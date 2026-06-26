#!/bin/bash
# ============================================================================
# PATTERNLENS APP STORE — v5.3.0
# SILENCE.OBJECTS FRAMEWORK | CAPACITOR REMOTE URL
# ============================================================================

set -e
set -o pipefail

APP_VERSION="5.3.0"
BUILD_NUMBER="1"
BUNDLE_ID="com.silenceobjects.patternlens"
APP_NAME="PatternLens"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${RED}☢️  APOKALIPSA MODE — PatternLens ${APP_VERSION}${NC}"
echo "=============================================="

# ============================================================================
# PHASE 1: INIT (one-time)
# ============================================================================
phase_1_init() {
    echo -e "${YELLOW}[PHASE 1] Project Initialization${NC}"

    pnpm install

    npx cap init ${APP_NAME} ${BUNDLE_ID} --web-dir out || true
    npx cap add ios || true
    npx cap sync ios

    echo -e "${GREEN}✔ Phase 1 Complete${NC}"
}

# ============================================================================
# PHASE 2: BUILD & SYNC
# ============================================================================
phase_2_build() {
    echo -e "${YELLOW}[PHASE 2] Build & Sync${NC}"

    pnpm typecheck || true
    pnpm lint || true
    pnpm build
    npx cap sync ios

    echo -e "${GREEN}✔ Phase 2 Complete${NC}"
}

# ============================================================================
# PHASE 3: XCODE PROJECT CONFIG
# ============================================================================
phase_3_xcode() {
    echo -e "${YELLOW}[PHASE 3] Xcode Project Setup${NC}"

    cd ios/App

    pod install --repo-update

    /usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName ${APP_NAME}" App/Info.plist
    /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${APP_VERSION}" App/Info.plist
    /usr/libexec/PlistBuddy -c "Set :CFBundleVersion ${BUILD_NUMBER}" App/Info.plist
    /usr/libexec/PlistBuddy -c "Set :ITSAppUsesNonExemptEncryption false" App/Info.plist 2>/dev/null || \
    /usr/libexec/PlistBuddy -c "Add :ITSAppUsesNonExemptEncryption bool false" App/Info.plist
    /usr/libexec/PlistBuddy -c "Set :UIStatusBarStyle UIStatusBarStyleLightContent" App/Info.plist 2>/dev/null || true

    /usr/libexec/PlistBuddy -c "Add :NSMicrophoneUsageDescription string 'PatternLens uses voice input for structural pattern analysis'" App/Info.plist 2>/dev/null || \
    /usr/libexec/PlistBuddy -c "Set :NSMicrophoneUsageDescription 'PatternLens uses voice input for structural pattern analysis'" App/Info.plist

    cd ../..

    echo -e "${GREEN}✔ Phase 3 Complete${NC}"
}

# ============================================================================
# PHASE 4: ARCHIVE
# ============================================================================
phase_4_release() {
    echo -e "${YELLOW}[PHASE 4] Release Archive${NC}"

    cd ios/App

    xcodebuild clean -workspace App.xcworkspace -scheme App -configuration Release

    xcodebuild -workspace App.xcworkspace \
        -scheme App \
        -configuration Release \
        -archivePath build/PatternLens.xcarchive \
        archive \
        CODE_SIGN_STYLE=Automatic \
        DEVELOPMENT_TEAM="${APPLE_TEAM_ID}"

    cd ../..

    echo -e "${GREEN}✔ Phase 4 Complete${NC}"
}

# ============================================================================
# PHASE 5: EXPORT & SUBMIT
# ============================================================================
phase_5_submit() {
    echo -e "${YELLOW}[PHASE 5] Export & Submit${NC}"

    cd ios/App

    xcodebuild -exportArchive \
        -archivePath build/PatternLens.xcarchive \
        -exportPath build/export \
        -exportOptionsPlist ../../exportOptions.plist

    xcrun altool --validate-app \
        -f build/export/${APP_NAME}.ipa \
        -t ios \
        -u "${APPLE_ID}" \
        -p "${APP_SPECIFIC_PASSWORD}"

    xcrun altool --upload-app \
        -f build/export/${APP_NAME}.ipa \
        -t ios \
        -u "${APPLE_ID}" \
        -p "${APP_SPECIFIC_PASSWORD}"

    cd ../..

    echo -e "${GREEN}✔ Phase 5 Complete — SUBMITTED TO APP STORE${NC}"
}

# ============================================================================
# GIT COMMIT
# ============================================================================
git_commit() {
    echo -e "${BLUE}[GIT] Auto-commit${NC}"
    git add -A
    git commit -m "🚀 iOS App Store build v${APP_VERSION} $(date +%Y%m%d-%H%M%S)

- Capacitor Remote URL (patternlens.app)
- Version ${APP_VERSION} build ${BUILD_NUMBER}
- SILENCE.OBJECTS Framework

[apokalipsa-mode] [auto-commit]" || true
    git push origin main || true
    echo -e "${GREEN}✔ Git commit complete${NC}"
}

# ============================================================================
# FULL PIPELINE
# ============================================================================
full_pipeline() {
    echo -e "${RED}☢️  FULL APP STORE PIPELINE${NC}"
    echo "=============================================="

    phase_1_init
    git_commit

    phase_2_build
    git_commit

    phase_3_xcode
    git_commit

    phase_4_release
    git_commit

    phase_5_submit
    git_commit

    echo ""
    echo -e "${GREEN}=============================================="
    echo "🎉 APP STORE SUBMISSION COMPLETE v${APP_VERSION}!"
    echo "=============================================="
    echo ""
    echo "Next steps:"
    echo "1. App Store Connect → check processing"
    echo "2. Complete screenshots + metadata"
    echo "3. Submit for review"
    echo "==============================================${NC}"
}

# ============================================================================
# EXECUTION
# ============================================================================
case "$1" in
    "init")    phase_1_init ;;
    "build")   phase_2_build ;;
    "xcode")   phase_3_xcode ;;
    "release") phase_4_release ;;
    "submit")  phase_5_submit ;;
    "commit")  git_commit ;;
    "full"|"yolo"|"")  full_pipeline ;;
    *)
        echo "Usage: $0 {init|build|xcode|release|submit|commit|full}"
        exit 1
        ;;
esac
