// Pestaña "Contactos" de la bandeja: colección `leads` (módulo forms del kit,
// kit/pocketbase/forms).
import { useState } from 'react';
import { errorMessage, pb, type RecordModel } from '../lib/pocketbase';
import { Fields, formatDate, type InboxTab } from './index';

const LEAD_STATUS: Record<string, string> = { new: 'Nuevo', contacted: 'Contactado', closed: 'Cerrado' };

const whatsappLink = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 ? `https://wa.me/${digits}` : '';
};

function LeadBadge({ record }: { record: RecordModel }) {
  return (
    <span className={`badge${record.status === 'new' || !record.status ? ' badge-building' : ''}`}>
      {LEAD_STATUS[record.status] ?? 'Nuevo'}
    </span>
  );
}

function LeadDetail({ record, onSaved }: { record: RecordModel; onSaved: (r: RecordModel) => void }) {
  const [error, setError] = useState('');

  async function setStatus(status: string) {
    setError('');
    try {
      onSaved(await pb().collection('leads').update(record.id, { status }));
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  const wa = whatsappLink(record.phone ?? '');
  return (
    <article className="card">
      <h2>{record.name}</h2>
      <Fields
        rows={[
          ['Recibido', formatDate(record.created)],
          ['Correo', record.email],
          ['Teléfono', record.phone],
          ['Interés', record.interest],
          ['Idioma', record.lang?.toUpperCase()],
          ['Mensaje', record.message],
        ]}
      />
      <div className="form-bar-actions inline-actions">
        <a className="btn" href={`mailto:${record.email}`}>
          Responder por correo
        </a>
        {wa && (
          <a className="btn" href={wa} target="_blank" rel="noopener">
            WhatsApp
          </a>
        )}
        <label className="inline-select">
          Estado
          <select value={record.status || 'new'} onChange={(e) => setStatus(e.target.value)}>
            {Object.entries(LEAD_STATUS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error && <p className="notice-error">{error}</p>}
    </article>
  );
}

export const leadsTab: InboxTab = {
  key: 'contactos',
  label: 'Contactos',
  collection: 'leads',
  pendingFilter: 'status = "new" || status = ""',
  pendingLabel: 'Solo nuevos',
  Badge: LeadBadge,
  Detail: LeadDetail,
};
