//! [PATH]: 04_packages/@silence/engine/src/lib.rs
//!
//! silence-engine — Deterministic behavioral scheduler
//! ====================================================
//!
//! Core engine for SILENCE.OBJECTS. CPU-only, single-threaded, batch inference.
//! All timing derived from phi constants (MATH_CORE). No floating-point in
//! deterministic path. No OS entropy. No system clock reads inside engine.
//!
//! Determinism Contract:
//! - Identical inputs (bitwise) produce identical outputs (bitwise).
//! - Seed is derived solely from SHA-256 of serialized input.
//! - All collections iterated in deterministic order (sorted Vec, not HashMap).
//! - No thread scheduling (single-threaded).
//! - No uninitialized memory (Rust safety + explicit zeroing).

#![cfg_attr(feature = "wasm", no_std)]

extern crate alloc;

use alloc::vec::Vec;
use core::fmt;

pub mod hash;

#[cfg(feature = "wasm")]
pub mod wasm;

// =============================================================================
// § 1. MATH CORE CONSTANTS (φ-derived, integer-only)
// =============================================================================

/// φ = (1 + √5) / 2 ≈ 1.618033988749895
/// Here represented as the base temporal unit in milliseconds.
pub const GOLDENSECOND: u64 = 1618;

/// 1/φ scaled by 10^15 for fixed-point integer arithmetic.
/// PHI_INV_NUM / PHI_INV_DEN ≈ 0.6180339887498948
pub const PHI_INV_NUM: u64 = 618_033_988_749_894;
pub const PHI_INV_DEN: u64 = 1_000_000_000_000_000;

/// φ² ≈ 2.618033988749895
pub const PHI_SQ: u64 = 2618; // scaled 10^3 for simplicity in cycle limits

/// Max number of prompts per cycle window (conservative = 3).
pub const MAX_SLOTS_PER_CYCLE: usize = 3;

/// Maximum schedule span from input timestamp to last slot (ms).
/// Must accommodate up to MAX_SLOTS_PER_CYCLE at the smallest interval.
pub const MAX_SCHEDULE_SPAN_MS: u64 = 5000;

// =============================================================================
// § 2. DATA MODEL
// =============================================================================

/// Unique observer identifier — 16 bytes, never PII.
/// In production this is a UUIDv4; in tests a deterministic byte array.
pub type ObserverPseudonym = [u8; 16];

/// Depth of attention profile — self-reported categorical 1-5.
#[repr(u8)]
#[derive(
    Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, serde::Serialize, serde::Deserialize,
)]
#[serde(try_from = "u8", into = "u8")]
pub enum AttentionDepth {
    Surface = 1,
    Shallow = 2,
    Moderate = 3,
    Deep = 4,
    Flow = 5,
}

impl AttentionDepth {
    /// Convert from raw u8 with validation.
    pub fn from_raw(v: u8) -> Option<Self> {
        match v {
            1 => Some(AttentionDepth::Surface),
            2 => Some(AttentionDepth::Shallow),
            3 => Some(AttentionDepth::Moderate),
            4 => Some(AttentionDepth::Deep),
            5 => Some(AttentionDepth::Flow),
            _ => None,
        }
    }

    /// Depth as u8 for serialization.
    pub fn to_raw(self) -> u8 {
        self as u8
    }
}

impl core::convert::TryFrom<u8> for AttentionDepth {
    type Error = &'static str;
    fn try_from(v: u8) -> Result<Self, Self::Error> {
        Self::from_raw(v).ok_or("invalid attention depth")
    }
}

impl From<AttentionDepth> for u8 {
    fn from(d: AttentionDepth) -> u8 {
        d.to_raw()
    }
}

/// Input to the deterministic scheduler.
/// All fields are user-provided or externally computed — engine NEVER reads
/// system clock or OS entropy.
#[derive(Clone, Debug, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub struct EngineInput {
    pub observer: ObserverPseudonym,
    pub timestamp_ms: u64,
    pub attention_depth: AttentionDepth,
    pub last_signal_ms: Option<u64>,
    pub entropy: [u8; 8],
}

/// A single scheduled slot (prompt delivery point).
#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, serde::Serialize, serde::Deserialize)]
pub struct SignalSlot {
    pub scheduled_ms: u64,
    pub priority: u8,        // 1-3
    pub signal_id: [u8; 16], // UUIDv4 or deterministic equivalent
}

