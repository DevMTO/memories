import type { Tour, Package } from '../../core/domain/models';
import type { ITourRepository } from '../../core/domain/ports/ITourRepository';

type Destination = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
};

export class MockTourRepository implements ITourRepository {
  private tours: Tour[] = [
    {
      id: '1',
      title: 'City Tour Cusco',
      slug: 'city-tour-cusco',
      description:
        'Recorra los principales atractivos de la ciudad imperial del Cusco, combinando historia, arquitectura inca y belleza colonial en una experiencia cultural imprescindible.',
      shortDescription:
        'Tour por los principales atractivos arqueológicos y culturales de Cusco.',
      price: 45,
      durationDays: 1,
      destinationName: 'Cusco',
      destinationSlug: 'cusco',
      location: 'Cusco, Peru',
      cities: ['Cusco'],
      imageUrl: '/images/tour1.jpg',
      gallery: ['/images/tour1.jpg', '/images/tour1-2.jpg'],
      features: ['Servicio compartido', 'Guía profesional', 'Recojo del hotel'],
      highlights: [
        'Qoricancha',
        'Sacsayhuamán',
        'Qenqo',
        'Puka Pukará',
        'Tambomachay'
      ],
      itinerary: [
        {
          day: 1,
          title: 'City Tour en Cusco',
          description:
            'Visita guiada por Qoricancha y los 4 sitios arqueológicos más emblemáticos de los alrededores de Cusco.',
          meals: [],
          includes: [
            'Recojo del hotel',
            'Transporte turístico',
            'Guía profesional',
            'Visita a Qoricancha',
            'Visita a Sacsayhuamán, Qenqo, Puka Pukará y Tambomachay'
          ],
          notIncludes: [
            'Alimentación',
            'Boletos no especificados',
            'Gastos personales'
          ]
        }
      ],
      includes: ['Transporte turístico', 'Guía profesional', 'Asistencia básica'],
      notIncludes: ['Alimentos', 'Propinas', 'Gastos personales'],
      whatToBring: [
        'Documento de identidad',
        'Bloqueador solar',
        'Agua',
        'Casaca ligera'
      ],
      seoTitle: 'City Tour Cusco | Tour cultural en la ciudad imperial',
      seoDescription:
        'Descubre Qoricancha, Sacsayhuamán y más en este city tour por Cusco.',
      isActive: true,
      isFeatured: true
    },
    {
      id: '2',
      title: 'Tour Valle Sagrado',
      slug: 'tour-valle-sagrado',
      description:
        'Explore el mágico Valle Sagrado de los Incas y descubra pueblos tradicionales, sitios arqueológicos y paisajes andinos inolvidables.',
      shortDescription:
        'Excursión de día completo por el Valle Sagrado de los Incas.',
      price: 75,
      durationDays: 1,
      destinationName: 'Valle Sagrado',
      destinationSlug: 'valle-sagrado',
      location: 'Cusco, Peru',
      cities: ['Pisac', 'Urubamba', 'Ollantaytambo'],
      imageUrl: '/images/tour2.jpg',
      gallery: ['/images/tour2.jpg', '/images/tour2-2.jpg'],
      features: ['Full day', 'Buffet incluido', 'Guía profesional'],
      highlights: ['Pisac', 'Urubamba', 'Ollantaytambo', 'Paisajes andinos'],
      itinerary: [
        {
          day: 1,
          title: 'Valle Sagrado de los Incas',
          description:
            'Recorrido por Pisac, almuerzo buffet en Urubamba y visita a Ollantaytambo.',
          meals: ['Almuerzo'],
          includes: [
            'Recojo del hotel',
            'Transporte turístico',
            'Guía profesional',
            'Almuerzo buffet'
          ],
          notIncludes: ['Desayuno', 'Cena', 'Boletos no especificados']
        }
      ],
      includes: [
        'Transporte turístico',
        'Guía profesional',
        'Almuerzo buffet'
      ],
      notIncludes: ['Desayuno', 'Cena', 'Gastos extras'],
      whatToBring: ['Documento de identidad', 'Sombrero', 'Bloqueador solar'],
      seoTitle: 'Tour Valle Sagrado | Excursión full day desde Cusco',
      seoDescription:
        'Visita Pisac, Urubamba y Ollantaytambo en un tour completo por el Valle Sagrado.',
      isActive: true,
      isFeatured: true
    },
    {
      id: '3',
      title: 'Tour Machu Picchu Full Day',
      slug: 'tour-machu-picchu-full-day',
      description:
        'Viva una experiencia única visitando la maravilla del mundo Machu Picchu en un recorrido cuidadosamente organizado desde Cusco.',
      shortDescription:
        'Excursión de día completo a Machu Picchu con tren y guía.',
      price: 320,
      durationDays: 1,
      destinationName: 'Machu Picchu',
      destinationSlug: 'machu-picchu',
      location: 'Cusco, Peru',
      cities: ['Ollantaytambo', 'Aguas Calientes', 'Machu Picchu'],
      imageUrl: '/images/tour3.jpg',
      gallery: ['/images/tour3.jpg', '/images/tour3-2.jpg'],
      features: ['Tren incluido', 'Ingreso incluido', 'Guía profesional'],
      highlights: [
        'Viaje en tren',
        'Aguas Calientes',
        'Visita guiada en Machu Picchu'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Excursión a Machu Picchu',
          description:
            'Salida en tren, ascenso en bus a Machu Picchu y recorrido guiado por la ciudadela inca.',
          meals: [],
          includes: [
            'Tren turístico ida y retorno',
            'Bus Consettur ida y retorno',
            'Ingreso a Machu Picchu',
            'Guía profesional'
          ],
          notIncludes: ['Almuerzo', 'Cena', 'Wayna Picchu', 'Gastos personales']
        }
      ],
      includes: [
        'Tren ida y retorno',
        'Bus a Machu Picchu',
        'Ingreso',
        'Guía profesional'
      ],
      notIncludes: ['Alimentos', 'Seguro de viaje', 'Extras no mencionados'],
      whatToBring: [
        'Pasaporte original',
        'Bloqueador solar',
        'Agua',
        'Ropa ligera'
      ],
      seoTitle: 'Tour Machu Picchu Full Day | Experiencia completa',
      seoDescription:
        'Descubre Machu Picchu en un tour full day con tren, bus e ingreso incluido.',
      isActive: true,
      isFeatured: true
    },
    {
      id: '4',
      title: 'Tour Laguna Humantay',
      slug: 'tour-laguna-humantay',
      description:
        'Descubra una de las lagunas más impresionantes de los Andes peruanos en una aventura de altura rodeada de paisajes espectaculares.',
      shortDescription:
        'Aventura de un día completo a la impresionante Laguna Humantay.',
      price: 55,
      durationDays: 1,
      destinationName: 'Humantay',
      destinationSlug: 'humantay',
      location: 'Cusco, Peru',
      cities: ['Mollepata', 'Soraypampa'],
      imageUrl: '/images/tour4.jpg',
      gallery: ['/images/tour4.jpg', '/images/tour4-2.jpg'],
      features: ['Trekking', 'Paisajes naturales', 'Full day'],
      highlights: ['Laguna Humantay', 'Soraypampa', 'Vista de nevados'],
      itinerary: [
        {
          day: 1,
          title: 'Excursión a Laguna Humantay',
          description:
            'Salida temprano desde Cusco, desayuno, caminata hacia la laguna y retorno por la tarde.',
          meals: ['Desayuno', 'Almuerzo'],
          includes: [
            'Recojo del hotel',
            'Transporte turístico',
            'Desayuno',
            'Almuerzo',
            'Guía profesional'
          ],
          notIncludes: ['Caballo de apoyo', 'Entrada', 'Gastos personales']
        }
      ],
      includes: [
        'Transporte turístico',
        'Guía profesional',
        'Desayuno',
        'Almuerzo'
      ],
      notIncludes: ['Ingreso', 'Caballo', 'Propinas'],
      whatToBring: [
        'Ropa abrigadora',
        'Bloqueador solar',
        'Agua',
        'Calzado de trekking'
      ],
      seoTitle: 'Tour Laguna Humantay | Aventura full day desde Cusco',
      seoDescription:
        'Explora la Laguna Humantay en una experiencia de naturaleza y aventura.',
      isActive: true,
      isFeatured: false
    }
  ];

  private packages: Package[] = [
    {
      id: '1',
      title: 'Explora Cusco Imperial 5 Días / 4 Noches',
      slug: 'explora-cusco-imperial-5-dias-4-noches',
      description:
        'Disfruta de Cusco en 5 días visitando la ciudad imperial, Maras, Moray, Valle Sagrado y la maravilla del mundo Machu Picchu.',
      shortDescription:
        'Paquete completo por Cusco, Valle Sagrado y Machu Picchu.',
      price: 620,
      durationDays: 5,
      durationNights: 4,
      destinations: [
        { name: 'Cusco', slug: 'cusco' },
        { name: 'Valle Sagrado', slug: 'valle-sagrado' },
        { name: 'Machu Picchu', slug: 'machu-picchu' }
      ],
      imageUrl: '/images/package1.jpg',
      gallery: [
        '/images/package1.jpg',
        '/images/package1-2.jpg',
        '/images/package1-3.jpg'
      ],
      features: ['Hoteles incluidos', 'Traslados', 'Tren a Machu Picchu'],
      highlights: [
        'City Tour en Cusco',
        'Maras y Moray',
        'Valle Sagrado',
        'Noche en Ollantaytambo',
        'Machu Picchu'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Bienvenido a Cusco - City Tour',
          description:
            'Llegada a Cusco, traslado al hotel y recorrido por Qoricancha y los 4 sitios arqueológicos.',
          accommodations: 'Hotel en Cusco',
          includes: [
            'Traslado aeropuerto - hotel',
            'City Tour',
            'Guía profesional',
            'Entradas a los atractivos',
            'Noche de hotel en Cusco'
          ],
          notIncludes: ['Almuerzo', 'Cena', 'Vuelo Lima - Cusco']
        },
        {
          day: 2,
          title: 'Tour Maras y Moray',
          description:
            'Excursión a Moray y Salineras de Maras con posible visita a centro textil.',
          accommodations: 'Hotel en Cusco',
          includes: [
            'Desayuno en hotel',
            'Transporte turístico',
            'Guía profesional',
            'Entradas',
            'Noche de hotel en Cusco'
          ],
          notIncludes: ['Almuerzo', 'Cena', 'Gastos personales']
        },
        {
          day: 3,
          title: 'Valle Sagrado de los Incas',
          description:
            'Visita a Pisac, almuerzo buffet en Urubamba y Ollantaytambo.',
          accommodations: 'Hotel en Ollantaytambo',
          meals: ['Desayuno', 'Almuerzo'],
          includes: [
            'Desayuno en hotel',
            'Transporte turístico',
            'Guía profesional',
            'Almuerzo buffet',
            'Entradas',
            'Noche de hotel en Ollantaytambo'
          ],
          notIncludes: ['Cena', 'Gastos extra']
        },
        {
          day: 4,
          title: 'Tour a Machu Picchu',
          description:
            'Tren a Aguas Calientes, bus a Machu Picchu y recorrido guiado por la ciudadela.',
          meals: ['Desayuno'],
          includes: [
            'Desayuno o box breakfast',
            'Tren ida y retorno',
            'Bus a Machu Picchu ida y retorno',
            'Ingreso a Machu Picchu',
            'Guía profesional',
            'Traslado de retorno a Cusco'
          ],
          notIncludes: [
            'Almuerzo',
            'Cena',
            'Wayna Picchu',
            'Seguro de viaje'
          ]
        },
        {
          day: 5,
          title: 'Salida de Cusco',
          description:
            'Traslado desde el hotel hacia el aeropuerto según horario de vuelo.',
          meals: ['Desayuno'],
          includes: ['Desayuno en hotel', 'Traslado hotel - aeropuerto'],
          notIncludes: ['Vuelos nacionales', 'Vuelos internacionales']
        }
      ],
      includes: [
        'Asistencia durante el viaje',
        'Coordinación del programa',
        'Traslados según itinerario'
      ],
      notIncludes: [
        'Vuelos',
        'Seguro de viaje',
        'Propinas',
        'Gastos no mencionados'
      ],
      whatToBring: [
        'Pasaporte original',
        'Bloqueador solar',
        'Repelente',
        'Ropa cómoda',
        'Dinero extra'
      ],
      seoTitle: 'Explora Cusco Imperial 5 Días / 4 Noches | Paquete en Cusco',
      seoDescription:
        'Descubre Cusco, Valle Sagrado y Machu Picchu en un paquete de 5 días con hotel, tours y traslados.',
      isActive: true,
      isFeatured: true
    },
    {
      id: '2',
      title: 'Perú Clásico: Lima, Cusco y Machu Picchu',
      slug: 'peru-clasico-lima-cusco-machu-picchu',
      description:
        'Descubra lo mejor del Perú en un recorrido que combina la capital gastronómica, la ciudad imperial y la maravilla del mundo.',
      shortDescription:
        'Paquete multidestino por Lima, Cusco y Machu Picchu.',
      price: 980,
      durationDays: 7,
      durationNights: 6,
      destinations: [
        { name: 'Lima', slug: 'lima' },
        { name: 'Cusco', slug: 'cusco' },
        { name: 'Machu Picchu', slug: 'machu-picchu' }
      ],
      imageUrl: '/images/package2.jpg',
      gallery: ['/images/package2.jpg', '/images/package2-2.jpg'],
      features: ['Multidestino', 'Hoteles incluidos', 'Ideal para primer viaje'],
      highlights: [
        'City tour en Lima',
        'City Tour en Cusco',
        'Valle Sagrado opcional',
        'Machu Picchu'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Llegada a Lima',
          description: 'Recepción en aeropuerto y traslado al hotel.',
          accommodations: 'Hotel en Lima',
          includes: ['Traslado aeropuerto - hotel', 'Noche de hotel en Lima'],
          notIncludes: ['Alimentos']
        },
        {
          day: 2,
          title: 'City Tour en Lima',
          description:
            'Recorrido por los principales atractivos históricos y modernos de Lima.',
          accommodations: 'Hotel en Lima',
          includes: ['Desayuno', 'City tour', 'Guía profesional'],
          notIncludes: ['Almuerzo', 'Cena']
        },
        {
          day: 3,
          title: 'Vuelo a Cusco',
          description: 'Llegada a Cusco y tarde libre para aclimatación.',
          accommodations: 'Hotel en Cusco',
          includes: ['Desayuno', 'Traslado', 'Noche de hotel en Cusco'],
          notIncludes: ['Vuelo doméstico']
        }
      ],
      includes: [
        'Traslados',
        'Hoteles',
        'Tours indicados',
        'Asistencia durante el viaje'
      ],
      notIncludes: ['Vuelos internacionales', 'Algunos almuerzos y cenas'],
      whatToBring: ['Pasaporte', 'Casaca', 'Bloqueador', 'Dinero extra'],
      seoTitle: 'Perú Clásico | Lima, Cusco y Machu Picchu',
      seoDescription:
        'Paquete turístico por Lima, Cusco y Machu Picchu ideal para conocer lo mejor del Perú.',
      isActive: true,
      isFeatured: true
    }
  ];

  async getAllTours(): Promise<Tour[]> {
    return this.tours;
  }

  async getTourById(id: string): Promise<Tour | null> {
    return this.tours.find((tour) => tour.id === id) || null;
  }

  async getTourBySlug(slug: string): Promise<Tour | null> {
    return this.tours.find((tour) => tour.slug === slug) || null;
  }

  async getFeaturedTours(): Promise<Tour[]> {
    return this.tours.filter((tour) => tour.isFeatured);
  }

  async getAllPackages(): Promise<Package[]> {
    return this.packages;
  }

  async getPackageById(id: string): Promise<Package | null> {
    return this.packages.find((pkg) => pkg.id === id) || null;
  }

  async getPackageBySlug(slug: string): Promise<Package | null> {
    return this.packages.find((pkg) => pkg.slug === slug) || null;
  }

  async getFeaturedPackages(): Promise<Package[]> {
    return this.packages.filter((pkg) => pkg.isFeatured);
  }

  async getDestinations(): Promise<Destination[]> {
    const map = new Map<string, Destination>();

    for (const tour of this.tours) {
      if (!map.has(tour.destinationSlug)) {
        map.set(tour.destinationSlug, {
          id: tour.destinationSlug,
          name: tour.destinationName,
          slug: tour.destinationSlug,
          imageUrl: `/images/dest-${tour.destinationSlug}.jpg`
        });
      }
    }

    for (const pkg of this.packages) {
      for (const destination of pkg.destinations) {
        if (!map.has(destination.slug)) {
          map.set(destination.slug, {
            id: destination.slug,
            name: destination.name,
            slug: destination.slug,
            imageUrl: `/images/dest-${destination.slug}.jpg`
          });
        }
      }
    }

    return Array.from(map.values());
  }

  async getToursByDestination(slug: string): Promise<Tour[]> {
    return this.tours.filter((tour) => tour.destinationSlug === slug);
  }

  async getPackagesByDestination(slug: string): Promise<Package[]> {
    return this.packages.filter((pkg) =>
      pkg.destinations.some((destination) => destination.slug === slug)
    );
  }
}