---
name: katha-memory
description: Enforces the Persistent Knowledge Graph architecture using the Memory MCP Server. Use this to read/write persistent context without blowing out the token limit.
---

# Katha Knowledge Graph Protocol

We now use the **Anthropic Memory MCP Server** instead of a flat text file. This gives us a persistent, queryable Knowledge Graph. You must use the provided MCP tools (`read_graph`, `search_nodes`, `add_entities`, `add_relations`) to manage long-term state.

## The Katha Memory Ontology
Whenever you write to the graph using `add_entities` or `add_relations`, you MUST strictly categorize the node type. Uncategorized noise is forbidden. Use the following entity types:

### `[BRAND_CANON]`
- **Usage:** Immutable design rules, hex codes, or font requirements.
- **Example:** `add_entities([{"name": "Katha_Palette", "entityType": "[BRAND_CANON]", "observations": ["Obsidian Weave is #111112", "Piña Ecru is #EAE2D5"]}])`
- **Rule:** Never delete these. Read them if you are unsure of the visual guidelines.

### `[TECH_DEBT]`
- **Usage:** Known bugs, failed code attempts, or WIP features that need fixing.
- **Example:** `add_entities([{"name": "KNarrativeThread_Mobile", "entityType": "[TECH_DEBT]", "observations": ["Touch targets on inputs need to be py-3 minimum."]}])`
- **Rule:** Once you fix the bug, delete the observation so the graph stays clean.

### `[PRESET_ARCHIVE]`
- **Usage:** Successfully generated UI themes or Photobooth Presets.
- **Example:** `add_entities([{"name": "Gumamela_Theme", "entityType": "[PRESET_ARCHIVE]", "observations": ["Primary: Loko Rust, Secondary: Champagne Heirloom."]}])`

### `[SESSION_HANDOFF]`
- **Usage:** Used to record exact cursor position and next steps.
- **Action:** Create or update an entity named `Current_Objective`.

## The "Save Often" Protocol (Continuous Checkpointing)
Context crashes happen abruptly. You must treat the Memory Server as an auto-save file:
1. **Micro-Commits:** Every time you successfully complete a task and run `katha-verify`, instantly write a single observation to the graph. Do not wait for `/handoff`.
2. **The 80% Tripwire:** If you detect your context window is filling up or the conversation is getting long, silently run a background `add_entities` update to `[SESSION_HANDOFF]` just in case you crash in the next prompt. Never let a cold brain wake up to an empty graph.

## Read Before Acting
If you receive a vague task (e.g., "build the admin dashboard"), first run `search_nodes(query: "admin")` or `read_graph()` to see if past agents already left architecture plans or tech debt notes. Do not hallucinate a solution if the Knowledge Graph already holds the answer.

## The Ultimate Fallback (Chrome DevTools MCP)
In the catastrophic event of a sudden power loss or silent token death where no `[SESSION_HANDOFF]` was written, you are NOT blind. 
- You have access to the `chrome-devtools` MCP. 
- **Action:** If the memory graph is mysteriously empty upon boot, use `take_snapshot` or `evaluate_script` via Chrome DevTools to literally read the user's active browser window or open terminal chat logs. You can scrape the actual conversation history directly from the DOM to reconstruct your memory before proceeding.
