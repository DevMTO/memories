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
        title: 'Valle Sagrado + Machu Picchu + Wayna Picchu 2D/1N',
        slug: 'valle-sagrado-machu-picchu-wayna-picchu-2d-1n',

        description:
            'Vive una experiencia inolvidable recorriendo el Valle Sagrado, descubriendo Machu Picchu y ascendiendo a Wayna Picchu, combinando historia, naturaleza y paisajes espectaculares en 2 días.',

        shortDescription:
            'Explora el Valle Sagrado, visita Machu Picchu y asciende la montaña Wayna Picchu en una aventura de 2 días con noche en Aguas Calientes.',

        price: 0,
        durationDays: 2,
        durationNights: 1,

        destinationName: 'Cusco',
        destinationSlug: 'cusco',

        location: 'Cusco, Peru',
        cities: ['Cusco'],

        imageUrl: '-------',
        gallery: [],

        features: [
            'Servicio compartido',
            'Guía profesional',
            'Tren turístico',
            'Hotel en Aguas Calientes'
        ],

        highlights: [
            'Mirador del Valle Sagrado',
            'Mercado de Pisac',
            'Centro arqueológico de Pisac',
            'Ollantaytambo',
            'Machu Picchu',
            'Wayna Picchu',
            'Aguas Calientes'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Explora el Valle Sagrado | Noche en Aguas Calientes',
            description:
                'Visita al Valle Sagrado con parada en mirador, mercado y sitio arqueológico de Pisac, almuerzo buffet en Urubamba y recorrido por Ollantaytambo. Por la tarde viaje en tren hacia Aguas Calientes y pernocte.',
            meals: ['Almuerzo'],
            includes: [
                'Recojo del hotel',
                'Ingreso a Pisac',
                'Ingreso a Ollantaytambo',
                'Almuerzo buffet',
                'Guía turístico español/inglés',
                'Tren Ollantaytambo - Aguas Calientes',
                'Hotel en Aguas Calientes'
            ],
            notIncludes: [
                'Desayuno',
                'Cena',
                'Seguro de viaje',
                'Gastos personales'
            ]
            },
            {
            day: 2,
            title: 'Machu Picchu y ascenso a Wayna Picchu',
            description:
                'Visita guiada por Machu Picchu recorriendo templos, plazas y lugares sagrados. Luego ascenso a Wayna Picchu con vistas panorámicas del valle. Retorno en tren y transporte a Cusco.',
            meals: [],
            includes: [
                'Guía profesional',
                'Bus Aguas Calientes - Machu Picchu ida y vuelta',
                'Ingreso a Machu Picchu',
                'Ingreso a Wayna Picchu',
                'Tren Aguas Calientes - Ollantaytambo',
                'Transporte Ollantaytambo - Cusco'
            ],
            notIncludes: [
                'Desayuno',
                'Almuerzo',
                'Cena',
                'Snack',
                'Propinas',
                'Seguro de viaje'
            ]
            }
        ],

        includes: [
            'Recojo del hotel',
            'Guía profesional',
            'Ingresos turísticos',
            'Ingreso a Machu Picchu',
            'Ingreso a Wayna Picchu',
            'Bus Consettur',
            'Trenes turísticos ida y retorno',
            '1 noche de hotel en Aguas Calientes',
            'Almuerzo buffet día 1',
            'Transporte turístico'
        ],

        notIncludes: [
            'Desayunos',
            'Almuerzos no especificados',
            'Cenas',
            'Seguro de viaje',
            'Propinas',
            'Gastos extras'
        ],

        whatToBring: [
            'Pasaporte original',
            'Mochila pequeña',
            'Botas cómodas',
            'Bloqueador solar',
            'Repelente',
            'Ropa de lluvia',
            'Sombrero',
            'Cámara',
            'Dinero extra',
            'Medicación personal'
        ],

        seoTitle: 'Valle Sagrado + Machu Picchu + Wayna Picchu 2D/1N | Tour en Cusco',
        seoDescription:
            'Recorre el Valle Sagrado, visita Machu Picchu y asciende Wayna Picchu en un tour de 2 días con tren y hotel incluido.',

        isActive: true,
        isFeatured: true
        },  


    {
        id: '2',
        title: 'Machu Picchu Full Day',
        slug: 'machu-picchu-full-day',

        description:
            'Descubre la maravilla del mundo Machu Picchu en un día completo, viajando en tren desde Ollantaytambo y explorando la ciudadela inca acompañado de un guía profesional.',

        shortDescription:
            'Visita Machu Picchu en un día desde Cusco con transporte, tren turístico, bus y guiado profesional incluido.',

        price: 0,
        durationDays: 1,

        destinationName: 'Cusco',
        destinationSlug: 'cusco',

        location: 'Cusco, Peru',
        cities: ['Cusco'],

        imageUrl: '--------',
        gallery: [],

        features: [
            'Servicio personalizado',
            'Guía profesional',
            'Tren turístico',
            'Bus Consettur'
        ],

        highlights: [
            'Machu Picchu',
            'Aguas Calientes',
            'Viaje en tren panorámico',
            'Circuito guiado en la ciudadela'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Excursión a Machu Picchu Full Day',
            description:
                'Salida temprana desde Cusco hacia Ollantaytambo para abordar tren a Aguas Calientes. Ascenso en bus a Machu Picchu, visita guiada de aproximadamente 2 horas y retorno por la tarde a Cusco.',
            meals: [],
            includes: [
                'Recojo del hotel',
                'Transporte Cusco - Ollantaytambo ida y vuelta',
                'Tren turístico ida y retorno',
                'Bus Aguas Calientes - Machu Picchu ida y vuelta',
                'Ingreso a Machu Picchu',
                'Guía profesional'
            ],
            notIncludes: [
                'Desayuno',
                'Almuerzo',
                'Cena',
                'Ingreso a Wayna Picchu',
                'Seguro de viaje',
                'Propinas'
            ]
            }
        ],

        includes: [
            'Transporte turístico privado',
            'Tren turístico ida y retorno',
            'Bus Consettur',
            'Ingreso a Machu Picchu',
            'Guía profesional'
        ],

        notIncludes: [
            'Alimentos',
            'Ingreso a Wayna Picchu o Montaña Machu Picchu',
            'Baños termales',
            'Seguro de viaje',
            'Propinas',
            'Gastos extras'
        ],

        whatToBring: [
            'Pasaporte original',
            'Mochila pequeña',
            'Botas cómodas',
            'Bloqueador solar',
            'Repelente',
            'Ropa de lluvia',
            'Sombrero',
            'Cámara',
            'Dinero extra',
            'Medicación personal'
        ],

        seoTitle: 'Machu Picchu Full Day | Tour de un día desde Cusco',
        seoDescription:
            'Visita Machu Picchu en un solo día con tren, transporte, guía profesional e ingreso incluido desde Cusco.',

        isActive: true,
        isFeatured: true
        },
    {
        id: '3',
        title: 'Valle Sagrado + Machu Picchu 2D/1N',
        slug: 'valle-sagrado-machu-picchu-2d-1n',

        description:
            'Descubre el Valle Sagrado de los Incas y Machu Picchu en una experiencia de 2 días, combinando historia, cultura, paisajes andinos y una noche en Aguas Calientes.',

        shortDescription:
            'Recorre el Valle Sagrado y visita Machu Picchu en un tour de 2 días con tren, hotel y guiado profesional incluido.',

        price: 0,
        durationDays: 2,
        durationNights: 1,

        destinationName: 'Cusco',
        destinationSlug: 'cusco',

        location: 'Cusco, Peru',
        cities: ['Cusco'],

        imageUrl: '------------',
        gallery: [],

        features: [
            'Servicio compartido',
            'Guía profesional',
            'Tren turístico',
            'Hotel en Aguas Calientes'
        ],

        highlights: [
            'Valle Sagrado',
            'Pisac',
            'Ollantaytambo',
            'Aguas Calientes',
            'Machu Picchu'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Valle Sagrado y viaje a Aguas Calientes',
            description:
                'Recorrido por el Valle Sagrado visitando mirador, mercado y sitio arqueológico de Pisac, almuerzo buffet en Urubamba y visita a Ollantaytambo. Por la tarde viaje en tren hacia Aguas Calientes y noche de hotel.',
            meals: ['Almuerzo'],
            includes: [
                'Recojo del hotel',
                'Ingreso a Pisac',
                'Ingreso a Ollantaytambo',
                'Almuerzo buffet',
                'Guía profesional',
                'Tren Ollantaytambo - Aguas Calientes',
                'Hotel en Aguas Calientes'
            ],
            notIncludes: [
                'Desayuno',
                'Cena',
                'Gastos extras'
            ]
            },
            {
            day: 2,
            title: 'Tour a Machu Picchu y retorno a Cusco',
            description:
                'Visita guiada por Machu Picchu recorriendo templos, plazas y sitios históricos. Retorno en bus a Aguas Calientes, viaje en tren a Ollantaytambo y traslado final a Cusco.',
            meals: ['Desayuno'],
            includes: [
                'Desayuno en hotel',
                'Ingreso a Machu Picchu',
                'Bus Aguas Calientes - Machu Picchu ida y vuelta',
                'Guía profesional',
                'Tren Aguas Calientes - Ollantaytambo',
                'Transporte Ollantaytambo - Cusco'
            ],
            notIncludes: [
                'Almuerzo',
                'Cena',
                'Ingreso a Wayna Picchu',
                'Gastos extras'
            ]
            }
        ],

        includes: [
            'Recojo del hotel',
            'Guía profesional',
            'Ingresos turísticos',
            'Ingreso a Machu Picchu',
            'Bus Consettur',
            'Trenes turísticos ida y retorno',
            '1 noche de hotel en Aguas Calientes',
            'Almuerzo buffet día 1',
            'Desayuno día 2',
            'Transporte turístico'
        ],

        notIncludes: [
            'Ingreso a Wayna Picchu o Montaña Machu Picchu',
            'Almuerzo día 2',
            'Cenas',
            'Tren Vistadome',
            'Gastos extras'
        ],

        whatToBring: [
            'Pasaporte original',
            'Mochila pequeña',
            'Botas cómodas',
            'Bloqueador solar',
            'Repelente',
            'Ropa de lluvia',
            'Sombrero',
            'Cámara',
            'Dinero extra',
            'Medicación personal'
        ],

        seoTitle: 'Valle Sagrado + Machu Picchu 2D/1N | Tour en Cusco',
        seoDescription:
            'Explora el Valle Sagrado y visita Machu Picchu en un tour de 2 días con tren, hotel e ingresos incluidos.',

        isActive: true,
        isFeatured: true
        },
    {
        id: '4',
        title: 'Explora el Wayna Picchu desde Cusco Full Day (1D)',
        slug: 'explora-el-wayna-picchu-desde-cusco-full-day-1d',

        description:
            'Vive una aventura full day desde Cusco visitando Machu Picchu y ascendiendo a la montaña Wayna Picchu, disfrutando paisajes espectaculares, historia inca y una experiencia única de trekking.',

        shortDescription:
            'Explora Machu Picchu y asciende Wayna Picchu en un tour full day desde Cusco con tren, bus e ingresos incluidos.',

        price: 0,
        durationDays: 1,

        destinationName: 'Cusco',
        destinationSlug: 'cusco',

        location: 'Cusco, Peru',
        cities: ['Cusco'],

        imageUrl: '----------',
        gallery: [],

        features: [
            'Servicio privado',
            'Guía profesional',
            'Tren turístico',
            'Bus Consettur',
            'Ingreso a Wayna Picchu'
        ],

        highlights: [
            'Machu Picchu',
            'Wayna Picchu',
            'Aguas Calientes',
            'Viaje en tren panorámico',
            'Ascenso de aventura'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Machu Picchu y ascenso a Wayna Picchu',
            description:
                'Salida temprana desde Cusco hacia Ollantaytambo para abordar tren a Aguas Calientes. Recorrido guiado por Machu Picchu y posterior ascenso a Wayna Picchu con vistas panorámicas. Retorno por la tarde a Cusco.',
            meals: [],
            includes: [
                'Recojo y retorno al hotel',
                'Transporte Cusco - Ollantaytambo ida y vuelta',
                'Tren turístico ida y retorno',
                'Bus Aguas Calientes - Machu Picchu ida y vuelta',
                'Ingreso a Machu Picchu',
                'Ingreso a Wayna Picchu',
                'Guía profesional privado'
            ],
            notIncludes: [
                'Desayuno',
                'Almuerzo',
                'Cena',
                'Seguro de viaje',
                'Propinas',
                'Gastos extras'
            ]
            }
        ],

        includes: [
            'Recojo y retorno al hotel',
            'Transporte turístico privado',
            'Tren turístico ida y retorno',
            'Bus Consettur',
            'Ingreso a Machu Picchu',
            'Ingreso a Wayna Picchu',
            'Guía profesional privado'
        ],

        notIncludes: [
            'Alimentos',
            'Seguro de viaje',
            'Propinas',
            'Tren Vistadome',
            'Gastos extras'
        ],

        whatToBring: [
            'Pasaporte original',
            'Mochila pequeña',
            'Botas cómodas',
            'Bloqueador solar',
            'Repelente',
            'Ropa de lluvia',
            'Sombrero',
            'Cámara',
            'Dinero extra',
            'Medicación personal'
        ],

        seoTitle: 'Explora el Wayna Picchu desde Cusco Full Day (1D)',
        seoDescription:
            'Tour full day desde Cusco para visitar Machu Picchu y ascender la montaña Wayna Picchu con tren, guía e ingresos incluidos.',

        isActive: true,
        isFeatured: true
        },
        {
        id: '5',
        title: 'EXPLORA EL CAÑÓN DEL COLCA EN AREQUIPA FD',
        slug: 'explora-el-cañón-del-colca-en-arequipa-fd',

        description:
            'Explora el impresionante Cañón del Colca en un tour de un día desde Arequipa, visitando miradores, observando cóndores y disfrutando de paisajes andinos y aguas termales en Chivay.',

        shortDescription:
            'Tour full day al Cañón del Colca con miradores, cóndores, aguas termales y paisajes andinos desde Arequipa.',

        price: 0,
        durationDays: 1,
        durationNights: 0,

        destinationName: 'Arequipa',
        destinationSlug: 'arequipa',

        location: 'Arequipa, Peru',
        cities: ['Arequipa', 'Chivay'],

        imageUrl: '',
        gallery: [
          
        ],

        features: [
            'Servicio compartido',
            'Guía bilingüe',
            'Transporte turístico',
            'Desayuno y almuerzo incluidos'
        ],

        highlights: [
            'Cañón del Colca',
            'Mirador Tres Cruces del Cóndor',
            'Vuelo del cóndor',
            'Aguas termales de Chivay',
            'Reserva de Salinas y Aguada Blanca',
            'Paisajes andinos'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Tour Cañón del Colca Full Day',
            description:
                'Recojo temprano desde Arequipa y viaje hacia Chivay para desayuno. Continuación al mirador Tres Cruces del Cóndor para observar el cañón y posible vuelo de cóndores. Paradas en miradores, visita opcional a aguas termales y almuerzo en Chivay. Retorno a Arequipa con paradas para observar volcanes y la reserva de Salinas.',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Recojo del hotel',
                'Transporte turístico',
                'Guía bilingüe',
                'Desayuno',
                'Almuerzo',
                'Ingreso al Cañón del Colca',
                'Ingreso a aguas termales'
            ],
            notIncludes: [
                'Seguro de viaje',
                'Propinas',
                'Gastos personales',
                'Hotel'
            ]
            }
        ],

        includes: [
            'Transporte turístico',
            'Guía bilingüe',
            'Desayuno y almuerzo en Chivay',
            'Ingreso al Cañón del Colca',
            'Ingreso a aguas termales'
        ],

        notIncludes: [
            'Seguro de viaje',
            'Propinas',
            'Gastos personales',
            'Noche de hotel'
        ],

        whatToBring: [
            'Pasaporte original',
            'Ropa cómoda',
            'Lentes de sol',
            'Gorro para el sol',
            'Bloqueador solar',
            'Medicamentos personales',
            'Ropa de baño',
            'Dinero extra'
        ],

        seoTitle: 'Explora el Cañón del Colca en Arequipa Full Day',
        seoDescription:
            'Tour full day al Cañón del Colca desde Arequipa con miradores, cóndores, aguas termales y paisajes andinos.',

        isActive: true,
        isFeatured: true
        },


        {
        id: '6',
        title: 'EXPLORA CUSCO Y LOS 4 ATRACTIVOS TURÍSTICOS',
        slug: 'explora-cusco-y-los-4-atractivos-turísticos',

        description:
            'Disfruta de un tour de medio día en Cusco recorriendo el templo de Qoricancha y los principales centros arqueológicos como Sacsayhuaman, Qenqo, Puca Pucara y Tambomachay.',

        shortDescription:
            'City tour en Cusco visitando Qoricancha y los 4 sitios arqueológicos cercanos en medio día.',

        price: 0,
        durationDays: 1,
        durationNights: 0,

        destinationName: 'Cusco',
        destinationSlug: 'cusco',

        location: 'Cusco, Peru',
        cities: ['Cusco'],

        imageUrl: '',
        gallery: [
        
        ],

        features: [
            'Servicio compartido',
            'Guía turístico',
            'Transporte turístico',
            'Entradas incluidas'
        ],

        highlights: [
            'Templo del Sol Qoricancha',
            'Sacsayhuaman',
            'Qenqo',
            'Puca Pucara',
            'Tambomachay',
            'Historia y cultura inca'
        ],

        itinerary: [
            {
            day: 1,
            title: 'City Tour Cusco y 4 Ruinas',
            description:
                'Recojo del hotel por la tarde y visita al templo Qoricancha. Luego recorrido por Sacsayhuaman, Qenqo, Puca Pucara y Tambomachay. Retorno al hotel en Cusco.',
            includes: [
                'Recojo del hotel',
                'Transporte turístico',
                'Guía turístico',
                'Ingreso a Qoricancha',
                'Ingreso a Sacsayhuaman, Qenqo, Puca Pucara y Tambomachay'
            ],
            notIncludes: [
                'Snack',
                'Agua',
                'Seguro de viaje',
                'Gastos personales'
            ]
            }
        ],

        includes: [
            'Guía turístico',
            'Transporte turístico',
            'Ingreso a Qoricancha',
            'Ingreso a los 4 sitios arqueológicos'
        ],

        notIncludes: [
            'Snack',
            'Agua',
            'Seguro de viaje',
            'Costos extras'
        ],

        whatToBring: [
            'Original Passport',
            'Small backpack',
            'comfortable hiking boots',
            'sunscreen',
            'face moisturizer',
            'Insect repellent',
            'Toilet paper',
            'personal medication',
            'Sun hat',
            'Rain clothes',
            'Camera',
            'Extra money'
        ],

        seoTitle: 'Explora Cusco y los 4 atractivos turísticos | City Tour Cusco',
        seoDescription:
            'Tour de medio día en Cusco visitando Qoricancha, Sacsayhuaman, Qenqo, Puca Pucara y Tambomachay.',

        isActive: true,
        isFeatured: true
        },


        {
        id: '7',
        title: 'DESCUBRE EL CENTRO HISTÓRICO DE LIMA',
        slug: 'descubre-el-centro-histórico-de-lima',

        description:
            'Explora el centro histórico de Lima en un tour de medio día visitando sus templos, conventos coloniales y la ciudad moderna en Miraflores.',

        shortDescription:
            'City tour en Lima visitando el centro histórico, San Francisco y la zona moderna de Miraflores.',

        price: 0,
        durationDays: 1,
        durationNights: 0,

        destinationName: 'Lima',
        destinationSlug: 'lima',

        location: 'Lima, Peru',
        cities: ['Lima'],

        imageUrl: '',
        gallery: [
           
        ],

        features: [
            'Servicio compartido',
            'Guía bilingüe',
            'Transporte turístico',
            'Ingreso incluido'
        ],

        highlights: [
            'Centro histórico de Lima',
            'Convento San Francisco y catacumbas',
            'Plaza de Armas de Lima',
            'Miraflores y Parque del Amor',
            'Vista del océano Pacífico'
        ],

        itinerary: [
            {
            day: 1,
            title: 'City Tour Lima Histórico y Moderno',
            description:
                'Inicio con visita panorámica a Huaca Pucllana, recorrido por el centro histórico visitando Catedral, Palacio de Gobierno y Convento San Francisco con catacumbas. Luego recorrido por San Isidro y Miraflores incluyendo Parque del Amor y Larcomar.',
            includes: [
                'Recojo del hotel',
                'Transporte turístico',
                'Guía bilingüe',
                'Ingreso a Convento San Francisco'
            ],
            notIncludes: [
                'Desayuno',
                'Almuerzo',
                'Seguro de viaje',
                'Propinas',
                'Gastos personales'
            ]
            }
        ],

        includes: [
            'Recojo del hotel',
            'Transporte turístico',
            'Guía bilingüe',
            'Ingreso a Convento San Francisco'
        ],

        notIncludes: [
            'Desayuno',
            'Almuerzo',
            'Gastos extras',
            'Seguro de viaje',
            'Propinas',
            'Noche de hotel en Lima'
        ],

        whatToBring: [
            'Pasaporte original o foto',
            'Ropa cómoda',
            'Lentes de sol',
            'Gorro para el sol',
            'Bloqueador solar',
            'Medicamentos personales',
            'Dinero extra'
        ],

        seoTitle: 'Descubre el Centro Histórico de Lima | City Tour Lima',
        seoDescription:
            'Recorre el centro histórico de Lima, San Francisco y Miraflores en un tour de medio día con guía y transporte incluido.',

        isActive: true,
        isFeatured: true
        },

        {
        id: '8',
        title: 'RECORRE EL LAGO TITICACA Y LAS ISLAS DE UROS Y TAQUILE',
        slug: 'recorre-el-lago-titicaca-y-las-islas-de-uros-y-taquile',

        description:
            'Descubre el Lago Titicaca y visita las islas de Uros y Taquile en una experiencia única navegando por el lago más alto del mundo, conociendo sus culturas y tradiciones.',

        shortDescription:
            'Tour al Lago Titicaca visitando Uros y Taquile con navegación, cultura local y almuerzo típico.',

        price: 0,
        durationDays: 1,
        durationNights: 0,

        destinationName: 'Puno',
        destinationSlug: 'puno',

        location: 'Puno, Peru',
        cities: ['Puno'],

        imageUrl: '',
        gallery: [],

        features: [
            'Servicio compartido',
            'Guía bilingüe',
            'Transporte fluvial',
            'Almuerzo incluido'
        ],

        highlights: [
            'Lago Titicaca',
            'Islas flotantes de Uros',
            'Isla Taquile',
            'Cultura y tradiciones locales',
            'Paisajes andinos'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Tour Lago Titicaca Uros y Taquile',
            description:
                'Recojo temprano y traslado al muelle para navegar por el Lago Titicaca. Visita a las islas Uros para conocer su cultura y estilo de vida. Continuación hacia la isla Taquile donde se disfruta de un almuerzo típico y recorrido cultural. Retorno por la tarde a Puno.',
            meals: ['Almuerzo'],
            includes: [
                'Recojo del hotel',
                'Transporte fluvial turístico',
                'Guía bilingüe',
                'Almuerzo',
                'Ingreso a Uros',
                'Ingreso a Taquile'
            ],
            notIncludes: [
                'Gastos personales',
                'Seguro de viaje',
                'Propinas',
                'Hotel',
                'Actividades extras'
            ]
            }
        ],

        includes: [
            'Recojo del hotel',
            'Transporte fluvial turístico',
            'Guía bilingüe',
            'Almuerzo',
            'Ingreso a Uros',
            'Ingreso a Taquile'
        ],

        notIncludes: [
            'Gastos extras',
            'Seguro de viaje',
            'Propinas',
            'Noche de hotel',
            'Actividades extras'
        ],

        whatToBring: [
            'Pasaporte original',
            'Ropa cómoda',
            'Lentes de sol',
            'Gorro para el sol',
            'Bloqueador solar',
            'Medicamentos personales',
            'Dinero extra'
        ],

        seoTitle: 'Tour Lago Titicaca Uros y Taquile | Puno',
        seoDescription:
            'Explora el Lago Titicaca visitando Uros y Taquile en un tour de un día con almuerzo incluido y guía bilingüe.',

        isActive: true,
        isFeatured: true
        },

        {
        id: '9',
        title: 'TOUR A SALINERAS DE MARAS Y MORAY',
        slug: 'tour-a-salineras-de-maras-y-moray',

        description:
            'Explora Moray y las Salineras de Maras en un tour de medio día desde Cusco, descubriendo paisajes andinos, agricultura inca y tradiciones textiles en Chinchero.',

        shortDescription:
            'Tour de medio día a Moray, Maras y Chinchero con cultura, paisajes andinos y tradición textil.',

        price: 0,
        durationDays: 1,
        durationNights: 0,

        destinationName: 'Cusco',
        destinationSlug: 'cusco',

        location: 'Cusco, Peru',
        cities: ['Cusco', 'Maras', 'Moray', 'Chinchero'],

        imageUrl: '',
        gallery: [],

        features: [
            'Servicio compartido',
            'Guía turístico',
            'Transporte turístico',
            'Entradas incluidas'
        ],

        highlights: [
            'Andenes circulares de Moray',
            'Salineras de Maras',
            'Paisajes del Valle Sagrado',
            'Centro textil de Chinchero',
            'Cultura andina'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Tour Maras, Moray y Chinchero',
            description:
                'Recojo del hotel y viaje hacia Moray para conocer sus terrazas agrícolas. Luego visita a las Salineras de Maras y finalmente parada en Chinchero para conocer el proceso de tejidos andinos. Retorno a Cusco por la tarde.',
            includes: [
                'Recojo del hotel',
                'Transporte turístico',
                'Guía turístico',
                'Ingreso a Moray',
                'Ingreso a Salineras de Maras',
                'Visita a centro textil'
            ],
            notIncludes: [
                'Desayuno',
                'Almuerzo',
                'Cena',
                'Seguro de viaje',
                'Gastos personales'
            ]
            }
        ],

        includes: [
            'Transporte turístico',
            'Guía turístico',
            'Ingreso a Moray',
            'Ingreso a Salineras de Maras',
            'Visita a centro textil en Chinchero'
        ],

        notIncludes: [
            'Desayuno',
            'Almuerzo',
            'Cena',
            'Costos extras',
            'Actividades adicionales',
            'Seguro de viaje'
        ],

        whatToBring: [
            'Pasaporte original',
            'Mochila pequeña',
            'Botas de montaña cómodas',
            'Bloqueador solar',
            'Crema hidratante',
            'Repelente de insectos',
            'Desinfectante de manos',
            'Toallitas húmedas',
            'Papel higiénico',
            'Medicación personal',
            'Sombrero para el sol'
        ],

        seoTitle: 'Tour a Salineras de Maras y Moray | Cusco',
        seoDescription:
            'Descubre Moray, Maras y Chinchero en un tour de medio día desde Cusco con paisajes andinos y cultura local.',

        isActive: true,
        isFeatured: true
        },

        {
  id: '10',
  title: 'VIAJE A PARACAS, ICA Y SOBREVUELA LAS LÍNEAS DE NAZCA 2D/1N',
  slug: 'viaje-a-paracas-ica-y-sobrevuela-las-líneas-de-nazca-2d-1n',

  description:
    'Explora la costa peruana en un viaje de 2 días visitando Paracas, Ica y Huacachina, y vive la experiencia única de sobrevolar las Líneas de Nazca.',

  shortDescription:
    'Tour de 2 días a Paracas, Ica y Nazca con Islas Ballestas, Huacachina y sobrevuelo de Líneas de Nazca.',

  price: 0,
  durationDays: 2,
  durationNights: 1,

  destinationName: 'Lima',
  destinationSlug: 'lima',

  location: 'Lima, Peru',
  cities: ['Lima', 'Paracas', 'Ica', 'Huacachina', 'Nazca'],

  imageUrl: '',
  gallery: [],

  features: [
    'Servicio compartido',
    'Guía bilingüe',
    'Transporte turístico',
    'Bus interprovincial',
    'Hotel en Nazca'
  ],

  highlights: [
    'Islas Ballestas',
    'Viñedos en Ica',
    'Huacachina con buggies y sandboard',
    'Sobrevuelo Líneas de Nazca',
    'Costa peruana'
  ],

  itinerary: [
    {
      day: 1,
      title: 'VIAJE A PARACAS, ICA, HUACACHINA',
      description:
        'Salida desde Lima hacia Paracas para visitar Islas Ballestas. Luego recorrido a Ica con visita a viñedo y degustación de pisco. Por la tarde actividades de buggies y sandboard en Huacachina y viaje en bus hacia Nazca. Traslado a hotel.',
      accommodations: 'Noche de hotel en Nazca',
      includes: [
        'Transporte turístico',
        'Guía bilingüe',
        'Ingreso a Islas Ballestas',
        'Visita a viñedo',
        'Buggies y sandboard',
        'Bus Ica - Nazca',
        'Hotel en Nazca'
      ],
      notIncludes: [
        'Almuerzo',
        'Cena',
        'Seguro de viaje',
        'Gastos personales'
      ]
    },
    {
      day: 2,
      title: 'SOBREVUELO DE LÍNEAS DE NAZCA - RETORNO A LIMA',
      description:
        'Traslado al aeródromo para sobrevolar las Líneas de Nazca. Tiempo libre y retorno en bus a Lima con traslado al hotel.',
      includes: [
        'Transporte turístico',
        'Traslado al aeródromo',
        'Sobrevuelo Líneas de Nazca',
        'Bus Nazca - Lima',
        'Traslado estación - hotel'
      ],
      notIncludes: [
        'Almuerzo',
        'Cena',
        'Seguro de viaje',
        'Hotel en Lima',
        'Actividades extras'
      ]
    }
  ],

  includes: [
    'Transporte turístico',
    'Guía bilingüe',
    'Ingreso a Islas Ballestas',
    'Visita a viñedo',
    'Buggies y sandboard',
    'Bus Ica - Nazca',
    'Bus Nazca - Lima',
    'Sobrevuelo Líneas de Nazca',
    'Traslados',
    '1 noche de hotel en Nazca'
  ],

  notIncludes: [
    'Almuerzos',
    'Cenas',
    'Seguro de viaje',
    'Gastos personales',
    'Hotel en Lima',
    'Actividades adicionales'
  ],

  whatToBring: [
    'Pasaporte original o foto',
    'Ropa cómoda',
    'Lentes de sol',
    'Gorro para el sol',
    'Bloqueador solar',
    'Medicamentos personales',
    'Dinero extra'
  ],

  seoTitle: 'Paracas, Ica y Líneas de Nazca 2D/1N | Tour desde Lima',
  seoDescription:
    'Viaja a Paracas, Ica y Nazca en 2 días con Islas Ballestas, Huacachina y sobrevuelo de Líneas de Nazca.',

  isActive: true,
  isFeatured: true
},






  ];





  private packages: Package[] = [
    {
        id: '1',
        title: 'Experiencia en los Andes Viaje de 9 Dias 8 Noches',
        slug: 'experiencia-en-los-andes-viaje-de-9-dias-8-noches',

        description:
            'Descubre Perú en una experiencia de 9 días recorriendo Lima, Paracas, Ica y Cusco, incluyendo Machu Picchu, Valle Sagrado, Laguna Humantay y experiencias únicas en los Andes.',

        shortDescription:
            'Paquete completo por Lima, Paracas, Ica, Cusco, Machu Picchu y Laguna Humantay.',

        price: 0,
        durationDays: 9,
        durationNights: 8,

        destinations: [
            { name: 'Lima', slug: 'lima' },
            { name: 'Paracas', slug: 'paracas' },
            { name: 'Ica', slug: 'ica' },
            { name: 'Cusco', slug: 'cusco' },
            { name: 'Valle Sagrado', slug: 'valle-sagrado' },
            { name: 'Machu Picchu', slug: 'machu-picchu' },
            { name: 'Laguna Humantay', slug: 'laguna-humantay' }
        ],

        imageUrl: '',
        gallery: [],

        features: [
            'Hoteles incluidos',
            'Vuelos domésticos',
            'Tren panorámico',
            'Tours guiados',
            'Traslados incluidos'
        ],

        highlights: [
            'City Tour en Lima',
            'Paracas e Islas Ballestas',
            'Huacachina y sandboarding',
            'Valle Sagrado',
            'Mountain View',
            'Machu Picchu',
            'Laguna Humantay',
            'City Tour Cusco'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Bienvenida en Lima y City Tour',
            description:
                'Recepción en aeropuerto, traslado al hotel y recorrido por Lima histórica y moderna.',
            accommodations: 'Hotel en Lima',
            includes: [
                'Traslado aeropuerto - hotel',
                'City Tour Lima',
                'Guía bilingüe',
                'Ingreso a Convento San Francisco',
                'Hotel en Lima'
            ],
            notIncludes: ['Alimentos', 'Seguro de viaje']
            },
            {
            day: 2,
            title: 'Paracas + Ica Full Day',
            description:
                'Visita a Islas Ballestas, vitivinícola y aventura en Huacachina con buggies y sandboarding.',
            accommodations: 'Hotel en Lima',
            meals: ['Desayuno'],
            includes: [
                'Desayuno',
                'Tour Islas Ballestas',
                'Buggies y sandboarding',
                'Guía profesional',
                'Hotel en Lima'
            ],
            notIncludes: ['Almuerzo', 'Cena']
            },
            {
            day: 3,
            title: 'Vuelo Lima - Cusco',
            description:
                'Traslado al aeropuerto, vuelo doméstico y recepción en Cusco.',
            accommodations: 'Hotel en Cusco',
            includes: [
                'Traslado hotel - aeropuerto',
                'Vuelo Lima - Cusco',
                'Traslado aeropuerto - hotel',
                'Hotel en Cusco'
            ],
            notIncludes: ['Almuerzo', 'Cena']
            },
            {
            day: 4,
            title: 'Maras y noche en Mountain View',
            description:
                'Visita a Salineras de Maras y experiencia de desconexión en Mountain View.',
            accommodations: 'Mountain View',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Ingreso a Maras',
                'Guía profesional',
                'Almuerzo',
                'Noche en Mountain View'
            ],
            notIncludes: ['Cena']
            },
            {
            day: 5,
            title: 'Tren panorámico a Aguas Calientes',
            description:
                'Traslado a Ollantaytambo y viaje en tren Vistadome Observatory hacia Aguas Calientes.',
            accommodations: 'Hotel en Aguas Calientes',
            meals: ['Desayuno'],
            includes: [
                'Desayuno',
                'Tren Vistadome',
                'Traslado',
                'Hotel en Aguas Calientes'
            ],
            notIncludes: ['Almuerzo', 'Cena']
            },
            {
            day: 6,
            title: 'Tour a Machu Picchu',
            description:
                'Visita guiada por Machu Picchu y retorno a Cusco.',
            accommodations: 'Hotel en Cusco',
            meals: ['Desayuno'],
            includes: [
                'Ingreso a Machu Picchu',
                'Bus Consettur',
                'Tren retorno',
                'Guía profesional',
                'Hotel en Cusco'
            ],
            notIncludes: ['Almuerzo', 'Cena', 'Wayna Picchu']
            },
            {
            day: 7,
            title: 'Laguna Humantay Trek',
            description:
                'Caminata hacia la Laguna Humantay con desayuno y almuerzo incluidos.',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Transporte turístico',
                'Guía trekking',
                'Ingreso a Humantay',
                'Bastón trekking'
            ],
            notIncludes: ['Cena', 'Caballo']
            },
            {
            day: 8,
            title: 'City Tour Cusco',
            description:
                'Visita a Qoricancha, Sacsayhuamán, Qenqo, Puka Pukara y Tambomachay.',
            accommodations: 'Hotel en Cusco',
            meals: ['Desayuno'],
            includes: [
                'Guía profesional',
                'Entradas',
                'Transporte turístico',
                'Hotel en Cusco'
            ],
            notIncludes: ['Almuerzo', 'Cena']
            },
            {
            day: 9,
            title: 'Salida Cusco - Lima',
            description:
                'Traslado al aeropuerto y vuelo doméstico Cusco - Lima.',
            meals: ['Desayuno'],
            includes: [
                'Desayuno',
                'Traslado hotel - aeropuerto',
                'Vuelo Cusco - Lima'
            ],
            notIncludes: ['Hotel en Lima', 'Almuerzo', 'Cena']
            }
        ],

        includes: [
            'Hoteles durante todo el programa',
            'Vuelos domésticos Lima - Cusco - Lima',
            'Tours guiados',
            'Traslados turísticos',
            'Entradas según itinerario',
            'Trenes turísticos'
        ],

        notIncludes: [
            'Vuelos internacionales',
            'Seguro de viaje',
            'Propinas',
            'Gastos personales',
            'Servicios no mencionados'
        ],

        whatToBring: [
            'Pasaporte original',
            'Mochila pequeña',
            'Botas cómodas',
            'Bloqueador solar',
            'Repelente',
            'Ropa de lluvia',
            'Cámara',
            'Dinero extra',
            'Medicación personal'
        ],

        seoTitle: 'Experiencia en los Andes Viaje de 9 Dias 8 Noches',
        seoDescription:
            'Descubre Lima, Paracas, Ica, Cusco, Machu Picchu y Laguna Humantay en un paquete completo de 9 días.',

        isActive: true,
        isFeatured: true
        },
    {
        id: '2',
        title: 'Explora Cusco Imperial 5 Dias / 4 Noches',
        slug: 'explora-cusco-imperial-5-dias-4-noches',

        description:
            'Disfruta de Cusco en 5 días recorriendo los principales atractivos de la ciudad imperial, Valle Sagrado, Maras, Moray y la maravilla del mundo Machu Picchu.',

        shortDescription:
            'Paquete completo por Cusco, Valle Sagrado y Machu Picchu en 5 días.',

        price: 0,
        durationDays: 5,
        durationNights: 4,

        destinations: [
            { name: 'Cusco', slug: 'cusco' },
            { name: 'Valle Sagrado', slug: 'valle-sagrado' },
            { name: 'Machu Picchu', slug: 'machu-picchu' }
        ],

        imageUrl: '/images/package2.jpg',
        gallery: [],

        features: [
            'Hoteles incluidos',
            'Traslados turísticos',
            'Tren turístico',
            'Tours guiados'
        ],

        highlights: [
            'City Tour Cusco',
            'Maras y Moray',
            'Valle Sagrado',
            'Ollantaytambo',
            'Machu Picchu'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Bienvenido a Cusco y City Tour',
            description:
                'Recepción en aeropuerto, traslado al hotel y city tour por Qoricancha, Sacsayhuamán, Qenqo, Puka Pukara y Tambomachay.',
            accommodations: 'Hotel en Cusco',
            includes: [
                'Traslado aeropuerto - hotel',
                'City Tour',
                'Guía profesional',
                'Entradas',
                'Hotel en Cusco'
            ],
            notIncludes: [
                'Alimentos',
                'Vuelos nacionales',
                'Seguro de viaje'
            ]
            },
            {
            day: 2,
            title: 'Tour Maras y Moray',
            description:
                'Excursión a Moray, Salineras de Maras y visita opcional a centro textil en Chinchero.',
            accommodations: 'Hotel en Cusco',
            meals: ['Desayuno'],
            includes: [
                'Desayuno',
                'Transporte turístico',
                'Guía profesional',
                'Entradas',
                'Hotel en Cusco'
            ],
            notIncludes: [
                'Almuerzo',
                'Cena',
                'Gastos extras'
            ]
            },
            {
            day: 3,
            title: 'Valle Sagrado de los Incas',
            description:
                'Visita a Pisac, almuerzo buffet en Urubamba y recorrido por Ollantaytambo con pernocte.',
            accommodations: 'Hotel en Ollantaytambo',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Desayuno',
                'Transporte turístico',
                'Guía profesional',
                'Almuerzo buffet',
                'Entradas',
                'Hotel en Ollantaytambo'
            ],
            notIncludes: [
                'Cena',
                'Seguro de viaje'
            ]
            },
            {
            day: 4,
            title: 'Tour a Machu Picchu',
            description:
                'Viaje en tren a Aguas Calientes, bus a Machu Picchu y recorrido guiado por la ciudadela. Retorno a Cusco.',
            accommodations: 'Hotel en Cusco',
            meals: ['Desayuno'],
            includes: [
                'Desayuno o box breakfast',
                'Tren ida y retorno',
                'Bus ida y retorno',
                'Ingreso a Machu Picchu',
                'Guía profesional',
                'Traslado a Cusco'
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
                'Tiempo libre y traslado desde hotel al aeropuerto de Cusco según horario de vuelo.',
            meals: ['Desayuno'],
            includes: [
                'Desayuno',
                'Traslado hotel - aeropuerto'
            ],
            notIncludes: [
                'Vuelos nacionales',
                'Vuelos internacionales',
                'Seguro de viaje'
            ]
            }
        ],

        includes: [
            'Hoteles durante el programa',
            'Tours guiados',
            'Traslados según itinerario',
            'Entradas turísticas',
            'Tren turístico'
        ],

        notIncludes: [
            'Vuelos nacionales e internacionales',
            'Seguro de viaje',
            'Propinas',
            'Gastos personales',
            'Servicios no mencionados'
        ],

        whatToBring: [
            'Pasaporte original',
            'Mochila pequeña',
            'Botas cómodas',
            'Bloqueador solar',
            'Repelente',
            'Ropa de lluvia',
            'Cámara',
            'Dinero extra',
            'Medicación personal'
        ],

        seoTitle: 'Explora Cusco Imperial 5 Dias / 4 Noches',
        seoDescription:
            'Descubre Cusco, Valle Sagrado y Machu Picchu en un paquete de 5 días con hotel, tours y traslados incluidos.',

        isActive: true,
        isFeatured: true
        },
    {
        id: '3',
        title: 'PERÚ AVENTURERO 13 DÍAS 12 NOCHES',
        slug: 'peru-aventurero-13-dias-12-noches',

        description:
            'Vive una aventura completa por Perú recorriendo Lima, Paracas, Huacachina, Nazca, Arequipa, Puno y Cusco, finalizando con la visita a Machu Picchu.',
        shortDescription:
            'Aventura por Perú visitando costa, sierra y Machu Picchu en 13 días.',

        price: 0,
        durationDays: 13,
        durationNights: 12,

        destinations: [
            { name: 'Lima', slug: 'lima' },
            { name: 'Nazca', slug: 'nazca' },
            { name: 'Arequipa', slug: 'arequipa' },
            { name: 'Puno', slug: 'puno' },
            { name: 'Cusco', slug: 'cusco' },
            { name: 'Machu Picchu', slug: 'machu-picchu' }
        ],

        imageUrl: '/images/package3.jpg',
        gallery: [],

        features: [
            'Hoteles incluidos',
            'Traslados turísticos',
            'Tours guiados',
            'Bus y vuelos internos'
        ],

        highlights: [
            'Islas Ballestas',
            'Huacachina',
            'Líneas de Nazca',
            'Cañón del Colca',
            'Lago Titicaca',
            'Valle Sagrado',
            'Machu Picchu'
        ],

        itinerary: [
            {
            day: 1,
            title: 'BIENVENIDO A PERÚ - DISFRUTE DE LIMA',
            description:
                'Recepción en Lima, traslado al hotel y tiempo libre para recorrer Miraflores.',
            accommodations: 'Hotel en Lima',
            meals: [],
            includes: [
                'Traslado aeropuerto - hotel',
                'Noche de hotel en Lima'
            ],
            notIncludes: [
                'Desayuno',
                'Almuerzo',
                'Cena',
                'Seguro de viaje'
            ]
            },
            {
            day: 2,
            title: 'TOUR ISLAS BALLESTAS + VITIVINÍCOLA Y AVENTURA EN HUACACHINA',
            description:
                'Tour por Paracas, Islas Ballestas, visita a vitivinícola y aventura en Huacachina.',
            accommodations: 'Hotel en Nazca',
            meals: ['Desayuno'],
            includes: [
                'Box breakfast',
                'Tour Islas Ballestas',
                'Visita vitivinícola',
                'Sandboarding y Buggies',
                'Bus Ica - Nazca',
                'Hotel en Nazca'
            ],
            notIncludes: ['Almuerzo', 'Cena', 'Seguro de viaje']
            },
            {
            day: 3,
            title: 'SOBREVUELO LINEAS DE NAZCA - VIAJE EN BUS A AREQUIPA',
            description:
                'Sobrevuelo a las Líneas de Nazca y viaje nocturno hacia Arequipa.',
            accommodations: 'Hotel en Arequipa',
            meals: ['Desayuno'],
            includes: [
                'Sobrevuelo Líneas de Nazca',
                'Bus Nazca - Arequipa',
                'Traslados',
                'Hotel en Arequipa'
            ],
            notIncludes: ['Almuerzo', 'Cena', 'Seguro de viaje']
            },
            {
            day: 4,
            title: 'DISFRUTA DE AREQUIPA - CITY TOUR POR LA TARDE',
            description:
                'Recorrido por Arequipa visitando plaza principal, Yanahuara y Carmen Alto.',
            accommodations: 'Hotel en Arequipa',
            meals: ['Desayuno'],
            includes: [
                'City tour Arequipa',
                'Guía turístico',
                'Entradas',
                'Hotel en Arequipa'
            ],
            notIncludes: ['Almuerzo', 'Cena']
            },
            {
            day: 5,
            title: 'TOUR A CAÑON DE COLCA Y MIRADOR DE 3 CRUCES EN FULL DAY',
            description:
                'Excursión al Cañón del Colca, mirador Cruz del Cóndor y aguas termales.',
            accommodations: 'Hotel en Arequipa',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Tour Cañón del Colca',
                'Entradas',
                'Aguas termales',
                'Hotel en Arequipa'
            ],
            notIncludes: ['Cena', 'Seguro de viaje']
            },
            {
            day: 6,
            title: 'VIAJE EN BUS DE AREQUIPA A PUNO',
            description:
                'Traslado desde Arequipa hacia Puno en bus turístico.',
            accommodations: 'Hotel en Puno',
            meals: ['Desayuno'],
            includes: [
                'Bus Arequipa - Puno',
                'Traslados',
                'Hotel en Puno'
            ],
            notIncludes: ['Almuerzo', 'Cena']
            },
            {
            day: 7,
            title: 'TOUR A LAS ISLAS FLOTANTES DE UROS Y TAQUILE EN FULL DAY',
            description:
                'Navegación por el Lago Titicaca visitando Uros y Taquile.',
            accommodations: 'Hotel en Puno',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Lancha turística',
                'Visita Uros y Taquile',
                'Entradas',
                'Hotel en Puno'
            ],
            notIncludes: ['Seguro de viaje']
            },
            {
            day: 8,
            title: 'VIAJE DE PUNO A CUSCO EN BUS - RUTA DEL SOL',
            description:
                'Viaje turístico de Puno a Cusco visitando Pucará, La Raya, Raqchi y Andahuaylillas.',
            accommodations: 'Hotel en Cusco',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Bus turístico Ruta del Sol',
                'Entradas',
                'Almuerzo buffet',
                'Hotel en Cusco'
            ],
            notIncludes: ['Cena']
            },
            {
            day: 9,
            title: 'DISFRUTE DE LA CIUDAD DE CUSCO - WALKING TOUR',
            description:
                'Recorrido a pie por calles emblemáticas, Sapantiana y San Blas.',
            accommodations: 'Hotel en Cusco',
            meals: ['Desayuno'],
            includes: [
                'Walking tour',
                'Guía turístico',
                'Hotel en Cusco'
            ],
            notIncludes: ['Almuerzo', 'Cena']
            },
            {
            day: 10,
            title: 'TOUR EN EL VALLE SAGRADO DE LOS INCAS - NOCHE EN OLLANTAYTAMBO',
            description:
                'Visita a Pisac, Urubamba y Ollantaytambo con noche en Ollantaytambo.',
            accommodations: 'Hotel en Ollantaytambo',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Tour Valle Sagrado',
                'Entradas',
                'Almuerzo buffet',
                'Hotel en Ollantaytambo'
            ],
            notIncludes: ['Cena']
            },
            {
            day: 11,
            title: 'TOUR A LA MARAVILLA DEL MUNDO MACHUPICCHU - RETORNO A CUSCO',
            description:
                'Viaje en tren a Machu Picchu, recorrido guiado y retorno a Cusco.',
            accommodations: 'Hotel en Cusco',
            meals: ['Desayuno'],
            includes: [
                'Tren ida y retorno',
                'Bus a Machu Picchu',
                'Ingreso Machu Picchu',
                'Guía profesional',
                'Hotel en Cusco'
            ],
            notIncludes: ['Almuerzo', 'Cena', 'Wayna Picchu']
            },
            {
            day: 12,
            title: 'TOUR A LAS SALINERAS DE MARAS & MORAY',
            description:
                'Excursión a Moray, Salineras de Maras y visita a centro textil en Chinchero.',
            accommodations: 'Hotel en Cusco',
            meals: ['Desayuno'],
            includes: [
                'Tour Maras y Moray',
                'Entradas',
                'Centro textil',
                'Hotel en Cusco'
            ],
            notIncludes: ['Almuerzo', 'Cena']
            },
            {
            day: 13,
            title: 'VUELO DE CUSCO A LIMA - CONEXIÓN A VUELO INTERNACIONAL',
            description:
                'Traslado al aeropuerto y vuelo de retorno Cusco - Lima.',
            meals: ['Desayuno'],
            includes: [
                'Traslado hotel - aeropuerto',
                'Vuelo Cusco - Lima'
            ],
            notIncludes: [
                'Hotel en Lima',
                'Almuerzo',
                'Cena'
            ]
            }
        ],

        includes: [
            'Hoteles durante todo el recorrido',
            'Traslados turísticos',
            'Tours guiados',
            'Entradas según itinerario'
        ],

        notIncludes: [
            'Seguro de viaje',
            'Propinas',
            'Gastos personales',
            'Servicios no mencionados'
        ],

        whatToBring: [
            'Pasaporte original',
            'Mochila pequeña',
            'Bloqueador solar',
            'Repelente',
            'Ropa cómoda',
            'Cámara fotográfica',
            'Dinero extra'
        ],

        seoTitle: 'PERÚ AVENTURERO 13 DÍAS 12 NOCHES | Paquete turístico Perú',
        seoDescription:
            'Descubre Lima, Nazca, Arequipa, Puno, Cusco y Machu Picchu en 13 días con hoteles, tours y traslados.',

        isActive: true,
        isFeatured: true
        },

        {
        id: '4',
        title: 'RECORRE LOS ANDES PERUANOS EN UN VIAJE DE 7 DÍAS Y 6 NOCHES',
        slug: 'recorre-los-andes-peruanos-en-un-viaje-de-7-dias-y-6-noches',

        description:
            'Este paquete turístico es ideal para aquellos viajeros que desean conocer la sierra del Perú ya que conecta 2 ciudades muy importantes Cusco y Puno. Al llegar a Cusco será recibido por nuestro staff y por la tarde tendrá un recorrido por los atractivos turísticos que se encuentran cerca a la ciudad de Cusco. Luego visitará el Valle Sagrado, Machu Picchu y finalmente Puno navegando por el lago Titicaca visitando Uros y Taquile.',

        shortDescription:
            'Paquete turístico de 7 días recorriendo Cusco, Valle Sagrado, Machu Picchu y Puno.',

        price: 0,
        durationDays: 7,
        durationNights: 6,

        destinations: [
            { name: 'Cusco', slug: 'cusco' },
            { name: 'Valle Sagrado', slug: 'valle-sagrado' },
            { name: 'Machu Picchu', slug: 'machu-picchu' },
            { name: 'Puno', slug: 'puno' }
        ],

        imageUrl: '/images/package4.jpg',
        gallery: [
            '/images/package4.jpg',
            '/images/package4-2.jpg',
            '/images/package4-3.jpg'
        ],

        features: [
            'Hoteles incluidos',
            'Traslados',
            'Tours guiados',
            'Tren a Machu Picchu',
            'Ruta del Sol',
            'Tour Lago Titicaca'
        ],

        highlights: [
            'Disfruta de la ciudad de Cusco recorriendo sus calles autenticos y unicos',
            'Disfruta de los andes de la cordillera de vilcanota en su recorrido de Valle Sagrado',
            'Disfruta del recorrido de sus templos, plazas, andenes en Machu Picchu',
            'Descubre la maravilla del mundo moderno Machu Picchu y sorprendete con la arquitectura y misterios guardados.',
            'Recorre el encantador pueblo de Aguas Calientes rodeado de hoteles y restaurantes turísticos',
            'Disfruta del recorrido en tren durante su viaje de Ollantaytambo a Aguas Calientes con vistas hacia el valle',
            'Conectate con la historia y magia en Machu Picchu, donde te recargas de mucha energía',
            'Navega por el Lago Titicaca y disfruta de las islas Uros y Taquile'
        ],

        itinerary: [
            {
            day: 1,
            title: 'BIENVENIDO A CUSCO - CITY TOUR POR LA TARDE',
            description:
                'Recepción en aeropuerto de Cusco, traslado al hotel y city tour por Qoricancha, Sacsayhuaman, Qenqo, Puca Pucará y Tambomachay.',
            accommodations: 'Hotel en Cusco',
            includes: [
                'Transporte turístico de Aeropuerto a Hotel en el centro histórico',
                'City Tour a los 4 atractivos turísticos',
                'TRansporte turístico para el city tour',
                'Guia turistico ingles-español',
                'Tickets de ingreso al templo de Coricancha',
                'Tickets de ingreso a Sacsayhuaman, Qenqo, Puca Pucará y Tambomachay',
                'Asistencia durante el recorrido',
                'Noche de hotel en Cusco'
            ],
            notIncludes: [
                'Desayuno',
                'Almuerzo',
                'Cena',
                'Costos extras',
                'Actividades extras durante el tour',
                'Vuelo nacional de Lima a Cusco',
                'Seguro de viaje'
            ]
            },
            {
            day: 2,
            title: 'TOUR VALLE SAGRADO DE LOS INCAS - PERNOCTE EN OLLANTAYTAMBO',
            description:
                'Recorrido por Pisac, Urubamba y Ollantaytambo con almuerzo buffet y noche en Ollantaytambo.',
            accommodations: 'Hotel en Ollantaytambo',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Desayuno en el hotel de Cusco',
                'Transporte Turístico',
                'Guia Turistico ingles - español',
                'Almuerzo Buffet en Urubamba',
                'Tickets de ingreso a centro arqueológico de Pisac',
                'Tickets de ingreso a centro arqueológico de Ollantaytambo',
                'Noche de hotel en Ollantaytambo'
            ],
            notIncludes: [
                'Cena',
                'Gastos extras',
                'Propinas',
                'Actividades extras durante el tour',
                'Seguros de viaje'
            ]
            },
            {
            day: 3,
            title: 'TOUR A LA MARAVILLA DEL MUNDO MACHUPICCHU - RETORNO A CUSCO',
            description:
                'Viaje en tren a Aguas Calientes, visita guiada a Machu Picchu y retorno a Cusco.',
            accommodations: 'Hotel en Cusco',
            meals: ['Desayuno'],
            includes: [
                'Desayuno o box breakfast en el hotel de Ollantaytambo',
                'Transporte turístico privado de la estación de Ollantaytambo hacia su hotel en Cusco',
                'Tickets de tren turístico servicio expeditions o the voyager desde la estación de Ollantaytambo hacia Aguas Calientes y retorno.',
                'Tickets de bus de Aguas Calientes a Machu Picchu y retorno de Machu Picchu a Aguas Calientes.',
                'Tickets de ingreso a la Maravilla del mundo Machu Picchu.',
                'Guía turístico profesional',
                'Noche de hotel en Cusco'
            ],
            notIncludes: [
                'Tickets de ingreso a Wayna Picchu o montaña Machu Picchu',
                'Almuerzo',
                'Cena',
                'Tickets de tren servicio Vistadome Observatory',
                'Ingreso a baños termales',
                'Seguro de Viaje',
                'Snack',
                'Propinas',
                'Costos extras fuera de nuestro control'
            ]
            },
            {
            day: 4,
            title: 'TREKKING A LA MONTAÑA DE COLORES VINICUNCA FULL DAY',
            description:
                'Excursión de trekking a Vinicunca con desayuno y almuerzo buffet en Cusipata.',
            accommodations: 'Hotel en Cusco',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Recojo de su hotel en el centro histórico',
                'Transporte Turistico',
                'Guia Profesional especializado en Trekking inglés- español',
                'Desayuno y Almuerzo Buffet en Cusipata',
                'Tickets de ingreso a Montaña de Colores Vinicunca',
                'Kit de primeros auxilios',
                'Asistencia durante el recorrido',
                'Noche de hotel en Cusco'
            ],
            notIncludes: [
                'Cena',
                'Seguro de Viaje',
                'Propinas',
                'Snack',
                'Caballo de Silla',
                'Costos extras fuera de nuestro control'
            ]
            },
            {
            day: 5,
            title: 'RUTA DEL SOL - VIAJE DE CUSCO A PUNO EN BUS',
            description:
                'Viaje en bus turístico desde Cusco a Puno visitando Andahuaylillas, Raqchi, La Raya y Pucará.',
            accommodations: 'Hotel en Puno',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Desayuno-box breakfast en el hotel',
                'Transporte de su hotel a la estación de Bus',
                'Bus turistico de Cusco a Puno',
                'Tickets de ingreso a la capilla de Andahuaylillas',
                'Tickets de ingreso a centro arqueologico de Raqchi',
                'Visita a museo de sitio en Pucará',
                'Almuerzo Buffet',
                'Traslado de estación de Bus a su hotel en Puno',
                'Noche de hotel en Puno'
            ],
            notIncludes: [
                'Cena',
                'Seguro de Viaje',
                'Propinas',
                'Snack',
                'Costos extras fuera de nuestro control'
            ]
            },
            {
            day: 6,
            title: 'TOUR A LAS ISLAS UROS Y TAQUILE FULL DAYS',
            description:
                'Tour navegando por el Lago Titicaca visitando Uros y Taquile con almuerzo típico.',
            accommodations: 'Hotel en Puno',
            meals: ['Almuerzo'],
            includes: [
                'Recojo de su hotel',
                'Transporte Fluvial Turístico',
                'Guia Bilingue (Español - Ingles)',
                'Almuerzo en Taquile',
                'Tickets de Ingreso a la Isla de Uros',
                'Tickets de Ingreso a la isla de Taquile',
                'Noche de hotel en Puno'
            ],
            notIncludes: [
                'Cena',
                'Gastos Extras',
                'Seguro de Viaje',
                'Propinas',
                'Actividades extras en las islas',
                'Costos extras fuera de nuestro control'
            ]
            },
            {
            day: 7,
            title: 'TRASLADO DE HOTEL A AEROPUERTO - VUELO A LIMA',
            description:
                'Traslado desde Puno al aeropuerto de Juliaca para vuelo con destino a Lima.',
            meals: ['Desayuno'],
            includes: [
                'Desayuno en el hotel de Puno',
                'Transporte Turistico de Puno hacia el aeropuerto en Juliaca'
            ],
            notIncludes: [
                'Almuerzo',
                'Cena',
                'Gastos Extras',
                'Propinas',
                'Seguro de Viaje',
                'Actividades extras en las islas',
                'Costos extras fuera de nuestro control',
                'Vuelo doméstico de Juliaca a Lima',
                'Hotel en Lima'
            ]
            }
        ],

        includes: [
            'Hoteles durante todo el recorrido',
            'Tours guiados',
            'Traslados turísticos',
            'Tren a Machu Picchu',
            'Bus turístico Ruta del Sol',
            'Tour Lago Titicaca'
        ],

        notIncludes: [
            'Vuelos nacionales e internacionales no especificados',
            'Seguro de viaje',
            'Propinas',
            'Gastos extras'
        ],

        whatToBring: [
            'Pasaporte original',
            'Mochila pequeña Portadores de agua como Camelbacks',
            'Zapatos de montaña cómodas',
            'Protector solar',
            'Crema hidratante para la cara',
            'Repelente de insectos',
            'Desinfectante de manos',
            'Toallitas húmedas',
            'Cepillo de dientes y pasta',
            'Papel higiénico',
            'Medicamentos personales',
            'Sombrero para el sol',
            'Ropa de lluvia',
            'Cámara fotografica',
            'Dinero extra para souvenirs, bebidas y propinas'
        ],

        seoTitle: 'RECORRE LOS ANDES PERUANOS EN UN VIAJE DE 7 DÍAS Y 6 NOCHES',
        seoDescription:
            'Descubre Cusco, Valle Sagrado, Machu Picchu y Puno en un viaje de 7 días y 6 noches por los Andes peruanos.',

        isActive: true,
        isFeatured: true
        },

        {
        id: '5',
        title: 'VIAJE INOLVIDABLE EN PERÚ DE 10 DÍAS / 09 NOCHES - SERVICIO PRIVADO',
        slug: 'viaje-inolvidable-en-perú-de-10-días-09-noches-servicio-privado',

        description:
            'Descubre Perú en un viaje de 10 días recorriendo Lima, Paracas, Ica, Huacachina y Cusco, incluyendo Machu Picchu, Valle Sagrado, Montaña de Colores y Laguna Humantay.',

        shortDescription:
            'Paquete completo por Lima, Paracas, Ica, Huacachina, Cusco y Machu Picchu con experiencias de aventura y trekking.',

        price: 0,
        durationDays: 10,
        durationNights: 9,

        destinations: [
            { name: 'Lima', slug: 'lima' },
            { name: 'Paracas', slug: 'paracas' },
            { name: 'Ica', slug: 'ica' },
            { name: 'Huacachina', slug: 'huacachina' },
            { name: 'Cusco', slug: 'cusco' },
            { name: 'Valle Sagrado', slug: 'valle-sagrado' },
            { name: 'Machu Picchu', slug: 'machu-picchu' },
            { name: 'Montaña de Colores', slug: 'montaña-de-colores' },
            { name: 'Laguna Humantay', slug: 'laguna-humantay' }
        ],

        imageUrl: '/images/package2.jpg',
        gallery: [
            '/images/package2.jpg',
            '/images/package2-2.jpg',
            '/images/package2-3.jpg'
        ],

        features: [
            'Hoteles incluidos',
            'Vuelos domésticos',
            'Tours privados',
            'Traslados turísticos',
            'Entradas incluidas'
        ],

        highlights: [
            'City Tour en Lima',
            'Islas Ballestas en Paracas',
            'Huacachina con buggies y sandboarding',
            'Valle Sagrado de los Incas',
            'Machu Picchu tour privado',
            'Maras y Moray',
            'City Tour Cusco',
            'Montaña de Colores',
            'Laguna Humantay'
        ],

        itinerary: [
            {
            day: 1,
            title: 'BIENVENIDO A LIMA - RECORRIDO POR EL CENTRO DE LA CIUDAD',
            description:
                'Recepción en aeropuerto, traslado a hotel y recorrido por Lima histórica y moderna.',
            accommodations: 'Noche de hotel en Lima',
            includes: [
                'Transporte aeropuerto - hotel',
                'City tour Lima',
                'Guía privado',
                'Ingreso a Convento San Francisco',
                'Hotel en Lima'
            ],
            notIncludes: ['Alimentos', 'Seguro de viaje']
            },
            {
            day: 2,
            title: 'TOUR HACIA ICA Y PARACAS + SUNSET EN EL DESIERTO',
            description:
                'Visita a Islas Ballestas, viñedo en Ica y aventura en Huacachina con buggies y sandboarding.',
            accommodations: 'Noche de hotel en Lima',
            includes: [
                'Transporte turístico',
                'Guía privado',
                'Ingreso a Islas Ballestas',
                'Buggies y sandboarding',
                'Hotel en Lima'
            ],
            notIncludes: ['Almuerzo', 'Cena']
            },
            {
            day: 3,
            title: 'VUELO A CUSCO - PERNOCTE EN VALLE SAGRADO',
            description:
                'Vuelo Lima - Cusco y traslado al Valle Sagrado con visita cultural.',
            accommodations: 'Noche de hotel en Valle Sagrado',
            includes: [
                'Traslados',
                'Vuelo Lima - Cusco',
                'Guía privado',
                'Hotel en Valle Sagrado'
            ],
            notIncludes: ['Almuerzo', 'Cena']
            },
            {
            day: 4,
            title: 'TOUR A LA MARAVILLA DEL MUNDO MACHU PICCHU',
            description:
                'Viaje en tren, visita guiada a Machu Picchu y retorno.',
            accommodations: 'Noche de hotel en Valle Sagrado',
            meals: ['Desayuno'],
            includes: [
                'Desayuno',
                'Tren turístico',
                'Bus',
                'Ingreso Machu Picchu',
                'Guía',
                'Hotel'
            ],
            notIncludes: ['Almuerzo', 'Cena']
            },
            {
            day: 5,
            title: 'TOUR A MARAS Y MORAY - ALMUERZO EN MOUNTAIN VIEW',
            description:
                'Visita a Maras y Moray con retorno a Cusco.',
            accommodations: 'Noche de hotel en Cusco',
            meals: ['Desayuno'],
            includes: [
                'Desayuno',
                'Ingreso a Maras y Moray',
                'Guía',
                'Transporte',
                'Hotel en Cusco'
            ],
            notIncludes: ['Almuerzo', 'Cena']
            },
            {
            day: 6,
            title: 'CITY TOUR EN CUSCO + TEMPLO DEL SOL QORICANCHA',
            description:
                'Recorrido por Qoricancha y sitios arqueológicos cercanos.',
            accommodations: 'Noche de hotel en Cusco',
            meals: ['Desayuno'],
            includes: [
                'Guía',
                'Entradas',
                'Transporte',
                'Hotel en Cusco'
            ],
            notIncludes: ['Almuerzo', 'Cena']
            },
            {
            day: 7,
            title: 'TREKKING A LA MONTAÑA DE COLORES EN FULL DAY',
            description:
                'Caminata a Vinicunca con desayuno y almuerzo.',
            accommodations: 'Noche de hotel en Cusco',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Transporte',
                'Guía trekking',
                'Ingreso',
                'Desayuno y almuerzo',
                'Hotel en Cusco'
            ],
            notIncludes: ['Cena']
            },
            {
            day: 8,
            title: 'TREKKING A LA LAGUNA DE HUMANTAY EN FULL DAYS',
            description:
                'Caminata hacia la Laguna Humantay con vistas espectaculares.',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Transporte',
                'Guía trekking',
                'Ingreso',
                'Desayuno y almuerzo'
            ],
            notIncludes: ['Cena']
            },
            {
            day: 9,
            title: 'DIA LIBRE  EN CUSCO',
            description:
                'Día libre para recorrer Cusco o descansar.',
            accommodations: 'Noche de hotel en Cusco',
            meals: ['Desayuno'],
            includes: ['Desayuno', 'Hotel en Cusco'],
            notIncludes: ['Almuerzo', 'Cena']
            },
            {
            day: 10,
            title: 'VUELO DE CUSCO A LIMA - CONEXIÓN VUELO INTERNACIONAL',
            description:
                'Traslado al aeropuerto y vuelo Cusco - Lima.',
            meals: ['Desayuno'],
            includes: [
                'Desayuno',
                'Traslado aeropuerto',
                'Vuelo Cusco - Lima'
            ],
            notIncludes: ['Hotel en Lima', 'Almuerzo', 'Cena']
            }
        ],

        includes: [
            'Hoteles durante el programa',
            'Vuelos domésticos',
            'Tours privados',
            'Traslados turísticos',
            'Entradas a atractivos',
            'Trenes turísticos'
        ],

        notIncludes: [
            'Vuelos internacionales',
            'Seguro de viaje',
            'Propinas',
            'Gastos personales'
        ],

        whatToBring: [
            'Pasaporte original',
            'Mochila pequeña',
            'Botas cómodas',
            'Bloqueador solar',
            'Repelente',
            'Ropa de lluvia',
            'Cámara',
            'Dinero extra',
            'Medicación personal'
        ],

        seoTitle: 'VIAJE INOLVIDABLE EN PERÚ DE 10 DÍAS / 09 NOCHES - SERVICIO PRIVADO',
        seoDescription:
            'Viaja por Perú en 10 días visitando Lima, Paracas, Cusco, Machu Picchu y más con experiencias únicas.',

        isActive: true,
        isFeatured: true
        },








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