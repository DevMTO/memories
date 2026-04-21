import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

dotenv.config();

// Ensure Firebase is initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

async function seedPdfTour() {
  const pdfTour = {
    title: 'Explora Cusco Imperial',
    description: 'Disfruta de Cusco en 5 días, este paquete turístico es perfecto para visitar los lugares más turísticos de Cusco, donde cada destino turístico que visitará le sorprenderá con su historia única y arquitectura hecha por los antepasados incas.',
    price: 1200,
    durationDays: 5,
    durationNights: 4,
    location: 'Cusco, Perú',
    cities: ['Cusco', 'Valle Sagrado', 'Machu Picchu'],
    imageUrl: '/images/tour1.jpg',
    itinerary: [
      {
        day: 1,
        title: 'BIENVENIDO A CUSCO - CITY TOUR A LOS 4 ATRACTIVOS TURÍSTICOS',
        description: 'A su llegada al aeropuerto Alejandro Velasco Astete de Cusco estará a la espera por usted un transporte turistico quien le trasladará desde el aeropuerto hacia su hotel en el centro de la ciudad. Por la tarde le recogeremos de su hotel para iniciar el recorrido: Qoricancha, Sacsayhuaman, Qenqo, Pukapukara y Tambomachay.',
        accommodations: 'Hotel 4 estrellas',
        meals: 'Ninguna'
      },
      {
        day: 2,
        title: 'VALLE SAGRADO DE LOS INCAS',
        description: 'Nos enrumbamos hacia el valle sagrado donde el paisaje y montañas que rodean este lugar forman paisajes únicos y espectaculares. Pernoctamos en el hermoso y auténtico pueblo de Ollantaytambo.',
        accommodations: 'Hotel en Ollantaytambo',
        meals: 'Desayuno, Almuerzo Buffet'
      },
      {
        day: 3,
        title: 'MACHU PICCHU - LA MARAVILLA DEL MUNDO',
        description: 'Tomaremos el tren turístico con destino al pueblo de Aguas Calientes y luego un bus que nos llevará hasta la maravilla del mundo Machu Picchu donde disfrutaremos del recorrido por sus templos, recintos y lugares sagrados.',
        accommodations: 'Hotel en Cusco',
        meals: 'Desayuno'
      },
      {
        day: 4,
        title: 'MONTAÑA DE COLORES O LAGUNA HUMANTAY',
        description: 'Día de aventura hacia uno de los paisajes naturales más asombrosos de los Andes. (Día flexible según preferencia del pasajero).',
        accommodations: 'Hotel en Cusco',
        meals: 'Desayuno, Almuerzo'
      },
      {
        day: 5,
        title: 'DESPEDIDA DE CUSCO',
        description: 'A la hora oportuna, traslado al aeropuerto para abordar su vuelo de retorno.',
        accommodations: 'Ninguno',
        meals: 'Desayuno'
      }
    ],
    includes: [
      'Transporte turístico de Aeropuerto',
      'Tickets de Ingreso a todos los atractivos',
      'Tren turístico a Machu Picchu',
      'Guía profesional',
      'Alojamiento en hoteles seleccionados'
    ],
    notIncludes: [
      'Vuelos internacionales y nacionales',
      'Alimentación no mencionada',
      'Seguro de viaje'
    ]
  };

  try {
    const docRef = await db.collection('tours').add(pdfTour);
    console.log('PDF Tour seeded successfully with ID:', docRef.id);
  } catch (error) {
    console.error('Error seeding PDF Tour:', error);
  }
}

seedPdfTour();
