// Núcleo de /admin: sesión, menú y pantallas a partir de la configuración del
// proyecto (navegación por hash). Ver kit/README.md.
import { useEffect, useState } from 'react';
import { liveUrl, setConfig, type AdminConfig, type SectionDef } from './config';
import { connect, pb } from './lib/pocketbase';
import { PreviewControl, PublishButton, PublishProvider, PublishStatus } from './lib/publish';
import { useRoute } from './lib/router';
import { Account } from './screens/Account';
import { Backups } from './screens/Backups';
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
          <PreviewControl />
          <PublishButton />
          <a className="btn btn-ghost" href={liveUrl()} target="_blank" rel="noopener">
            Sitio publicado ↗
          </a>
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
        {/* Lo que se usa poco: abajo, aparte del contenido. */}
        <div className="sidebar-footer">
          <a href={`#/${BACKUPS}`} className={current === BACKUPS ? 'is-active' : ''}>
            Copias de seguridad
          </a>
          <a href={`#/${ACCOUNT}`} className={current === ACCOUNT ? 'is-active' : ''}>
            Mi cuenta
          </a>
          <button type="button" className="sidebar-link" onClick={() => confirm('¿Cerrar sesión?') && onLogout()}>
            Cerrar sesión
          </button>
        </div>
      </nav>
      <main className="content">
        <PublishStatus showPending={current !== ''} />
        <Screen section={config.sections.find((s) => s.key === current)} route={route} />
      </main>
    </div>
  );
}

// Pantallas propias del kit, fuera de las secciones del proyecto: al pie del menú.
const ACCOUNT = 'cuenta';
const BACKUPS = 'copias';

function Screen({ section, route }: { section: SectionDef | undefined; route: string[] }) {
  const [key = '', id, extra] = route;
  if (!key) return <Dashboard />;
  if (key === ACCOUNT && !section) return <Account />;
  if (key === BACKUPS && !section) return <Backups />;
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
