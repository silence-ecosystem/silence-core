//! [PATH]: 04_packages/@silence/engine/tests/equivalence.rs
//!
//! Equivalence test runner for silence-engine.
//! Validates determinism contract across Rust native execution.
//! (WASM and CPU fallback tested separately in CI via JS runner.)

use silence_engine::{
    compute_batch, compute_schedule, validate_output, verify_determinism, AttentionDepth,
    EngineInput, MAX_SCHEDULE_SPAN_MS,
};

/// Build a deterministic test input from an index.
fn make_test_input(index: u64) -> EngineInput {
    let mut observer = [0u8; 16];
    observer[0..8].copy_from_slice(&index.to_le_bytes());
    observer[8..16].copy_from_slice(b"SILOS_00");

    let mut entropy = [0u8; 8];
    entropy.copy_from_slice(&index.to_le_bytes());

    EngineInput {
        observer,
        timestamp_ms: 1_700_000_000_000 + (index * 1000),
        attention_depth: AttentionDepth::Moderate,
        last_signal_ms: None,
        entropy,
    }
}

/// Build input with specific depth for depth-variant testing.
#[allow(dead_code)]
fn make_test_input_with_depth(index: u64, depth: AttentionDepth) -> EngineInput {
    let mut input = make_test_input(index);
    input.attention_depth = depth;
    input
}

#[test]
fn determinism_1000_identical_inputs() {
    let inputs: Vec<_> = (0..1000).map(make_test_input).collect();
    assert!(
        verify_determinism(&inputs),
        "determinism failed for 1000 inputs"
    );
}

#[test]
fn determinism_10000_identical_inputs() {
    let inputs: Vec<_> = (0..10_000).map(make_test_input).collect();
    assert!(
        verify_determinism(&inputs),
        "determinism failed for 10000 inputs"
    );
}

#[test]
fn zero_collision_10000_unique_inputs() {
    let inputs: Vec<_> = (0..10_000).map(make_test_input).collect();
    let outputs = compute_batch(&inputs);

    let mut seen = std::collections::BTreeSet::new();
    for out in &outputs {
        let key = out.output_hash;
        assert!(seen.insert(key), "collision detected: output_hash repeated");
    }
}

#[test]
fn validation_passes_for_all_outputs() {
    let inputs: Vec<_> = (0..1000).map(make_test_input).collect();
    let outputs = compute_batch(&inputs);
    for (i, (inp, out)) in inputs.iter().zip(outputs.iter()).enumerate() {
        validate_output(inp, out).unwrap_or_else(|_| panic!("validation failed at index {}", i));
    }
}

#[test]
fn slot_count_within_limit() {
    let inputs: Vec<_> = (0..1000).map(make_test_input).collect();
    let outputs = compute_batch(&inputs);
    for out in &outputs {
        assert!(out.slots.len() <= 3, "too many slots: {}", out.slots.len());
    }
}

#[test]
fn slots_are_sorted() {
    let inputs: Vec<_> = (0..1000).map(make_test_input).collect();
    let outputs = compute_batch(&inputs);
    for out in &outputs {
        for i in 1..out.slots.len() {
            assert!(
                out.slots[i].scheduled_ms >= out.slots[i - 1].scheduled_ms,
                "slots not sorted"
            );
        }
    }
}

#[test]
fn schedule_span_within_limit() {
    let inputs: Vec<_> = (0..1000).map(make_test_input).collect();
    let outputs = compute_batch(&inputs);
    for (inp, out) in inputs.iter().zip(outputs.iter()) {
        if let Some(last) = out.slots.last() {
            let span = last.scheduled_ms - inp.timestamp_ms;
            assert!(
                span <= MAX_SCHEDULE_SPAN_MS,
                "schedule span exceeded: {} ms",
                span
            );
        }
    }
}

#[test]
fn depth_variants_produce_different_schedules() {
    let base = make_test_input(42);
    let depths = [
        AttentionDepth::Surface,
        AttentionDepth::Shallow,
        AttentionDepth::Moderate,
        AttentionDepth::Deep,
        AttentionDepth::Flow,
    ];

    let mut hashes = std::collections::BTreeSet::new();
    for d in &depths {
        let mut input = base.clone();
        input.attention_depth = *d;
        let out = compute_schedule(&input);
        hashes.insert(out.output_hash);
    }

    assert_eq!(
        hashes.len(),
        depths.len(),
        "different depths should produce different outputs"
    );
}

#[test]
fn seed_derived_from_input_hash() {
    let input = make_test_input(123);
    let out = compute_schedule(&input);

    let expected_seed = u64::from_le_bytes([
        out.input_hash[0],
        out.input_hash[1],
        out.input_hash[2],
        out.input_hash[3],
        out.input_hash[4],
        out.input_hash[5],
        out.input_hash[6],
        out.input_hash[7],
    ]);

    assert_eq!(
        out.seed, expected_seed,
        "seed must be first 8 bytes of input_hash"
    );
}

#[test]
fn output_hash_changes_with_different_entropy() {
    let input1 = make_test_input(99);
    let mut input2 = input1.clone();
    input2.entropy = [0xFFu8; 8];

    let out1 = compute_schedule(&input1);
    let out2 = compute_schedule(&input2);

    assert_ne!(
        out1.output_hash, out2.output_hash,
        "different entropy must produce different output_hash"
    );
}
