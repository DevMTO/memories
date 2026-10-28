// Núcleo de /admin: sesión, menú y pantallas a partir de la configuración del
// proyecto (navegación por hash). Ver kit/README.md.
import { useEffect, useState } from 'react';
import { setConfig, type AdminConfig, type SectionDef } from './config';
import { connect, pb } from './lib/pocketbase';
import { PreviewButton, PublishButton, PublishProvider, PublishStatus } from './lib/publish';
import { useRoute } from './lib/router';
import { Dashboard } from './screens/Dashboard';
import { FormScreen } from './screens/FormScreen';
import { ListScreen } from './screens/ListScreen';
import { Login } from './screens/Login';
import { SingleRecordScreen } from './screens/SingleRecordScreen';
import { TrashScreen } from './screens/TrashScreen';

type Props = { config: AdminConfig; pocketbaseUrl: string };

// Estado de la sesión: el SDK guarda el token en localStorage. Se revisa cada
// minuto porque el token vence aunque nadie toque nada.
function useSession() {
  const [valid, setValid] = useState(() => pb().authStore.isValid);
  useEffect(() => {
    const update = () => setValid(pb().authStore.isValid);
    const unsubscribe = pb().authStore.onChange(update);
    const timer = setInterval(update, 60_000);
    // Renovar el token al abrir; si ya no sirve, al login.
    if (pb().authStore.isValid)
      pb()
        .collection('editors')
        .authRefresh()
        .catch(() => pb().authStore.clear());
    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);
  return valid;
}

export function AdminApp({ config, pocketbaseUrl }: Props) {
  connect(pocketbaseUrl);
  setConfig(config);
  const valid = useSession();
  // Una vez adentro, si la sesión vence se muestra el login encima sin
  // desmontar la pantalla (no se pierde el formulario abierto).
  const [entered, setEntered] = useState(valid);
  useEffect(() => {
    if (valid) setEntered(true);
  }, [valid]);

  if (!entered) {
    return (
      <div className="login-page">
        <Login title={config.brand} />
      </div>
    );
  }

  return (
    <PublishProvider>
      <Shell config={config} onLogout={logout} />
      {!valid && (
        <div className="overlay">
          <Login title={config.brand} expired />
        </div>
      )}
    </PublishProvider>
  );

  function logout() {
    pb().authStore.clear();
    setEntered(false);
  }
}

function NavBadge({ useBadge }: { useBadge: () => number }) {
  const count = useBadge();
  return count > 0 ? <span className="nav-count">{count}</span> : null;
}

function Shell({ config, onLogout }: { config: AdminConfig; onLogout: () => void }) {
  const route = useRoute();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [route.join('/')]);
  const current = route[0] ?? '';

  return (
    <div className="shell">
      <header className="topbar">
        <button type="button" className="icon-btn menu-toggle" aria-label="Menú" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <a className="brand" href="#/">
          {config.brand} · Editor
        </a>
        <div className="topbar-actions">
          <PreviewButton className="btn btn-ghost" />
          <PublishButton />
          <a className="btn btn-ghost" href={config.siteUrl ?? '/'} target="_blank" rel="noopener">
            Ver sitio ↗
          </a>
          <button type="button" className="btn btn-ghost" onClick={() => confirm('¿Cerrar sesión?') && onLogout()}>
            Salir
          </button>
        </div>
      </header>
      <nav className={`sidebar${menuOpen ? ' is-open' : ''}`}>
        <a href="#/" className={current === '' ? 'is-active' : ''}>
          Inicio
        </a>
        {config.sections.map((s) => (
          <a key={s.key} href={`#/${s.key}`} className={current === s.key ? 'is-active' : ''}>
            {s.title}
            {s.kind === 'screen' && s.useBadge && <NavBadge useBadge={s.useBadge} />}
          </a>
        ))}
      </nav>
      <main className="content">
        <PublishStatus showPending={current !== ''} />
        <Screen section={config.sections.find((s) => s.key === current)} route={route} />
      </main>
    </div>
  );
}

function Screen({ section, route }: { section: SectionDef | undefined; route: string[] }) {
  const [key = '', id, extra] = route;
  if (!key) return <Dashboard />;
  switch (section?.kind) {
    case 'collection':
      if (id === 'borrados') return <TrashScreen def={section} />;
      return id ? (
        <FormScreen key={section.key} def={section} id={id} copyFrom={id === 'nuevo' ? extra : undefined} />
      ) : (
        <ListScreen def={section} />
      );
    case 'single':
      return <SingleRecordScreen key={section.key} def={section} />;
    case 'screen':
      return <section.Screen route={route.slice(1)} />;
    default:
      return (
        <p>
          Página no encontrada. <a href="#/">Volver al inicio</a>
        </p>
      );
  }
}
