"""17-626 Assignment 3 — proposed Step 1 sprint goal model.

Purpose: scoped group model for V1, *pending group agreement*.
Uses fresh SG- IDs because all three A2 models reused G-1, G-2, etc.
Plain-English goal names deliberately avoid CamelCase.

Install the course goalmodeling wheel, then run:
    python goal_model_sprint.py

The model prints a Mermaid Live Editor link. All leaf assignments and
prototype-specific workflow details are analyst proposals, not transcript quotes.

Source crosswalk (examples, not an assertion that IDs match across models):
  Your model: SG-2 ~ G-27/G-29; SG-5 ~ G-42/G-56/G-58/G-59;
              SG-8 ~ G-60/G-62/G-63; SG-13 ~ G-31/G-32/G-33/G-34.
  Teammate A detailed catalogue: SG-2 ~ G-2; SG-5 ~ G-40/G-41/G-42/G-43;
              SG-8 ~ G-46/G-47/G-49/G-93/G-94; SG-13 ~ G-11/G-20.
  Teammate B smaller graph: SG-2 ~ G-13/G-17; SG-8 ~ G-19/G-32;
              SG-13 ~ G-20/G-24.

Open question: change-request cutoff (no specific time encoded here).
"""

from goalmodeling.schema import (
    AchieveGoal, MaintainGoal, Refinement, Agent, AgentType,
    Operation, OperationCategory, PerformanceLink,
    generate_graph, generate_pako_link,
)

system = Agent("CSA prototype", AgentType.SOFTWARE_AGENT)
lucia = Agent("Lucia", AgentType.ENVIRONMENT_AGENT)
member = Agent("CSA member", AgentType.ENVIRONMENT_AGENT)
packer = Agent("Packing crew", AgentType.ENVIRONMENT_AGENT)


def leaf(id_, label, agent, operation, software=False):
    category = (
        OperationCategory.SOFTWARE_TO_BE_OPERATION
        if software else OperationCategory.ENVIRONMENT_OPERATION
    )
    return AchieveGoal(
        f"{id_}: {label}",
        leaf=True,
        performs=[PerformanceLink(agent, Operation(operation, category))],
    )


def parent(id_, label, children, maintain=False):
    cls = MaintainGoal if maintain else AchieveGoal
    return cls(
        f"{id_}: {label}",
        refinements=[Refinement(False, children, "H4")],
    )


# Box planning: core farm operation
sg3 = leaf("SG-3", "Review available produce for this week's boxes", lucia,
           "Review mock harvest quantities")
sg4 = leaf("SG-4", "Choose contents that meet the promised share value", lucia,
           "Choose the box mix")
sg2 = parent("SG-2", "Create a feasible weekly CSA box plan", [sg3, sg4])

# Clear, reliable information: member-facing operation
sg6 = leaf("SG-6", "Show the early box estimate as provisional", system,
           "Display provisional preview", True)
sg7 = leaf("SG-7", "Show current confirmed contents and later changes", system,
           "Publish final list and indicate changes", True)
sg5 = parent("SG-5", "Members can see dependable box information", [sg6, sg7], True)

# Swap requests: unresolved operational rules, displayed without inventing a cutoff
sg9 = leaf("SG-9", "Submit a swap request before the agreed cutoff", member,
           "Request a substitution")
sg10 = leaf("SG-10", "Show farm-approved substitute choices", system,
            "Display available alternatives", True)
sg11 = leaf("SG-11", "Review and approve or decline each request", lucia,
            "Review requests")
sg12 = leaf("SG-12", "Show the request status to Lucia and the member", system,
            "Display current request status", True)
sg8 = parent("SG-8", "Handle member swaps within farm limits",
             [sg9, sg10, sg11, sg12])

# Packing: fulfills approved requests in the actual box
sg14 = leaf("SG-14", "Update the packing list after an approved swap", system,
            "Update member packing checklist", True)
sg15 = leaf("SG-15", "Check each packed box against the current list", packer,
            "Verify finished box")
sg13 = parent("SG-13", "Pack the correct contents for each member", [sg14, sg15])

sg1 = parent("SG-1", "Weekly CSA boxes are planned and packed correctly",
             [sg2, sg5, sg8, sg13])

if __name__ == "__main__":
    diagram = generate_graph([sg1], [])
    print("=== PROPOSED A3 V1 SPRINT GOAL MODEL ===")
    print(generate_pako_link(diagram, "edit"))
