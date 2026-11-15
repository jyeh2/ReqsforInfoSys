# Learning Log — Assignment 3

## 1. Sprint Planning and Requirements Selection

### Selected Scope

After comparing individual goal models, we identified several shared goals and selected four as the foundation of our V1 prototype. These goals cover the core CSA workflow.

| Group goal | Requirement | Reason for priority |
| --- | --- | --- |
| SG-2 | Lucia plans CSA boxes using available produce and promised share value. | **Core:** Box planning must happen before publishing or packing. |
| SG-5 | Members see an early estimate clearly labeled provisional, followed by the current confirmed contents and changes. | **User-facing:** Members need reliable information before pickup. |
| SG-8 | Members request swaps from farm-approved options before a cutoff, and can see the request status. | **Uncertain:** Stakeholders differ on acceptable swaps and deadlines. |
| SG-13 | Approved swaps update the packing list, and packers check each completed box. | **Core:** Approved swaps must be reflected in the packing checklist. |

Together, these goals establish the workflow of planning a box, publishing its contents, handling member swaps, and updating the packing checklist.

### Decision Making Process

Although the individual goal models addressed similar needs, they differed in emphasis due to differences in interview length. By comparing them, we identified overlapping goals, such as Lucia and Raj needing dependable box information, while keeping distinct requirements like early estimates (SG-6) and confirmed contents (SG-7) separate. We also identified dependencies in the workflow: boxes must be planned (SG-2) before members can view them (SG-5), and approved substitutions must lead to packing checklist updates (SG-14). We assigned new SG identifiers to distinguish the combined model from the original individual models.

We also identified conflicting expectations around swap deadlines. One model proposed 24 hours before packing, while another proposed Wednesday evening for Friday pickups. Rather than treating either as definitive, we documented both and initially chose the earlier deadline, until we get further stakeholder input. Finally, we put off lower-priority features, including restaurant ordering, market sales, offline synchronization, and detailed lot traceability, to keep V1 focused on the core CSA workflow.

## 2. Prototype Evaluation

### Observations

Prototype V1 implemented the general functionality outlined in our user goals, but evaluation revealed gaps in how packing infromation was communicated to stakeholders. Most notably, members could not clearly distinguish provisional box estimates from confirmed contents or identify which substitutions had been approved. This showed that displaying a list of items was insufficient, and the system also needed to communicate changes and their status.

We also noticed some ambiguity around swap deadlines and packing list finalization. V1 did not clearly distinguish between when swap requests closed and when the packing list became locked, even though Lucia could still approve requests after the cutoff. These findings highlighted the importance of transparency and predictability, which were the key areas of improvement in V2.

## 3. Revisions and Learning

The most significant change between V1 and V2 involved swap deadlines and packing list finalization. V1 used the earlier of 24 hours before packing or Wednesday at 8:00 p.m. for Friday pickups. However, evaluation revealed that this did not fully reflect stakeholder expectations: Raj wanted box contents at least 48 hours before pickup, while Lucia indicated that she sends contents by Wednesday. We also learned that closing swap requests and locking the packing list were separate events, since Lucia could still approve requests after the cutoff. In V2, we set the swap deadline to Wednesday at 8:00 p.m. for Friday pickups and require Lucia to publish the box by that time. We retained the alternative proposals in the goal model to document unresolved stakeholder differences.

We also separated provisional estimates from confirmed box contents. V1 displayed box contents and allowed substitution requests, but did not clearly communicate changes or approval status. As a result, we expanded SG-6 to include identifying changes to estimates and revised the specification and prototype to track original estimates separately from confirmed contents. V2 also introduces clearer status indicators for substitution requests and packing list finalization. These changes improve transparency for members while helping Lucia and packers prepare accurate orders.

## 4. Short Reflection

The most important decisions requiring human judgment involved resolving conflicting stakeholder expectations rather than relying solely on AI-generated requirements. Prototyping also revealed that technically meeting requirements did not necessarily mean we addressed stakeholder needs, as V1 still had information visibility issues. Spec-driven development helped maintain consistency by connecting stakeholder goals to requirements and implementation tasks, allowing changes to be traced throughout development. Our contributions extended beyond AI-generated specifications and code through the goal model, documented decisions and trade-offs, V1 evaluation, and V2 revisions. These activities ensured that the final implementation addressed the actual stakeholder needs.
