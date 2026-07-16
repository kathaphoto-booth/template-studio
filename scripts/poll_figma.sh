#!/bin/bash
source .env
export FIGMA_ACCESS_TOKEN
echo "🍌 Nano-Banana Watcher Started. Polling Figma file 6aYjDZptjiLUr9gn7glRS0..."
while true; do
  OUTPUT=$(node scripts/sync_figma.js)
  if echo "$OUTPUT" | grep -q "canvas is currently empty"; then
    sleep 30
  else
    echo "✅ Figma assets detected!"
    echo "$OUTPUT"
    exit 0
  fi
done
