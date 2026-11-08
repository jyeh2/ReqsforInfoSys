# Quickstart: 001-csa-box-swaps (V1)

## Prerequisites
Node 20+.

## Run locally
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173/ReqsforInfoSys/v1/
npm test           # domain rule unit tests (Vitest)
npm run build:v1   # writes ../v1 for GitHub Pages
```

Deployed: https://jyeh2.github.io/ReqsforInfoSys/v1/

## Validation walkthrough (maps to acceptance scenarios)

Start with **Reset demo**. Clock: Mon 09:00.

1. **Member** (any): box shows "Not published yet". → US2-1
2. **Lucia / Planner**: set Heirloom tomatoes to 2 → infeasible flag, publish disabled. Set back
   to 0. Lower items until value < $25 → shortfall shown, publish disabled. Restore. → US1-1..3
3. **Publish** → status Provisional. **Member**: provisional label shown. → US1-4, US2-2
4. **Confirm** → **Member** sees "Confirmed at Mon 09:00". **Packer** sees lists. → US1-5, US2-3
5. **Member (Raj)**: cutoff shown as Wed 08:00, labeled provisional. Request Potatoes → Sweet
   potatoes. Status Pending. → US3-1..3
6. **Lucia / Requests**: approve. **Raj**: status Approved, box marks change.
   **Packer**: Raj's list shows Sweet potatoes (swap). → US3-4, US2-4, US4-1
7. **Member (Mei)**: request and have Lucia decline → box unchanged. → US3-5
8. Clock **Wed 08:00**: member swap form replaced by late explanation. → US3-6
9. Submit a request before cutoff, leave it pending, clock **Thu 08:00** → status "Not reviewed
   before packing", packing list unchanged. → US4-3, edge case
10. **Packer**: check all lines → "Mark box checked" enabled → Checked. → US4-2
