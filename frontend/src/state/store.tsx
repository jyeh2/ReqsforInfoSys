import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import { createMockState } from '../data/mockWeek';
import type { AppState } from '../domain/types';
import { reducer, type Action } from './reducer';

const KEY = `csa-box-planner-${__APP_VERSION__}`;

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch {
    /* storage unavailable — fall back to seed data */
  }
  return createMockState();
}

const Ctx = createContext<{ state: AppState; dispatch: Dispatch<Action> } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore outside provider');
  return v;
}
