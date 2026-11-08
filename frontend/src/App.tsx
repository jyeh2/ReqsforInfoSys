import { useState } from 'react';
import { Header, type Role } from './components/Header';
import { MemberView } from './components/MemberView';
import { PackingView } from './components/PackingView';
import { PlannerView } from './components/PlannerView';
import { RequestsView } from './components/RequestsView';
import { useStore } from './state/store';

export default function App() {
  const { state } = useStore();
  const [role, setRole] = useState<Role>('lucia');
  const [memberId, setMemberId] = useState(state.members[0].id);
  const [luciaTab, setLuciaTab] = useState<'plan' | 'requests'>('plan');
  const pending = state.requests.filter((r) => r.status === 'pending').length;

  return (
    <>
      <Header role={role} setRole={setRole} memberId={memberId} setMemberId={setMemberId} />
      <main>
        {role === 'lucia' && (
          <>
            <div className="subtabs">
              <button className={luciaTab === 'plan' ? 'tab active' : 'tab'} onClick={() => setLuciaTab('plan')}>Box plan</button>
              <button className={luciaTab === 'requests' ? 'tab active' : 'tab'} onClick={() => setLuciaTab('requests')}>
                Swap requests{pending > 0 && ` (${pending})`}
              </button>
            </div>
            {luciaTab === 'plan' ? <PlannerView /> : <RequestsView />}
          </>
        )}
        {role === 'member' && <MemberView key={memberId} memberId={memberId} />}
        {role === 'packer' && <PackingView />}
      </main>
    </>
  );
}
