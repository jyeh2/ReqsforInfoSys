// Mock data for one week (Assumption A-3: all values are mock, not stakeholder facts).
import type { AppState } from '../domain/types';

export function createMockState(): AppState {
  return {
    items: [
      { id: 'carrots', name: 'Carrots', unit: 'bunch', available: 12, unitValue: 3, isSubstitute: false },
      { id: 'kale', name: 'Kale', unit: 'bunch', available: 10, unitValue: 3.5, isSubstitute: false },
      { id: 'salad', name: 'Salad mix', unit: 'bag', available: 8, unitValue: 5, isSubstitute: false },
      { id: 'tomatoes', name: 'Heirloom tomatoes', unit: 'lb', available: 6, unitValue: 4.5, isSubstitute: false },
      { id: 'potatoes', name: 'Potatoes', unit: 'lb', available: 20, unitValue: 2, isSubstitute: false },
      { id: 'squash', name: 'Winter squash', unit: 'each', available: 6, unitValue: 4, isSubstitute: false },
      { id: 'garlic', name: 'Garlic', unit: 'head', available: 10, unitValue: 1.5, isSubstitute: false },
      { id: 'apples', name: 'Apples', unit: 'lb', available: 16, unitValue: 2.5, isSubstitute: false },
      { id: 'beets', name: 'Beets', unit: 'bunch', available: 6, unitValue: 3, isSubstitute: true },
      { id: 'spinach', name: 'Spinach', unit: 'bunch', available: 3, unitValue: 3.5, isSubstitute: true },
      { id: 'leeks', name: 'Leeks', unit: 'each', available: 4, unitValue: 2.5, isSubstitute: true },
      { id: 'sweetpotatoes', name: 'Sweet potatoes', unit: 'lb', available: 8, unitValue: 3, isSubstitute: true },
    ],
    members: [
      { id: 'raj', name: 'Raj' },
      { id: 'mei', name: 'Mei' },
      { id: 'sam', name: 'Sam' },
      { id: 'dana', name: 'Dana' },
    ],
    // Assumption A-1: Friday pickup, packing starts Thursday 08:00.
    schedule: { pickup: '2026-11-13T09:00', packingStart: '2026-11-12T08:00' },
    plan: {
      status: 'draft',
      shareValue: 25,
      lines: [
        { itemId: 'carrots', qty: 1 },
        { itemId: 'kale', qty: 1 },
        { itemId: 'salad', qty: 1 },
        { itemId: 'potatoes', qty: 2 },
        { itemId: 'squash', qty: 1 },
        { itemId: 'apples', qty: 2 },
        { itemId: 'garlic', qty: 1 },
      ],
    },
    requests: [],
    clock: '2026-11-09T09:00',
    packingChecks: {},
    packingMarked: {},
  };
}
