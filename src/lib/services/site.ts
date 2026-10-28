// Datos de contacto del sitio (registro `settings`, editable en /admin), con la
// forma que usan los componentes.
import { getEntry } from 'astro:content';

const digits = (phone: string) => phone.replace(/\D/g, '');

export async function getContact() {
  const data = (await getEntry('settings', 'settings'))?.data;
  return {
    whatsappNumber: digits(data?.whatsapp ?? ''),
    whatsappDisplay: data?.whatsapp ?? '',
    emergencyNumber: digits(data?.emergencyPhone ?? ''),
    emergencyDisplay: data?.emergencyPhone ?? '',
    email: data?.email ?? '',
    address: data?.address ?? '',
  };
}
