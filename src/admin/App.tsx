// Isla de /admin: el editor del kit (kit/admin) con la configuración de este proyecto.
import { useMemo } from 'react';
import { adminConfig } from '#src/admin/config.tsx';
import { AdminApp } from '#kit/admin/AdminApp.tsx';

type Props = { pocketbaseUrl: string; langs: string[]; defaultLang: string };

export default function App({ pocketbaseUrl, langs, defaultLang }: Props) {
  const config = useMemo(() => adminConfig(langs, defaultLang), [langs, defaultLang]);
  return <AdminApp config={config} pocketbaseUrl={pocketbaseUrl} />;
}
