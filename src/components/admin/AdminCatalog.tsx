import React, { useEffect, useMemo, useState } from 'react';
import type { ItineraryDay, TravelProduct, TravelProductKind } from '../../core/domain/models';
import { sitePath } from '../../core/site-path';

const emptyDay = (day = 1): ItineraryDay => ({
  day,
  title: `Día ${day}`,
  description: '',
  meals: [],
  includes: [],
  notIncludes: [],
});

const emptyProduct = (): TravelProduct => ({
  id: '',
  kind: 'tour',
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  price: 0,
  durationDays: 1,
  durationNights: 0,
  destinationName: 'Cusco',
  destinationSlug: 'cusco',
  location: 'Cusco',
  cities: ['Cusco'],
  imageUrl: '/images/hero.webp',
  gallery: [],
  features: ['Tour guiado'],
  highlights: [],
  itinerary: [emptyDay()],
  includes: [],
  notIncludes: [],
  whatToBring: [],
  importantNotes: [],
  seoTitle: '',
  seoDescription: '',
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
});

const asLines = (items?: string[]) => (items || []).join('\n');
const fromLines = (value: string) => value.split('\n').map((item) => item.trim()).filter(Boolean);

const kindLabel: Record<TravelProductKind, string> = {
  tour: 'Tour',
  trekking: 'Trekking',
  package: 'Paquete',
};

function LineField({ label, value, onChange, help }: {
  label: string;
  value?: string[];
  onChange: (items: string[]) => void;
  help?: string;
}) {
  return (
    <label className="admin-field admin-field--wide">
      <span>{label}</span>
      {help && <small>{help}</small>}
      <textarea rows={5} value={asLines(value)} onChange={(event) => onChange(fromLines(event.target.value))} />
    </label>
  );
}