/// Complete schedule output.
#[derive(Clone, Debug, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub struct EngineOutput {
    pub slots: Vec<SignalSlot>,
    pub input_hash: [u8; 32],  // SHA-256
    pub seed: u64,             // deterministic derivative of input_hash
    pub output_hash: [u8; 32], // SHA-256(seed + serialized slots)
}

// =============================================================================
// § 3. SERIALIZATION (deterministic, little-endian, fixed-width)
// =============================================================================

impl EngineInput {
    /// Serialize to a deterministic byte vector.
    /// Order: observer (16) || timestamp (8 LE) || depth (1) || last_signal (1+8 LE) || entropy (8)
    pub fn to_bytes(&self) -> Vec<u8> {
        let mut buf = Vec::with_capacity(42);
        buf.extend_from_slice(&self.observer);
        buf.extend_from_slice(&self.timestamp_ms.to_le_bytes());
        buf.push(self.attention_depth.to_raw());
        match self.last_signal_ms {
            Some(t) => {
                buf.push(1);
                buf.extend_from_slice(&t.to_le_bytes());
            }
            None => {
                buf.push(0);
                buf.extend_from_slice(&0u64.to_le_bytes());
            }
        }
        buf.extend_from_slice(&self.entropy);
        buf
    }
}

impl SignalSlot {
    /// Serialize to deterministic bytes.
    /// Order: scheduled_ms (8 LE) || priority (1) || signal_id (16)
    pub fn to_bytes(&self) -> Vec<u8> {
        let mut buf = Vec::with_capacity(25);
        buf.extend_from_slice(&self.scheduled_ms.to_le_bytes());
        buf.push(self.priority);
        buf.extend_from_slice(&self.signal_id);
        buf
    }
}

// =============================================================================
// § 4. HASH & SEED PIPELINE
// =============================================================================

/// Compute SHA-256 of serialized input.
pub fn compute_input_hash(input: &EngineInput) -> [u8; 32] {
    hash::sha256(&input.to_bytes())
}

/// Derive deterministic seed from input hash.
/// Uses first 8 bytes of SHA-256 as little-endian u64.
pub fn derive_seed(input_hash: &[u8; 32]) -> u64 {
    let mut bytes = [0u8; 8];
    bytes.copy_from_slice(&input_hash[0..8]);
    u64::from_le_bytes(bytes)
}

/// Compute SHA-256 of seed + all serialized slots (in order).
/// Slots MUST be sorted by scheduled_ms before calling.
pub fn compute_output_hash(seed: u64, slots: &[SignalSlot]) -> [u8; 32] {
    let mut buf = Vec::with_capacity(8 + slots.len() * 25);
    buf.extend_from_slice(&seed.to_le_bytes());
    for slot in slots {
        buf.extend_from_slice(&slot.to_bytes());
    }
    hash::sha256(&buf)
}

// =============================================================================
// § 5. SCHEDULER (phi-derived timing, fixed-point integer)
// =============================================================================

/// Compute next window using fixed-point phi-inverse exponentiation.
/// interval = GOLDENSECOND * (PHI_INV)^depth
/// Uses integer arithmetic only — no floating-point nondeterminism.
fn compute_interval_ms(depth: AttentionDepth) -> u64 {
    let n = depth.to_raw() as u64;
    let mut interval = GOLDENSECOND;
    for _ in 0..n {
        interval = (interval * PHI_INV_NUM) / PHI_INV_DEN;
    }
    interval
}

/// Deterministic pseudo-UUID generator from seed + index.
/// Not cryptographically random — purely deterministic for equivalence testing.
fn deterministic_signal_id(seed: u64, index: u32) -> [u8; 16] {
    let mut buf = [0u8; 24];
    buf[0..8].copy_from_slice(&seed.to_le_bytes());
    buf[8..12].copy_from_slice(&index.to_le_bytes());
    // pad with fixed pattern for remaining 12 bytes
    buf[12..16].copy_from_slice(b"SILO");
    buf[16..20].copy_from_slice(b"_ENG");
    buf[20..24].copy_from_slice(b"_001");
    let h = hash::sha256(&buf);
    let mut out = [0u8; 16];
    out.copy_from_slice(&h[0..16]);
    out
}

