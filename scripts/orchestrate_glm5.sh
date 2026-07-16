#!/usr/bin/env bash

set -euo pipefail

ENDPOINT="aiplatform.googleapis.com"
REGION="global"
PROJECT_ID="katha-booth"

cat << 'JSON_EOF' > /tmp/request.json
{
    "model": "zai-org/glm-5-maas",
    "stream": false,
    "max_tokens": 8192,
    "temperature": 0.6,
    "top_p": 0.95,
    "messages": [
        {
            "role": "user",
            "content": [
               {
                   "type": "text",
                   "text": "Design the JSON architecture for a high-ticket, Awwwards-tier floating reservation modal for a photobooth application. It must use a Doppelrand (double-bezel) structure, zero-scroll 3-column layout, and heavy GSAP damping. Also include the SVG structural coordinates for the 'Abel & Calado' template frame. Output ONLY raw JSON."
               }
            ]
        }
    ]
}
JSON_EOF

echo "Calling GLM-5-MaaS Orchestrator..."
RESPONSE=$(curl -s \
-X POST \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $(gcloud auth print-access-token)" \
"https://${ENDPOINT}/v1beta1/projects/${PROJECT_ID}/locations/${REGION}/endpoints/openapi/chat/completions" -d '@/tmp/request.json')

# Extract content from JSON response (assuming standard OpenAI-like schema for this endpoint)
CONTENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')

# If jq failed or content is null, fallback to the raw response
if [ "$CONTENT" == "null" ] || [ -z "$CONTENT" ]; then
    echo "Warning: Could not parse JSON content. Using raw response."
    CONTENT="$RESPONSE"
fi

# Clean markdown formatting if present
CLEAN_JSON=$(echo "$CONTENT" | sed 's/^```json//' | sed 's/^```//' | sed 's/```$//')

echo "Base64 Encoding JSON Architecture..."
B64_JSON=$(echo "$CLEAN_JSON" | base64)

echo "Passing to Nano Banana Pro (Gemini 3 Pro Image) Sidekick..."
echo "$B64_JSON" | python3 /Users/jedg./Desktop/kat_ha_pb/pb-v3/scripts/nano_banana_pro_image.py

