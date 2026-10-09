'use client';

import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api';
import { Stellplatz } from '@/lib/types';

export default function StellplaetzePage() {
  const { token } = useAuth();
  const [stellplaetze, setStellplaetze] = useState<Stellplatz[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nummer: '',
    typ: 'wohnmobil' as 'wohnmobil' | 'zelt' | 'wohnwagen',
    preis_pro_nacht: '',
    beschreibung: '',
    hat_strom: false,
    hat_wasser: false,
  });

  const loadStellplaetze = () => {
    if (!token) return;
    apiFetch<Stellplatz[]>('/stellplaetze/', {}, token)
      .then(setStellplaetze)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadStellplaetze();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/stellplaetze/', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          preis_pro_nacht: parseFloat(form.preis_pro_nacht),
        }),
      }, token);
      setShowForm(false);
      setForm({ nummer: '', typ: 'wohnmobil', preis_pro_nacht: '', beschreibung: '', hat_strom: false, hat_wasser: false });
      loadStellplaetze();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Stellplatz wirklich löschen?')) return;
    try {
      await apiFetch(`/stellplaetze/${id}`, { method: 'DELETE' }, token);
      loadStellplaetze();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen');
    }
  };

  return (
    <ProtectedRoute>
      <Nav />
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Stellplätze</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Abbrechen' : 'Neuer Stellplatz'}
          </button>
        </div>
        {error && <div style={{ background: '#fed7d7', color: '#742a2a', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
        {showForm && (
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Nummer</label>
                  <input value={form.nummer} onChange={(e) => setForm({ ...form, nummer: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Typ</label>
                  <select value={form.typ} onChange={(e) => setForm({ ...form, typ: e.target.value as 'wohnmobil' | 'zelt' | 'wohnwagen' })}>
                    <option value="wohnmobil">Wohnmobil</option>
                    <option value="zelt">Zelt</option>
                    <option value="wohnwagen">Wohnwagen</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Preis pro Nacht (€)</label>
                  <input type="number" step="0.01" value={form.preis_pro_nacht} onChange={(e) => setForm({ ...form, preis_pro_nacht: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Beschreibung</label>
                  <input value={form.beschreibung} onChange={(e) => setForm({ ...form, beschreibung: e.target.value })} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="hat_strom" checked={form.hat_strom} onChange={(e) => setForm({ ...form, hat_strom: e.target.checked })} style={{ width: 'auto' }} />
                  <label htmlFor="hat_strom" style={{ margin: 0 }}>Strom</label>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" id="hat_wasser" checked={form.hat_wasser} onChange={(e) => setForm({ ...form, hat_wasser: e.target.checked })} style={{ width: 'auto' }} />
                  <label htmlFor="hat_wasser" style={{ margin: 0 }}>Wasser</label>
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
                <th>Nr.</th>
                <th>Typ</th>
                <th>Preis/Nacht</th>
                <th>Strom</th>
                <th>Wasser</th>
                <th>Aktiv</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {stellplaetze.map((s) => (
                <tr key={s.id}>
                  <td>{s.nummer}</td>
                  <td>{s.typ}</td>
                  <td>{s.preis_pro_nacht.toFixed(2)} €</td>
                  <td>{s.hat_strom ? 'Ja' : 'Nein'}</td>
                  <td>{s.hat_wasser ? 'Ja' : 'Nein'}</td>
                  <td>{s.ist_aktiv ? 'Ja' : 'Nein'}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>Löschen</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
