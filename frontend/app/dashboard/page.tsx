'use client';

import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api';
import { DashboardStats } from '@/lib/types';

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    apiFetch<DashboardStats>('/dashboard/', {}, token)
      .then(setStats)
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <ProtectedRoute>
      <Nav />
      <div className="container">
        <h1>Dashboard</h1>
        {error && <div style={{ background: '#fed7d7', color: '#742a2a', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
        {stats ? (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.gesamt_stellplaetze}</div>
                <div className="stat-label">Stellplätze gesamt</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.belegte_stellplaetze}</div>
                <div className="stat-label">Belegt</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.freie_stellplaetze}</div>
                <div className="stat-label">Frei</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.aktive_buchungen}</div>
                <div className="stat-label">Aktive Buchungen</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.umsatz_monat.toFixed(2)} €</div>
                <div className="stat-label">Umsatz Monat</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.umsatz_jahr.toFixed(2)} €</div>
                <div className="stat-label">Umsatz Jahr</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.durchschnittliche_belegung}%</div>
                <div className="stat-label">Auslastung</div>
              </div>
            </div>
            <div className="card">
              <h2>Stellplätze nach Typ</h2>
              <table>
                <thead>
                  <tr>
                    <th>Typ</th>
                    <th>Anzahl</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.stellplaetze_nach_typ).map(([typ, count]) => (
                    <tr key={typ}>
                      <td>{typ}</td>
                      <td>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card">
              <h2>Buchungen nach Status</h2>
              <table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Anzahl</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.buchungen_nach_status).map(([status, count]) => (
                    <tr key={status}>
                      <td>{status}</td>
                      <td>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p>Lade Dashboard...</p>
        )}
      </div>
    </ProtectedRoute>
  );
}
