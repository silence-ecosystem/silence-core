//! [PATH]: 04_packages/@silence/engine/src/bin/engine-cli.rs
//!
//! CLI for silence-engine — native Rust target.
//! Usage:
//!   engine-cli compute < input.json > output.json
//!   engine-cli verify   < input.json
//!   engine-cli equivalence --count 10000

use silence_engine::{
    compute_schedule, validate_output, verify_determinism, AttentionDepth, EngineInput,
};
use std::io::{self, Read, Write};

fn main() {
    let args: Vec<String> = std::env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: engine-cli <compute|verify|equivalence> [options]");
        std::process::exit(1);
    }

    match args[1].as_str() {
        "compute" => cmd_compute(),
        "verify" => cmd_verify(),
        "equivalence" => cmd_equivalence(&args),
        _ => {
            eprintln!("Unknown command: {}", args[1]);
            std::process::exit(1);
        }
    }
}

fn cmd_compute() {
    let mut input_str = String::new();
    io::stdin()
        .read_to_string(&mut input_str)
        .expect("read stdin");

    let input: EngineInput = serde_json::from_str(&input_str).expect("deserialize input");

    let output = compute_schedule(&input);
    validate_output(&input, &output).expect("validation");

    let out_str = serde_json::to_string_pretty(&output).expect("serialize output");
    io::stdout()
        .write_all(out_str.as_bytes())
        .expect("write stdout");
    println!();
}

fn cmd_verify() {
    let mut input_str = String::new();
    io::stdin()
        .read_to_string(&mut input_str)
        .expect("read stdin");

    let input: EngineInput = serde_json::from_str(&input_str).expect("deserialize input");

    let ok = verify_determinism(&[input]);
    if ok {
        println!("DETERMINISM_OK");
        std::process::exit(0);
    } else {
        println!("DETERMINISM_FAIL");
        std::process::exit(1);
    }
}

fn cmd_equivalence(args: &[String]) {
    let count = args
        .iter()
        .position(|a| a == "--count")
        .and_then(|i| args.get(i + 1))
        .and_then(|s| s.parse::<usize>().ok())
        .unwrap_or(1000);

    let mut inputs = Vec::with_capacity(count);
    for i in 0..count {
        let mut observer = [0u8; 16];
        observer[0..8].copy_from_slice(&(i as u64).to_le_bytes());
        observer[8..16].copy_from_slice(b"SILOS_00");

        let mut entropy = [0u8; 8];
        entropy.copy_from_slice(&(i as u64).to_le_bytes());

        inputs.push(EngineInput {
            observer,
            timestamp_ms: 1_700_000_000_000 + (i as u64 * 1000),
            attention_depth: AttentionDepth::Moderate,
            last_signal_ms: None,
            entropy,
        });
    }

    let out1 = silence_engine::compute_batch(&inputs);
    let out2 = silence_engine::compute_batch(&inputs);

    let mut mismatches = 0usize;
    for i in 0..count {
        if out1[i] != out2[i] {
            mismatches += 1;
            eprintln!("Mismatch at index {}", i);
        }
    }

    if mismatches == 0 {
        println!("EQUIVALENCE_OK count={} mismatches=0", count);
        std::process::exit(0);
    } else {
        println!("EQUIVALENCE_FAIL count={} mismatches={}", count, mismatches);
        std::process::exit(1);
    }
}