export default function AdminCatalog() {
  const [products, setProducts] = useState<TravelProduct[]>([]);
  const [draft, setDraft] = useState<TravelProduct>(emptyProduct());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'all' | TravelProductKind>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const loadProducts = async (preferredId?: string) => {
    setLoading(true);
    try {
      const response = await fetch(sitePath('/api/admin/catalog'));
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo cargar el catálogo.');
      setProducts(payload.products);
      const nextId = preferredId || selectedId || payload.products[0]?.id;
      const selected = payload.products.find((item: TravelProduct) => item.id === nextId);
      if (selected) {
        setSelectedId(selected.id);
        setDraft(structuredClone(selected));
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo cargar el catálogo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadProducts(); }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesKind = kind === 'all' || product.kind === kind;
      const matchesQuery = !needle || [product.title, product.destinationName, product.slug]
        .some((value) => value?.toLowerCase().includes(needle));
      return matchesKind && matchesQuery;
    });
  }, [products, query, kind]);

  const update = (key: string, value: unknown) =>
    setDraft((current) => ({ ...current, [key]: value } as TravelProduct));

  const selectProduct = (product: TravelProduct) => {
    setSelectedId(product.id);
    setDraft(structuredClone(product));
    setNotice('');
    setError('');
  };

  const newProduct = () => {
    setSelectedId(null);
    setDraft(emptyProduct());
    setNotice('Nuevo registro listo para completar.');
    setError('');
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    setError('');

    try {
      const endpoint = selectedId
        ? sitePath(`/api/admin/catalog/${encodeURIComponent(selectedId)}`)
        : sitePath('/api/admin/catalog');
      const response = await fetch(endpoint, {
        method: selectedId ? 'PUT' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo guardar.');
      setNotice('Cambios guardados correctamente.');
      await loadProducts(payload.product.id);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!selectedId || !window.confirm(`¿Eliminar definitivamente “${draft.title}”?`)) return;
    setError('');
    const response = await fetch(sitePath(`/api/admin/catalog/${encodeURIComponent(selectedId)}`), { method: 'DELETE' });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || 'No se pudo eliminar.');
      return;
    }
    setSelectedId(null);
    setDraft(emptyProduct());
    setNotice('Registro eliminado.');
    await loadProducts();
  };

  const logout = async () => {
    await fetch(sitePath('/api/admin/session'), { method: 'DELETE' });
    window.location.href = sitePath('/gestion/login');
  };

  const setDay = (index: number, day: ItineraryDay) => {
    const next = [...(draft.itinerary || [])];
    next[index] = day;
    update('itinerary', next);
  };

  const addDay = () => {
    const nextDay = (draft.itinerary?.length || 0) + 1;
    update('itinerary', [...(draft.itinerary || []), emptyDay(nextDay)]);
  };

  const removeDay = (index: number) => {
    update('itinerary', (draft.itinerary || []).filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <main className="catalog-admin">
      <aside className="catalog-sidebar">
        <div className="catalog-brand">
          <img src={sitePath('/images/LOGOTIPOS/LOGOTIPO-MEMORIES-TRAVEL-5.webp')} alt="Memories Travel" />
          <span>Gestión de catálogo</span>
        </div>
        <button className="admin-primary-button" type="button" onClick={newProduct}>+ Nueva experiencia</button>
        <input className="catalog-search" placeholder="Buscar por nombre o destino" value={query} onChange={(event) => setQuery(event.target.value)} />
        <div className="catalog-filters" role="group" aria-label="Filtrar por tipo">
          {(['all', 'tour', 'trekking', 'package'] as const).map((value) => (
            <button key={value} type="button" className={kind === value ? 'is-active' : ''} onClick={() => setKind(value)}>
              {value === 'all' ? 'Todos' : kindLabel[value]}
            </button>
          ))}
        </div>
        <div className="catalog-list" aria-live="polite">
          {loading ? <p className="catalog-empty">Cargando…</p> : filtered.map((product) => (
            <button key={product.id} type="button" className={`catalog-list-item ${selectedId === product.id ? 'is-selected' : ''}`} onClick={() => selectProduct(product)}>
              <span className={`catalog-kind catalog-kind--${product.kind}`}>{kindLabel[product.kind]}</span>
              <strong>{product.title}</strong>
              <small>{product.destinationName} · {product.isActive ? 'Publicado' : 'Borrador'}</small>
            </button>
          ))}
          {!loading && filtered.length === 0 && <p className="catalog-empty">No hay coincidencias.</p>}
        </div>
        <button className="admin-logout" type="button" onClick={logout}>Cerrar sesión</button>
      </aside>

      <section className="catalog-editor">
        <header className="catalog-editor-header">
          <div>
            <p className="admin-kicker">{selectedId ? 'Editar experiencia' : 'Nueva experiencia'}</p>
            <h1>{draft.title || 'Sin título'}</h1>
          </div>
          <div className="catalog-editor-actions">
            {selectedId && <a href={sitePath(draft.kind === 'package' ? `/packages/${draft.slug}` : `/tours/${draft.slug}`)} target="_blank" rel="noreferrer">Vista pública ↗</a>}
            {selectedId && <button type="button" className="admin-danger-button" onClick={remove}>Eliminar</button>}
            <button type="submit" form="catalog-form" className="admin-primary-button" disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
          </div>
        </header>

        {notice && <p className="admin-alert admin-alert--success">{notice}</p>}
        {error && <p className="admin-alert admin-alert--error">{error}</p>}

        <form id="catalog-form" onSubmit={save} className="catalog-form">
          <section className="admin-panel">
            <div className="admin-panel-title"><span>01</span><div><h2>Información principal</h2><p>Datos visibles en tarjetas, filtros y cabecera.</p></div></div>
            <div className="admin-form-grid">
              <label className="admin-field"><span>Tipo</span><select value={draft.kind} onChange={(event) => update('kind', event.target.value as TravelProductKind)}><option value="tour">Tour</option><option value="trekking">Trekking</option><option value="package">Paquete</option></select></label>
              <label className="admin-field"><span>Orden</span><input type="number" min="0" value={draft.sortOrder || 0} onChange={(event) => update('sortOrder', Number(event.target.value))} /></label>
              <label className="admin-field admin-field--wide"><span>Título</span><input value={draft.title} onChange={(event) => update('title', event.target.value)} required /></label>
              <label className="admin-field admin-field--wide"><span>Slug URL</span><input value={draft.slug} onChange={(event) => update('slug', event.target.value)} placeholder="se genera desde el título si se deja vacío" /></label>
              <label className="admin-field"><span>Días</span><input type="number" min="1" value={draft.durationDays} onChange={(event) => update('durationDays', Number(event.target.value))} /></label>
              <label className="admin-field"><span>Noches</span><input type="number" min="0" value={draft.durationNights || 0} onChange={(event) => update('durationNights', Number(event.target.value))} /></label>
              <label className="admin-field"><span>Precio desde (USD)</span><input type="number" min="0" step="0.01" value={draft.price} onChange={(event) => update('price', Number(event.target.value))} /></label>
              <label className="admin-field"><span>Destino principal</span><input value={draft.destinationName} onChange={(event) => update('destinationName', event.target.value)} /></label>
              <label className="admin-field"><span>Slug del destino</span><input value={draft.destinationSlug} onChange={(event) => update('destinationSlug', event.target.value)} /></label>
              <label className="admin-field"><span>Ubicación</span><input value={draft.location || ''} onChange={(event) => update('location', event.target.value)} /></label>
              <label className="admin-field admin-field--wide"><span>Descripción corta</span><textarea rows={3} value={draft.shortDescription || ''} onChange={(event) => update('shortDescription', event.target.value)} /></label>
              <label className="admin-field admin-field--wide"><span>Descripción completa</span><textarea rows={9} value={draft.description} onChange={(event) => update('description', event.target.value)} required /></label>
              <label className="admin-check"><input type="checkbox" checked={draft.isActive !== false} onChange={(event) => update('isActive', event.target.checked)} /><span>Publicado</span></label>
              <label className="admin-check"><input type="checkbox" checked={Boolean(draft.isFeatured)} onChange={(event) => update('isFeatured', event.target.checked)} /><span>Destacado en inicio</span></label>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-title"><span>02</span><div><h2>Imágenes y destinos</h2><p>Usa rutas dentro de public, por ejemplo /images/cusco/machu-picchu.webp.</p></div></div>
            <div className="admin-form-grid">
              <label className="admin-field admin-field--wide"><span>Imagen principal</span><input value={draft.imageUrl} onChange={(event) => update('imageUrl', event.target.value)} /></label>
              {draft.imageUrl && <div className="admin-image-preview"><img src={sitePath(draft.imageUrl)} alt="Vista previa" /></div>}
              <LineField label="Galería" value={draft.gallery} onChange={(value) => update('gallery', value)} help="Una ruta de imagen por línea." />
              <LineField label="Ciudades y lugares" value={draft.cities} onChange={(value) => update('cities', value)} help="Un destino por línea; se usa en filtros y páginas de destino." />
              {draft.kind === 'package' && <LineField label="Destinos del paquete" value={(draft.destinations || []).map((item) => `${item.name}|${item.slug}`)} onChange={(value) => update('destinations', value.map((line) => { const [name, slug = ''] = line.split('|'); return { name: name.trim(), slug: slug.trim() }; }))} help="Formato: Nombre|slug, uno por línea." />}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-title"><span>03</span><div><h2>Contenido del servicio</h2><p>Completa todo lo que el viajero necesita conocer antes de reservar.</p></div></div>
            <div className="admin-form-grid admin-form-grid--lists">
              <LineField label="Características" value={draft.features} onChange={(value) => update('features', value)} />
              <LineField label="Highlights" value={draft.highlights} onChange={(value) => update('highlights', value)} />
              <LineField label="Incluye" value={draft.includes} onChange={(value) => update('includes', value)} />
              <LineField label="No incluye" value={draft.notIncludes} onChange={(value) => update('notIncludes', value)} />
              <LineField label="Qué llevar" value={draft.whatToBring} onChange={(value) => update('whatToBring', value)} />
              <LineField label="Información importante" value={draft.importantNotes} onChange={(value) => update('importantNotes', value)} />
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-title admin-panel-title--actions"><span>04</span><div><h2>Itinerario detallado</h2><p>Edita cada jornada, comidas y servicios específicos.</p></div><button type="button" onClick={addDay}>+ Agregar día</button></div>
            <div className="admin-days">
              {(draft.itinerary || []).map((day, index) => (
                <article className="admin-day" key={`${day.day}-${index}`}>
                  <header><strong>Día {day.day}</strong><button type="button" onClick={() => removeDay(index)}>Quitar</button></header>
                  <div className="admin-form-grid">
                    <label className="admin-field"><span>Número</span><input type="number" min="1" value={day.day} onChange={(event) => setDay(index, { ...day, day: Number(event.target.value) })} /></label>
                    <label className="admin-field"><span>Alojamiento</span><input value={day.accommodations || ''} onChange={(event) => setDay(index, { ...day, accommodations: event.target.value })} /></label>
                    <label className="admin-field admin-field--wide"><span>Título</span><input value={day.title} onChange={(event) => setDay(index, { ...day, title: event.target.value })} /></label>
                    <label className="admin-field admin-field--wide"><span>Descripción</span><textarea rows={7} value={day.description} onChange={(event) => setDay(index, { ...day, description: event.target.value })} /></label>
                    <label className="admin-field admin-field--wide"><span>Comidas (separadas por coma)</span><input value={(day.meals || []).join(', ')} onChange={(event) => setDay(index, { ...day, meals: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} /></label>
                    <LineField label="Incluye este día" value={day.includes} onChange={(value) => setDay(index, { ...day, includes: value })} />
                    <LineField label="No incluye este día" value={day.notIncludes} onChange={(value) => setDay(index, { ...day, notIncludes: value })} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-title"><span>05</span><div><h2>SEO</h2><p>Título y resumen para buscadores.</p></div></div>
            <div className="admin-form-grid">
              <label className="admin-field admin-field--wide"><span>Título SEO</span><input value={draft.seoTitle || ''} onChange={(event) => update('seoTitle', event.target.value)} /></label>
              <label className="admin-field admin-field--wide"><span>Descripción SEO</span><textarea rows={3} value={draft.seoDescription || ''} onChange={(event) => update('seoDescription', event.target.value)} /></label>
            </div>
          </section>

          <div className="admin-mobile-save"><button className="admin-primary-button" disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button></div>
        </form>
      </section>
    </main>
  );
}
