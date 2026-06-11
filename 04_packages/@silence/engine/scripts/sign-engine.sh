#!/usr/bin/env bash
# [PATH]: 04_packages/@silence/engine/scripts/sign-engine.sh
#
# Cryptographic signing pipeline for silence-engine artifacts.
# Uses Ed25519 via OpenSSL.
#
# Usage:
#   ./scripts/sign-engine.sh <artifact_path>
# Output:
#   <artifact_path>.sig    — Ed25519 signature (raw)
#   <artifact_path>.sig.b64 — Ed25519 signature (base64)
#   <artifact_path>.hash   — SHA-256 of artifact (hex)

set -euo pipefail

ARTIFACT="${1:-}"
if [ -z "$ARTIFACT" ]; then
  echo "Usage: $0 <artifact_path>"
  exit 1
fi

if [ ! -f "$ARTIFACT" ]; then
  echo "Artifact not found: $ARTIFACT"
  exit 1
fi

KEY_DIR="${KEY_DIR:-01_governance/RELEASE_KEYS}"
PRIV_KEY="$KEY_DIR/engine-signing-key.pem"
PUB_KEY="$KEY_DIR/engine-signing-key.pub"

# Generate keys if absent (dev only; CI should mount pre-generated keys)
if [ ! -f "$PRIV_KEY" ]; then
  mkdir -p "$KEY_DIR"
  openssl genpkey -algorithm Ed25519 -out "$PRIV_KEY" 2>/dev/null
  openssl pkey -in "$PRIV_KEY" -pubout -out "$PUB_KEY" 2>/dev/null
  echo "[SIGN] Generated new Ed25519 key pair in $KEY_DIR"
fi

# Compute SHA-256 hash
HASH=$(openssl dgst -sha256 -binary "$ARTIFACT" | xxd -p -c 64)
echo "$HASH" > "$ARTIFACT.hash"
echo "[SIGN] SHA-256: $HASH"

# Write hash bytes to temp file for signing (OpenSSL pkeyutl needs a real file)
HASH_BYTES=$(mktemp)
echo "$HASH" | xxd -r -p > "$HASH_BYTES"

# Sign hash
openssl pkeyutl -sign \
  -in "$HASH_BYTES" \
  -inkey "$PRIV_KEY" \
  -out "$ARTIFACT.sig" \
  -rawin 2>/dev/null

rm -f "$HASH_BYTES"

# Encode signature to base64 for portability
base64 "$ARTIFACT.sig" > "$ARTIFACT.sig.b64"
echo "[SIGN] Signature: $ARTIFACT.sig.b64"

# Verify immediately
VERIFY_TMP=$(mktemp)
echo "$HASH" | xxd -r -p > "$VERIFY_TMP"
if openssl pkeyutl -verify \
  -in "$VERIFY_TMP" \
  -inkey "$PUB_KEY" -pubin \
  -sigfile "$ARTIFACT.sig" \
  -rawin 2>/dev/null; then
  echo "[SIGN] Verification OK"
  rm -f "$VERIFY_TMP"
else
  rm -f "$VERIFY_TMP"
  echo "[SIGN] Verification FAILED"
  exit 1
fi
