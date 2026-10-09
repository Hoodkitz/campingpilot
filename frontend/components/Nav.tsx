'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function Nav() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ background: '#1a365d', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>
          Campingpilot
        </Link>
        {user && (
          <>
            <Link href="/stellplaetze" style={{ color: '#cbd5e0', textDecoration: 'none' }}>Stellplätze</Link>
            <Link href="/buchungen" style={{ color: '#cbd5e0', textDecoration: 'none' }}>Buchungen</Link>
          </>
        )}
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: '#cbd5e0' }}>{user.username}</span>
            <button onClick={logout} style={{ background: '#e53e3e', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
        )}
      </div>
    </nav>
  );
}
