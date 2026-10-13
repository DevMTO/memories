export const SITE_CONTACT = {
  whatsappNumber: '51954669589',
  whatsappDisplay: '+51 954 669 589',
  emergencyNumber: '51926301932',
  emergencyDisplay: '+51 926 301 932',
  email: 'reservas@memoriestravel.com',
  address: 'Luis Vallejo Santoni C-2, Santiago - Cusco',
} as const;

export const buildWhatsAppUrl = (message?: string) => {
  const base = `https://wa.me/${SITE_CONTACT.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

export const SITE_DEVELOPER = {
  name: 'Turix',
  url: 'https://turix.tech/',
} as const;
