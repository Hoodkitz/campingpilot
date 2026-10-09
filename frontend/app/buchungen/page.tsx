'use client';

import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api';
import { Buchung, Stellplatz } from '@/lib/types';

export default function BuchungenPage() {
  const { token } = useAuth();
  const [buchungen, setBuchungen] = useState<Buchung[]>([]);
  const [stellplaetze, setStellplaetze] = useState<Stellplatz[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    stellplatz_id: '',
    gast_name: '',
    gast_email: '',
    gast_telefon: '',
    check_in: '',
    check_out: '',
  });

  const loadData = () => {
    if (!token) return;
    apiFetch<Buchung[]>('/buchungen/', {}, token)
      .then(setBuchungen)
      .catch((err) => setError(err.message));
    apiFetch<Stellplatz[]>('/stellplaetze/', {}, token)
      .then(setStellplaetze)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/buchungen/', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          stellplatz_id: parseInt(form.stellplatz_id),
        }),
      }, token);
      setShowForm(false);
      setForm({ stellplatz_id: '', gast_name: '', gast_email: '', gast_telefon: '', check_in: '', check_out: '' });
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen');
    }
  };

  const handleCheckin = async (id: number) => {
    try {
      await apiFetch(`/buchungen/${id}/checkin`, { method: 'POST', body: '{}' }, token);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Check-in');
    }
  };

  const handleCheckout = async (id: number) => {
    try {
      await apiFetch(`/buchungen/${id}/checkout`, { method: 'POST', body: '{}' }, token);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Check-out');
    }
  };

  const handleStornieren = async (id: number) => {
    if (!confirm('Buchung wirklich stornieren?')) return;
    try {
      await apiFetch(`/buchungen/${id}/stornieren`, { method: 'POST' }, token);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Stornieren');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'reserviert': return <span className="badge badge-blue">Reserviert</span>;
      case 'checked_in': return <span className="badge badge-green">Eingecheckt</span>;
      case 'checked_out': return <span className="badge badge-gray">Ausgecheckt</span>;
      case 'storniert': return <span className="badge badge-red">Storniert</span>;
      default: return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <ProtectedRoute>
      <Nav />
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Buchungen</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Abbrechen' : 'Neue Buchung'}
          </button>
        </div>
        {error && <div style={{ background: '#fed7d7', color: '#742a2a', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
        {showForm && (
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Stellplatz</label>
                  <select value={form.stellplatz_id} onChange={(e) => setForm({ ...form, stellplatz_id: e.target.value })} required>
                    <option value="">Wählen...</option>
                    {stellplaetze.map((s) => (
                      <option key={s.id} value={s.id}>{s.nummer} ({s.typ})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Gastname</label>
                  <input value={form.gast_name} onChange={(e) => setForm({ ...form, gast_name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>E-Mail</label>
                  <input type="email" value={form.gast_email} onChange={(e) => setForm({ ...form, gast_email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Telefon</label>
                  <input value={form.gast_telefon} onChange={(e) => setForm({ ...form, gast_telefon: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Check-in</label>
                  <input type="datetime-local" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Check-out</label>
                  <input type="datetime-local" value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Speichern</button>
            </form>
          </div>
        )}
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Gast</th>
                <th>Stellplatz</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Preis</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {buchungen.map((b) => {
                const stellplatz = stellplaetze.find((s) => s.id === b.stellplatz_id);
                return (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.gast_name}</td>
                    <td>{stellplatz?.nummer || b.stellplatz_id}</td>
                    <td>{new Date(b.check_in).toLocaleDateString('de-DE')}</td>
                    <td>{new Date(b.check_out).toLocaleDateString('de-DE')}</td>
                    <td>{b.gesamtpreis.toFixed(2)} €</td>
                    <td>{getStatusBadge(b.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {b.status === 'reserviert' && (
                          <>
                            <button className="btn btn-success" onClick={() => handleCheckin(b.id)}>Check-in</button>
                            <button className="btn btn-danger" onClick={() => handleStornieren(b.id)}>Stornieren</button>
                          </>
                        )}
                        {b.status === 'checked_in' && (
                          <button className="btn btn-secondary" onClick={() => handleCheckout(b.id)}>Check-out</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
