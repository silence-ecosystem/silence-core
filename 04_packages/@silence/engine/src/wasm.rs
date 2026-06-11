//! [PATH]: 04_packages/@silence/engine/src/wasm.rs
//!
//! WASM bindings for silence-engine.
//! Exports deterministic scheduler to TypeScript/JavaScript runtime.

use alloc::string::String;
use alloc::format;
use wasm_bindgen::prelude::*;
use crate::{EngineInput, compute_schedule, validate_output};

/// Compute a deterministic schedule from JSON input.
/// Input JSON: { "observer": [16 u8 array], "timestamp_ms": u64, "attention_depth": 1-5, "last_signal_ms": null | u64, "entropy": [8 u8 array] }
/// Output JSON: { "slots": [...], "input_hash": [32 u8], "seed": u64, "output_hash": [32 u8] }
#[wasm_bindgen]
pub fn compute_schedule_json(input_json: &str) -> Result<String, JsValue> {
    let input: EngineInput = serde_json::from_str(input_json)
        .map_err(|e| JsValue::from_str(&format!("ENGINE_DESERIALIZE_ERROR: {}", e)))?;

    let output = compute_schedule(&input);

    // Validate before returning — catch any contract violation early
    validate_output(&input, &output)
        .map_err(|e| JsValue::from_str(&format!("ENGINE_VALIDATION_ERROR: {}", e)))?;

    serde_json::to_string(&output)
        .map_err(|e| JsValue::from_str(&format!("ENGINE_SERIALIZE_ERROR: {}", e)))
}

/// Verify determinism: run schedule twice and compare outputs.
/// Returns true if outputs are identical (bitwise) for all inputs.
#[wasm_bindgen]
pub fn verify_determinism_json(input_json: &str) -> Result<bool, JsValue> {
    let input: EngineInput = serde_json::from_str(input_json)
        .map_err(|e| JsValue::from_str(&format!("ENGINE_DESERIALIZE_ERROR: {}", e)))?;

    let out1 = compute_schedule(&input);
    let out2 = compute_schedule(&input);

    Ok(out1 == out2)
}

/// Validate an existing output against its input.
/// Returns empty string on success, error message on failure.
#[wasm_bindgen]
pub fn validate_json(input_json: &str, output_json: &str) -> Result<String, JsValue> {
    let input: EngineInput = serde_json::from_str(input_json)
        .map_err(|e| JsValue::from_str(&format!("ENGINE_DESERIALIZE_ERROR: {}", e)))?;
    let output = serde_json::from_str(output_json)
        .map_err(|e| JsValue::from_str(&format!("ENGINE_DESERIALIZE_ERROR: {}", e)))?;

    match validate_output(&input, &output) {
        Ok(()) => Ok(String::new()),
        Err(e) => Ok(format!("{}", e)),
    }
}
