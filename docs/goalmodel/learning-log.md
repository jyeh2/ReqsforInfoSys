# Learning Log — Assignment 3

## 1. Sprint Planning and Requirements Selection

### Selected scope

For Prototype V1, we propose **weekly CSA box planning and member substitutions**, using mock harvest data and sample members. We selected four goals:

| Group goal | Requirement | Reason for priority |
| --- | --- | --- |
| SG-2 | Lucia plans CSA boxes using available produce and promised share value. | **Core:** a workable box plan is needed before anything can be published or packed. |
| SG-5 | Members see an early estimate clearly labeled provisional, followed by the current confirmed contents and changes. | **User-facing:** Raj needs reliable information before pickup. |
| SG-8 | Members request swaps from farm-approved options before a cutoff, and can see the request status. | **Uncertain:** stakeholders differ about what changes are practical and when to stop accepting them. |
| SG-13 | Approved swaps update the packing list, and packers check each completed box. | **Core:** a confirmed swap must reach the actual box. |

Together, these form one testable workflow: **plan a box → publish the contents → handle a member swap → update and check the packing list**. This gives us a useful prototype without implementing the entire farm system.

### Comparing the A2 models

The three team members' models cover similar needs but contain different levels of detail. My model distinguishes early estimates from final box contents and links approved swaps to packing. One teammate's detailed model adds approved substitute choices, confirmations, and a proposed cutoff. The other teammate's model emphasizes request status for both Lucia and members, and records differing notice-period expectations. We combined these useful details rather than treating every differently worded goal as a new feature.

The original goal numbers differ between models. Relevant examples are **my G-27, G-31, G-42, G-56, G-60, G-62, G-63**; **the detailed model's G-2, G-11, G-20, G-40, G-46, G-47, G-93, G-94**; and **the smaller model's G-13, G-19, G-20, G-32**. Our proposed group model uses new **SG-** identifiers so these sources cannot be confused.

### Overlaps, conflicts, and lower priorities

An early estimate and a confirmed box list serve different purposes, so both are retained. A swap request, its approval status, and the packing-list update are also separate actions in one workflow. The models propose different change deadlines: for example, **24 hours before packing** versus **Wednesday evening for a Friday pickup**. We will not present either as an agreed stakeholder rule. The team must document a provisional V1 cutoff and preserve this question for stakeholder clarification.

We are postponing restaurant ordering, market sales, offline synchronization, and detailed lot-traceability reports. These matter to the full system, but are not needed to test our chosen CSA workflow. We also will not claim that mock item data guarantees allergen or cross-contact safety. The smaller prototype lets us focus on validating requirements instead of building unrelated features.

**Pending group agreement:** Confirm the selected scope and provisional cutoff before treating this model as final.
