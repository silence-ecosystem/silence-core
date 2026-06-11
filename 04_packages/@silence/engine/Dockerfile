# syntax=docker/dockerfile:1.6
# [PATH]: 04_packages/@silence/engine/Dockerfile
#
# Reproducible build for silence-engine.
# Pinned base image digest ensures bit-for-bit reproducibility of toolchain.
# CI verifies SHA-256 of output WASM across 3 independent builds (golden hash).

FROM rust:1.78-slim-bookworm@sha256:0c33d9ebb87e3a4d4f3e80a44ee356e570d8b5b1a7f0c1a0d6b5e2e8f7a3c4d5

WORKDIR /build

# Install wasm tooling
RUN apt-get update && apt-get install -y --no-install-recommends \
    binaryen \
    pkg-config \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy manifests first for layer caching
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY tests ./tests

# Build native binary (for equivalence testing in CI)
RUN cargo build --release --bin engine-cli \
    && cp target/release/engine-cli /build/engine-cli

# Build WASM target
RUN rustup target add wasm32-unknown-unknown \
    && cargo build --target wasm32-unknown-unknown --release --features wasm \
    && wasm-opt -Oz \
        target/wasm32-unknown-unknown/release/silence_engine.wasm \
        -o silence_engine.optim.wasm

# Output artifacts
RUN mkdir -p /dist \
    && cp /build/engine-cli /dist/ \
    && cp /build/silence_engine.optim.wasm /dist/

# CI reads these paths for golden hash verification
# /dist/engine-cli          — native binary
# /dist/silence_engine.optim.wasm — optimized WASM
