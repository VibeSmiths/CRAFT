#!/usr/bin/env bash
# Take documentation screenshots using fixture data.
# Swaps real channels with dummy data, captures screenshots, then restores.
#
# Usage: cd docs && bash take-screenshots.sh
# Requires: studio running via docker compose, playwright installed

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHANNELS_DIR="$REPO_ROOT/channels"
FIXTURES_DIR="$REPO_ROOT/docs/fixtures/channels"
BACKUP_DIR="$REPO_ROOT/channels.backup.$$"

echo "=== CRAFT Documentation Screenshots ==="

# Sanity checks
if [ ! -d "$FIXTURES_DIR" ]; then
  echo "ERROR: Fixture data not found at $FIXTURES_DIR"
  exit 1
fi

# Step 1: Backup real channels
echo "[1/5] Backing up real channels → $BACKUP_DIR"
mv "$CHANNELS_DIR" "$BACKUP_DIR"

# Ensure restore happens even on failure
restore() {
  echo "[restore] Restoring real channels..."
  rm -rf "$CHANNELS_DIR"
  mv "$BACKUP_DIR" "$CHANNELS_DIR"
  echo "[restore] Restarting studio with real data..."
  cd "$REPO_ROOT" && docker compose restart studio 2>/dev/null || true
  echo "[restore] Done."
}
trap restore EXIT

# Step 2: Copy fixture data
echo "[2/5] Installing fixture channel data"
mkdir -p "$CHANNELS_DIR"
cp -r "$FIXTURES_DIR"/* "$CHANNELS_DIR"/

# Step 3: Restart studio to pick up fixture data
echo "[3/5] Restarting studio container with fixture data..."
cd "$REPO_ROOT" && docker compose restart studio
sleep 3

# Step 4: Run Playwright screenshots
echo "[4/5] Taking screenshots..."
cd "$REPO_ROOT/docs"
npx playwright test screenshots.spec.ts || echo "WARNING: Some screenshots may have failed (data-dependent tests)"

# Step 5: Restore happens via trap
echo "[5/5] Screenshots complete! Restoring real data..."
# trap will handle restore
