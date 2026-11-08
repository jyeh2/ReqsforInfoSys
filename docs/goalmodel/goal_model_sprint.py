"""17-626 Assignment 3: proposed GROUP goal model for the V1 prototype.

Run with Python 3 (no third-party libraries required):
    python3 goal_model_sprint.py

Outputs:
    goal_model_sprint.mmd   -- editable Mermaid source
    a Mermaid Live Editor link in the terminal, from which SVG can be exported

IMPORTANT: The scope and the V2 cutoff (D-2) are PROPOSALS, not approved stakeholder
requirements. The conflicting alternatives remain visible in the diagram.

Group IDs SG-* are new, unique identifiers. Each teammate used different G-*
IDs in Assignment 2. See docs/goalmodel/goal-model.md for the source crosswalk.
"""

from __future__ import annotations

import base64
import json
from pathlib import Path
import zlib

MERMAID = r'''flowchart TB
    SG1["SG-1: Plan and pack the correct weekly CSA boxes"]

    SG2["SG-2: Create a feasible weekly box plan"]
    SG3["SG-3: Review available produce"]
    SG4["SG-4: Choose contents meeting promised share value"]

    SG5["SG-5: Members see reliable box information"]
    SG6["SG-6: Label early estimates as provisional"]
    SG7["SG-7: Show confirmed contents and later changes"]

    SG8["SG-8: Handle swaps within farm limits"]
    SG9["SG-9: Accept swap requests before displayed cutoff"]
    SG10["SG-10: Offer farm-approved substitutes"]
    SG11["SG-11: Lucia approves or declines requests"]
    SG12["SG-12: Show status to members and Lucia"]
    SG16["SG-16: Display the week's provisional cutoff rule"]
    SG17["SG-17: Explain late requests without changing a locked list"]

    SG13["SG-13: Pack the correct box for each member"]
    SG14["SG-14: Apply approved swaps to the packing list"]
    SG15["SG-15: Packers check the current list"]

    SG1 --> SG2
    SG1 --> SG5
    SG1 --> SG8
    SG1 --> SG13
    SG2 --> SG3
    SG2 --> SG4
    SG5 --> SG6
    SG5 --> SG7
    SG8 --> SG9
    SG8 --> SG10
    SG8 --> SG11
    SG8 --> SG12
    SG8 --> SG16
    SG8 --> SG17
    SG13 --> SG14
    SG13 --> SG15

    SG2 -. "plan before preview" .-> SG5
    SG10 -. "choices before approval" .-> SG11
    SG11 -. "approved swaps" .-> SG14
    SG14 -. "latest checklist" .-> SG15
    SG17 -. "do not silently alter" .-> SG15

    subgraph CUTOFF["C-1: Change-request cutoff -- conflicting A2 proposals"]
        REQ24["Proposal A: stop changes 24 hours before packing (A2 model only; no interview evidence)"]
        REQWED["Proposal B: Wednesday evening for Friday pickup (Hank)"]
        REQ48["Proposal C: know 48 h before pickup; swaps open until packing (Raj)"]
        REQ24 -. "potentially different deadlines" .-> REQWED
        REQ48 -. "member flexibility vs packing" .-> REQWED
        OLD["D-1 (V1, superseded): use the EARLIER deadline"]
        RULE["D-2 (V2): Wednesday 20:00 for Friday pickup; box published before cutoff"]
        NOTE["Open: Lucia and Hank to confirm D-2 and packing start"]
        REQ24 -.-> OLD
        OLD -. "V1 evaluation O-2" .-> RULE
        REQWED -.-> RULE
        REQ48 -.-> RULE
        RULE -.-> NOTE
    end

    SG16 -. "proposed V2 rule" .-> RULE

    classDef primary fill:#dbeafe,stroke:#2563eb,color:#172554,stroke-width:2px
    classDef mid fill:#edf2ff,stroke:#6485b6,color:#1e293b
    classDef leaf fill:#f8fafc,stroke:#94a3b8,color:#334155
    classDef alternatives fill:#fff2cf,stroke:#bf8b19,color:#603b06
    classDef decision fill:#e2f4e8,stroke:#3f8a58,color:#14532d
    classDef unresolved fill:#fde8e8,stroke:#c74b4b,color:#7f1d1d
    classDef superseded fill:#eeeeee,stroke:#9e9e9e,color:#616161,stroke-dasharray:4 3

    class SG1 primary
    class SG2,SG5,SG8,SG13 mid
    class SG3,SG4,SG6,SG7,SG9,SG10,SG11,SG12,SG14,SG15,SG16,SG17 leaf
    class REQ24,REQWED,REQ48 alternatives
    class RULE decision
    class OLD superseded
    class NOTE unresolved
'''


def mermaid_edit_link(code: str) -> str:
    """Produce the pako link format recognized by mermaid.live."""
    payload = json.dumps(
        {"code": code, "mermaid": {"theme": "neutral"}},
        separators=(",", ":"),
    ).encode("utf-8")
    compressed = zlib.compress(payload, level=9)
    encoded = base64.urlsafe_b64encode(compressed).decode("ascii").rstrip("=")
    return "https://mermaid.live/edit#pako:" + encoded


def main() -> None:
    output = Path(__file__).with_name("goal_model_sprint.mmd")
    output.write_text(MERMAID + "\n", encoding="utf-8")
    print("=== A3 SPRINT MODEL (V2: Step 5 revision) ===")
    print(mermaid_edit_link(MERMAID))
    print(f"\nMermaid source saved to: {output.name}")
    print("Status: D-2 cutoff is a PROPOSAL; stakeholder confirmation is still needed.")


if __name__ == "__main__":
    main()
