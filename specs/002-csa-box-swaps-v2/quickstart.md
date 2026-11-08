# Quickstart: 002-csa-box-swaps-v2 (V2)

## Run locally
```bash
cd frontend
npm install
npm test           # domain rule tests (Vitest)
npm run build:v2   # writes ../v2 for GitHub Pages
```

Deployed: https://jyeh2.github.io/ReqsforInfoSys/v2/ (V1 stays at /v1/)

## V2 validation walkthrough
Start with **Reset demo**. Clock: Mon 09:00.

1. **Lucia**: while Draft, a warning says members can't swap until publish, with time left until the
   Wed 20:00 cutoff. → US3-9, FR-023
2. Cutoff panel shows the D-2 cutoff (Wed 20:00) plus Proposals A, B and C, labeled provisional. → FR-009
3. Publish. Change Apples 2 → 3 lb. **Member (Raj)**: Apples line marked "Changed since first estimate:
   was 2 lb Apples". → US2-5, O-1
4. **Raj**: request Potatoes → Sweet potatoes; the message shows "Pending". **Lucia** approves; Raj's
   message now shows "Approved". → FR-013, O-9
5. **Lucia**: confirm. **Raj**: "Different from the first estimate" lists Apples 2 → 3 lb; the Sweet
   potatoes line is marked "Your approved swap (replaces 2 lb Potatoes)". → US2-6, US2-7, O-8, O-10
6. Clock **Wed 12:00**: swaps are still open (V1 would have closed them at Wed 08:00). → O-2
7. Clock **Wed 21:00**: member sees "Swap requests closed … the packing list locks at Thu 11-12
   08:00"; submitting records "Declined — Received after the swap cutoff (Wed 11-11 20:00)"; no
   requirement IDs on screen. → US3-6, US3-8, O-3, O-7
8. Reset; clock **Wed 21:00**; Lucia publishes a Draft → member sees "Swap requests were not
   available this week". → FR-023 edge case
9. V1 regression: packing, late handling and Checked behave as in V1 quickstart steps 9–10.
