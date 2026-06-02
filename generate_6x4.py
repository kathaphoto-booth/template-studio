import json

layouts = [
    {
        "id": "pc-F",
        "name": "Layout F (1 Large, 3 Small)",
        "viewbox": "1800 1200",
        "slots": [
            {"x": 100, "y": 100, "width": 1060, "height": 460},
            {"x": 100, "y": 580, "width": 520, "height": 520},
            {"x": 640, "y": 580, "width": 520, "height": 520},
            {"x": 1180, "y": 580, "width": 520, "height": 520}
        ],
        "textZones": [
            {"x": 1180, "y": 100, "width": 520, "height": 460}
        ],
        "slotCount": 4
    },
    {
        "id": "pc-G",
        "name": "Layout G (2x2 Grid)",
        "viewbox": "1800 1200",
        "slots": [
            {"x": 100, "y": 100, "width": 788, "height": 378},
            {"x": 912, "y": 100, "width": 788, "height": 378},
            {"x": 100, "y": 502, "width": 788, "height": 378},
            {"x": 912, "y": 502, "width": 788, "height": 378}
        ],
        "textZones": [
            {"x": 100, "y": 904, "width": 1600, "height": 196}
        ],
        "slotCount": 4
    },
    {
        "id": "pc-H",
        "name": "Layout H (3 Slots, Right Heavy)",
        "viewbox": "1800 1200",
        "slots": [
            {"x": 100, "y": 100, "width": 788, "height": 488},
            {"x": 100, "y": 612, "width": 788, "height": 488},
            {"x": 912, "y": 100, "width": 788, "height": 736}
        ],
        "textZones": [
            {"x": 912, "y": 860, "width": 788, "height": 240}
        ],
        "slotCount": 3
    },
    {
        "id": "pc-I",
        "name": "Layout I (3 Slots, Bottom Heavy)",
        "viewbox": "1800 1200",
        "slots": [
            {"x": 100, "y": 100, "width": 788, "height": 488},
            {"x": 100, "y": 612, "width": 788, "height": 488},
            {"x": 912, "y": 364, "width": 788, "height": 736}
        ],
        "textZones": [
            {"x": 912, "y": 100, "width": 788, "height": 240}
        ],
        "slotCount": 3
    },
    {
        "id": "pc-J",
        "name": "Layout J (2 Slots, Text Right)",
        "viewbox": "1800 1200",
        "slots": [
            {"x": 100, "y": 100, "width": 788, "height": 488},
            {"x": 100, "y": 612, "width": 788, "height": 488}
        ],
        "textZones": [
            {"x": 912, "y": 100, "width": 788, "height": 1000}
        ],
        "slotCount": 2
    },
    {
        "id": "pc-K",
        "name": "Layout K (Text Top, 2 Slots Bottom)",
        "viewbox": "1800 1200",
        "slots": [
            {"x": 100, "y": 364, "width": 788, "height": 736},
            {"x": 912, "y": 364, "width": 788, "height": 736}
        ],
        "textZones": [
            {"x": 100, "y": 100, "width": 1600, "height": 240}
        ],
        "slotCount": 2
    },
    {
        "id": "pc-M",
        "name": "Layout M (1 Massive Slot)",
        "viewbox": "1800 1200",
        "slots": [
            {"x": 100, "y": 100, "width": 1600, "height": 736}
        ],
        "textZones": [
            {"x": 100, "y": 860, "width": 1600, "height": 240}
        ],
        "slotCount": 1
    }
]

js_out = ""
for l in layouts:
    js_out += f"  // {l['name']}\n"
    js_out += f"  {{\n"
    js_out += f"    id: '{l['id']}',\n"
    js_out += f"    name: '{l['name']}',\n"
    js_out += f"    viewbox: '{l['viewbox']}',\n"
    js_out += f"    slots: [\n"
    for s in l['slots']:
        js_out += f"      {{ x: {s['x']}, y: {s['y']}, width: {s['width']}, height: {s['height']} }},\n"
    js_out += f"    ],\n"
    js_out += f"    textZones: [\n"
    for t in l['textZones']:
        js_out += f"      {{ x: {t['x']}, y: {t['y']}, width: {t['width']}, height: {t['height']} }}\n"
    js_out += f"    ],\n"
    js_out += f"    slotCount: {l['slotCount']}\n"
    js_out += f"  }},\n"

with open("temp_js.txt", "w") as f:
    f.write(js_out)
print("Generated JS for layouts.")
