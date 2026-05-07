import type { Tour } from '../../core/domain/models';

export const toursData: Tour[] = [
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

        imageUrl: '/images/cusco/ciudad-machu-picchu.webp',

        gallery: [
            '/images/cusco/cusco.png',
            '/images/cusco/valle-sagrado_.webp',
            '/images/cusco/valle-sagrada.webp',
        ],

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

        imageUrl: '/images/cusco/Machhu-Picchu.webp',

        gallery: [
            '/images/cusco/machu-picchu3.webp',
            '/images/cusco/mapi2.webp',
        ],

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

        imageUrl: '/images/cusco/valle-sagrado3.webp',

        gallery: [
            '/images/cusco/valleSagrado.webp',
            '/images/cusco/MACHU_PICCHU.webp',
        ],

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

        imageUrl: '/images/cusco/wayna-picchu.webp',

        gallery: [
            '/images/cusco/huayna-picchu.webp',
            '/images/cusco/Machhu-Picchu.webp',
        ],

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

        imageUrl: '/images/arequipa/Canon-del-Colca-en-Arequipa.webp',

        gallery: [
            '/images/arequipa/Agua-termal.webp',
            '/images/arequipa/Canon-del-Colca.webp',
            '/images/arequipa/colca-arequipa.webp',
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

        imageUrl: '/images/cusco/cusco1.webp',

        gallery: [
            '/images/cusco/Koricancha.webp',
            '/images/cusco/qenqo.webp',
            '/images/cusco/sacsayhuaman.webp',
            '/images/cusco/tambomacha.webp',
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

        imageUrl: '/images/lima/lima2.webp',

        gallery: [
            '/images/lima/catedral-de-lima.webp',
            '/images/lima/miraflores.webp',
            '/images/lima/Convento-de-San-Agustin.webp',
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

        imageUrl: '/images/puno/Puno6.webp',

        gallery: [
            '/images/puno/puno4.webp',
            '/images/puno/puno2.webp',
            '/images/puno/puno1.webp',
        ],

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

        imageUrl: '/images/cusco/maras-moray.webp',

        gallery: [
            '/images/cusco/Moray-Salineras.webp',
            '/images/cusco/moray.webp',
        ],

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

        imageUrl: '/images/ica/ica.png',

        gallery: [
            '/images/ica/ica1.webp',
            '/images/ica/paracas1.webp',
            '/images/ica/nazca1.webp',
        ],
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

    {
        id: '11',
        title: 'TOUR DE UN DÍA COMPLETO A PARACAS, ICA Y DESIERTO DE HUACACHINA',
        slug: 'tour-de-un-día-completo-a-paracas-ica-y-desierto-de-huacachina',

        description:
            'Disfruta de un tour full day por la costa peruana visitando Paracas, Ica y Huacachina, explorando Islas Ballestas, viñedos y viviendo la aventura en el desierto.',

        shortDescription:
            'Tour de un día a Paracas, Ica y Huacachina con Islas Ballestas, viñedos y buggies en el desierto.',

        price: 0,
        durationDays: 1,
        durationNights: 0,

        destinationName: 'Ica',
        destinationSlug: 'ica',

        location: 'Lima, Peru',
        cities: ['Lima', 'Paracas', 'Ica', 'Huacachina'],

        imageUrl: '/images/ica/paracas1.webp',

        gallery: [
            '/images/ica/PARACAS.webp',
            '/images/ica/laguna-huacachina.webp',
            '/images/ica/islas-ballestas-paracas.webp',
        ],

        features: [
            'Servicio compartido',
            'Guía bilingüe',
            'Transporte turístico',
            'Actividades de aventura'
        ],

        highlights: [
            'Islas Ballestas',
            'Viñedos en Ica',
            'Huacachina',
            'Buggies y sandboard',
            'Costa peruana'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Paracas, Ica y Huacachina Full Day',
            description:
                'Salida temprano desde Lima hacia Paracas para visitar Islas Ballestas. Luego visita a Ica con degustación de pisco en viñedo. Por la tarde aventura en Huacachina con buggies y sandboarding. Retorno a Lima por la noche.',
            includes: [
                'Recojo del hotel',
                'Transporte turístico',
                'Guía bilingüe',
                'Ingreso a Islas Ballestas',
                'Ingreso a viñedo',
                'Ingreso a Huacachina',
                'Buggies',
                'Sandboarding'
            ],
            notIncludes: [
                'Almuerzo',
                'Seguro de viaje',
                'Propinas',
                'Gastos personales',
                'Hotel en Lima',
                'Actividades extras'
            ]
            }
        ],

        includes: [
            'Recojo del hotel',
            'Transporte turístico',
            'Guía bilingüe',
            'Ingreso a Islas Ballestas',
            'Ingreso a viñedo',
            'Ingreso a Huacachina',
            'Buggies',
            'Sandboarding'
        ],

        notIncludes: [
            'Almuerzo',
            'Gastos extras',
            'Seguro de viaje',
            'Propinas',
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

        seoTitle: 'Tour Paracas, Ica y Huacachina Full Day | Desde Lima',
        seoDescription:
            'Explora Paracas, Ica y Huacachina en un tour de un día con Islas Ballestas, viñedos y aventura en el desierto.',

        isActive: true,
        isFeatured: true
        },

    {
        id: '12',
        title: 'RECORRE EL MISTERIOSO VALLE SAGRADO DE LOS INKAS',
        slug: 'recorre-el-misterioso-valle-sagrado-de-los-inkas',

        description:
            'Descubre el Valle Sagrado de los InkAs en un tour de día completo visitando Pisac, Urubamba, Ollantaytambo y Chinchero, rodeado de montañas, cultura y tradiciones andinas.',

        shortDescription:
            'Tour full day por el Valle Sagrado visitando Pisac, Ollantaytambo y Chinchero con cultura y paisajes andinos.',

        price: 0,
        durationDays: 1,
        durationNights: 0,

        destinationName: 'Cusco',
        destinationSlug: 'cusco',

        location: 'Cusco, Peru',
        cities: ['Cusco', 'Pisac', 'Urubamba', 'Ollantaytambo', 'Chinchero'],

        imageUrl: '/images/cusco/valle-sagrado_.webp',

        gallery: [
            '/images/cusco/pisaq.webp',
            '/images/cusco/urubamba.webp',
            '/images/cusco/Chinchero.webp',
        ],

        features: [
            'Servicio compartido',
            'Guía turístico',
            'Transporte turístico',
            'Entradas incluidas'
        ],

        highlights: [
            'Centro arqueológico de Pisac',
            'Mercado de Pisac',
            'Almuerzo en Urubamba',
            'Ollantaytambo',
            'Centro textil de Chinchero',
            'Valle Sagrado de los Incas'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Valle Sagrado de los InkAs Full Day',
            description:
                'Recojo del hotel y visita al centro arqueológico de Pisac y su mercado. Luego almuerzo en Urubamba y recorrido por Ollantaytambo. Finalmente visita a Chinchero y retorno a Cusco por la tarde.',
            meals: ['Almuerzo'],
            includes: [
                'Transporte turístico',
                'Guía turístico',
                'Ingreso a Pisac',
                'Ingreso a Ollantaytambo',
                'Visita a centro textil en Chinchero'
            ],
            notIncludes: [
                'Hotel en Cusco',
                'Gastos personales',
                'Seguro de viaje'
            ]
            }
        ],

        includes: [
            'Transporte turístico',
            'Guía turístico',
            'Ingreso a Pisac',
            'Ingreso a Ollantaytambo',
            'Visita a centro textil en Chinchero'
        ],

        notIncludes: [
            'Hotel en Cusco',
            'Gastos extras',
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

        seoTitle: 'Tour Valle Sagrado de los Incas Full Day | Cusco',
        seoDescription:
            'Explora Pisac, Urubamba, Ollantaytambo y Chinchero en un tour completo por el Valle Sagrado desde Cusco.',

        isActive: true,
        isFeatured: true
        },

        {
        id: '13',
        title: 'TREKKING A LA LAGUNA DE HUMANTAY - FULL DAY',
        slug: 'trekking-a-la-laguna-de-humantay-full-day',

        description:
            'Vive una aventura de un día hacia la Laguna de Humantay desde Cusco, rodeado de montañas, nevados y paisajes impresionantes con aguas turquesas.',

        shortDescription:
            'Trekking full day a la Laguna de Humantay con desayuno, almuerzo y vistas espectaculares en los Andes.',

        price: 0,
        durationDays: 1,
        durationNights: 0,

        destinationName: 'Cusco',
        destinationSlug: 'cusco',

        location: 'Cusco, Peru',
        cities: ['Cusco', 'Mollepata'],

        imageUrl: '/images/cusco/humantay.webp',

        gallery: [
            '/images/cusco/aguas-turquesas.webp',
            '/images/cusco/laguna-humantay.webp',
        ],

        features: [
            'Servicio compartido',
            'Guía especializado en trekking',
            'Transporte turístico',
            'Desayuno y almuerzo incluidos'
        ],

        highlights: [
            'Laguna de Humantay',
            'Nevado Salkantay',
            'Paisajes andinos',
            'Trekking en altura',
            'Aguas turquesas'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Trekking Laguna de Humantay Full Day',
            description:
                'Recojo temprano del hotel y viaje a Mollepata para desayuno. Traslado a Soraypampa e inicio de caminata hacia la Laguna de Humantay. Tiempo para disfrutar del paisaje y retorno para almuerzo. Regreso a Cusco por la tarde.',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Recojo del hotel',
                'Transporte turístico',
                'Guía profesional',
                'Desayuno',
                'Almuerzo',
                'Ingreso a Laguna Humantay',
                'Bastón de trekking',
                'Botiquín de primeros auxilios',
                'Asistencia durante el recorrido'
            ],
            notIncludes: [
                'Cena',
                'Snack',
                'Propinas',
                'Seguro de viaje',
                'Caballo de silla (el costo aproximado por caballo de silla es 120.00 soles)'
            ]
            }
        ],

        includes: [
            'Información previa',
            'Transporte turístico',
            'Guía especializado en trekking',
            'Desayuno',
            'Almuerzo',
            'Ingreso a Laguna Humantay',
            'Bastón de trekking',
            'Botiquín de primeros auxilios',
            'Asistencia durante el recorrido'
        ],

        notIncludes: [
            'Cena',
            'Snack',
            'Propinas',
            'Seguro de viaje',
            'Caballo de silla (el costo aproximado por caballo de silla es 120.00 soles)'
        ],

        whatToBring: [
            'Zapatos de trekking',
            'Chaqueta, bufanda, guantes y gorro',
            'Protector solar',
            'Gafas de sol',
            'Cámara',
            'Snacks o barras energéticas',
            'Poncho de lluvia',
            'Mochila cómoda',
            'Dinero extra'
        ],

        seoTitle: 'Trekking Laguna de Humantay Full Day | Cusco',
        seoDescription:
            'Disfruta un trekking a la Laguna de Humantay desde Cusco con desayuno, almuerzo y vistas espectaculares de los Andes.',

        isActive: true,
        isFeatured: true
        },

        {
        id: '14',
        title: 'Descubre Camino Inca 2 Dias 1 Noche',
        slug: 'descubre-camino-inca-2-dias-1-noche',

        description:
            'El Camino Inca a Machu Picchu es una de las rutas de trekking más famosas del mundo. Esta ruta de 2 días combina una caminata intensa con la visita a Machu Picchu, pasando por paisajes impresionantes, microclimas y sitios arqueológicos como Chachabamba y Wiñaywayna, culminando con la llegada a Intipunku y la vista de la ciudadela.',

        shortDescription:
            'Trekking corto por el Camino Inca con visita a Machu Picchu en 2 días.',

        price: 0,
        durationDays: 2,
        durationNights: 1,

        destinationName: 'Machu Picchu',
        destinationSlug: 'machu-picchu',

        location: 'Cusco',
        cities: ['Cusco', 'Ollantaytambo', 'Aguas Calientes'],

        imageUrl: '/images/cusco/camino-inka.webp',

        gallery: [
            '/images/cusco/aguas-termales.webp',
            '/images/cusco/MACHU_PICCHU.webp',
            '/images/cusco/caminata-machu-pichu.webp',
        ],

        features: [
            'Trekking Camino Inca corto',
            'Ingreso a Machu Picchu',
            'Guía profesional',
            'Tren turístico',
            'Hotel en Aguas Calientes'
        ],

        highlights: [
            'Recorrido por el Camino Inca en 2 días',
            'Visita a Chachabamba y Wiñaywayna',
            'Vista desde Intipunku',
            'Exploración de Machu Picchu',
            'Paisajes andinos y selva alta'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Cusco – Ollantaytambo – KM 104 – Aguas Calientes',
            description:
                'Salida temprano desde Cusco hacia Ollantaytambo, viaje en tren hasta el KM 104 donde inicia la caminata. Visita a Chachabamba, caminata hasta Wiñaywayna con box lunch y continuación hacia Intipunku para apreciar Machu Picchu. Descenso en bus a Aguas Calientes y noche en hotel.',
            accommodations: 'Hotel en Aguas Calientes',
            meals: ['Box Lunch', 'Cena'],
            includes: [
                'Servicio de transporte turístico Cusco- Estación Ollantaytambo',
                'Boleto de ingreso a Camino Inca km 104 - Chachabamba.',
                'Guía especializado y autorizado en la red de camino inca.',
                'Asistencia por parte de la agencia 24/7.',
                'Boleto de tren Expeditions o the voyager estacion Ollantaytambo a Km 104 en Chachabamba.',
                'Boleto de Bus de bajada de MachuPicchu a pueblo de Aguas Calientes',
                'Box Lunch opción vegetariano y vegano',
                'Noche de hotel en el pueblo de Aguas Calientes.'
            ],
            notIncludes: [
                'Boleto de tren servicio Vistadome Observatory de Ollantaytambo a Km 104.',
                'Bastones de Trekking',
                'Seguro de viaje.',
                'Propinas para el staff en ruta'
            ]
            },
            {
            day: 2,
            title: 'Aguas Calientes – Machu Picchu – Cusco',
            description:
                'Viaje en bus hacia Machu Picchu para visita guiada por los principales sectores. Luego retorno a Aguas Calientes, tiempo libre para almuerzo y regreso en tren a Ollantaytambo y traslado a Cusco.',
            meals: [],
            includes: [
                'Boleto de ingreso a la ciudadela de Machu Picchu.',
                'Guia especializado para el recorrido en Machu Picchu inglés / español',
                'Boleto de tren expeditions o the voyager de Aguas Calientes a Ollantaytambo',
                'Boleto de Bus de subida y bajada de Aguas Calientes a MachuPicchu y MachuPicchu a Aguas Calientes',
                'Transporte Turístico de estacion Ollantaytambo a Cusco'
            ],
            notIncludes: [
                'Boleto de ingreso y guiado a HuaynaPicchu.',
                'Almuerzo en Aguas Calientes',
                'Seguro de viaje',
                'Costes adicionales o retrasos fuera de nuestro control',
                'Noche de hotel en Cusco'
            ]
            }
        ],

        includes: [
            'Servicio de transporte turístico Cusco- Estación Ollantaytambo',
            'Boleto de ingreso a Camino Inca km 104 - Chachabamba.',
            'Guía especializado y autorizado en la red de camino inca.',
            'Asistencia por parte de la agencia 24/7.',
            'Boleto de tren Expeditions o the voyager estacion Ollantaytambo a Km 104 en Chachabamba.',
            'Boleto de Bus de bajada de MachuPicchu a pueblo de Aguas Calientes',
            'Box Lunch opción vegetariano y vegano',
            'Noche de hotel en el pueblo de Aguas Calientes.',
            'Boleto de ingreso a la ciudadela de Machu Picchu.',
            'Guia especializado para el recorrido en Machu Picchu inglés / español',
            'Boleto de tren expeditions o the voyager de Aguas Calientes a Ollantaytambo',
            'Boleto de Bus de subida y bajada de Aguas Calientes a MachuPicchu y MachuPicchu a Aguas Calientes',
            'Transporte Turístico de estacion Ollantaytambo a Cusco'
        ],

        notIncludes: [
            'Boleto de tren servicio Vistadome Observatory de Ollantaytambo a Km 104.',
            'Bastones de Trekking',
            'Seguro de viaje.',
            'Propinas para el staff en ruta',
            'Boleto de ingreso y guiado a HuaynaPicchu.',
            'Almuerzo en Aguas Calientes',
            'Noche de hotel en Cusco'
        ],

        whatToBring: [],

        seoTitle: 'Camino Inca 2 Dias 1 Noche a Machu Picchu',
        seoDescription:
            'Disfruta el Camino Inca corto de 2 días con visita a Machu Picchu, paisajes increíbles y guía profesional.',

        isActive: true,
        isFeatured: true
        }, 

        {
        id: '15',
        title: 'Trekking a la Montaña de Palccoyo',
        slug: 'trekking-montana-palccoyo',

        description:
            'El tour a la montaña de colores de Palccoyo es una experiencia increíble donde podrás disfrutar de paisajes andinos únicos. Es una alternativa a Vinicunca, ideal para quienes buscan una caminata corta y menos exigente. Desde sus miradores podrás apreciar montañas multicolores, valles, flora andina y el impresionante bosque de piedras, siendo un destino perfecto para amantes de la naturaleza y la fotografía.',

        shortDescription:
            'Tour a la Montaña de Colores de Palccoyo con caminata corta y vistas panorámicas.',

        price: 0,
        durationDays: 1,
        durationNights: 0,

        destinationName: 'Palccoyo',
        destinationSlug: 'palccoyo',

        location: 'Cusco',
        cities: ['Cusco', 'Cusipata'],

        imageUrl: '/images/cusco/Montana-palcoyo.webp',

        gallery: [
            '/images/cusco/montana-palcoyo (1).webp',
            '/images/cusco/palccoyo_1.webp',
        ],

        features: [
            'Caminata corta y fácil',
            'Desayuno y almuerzo buffet',
            'Guía profesional',
            'Transporte turístico',
            'Ingreso incluido'
        ],

        highlights: [
            'Montañas de colores de Palccoyo',
            'Miradores panorámicos',
            'Bosque de piedras',
            'Vista al nevado Ausangate',
            'Flora y fauna andina'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Cusco – Cusipata – Palccoyo – Cusco',
            description:
                'Recojo temprano desde Cusco y viaje hacia Cusipata para desayuno buffet. Luego traslado hacia el punto de inicio de la caminata. Caminata corta hacia los miradores de Palccoyo donde se aprecian montañas de colores y el bosque de piedras. Tiempo libre para fotografías y retorno para almuerzo buffet antes de regresar a Cusco.',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Información previa antes del inicio del tour',
                'Recojo de su hotel en el centro histórico de Cusco',
                'Transporte Turistico',
                'Guia Profesional con experiencia en trekking',
                'Desayuno y Almuerzo Buffet',
                'Tickets de ingreso a la montaña de Palccoyo',
                'Botiquín de primeros auxilios',
                'Asistencia durante el recorrido'
            ],
            notIncludes: [
                'Caballos de silla',
                'Seguros de viaje',
                'Snack',
                'Propinas',
                'Costos adicionales'
            ]
            }
        ],

        includes: [
            'Información previa antes del inicio del tour',
            'Recojo de su hotel en el centro histórico de Cusco',
            'Transporte Turistico',
            'Guia Profesional con experiencia en trekking',
            'Desayuno y Almuerzo Buffet',
            'Tickets de ingreso a la montaña de Palccoyo',
            'Botiquín de primeros auxilios',
            'Asistencia durante el recorrido'
        ],

        notIncludes: [
            'Caballos de silla',
            'Seguros de viaje',
            'Snack',
            'Propinas',
            'Costos adicionales'
        ],

        whatToBring: [
            'Zapatos cómodos de trekking',
            'Chaqueta, bufanda, guantes, gorro y gorra de abrigo',
            'Protector solar',
            'Gafas de sol',
            'Cámaras fotografias',
            'Snack o barras energeticas',
            'Poncho de lluvia (si viaja en temporada de lluvia)',
            'Mochila comoda',
            'Dinero extra para souvenirs y propinas'
        ],

        seoTitle: 'Trekking Montaña de Colores Palccoyo Cusco',
        seoDescription:
            'Disfruta el tour a Palccoyo, la montaña de colores alternativa con caminata corta, paisajes increíbles y vistas al nevado Ausangate.',

        isActive: true,
        isFeatured: true
        },

        {
        id: '16',
        title: 'Aventura en la Montaña de Colores Vinicunca',
        slug: 'aventura-montana-colores-vinicunca',

        description:
            'La Montaña de Colores Vinicunca, ubicada al sur de Cusco, es uno de los destinos más impresionantes del Perú. Esta aventura de un día te lleva hasta los 5200 msnm, donde el desafío es tanto físico como mental. Disfrutarás de paisajes únicos, vistas al nevado Ausangate y una experiencia inolvidable en los Andes.',

        shortDescription:
            'Tour de un día a la Montaña de Colores Vinicunca con trekking y vistas al Ausangate.',

        price: 0,
        durationDays: 1,
        durationNights: 0,

        destinationName: 'Vinicunca',
        destinationSlug: 'vinicunca',

        location: 'Cusco',
        cities: ['Cusco', 'Cusipata'],

        imageUrl: '/images/cusco/montaña_7Colores.webp',

        gallery: [
            '/images/cusco/Montana-de-7-Colores.webp',
            '/images/cusco/montana-7-colores.webp',
        ],

        features: [
            'Trekking de alta montaña',
            'Desayuno y almuerzo buffet',
            'Guía profesional',
            'Transporte turístico',
            'Ingreso incluido'
        ],

        highlights: [
            'Montaña de Colores Vinicunca',
            'Vista al nevado Ausangate',
            'Paisajes de la cordillera de Vilcanota',
            'Experiencia de trekking en altura',
            'Flora y fauna andina'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Cusco – Cusipata – Vinicunca – Cusco',
            description:
                'Salida temprano desde Cusco hacia Cusipata para desayuno buffet. Luego traslado al punto de inicio de la caminata. Caminata hacia la cima de la Montaña de Colores (5200 msnm) donde se aprecian vistas impresionantes del valle de Vilcanota y el nevado Ausangate. Descenso por la misma ruta, retorno a Cusipata para almuerzo buffet y regreso a Cusco.',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Información antes del día de su viaje',
                'Recojo de su hotel en el centro histórico',
                'Transporte Turistico',
                'Guia Profesional especializado en Trekking inglés- español',
                'Desayuno y Almuerzo Buffet en Cusipata',
                'Tickets de ingreso a Montaña de Colores Vinicunca',
                'Kit de primeros auxilios',
                'Asistencia durante el recorrido'
            ],
            notIncludes: [
                'Alimentos no mencionados',
                'Seguro de Viaje',
                'Propinas, Snack',
                'Caballo de Silla (si desea optar por caballo de silla el costo aproximado es de 120.00 Soles)'
            ]
            }
        ],

        includes: [
            'Información antes del día de su viaje',
            'Recojo de su hotel en el centro histórico',
            'Transporte Turistico',
            'Guia Profesional especializado en Trekking inglés- español',
            'Desayuno y Almuerzo Buffet en Cusipata',
            'Tickets de ingreso a Montaña de Colores Vinicunca',
            'Kit de primeros auxilios',
            'Asistencia durante el recorrido'
        ],

        notIncludes: [
            'Alimentos no mencionados',
            'Seguro de Viaje',
            'Propinas, Snack',
            'Caballo de Silla (si desea optar por caballo de silla el costo aproximado es de 120.00 Soles)'
        ],

        whatToBring: [
            'Zapatos cómodos de trekking',
            'Chaqueta, bufanda, guantes, gorro y gorra de abrigo',
            'Protector solar',
            'Gafas de sol',
            'Cámaras fotografias',
            'Snack o barras energeticas',
            'Poncho de lluvia (si viaja en temporada de lluvia)',
            'Mochila comoda',
            'Dinero extra para souvenirs y propinas'
        ],

        seoTitle: 'Tour Montaña de Colores Vinicunca Cusco',
        seoDescription:
            'Explora la Montaña de Colores Vinicunca en Cusco con trekking, desayuno y almuerzo incluidos, y vistas al nevado Ausangate.',

        isActive: true,
        isFeatured: true
        },

        {
        id: '17',
        title: 'Trekking a Waqrapukara Full Day',
        slug: 'trekking-waqrapukara-full-day',

        description:
            'El trekking a Waqrapukara es una experiencia única fuera de la ciudad, ideal para quienes buscan tranquilidad, naturaleza e historia. Esta impresionante fortaleza inca, cuyo nombre significa "fortaleza en forma de cuernos", está rodeada de templos y paisajes espectaculares a más de 4000 msnm, ofreciendo una conexión especial con la naturaleza y la cultura andina.',

        shortDescription:
            'Tour de un día a Waqrapukara con trekking, paisajes andinos y visita a la fortaleza.',

        price: 0,
        durationDays: 1,
        durationNights: 0,

        destinationName: 'Waqrapukara',
        destinationSlug: 'waqrapukara',

        location: 'Cusco',
        cities: ['Cusco', 'Cusipata', 'Acomayo'],

        imageUrl: '/images/cusco/waqrapukara.webp',

        gallery: [
            '/images/cusco/waqrapukara2.webp',
            '/images/cusco/waqrapukara4.webp',
            '/images/cusco/Waqrapukara3.webp',
        ],

        features: [
            'Trekking de un día',
            'Desayuno y almuerzo buffet',
            'Guía profesional',
            'Transporte turístico',
            'Ingreso incluido'
        ],

        highlights: [
            'Fortaleza de Waqrapukara',
            'Paisajes andinos',
            'Cañón del Apurímac',
            'Flora y fauna andina',
            'Construcciones incas'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Cusco – Cusipata – Waqrapukara – Cusco',
            description:
                'Salida temprano desde Cusco hacia Cusipata para desayuno buffet. Luego viaje hacia Santa Lucía y punto de inicio de la caminata. Caminata hacia Waqrapukara pasando por paisajes andinos y miradores. Visita guiada por la fortaleza y sus templos. Retorno por la misma ruta, almuerzo buffet en Cusipata y regreso a Cusco.',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Información un dia antes de su viaje',
                'Recojo de su hotel del centro histórico de Cusco',
                'Transporte turistico',
                'Guia turistico especialista en trekking',
                'Tickets de ingreso a centro arqueológico de Waqrapukara',
                'Desayuno y Almuerzo Buffet',
                'Botiquín de primeros auxilios',
                'Asistencia durante el viaje'
            ],
            notIncludes: [
                'Costos adicionales fuera del itinerario',
                'Snack, agua',
                'Seguros de viaje',
                'Propinas'
            ]
            }
        ],

        includes: [
            'Información un dia antes de su viaje',
            'Recojo de su hotel del centro histórico de Cusco',
            'Transporte turistico',
            'Guia turistico especialista en trekking',
            'Tickets de ingreso a centro arqueológico de Waqrapukara',
            'Desayuno y Almuerzo Buffet',
            'Botiquín de primeros auxilios',
            'Asistencia durante el viaje'
        ],

        notIncludes: [
            'Costos adicionales fuera del itinerario',
            'Snack, agua',
            'Seguros de viaje',
            'Propinas'
        ],

        whatToBring: [
            'Zapatos cómodos de trekking',
            'Chaqueta, bufanda, guantes, gorro y gorra de abrigo',
            'Protector solar',
            'Gafas de sol',
            'Cámaras fotografias',
            'Snack o barras energeticas',
            'Poncho de lluvia (si viaja en temporada de lluvia)',
            'Mochila comoda',
            'Dinero extra para souvenirs y propinas'
        ],

        seoTitle: 'Trekking Waqrapukara Full Day Cusco',
        seoDescription:
            'Descubre Waqrapukara en un trekking de un día desde Cusco con paisajes andinos, guía profesional y experiencia cultural única.',

        isActive: true,
        isFeatured: true
        }
        
        
        

];