/// Priority derived from depth: deeper attention = higher priority (lower number = higher).
fn priority_from_depth(depth: AttentionDepth) -> u8 {
    match depth {
        AttentionDepth::Surface => 3,
        AttentionDepth::Shallow => 3,
        AttentionDepth::Moderate => 2,
        AttentionDepth::Deep => 2,
        AttentionDepth::Flow => 1,
    }
}

/// Core scheduler: computes all slots for the next cycle window.
pub fn compute_schedule(input: &EngineInput) -> EngineOutput {
    let input_hash = compute_input_hash(input);
    let seed = derive_seed(&input_hash);

    let interval = compute_interval_ms(input.attention_depth);
    let base_time = input.timestamp_ms;
    let count = MAX_SLOTS_PER_CYCLE.min(3);

    let mut slots = Vec::with_capacity(count);
    for i in 0..count {
        let scheduled_ms = base_time + interval * (i as u64 + 1);
        let signal_id = deterministic_signal_id(seed, i as u32);
        let priority = priority_from_depth(input.attention_depth);
        slots.push(SignalSlot {
            scheduled_ms,
            priority,
            signal_id,
        });
    }

    // CRITICAL: deterministic iteration order
    slots.sort_by_key(|s| s.scheduled_ms);

    let output_hash = compute_output_hash(seed, &slots);

    EngineOutput {
        slots,
        input_hash,
        seed,
        output_hash,
    }
}

// =============================================================================
// § 6. VALIDATION
// =============================================================================

/// Validate that output satisfies determinism contract invariants.
pub fn validate_output(input: &EngineInput, output: &EngineOutput) -> Result<(), ValidationError> {
    // 1. Recompute input hash
    let expected_input_hash = compute_input_hash(input);
    if output.input_hash != expected_input_hash {
        return Err(ValidationError::InputHashMismatch);
    }

    // 2. Recompute seed
    let expected_seed = derive_seed(&output.input_hash);
    if output.seed != expected_seed {
        return Err(ValidationError::SeedMismatch);
    }

    // 3. Recompute output hash
    let expected_output_hash = compute_output_hash(output.seed, &output.slots);
    if output.output_hash != expected_output_hash {
        return Err(ValidationError::OutputHashMismatch);
    }

    // 4. Slot count limit
    if output.slots.len() > MAX_SLOTS_PER_CYCLE {
        return Err(ValidationError::TooManySlots);
    }

    // 5. Slots sorted
    for i in 1..output.slots.len() {
        if output.slots[i].scheduled_ms < output.slots[i - 1].scheduled_ms {
            return Err(ValidationError::SlotsNotSorted);
        }
    }

    // 6. Schedule span bound (relative to input timestamp)
    if let Some(last) = output.slots.last() {
        let span = last.scheduled_ms.saturating_sub(input.timestamp_ms);
        if span > MAX_SCHEDULE_SPAN_MS {
            return Err(ValidationError::SpanExceeded);
        }
    }

    Ok(())
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ValidationError {
    InputHashMismatch,
    SeedMismatch,
    OutputHashMismatch,
    TooManySlots,
    SlotsNotSorted,
    SpanExceeded,
}

impl fmt::Display for ValidationError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ValidationError::InputHashMismatch => write!(f, "ENGINE_INPUT_HASH_MISMATCH"),
            ValidationError::SeedMismatch => write!(f, "ENGINE_SEED_MISMATCH"),
            ValidationError::OutputHashMismatch => write!(f, "ENGINE_OUTPUT_HASH_MISMATCH"),
            ValidationError::TooManySlots => write!(f, "ENGINE_TOO_MANY_SLOTS"),
            ValidationError::SlotsNotSorted => write!(f, "ENGINE_SLOTS_NOT_SORTED"),
            ValidationError::SpanExceeded => write!(f, "ENGINE_SPAN_EXCEEDED"),
        }
    }
}

impl core::error::Error for ValidationError {}

// =============================================================================
// § 7. BATCH API (for CI equivalence testing)
// =============================================================================

/// Compute schedules for a batch of inputs.
/// Returns outputs in the same order as inputs.
pub fn compute_batch(inputs: &[EngineInput]) -> Vec<EngineOutput> {
    inputs.iter().map(compute_schedule).collect()
}

/// Verify that all inputs produce identical outputs when repeated.
/// Returns true iff every input run twice yields bitwise-identical outputs.
pub fn verify_determinism(inputs: &[EngineInput]) -> bool {
    let first = compute_batch(inputs);
    let second = compute_batch(inputs);
    first == second
}
