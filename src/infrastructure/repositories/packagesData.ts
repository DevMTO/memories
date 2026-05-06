import type { Package } from '../../core/domain/models';

export const packagesData: Package[] = [
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
            "City tour en Lima",
            "Tour a Islas Ballestas",
            "Sandboarding y buggies",
            "Vuelo Lima - Cusco",
            "Visita a Maras",
            "Experiencia Mountain View",
            "Tren panorámico a Machu Picchu",
            "Tour guiado Machu Picchu",
            "Trekking Laguna Humantay",
            "Tour arqueológico Cusco"
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
            title: "Lima City Tour",
            description:
            "Recepción en aeropuerto, traslado a hotel y recorrido por Lima (centro histórico, Miraflores, Huaca Pucllana, San Francisco).",
            accommodations: "Hotel en Lima",
            meals: [],
            includes: [
            "Transporte turístico del aeropuerto internacional Jorge Chávez a su hotel asignado.",
            "Recojo de su hotel para el city tour (Miraflores, Barranco)",
            "Transporte Turístico",
            "Guia Bilingue (Español - Ingles)",
            "Tickets de Ingreso a Convento San Francisco",
            "Noche de hotel en Lima"
            ],
            notIncludes: [
            "Alimentos: Desayuno, Almuerzo y cena",
            "Costes adicionales o retrasos fuera de nuestro control",
            "Gastos extras",
            "Seguro de Viaje"
            ]
        },

        {
            day: 2,
            title: "Paracas + Ica + Huacachina",
            description:
            "Tour a Islas Ballestas, visita a viñedos y aventura en el desierto con sandboarding y buggies.",
            accommodations: "Hotel en Lima",
            meals: ["Desayuno"],
            includes: [
            "Desayuno - Box Breakfast en el hotel de Lima",
            "Transporte turístico",
            "Guia turistico  Ingles - Español",
            "Tour a Islas Ballestas (si la marina dá orden de marea alta visitaremos otra isla)",
            "Visita a una vitivinicola",
            "Actividades de Sandboarding y Buggies",
            "Noche de hotel en Lima"
            ],
            notIncludes: [
            "Alimentos: Almuerzo y cena",
            "Costes adicionales o retrasos fuera de nuestro control",
            "Gastos extras",
            "Seguro de Viaje"
            ]
        },

        {
            day: 3,
            title: "Vuelo a Cusco",
            description:
            "Traslado al aeropuerto y vuelo a Cusco, recepción y traslado al hotel.",
            accommodations: "Hotel en Cusco",
            meals: [],
            includes: [
            "Transporte turístico de hotel a aeropuerto en Lima",
            "Vuelo doméstico de Lima a Cusco",
            "Transporte turístico del aeropuerto hacia su hotel en el centro histórico de Cusco",
            "Noche de hotel en Cusco"
            ],
            notIncludes: [
            "Alimentos: Almuerzo y cena",
            "Costes adicionales o retrasos fuera de nuestro control",
            "Gastos extras",
            "Seguro de Viaje"
            ]
        },

        {
            day: 4,
            title: "Maras + Mountain View",
            description:
            "Visita a salineras y experiencia en cabañas con actividades.",
            accommodations: "Cabañas en Mountain View",
            meals: ["Desayuno", "Almuerzo"],
            includes: [
            "Desayuno en el hotel de Cusco",
            "Transporte turístico",
            "Guia turistico ingles - español",
            "Tickets de ingreso a Salineras de Maras",
            "Almuerzo en Mountain view",
            "Noche en cabañas en Mountain View"
            ],
            notIncludes: [
            "Alimentos: Cena",
            "Actividades extras durante el tour",
            "Seguro de viaje"
            ]
        },

        {
            day: 5,
            title: "Tren a Aguas Calientes",
            description:
            "Viaje en tren panorámico hacia Machu Picchu.",
            accommodations: "Hotel en Aguas Calientes",
            meals: ["Desayuno"],
            includes: [
            "Desayuno en Mountain View",
            "Transporte turístico de Mountain View a estación de tren en Ollantaytambo",
            "Tickets de tren Vistadome Observatory de Ollantaytambo a Aguas Calientes",
            "Noche de hotel en Aguas Calientes"
            ],
            notIncludes: [
            "Alimentos: Almuerzo y Cena",
            "Actividades extras",
            "Seguro de viaje",
            "Costes adicionales o retrasos fuera de nuestro control"
            ]
        },

        {
            day: 6,
            title: "Machu Picchu",
            description:
            "Tour guiado y retorno a Cusco.",
            accommodations: "Hotel en Cusco",
            meals: ["Desayuno"],
            includes: [
            "Desayuno o box breakfast en el hotel de Aguas Calientes",
            "Transporte turístico privado de la estación de Ollantaytambo hacia su hotel en Cusco",
            "Tickets de tren turístico expeditions o the voyager desde la estación de Aguas Calientes a Ollantaytambo.",
            "Tickets de bus de Aguas Calientes a Machu Picchu y retorno de Machu Picchu a Aguas Calientes.",
            "Tickets de ingreso a la Maravilla del mundo Machu Picchu.",
            "Guía turístico profesional",
            "Noche de hotel en Cusco"
            ],
            notIncludes: [
            "Tickets de ingreso a la montaña de Wayna Picchu o montaña de Machu Picchu",
            "Alimentos: Almuerzo y Cena",
            "Tickets de tren de retorno servicio Vistadome Observatory",
            "Ingreso a los baños termales de Aguas Calientes",
            "Seguro de Viaje",
            "Snack, propinas",
            "Costos extras fuera de nuestro control"
            ]
        },

        {
            day: 7,
            title: "Laguna Humantay",
            description:
            "Trekking hacia la laguna de aguas turquesas.",
            accommodations: "Hotel en Cusco",
            meals: ["Desayuno", "Almuerzo"],
            includes: [
            "Información antes del viaje",
            "Transporte turístico",
            "Guia profesional especializado en trekking",
            "Desayuno y Almuerzo",
            "Tickets de ingreso a la laguna de Humantay",
            "Un bastón de trekking",
            "Botiquín de primeros auxilios",
            "Asistencia durante el recorrido"
            ],
            notIncludes: [
            "Alimentos: Cena",
            "Snack, Propina",
            "Seguro de Viaje",
            "Caballo de Silla (el costo aproximado por caballo de silla es 120.00 soles)",
            "Costos extras fuera de nuestro control"
            ]
        },

        {
            day: 8,
            title: "City Tour Cusco",
            description:
            "Visita a Qoricancha, Sacsayhuamán y centros arqueológicos.",
            accommodations: "Hotel en Cusco",
            meals: ["Desayuno"],
            includes: [
            "Desayuno en el hotel de Cusco",
            "Guia turistico ingles - español",
            "Transporte turístico",
            "Tickets de ingreso al templo del sol Coricancha",
            "Tickets de ingreso a los 4 ruinas: Sacsayhuaman, Qenqo, Puca Pucara y Tambomachay",
            "Noche de hotel en Cusco"
            ],
            notIncludes: [
            "Alimentos: Almuerzo y Cena",
            "Snack, propinas",
            "Seguros de viaje",
            "Costos extras fuera de nuestro control"
            ]
        },

        {
            day: 9,
            title: "Fin del viaje",
            description:
            "Traslado al aeropuerto y vuelo de retorno.",
            accommodations: "",
            meals: ["Desayuno"],
            includes: [
            "Desayuno en el hotel de Cusco",
            "Transporte de Hotel a Aeropuerto en Cusco",
            "Vuelo doméstico de Cusco a Lima"
            ],
            notIncludes: [
            "Hotel en Lima",
            "Alimentos: Almuerzo y cena",
            "Seguros de viaje",
            "Costes adicionales o retrasos fuera de nuestro control"
            ]
        }
        ],
        

        includes: [
        "Transporte turístico del aeropuerto internacional Jorge Chávez a su hotel asignado.",
        "Recojo de su hotel para el city tour (Miraflores, Barranco)",
        "Transporte Turístico",
        "Guia Bilingue (Español - Ingles)",
        "Tickets de Ingreso a Convento San Francisco",
        "Noche de hotel en Lima",
        "Desayuno - Box Breakfast en el hotel de Lima",
        "Guia turistico Ingles - Español",
        "Tour a Islas Ballestas (si la marina dá orden de marea alta visitaremos otra isla)",
        "Visita a una vitivinicola",
        "Actividades de Sandboarding y Buggies",
        "Transporte turístico de hotel a aeropuerto en Lima",
        "Vuelo doméstico de Lima a Cusco",
        "Transporte turístico del aeropuerto hacia su hotel en el centro histórico de Cusco",
        "Noche de hotel en Cusco",
        "Desayuno en el hotel de Cusco",
        "Guia turistico ingles - español",
        "Tickets de ingreso a Salineras de Maras",
        "Almuerzo en Mountain view",
        "Noche en cabañas en Mountain View",
        "Desayuno en Mountain View",
        "Transporte turístico de Mountain View a estación de tren en Ollantaytambo",
        "Tickets de tren Vistadome Observatory de Ollantaytambo a Aguas Calientes",
        "Noche de hotel en Aguas Calientes",
        "Desayuno o box breakfast en el hotel de Aguas Calientes",
        "Transporte turístico privado de la estación de Ollantaytambo hacia su hotel en Cusco",
        "Tickets de tren turístico expeditions o the voyager desde la estación de Aguas Calientes a Ollantaytambo.",
        "Tickets de bus de Aguas Calientes a Machu Picchu y retorno de Machu Picchu a Aguas Calientes.",
        "Tickets de ingreso a la Maravilla del mundo Machu Picchu.",
        "Guía turístico profesional",
        "Información antes del viaje",
        "Guia profesional especializado en trekking",
        "Desayuno y Almuerzo",
        "Tickets de ingreso a la laguna de Humantay",
        "Un bastón de trekking",
        "Botiquín de primeros auxilios",
        "Asistencia durante el recorrido",
        "Tickets de ingreso al templo del sol Coricancha",
        "Tickets de ingreso a los 4 ruinas: Sacsayhuaman, Qenqo, Puca Pucara y Tambomachay",
        "Transporte de Hotel a Aeropuerto en Cusco",
        "Vuelo doméstico de Cusco a Lima"
        ],

        notIncludes: [
        "Alimentos: Desayuno, Almuerzo y cena",
        "Costes adicionales o retrasos fuera de nuestro control",
        "Gastos extras",
        "Seguro de Viaje",
        "Alimentos: Almuerzo y cena",
        "Alimentos: Almuerzo y cena",
        "Alimentos: Cena",
        "Actividades extras durante el tour",
        "Alimentos: Almuerzo y Cena",
        "Actividades extras",
        "Tickets de ingreso a la montaña de Wayna Picchu o montaña de Machu Picchu",
        "Tickets de tren de retorno servicio Vistadome Observatory",
        "Ingreso a los baños termales de Aguas Calientes",
        "Snack, propinas",
        "Costos extras fuera de nuestro control",
        "Alimentos: Cena",
        "Snack, Propina",
        "Caballo de Silla (el costo aproximado por caballo de silla es 120.00 soles)",
        "Alimentos: Almuerzo y Cena",
        "Snack, propinas",
        "Seguros de viaje",
        "Hotel en Lima",
        "Alimentos: Almuerzo y cena",
        "Seguros de viaje",
        "Costes adicionales o retrasos fuera de nuestro control"
        ],

        whatToBring: [
        "Pasaporte original y vigente a la fecha de viaje",
        "Mochila pequeña Portadores de agua como Camelbaks",
        "Botas de montaña cómodas",
        "Crema solar",
        "Crema hidratante para la cara",
        "Repelente de insectos",
        "Desinfectante de manos",
        "Toallitas húmedas",
        "Cepillo de dientes y pasta",
        "Papel higiénico",
        "Medicación personal",
        "Sombrero para el sol",
        "Ropa de lluvia",
        "Cámara de fotos",
        "Dinero extra para cualquier emergencia."
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
            { name: "Cusco", slug: "cusco" },
            { name: "Maras", slug: "maras" },
            { name: "Moray", slug: "moray" },
            { name: "Valle Sagrado", slug: "valle-sagrado" },
            { name: "Ollantaytambo", slug: "ollantaytambo" },
            { name: "Machu Picchu", slug: "machu-picchu" }
        ],

        imageUrl: ' ',
        gallery: [],

        features: [
            "City Tour en Cusco",
            "Visita a Maras y Moray",
            "Valle Sagrado de los Incas",
            "Viaje en tren turístico",
            "Ingreso a Machu Picchu",
            "Guía profesional bilingüe",
            "Hoteles incluidos"
        ],

        highlights: [
            "Disfruta de la ciudad de Cusco recorriendo sus calles auténticas",
            "Explora el Valle Sagrado rodeado de montañas",
            "Descubre Machu Picchu y su arquitectura milenaria",
            "Viaja en tren con vistas espectaculares",
            "Recorre Aguas Calientes y su entorno natural",
            "Conéctate con la historia y energía inca"
        ],

        itinerary: [
    {
        day: 1,
        title: "Bienvenido a Cusco - City Tour",
        description:
            "Recepción en el aeropuerto y traslado al hotel. Por la tarde visita al Qoricancha, Sacsayhuaman, Qenqo, Puca Pucara y Tambomachay.",
        accommodations: "Hotel en Cusco",
        meals: [],
        includes: [
            "Transporte turístico de Aeropuerto a Hotel en el centro histórico",
            "City Tour a los 4 atractivos turísticos",
            "Transporte turístico para el city tour",
            "Guia turistico ingles-español",
            "Tickets de ingreso al templo de Coricancha",
            "Tickets de ingreso a Sacsayhuaman, Qenqo, PucaPucara y Tambomachay",
            "Asistencia durante el recorrido",
            "Noche de hotel en Cusco"
        ],
        notIncludes: [
            "Desayuno, Almuerzo, Cena",
            "Costos extras",
            "Actividades extras durante el tour",
            "Vuelo nacional de lima a Cusco",
            "Seguro de viaje"
        ]
    },
    {
        day: 2,
        title: "Maras y Moray",
        description:
            "Visita a Moray y Salineras de Maras con parada en Chinchero.",
        accommodations: "Hotel en Cusco",
        meals: ["Desayuno"],
        includes: [
            "Desayuno en el hotel de Cusco",
            "Transporte turístico",
            "Guia turistico ingles - español",
            "Tickets de ingreso a Salineras de Maras",
            "Tickets de ingreso al centro arqueológico de Moray",
            "Visita a centro textil en Chinchero.",
            "Noche de hotel en Cusco"
        ],
        notIncludes: [
            "Desayuno, Almuerzo, Cena",
            "Costos extras",
            "Actividades extras durante el tour",
            "Seguro de viaje"
        ]
    },
    {
        day: 3,
        title: "Valle Sagrado",
        description:
            "Visita a Pisac, Urubamba y Ollantaytambo. Pernocte en Ollantaytambo.",
        accommodations: "Hotel en Ollantaytambo",
        meals: ["Desayuno", "Almuerzo"],
        includes: [
            "Desayuno en el hotel de Cusco",
            "Transporte Turístico",
            "Guia Turistico ingles - español",
            "Almuerzo Buffet en Urubamba",
            "Tickets de ingreso a centro arqueológico de Pisac",
            "Tickets de ingreso a centro arqueológico de Ollantaytambo",
            "Noche de hotel en Ollantaytambo"
        ],
        notIncludes: [
            "Gastos extras",
            "Actividades extras durante el tour",
            "Seguros de viaje"
        ]
    },
    {
        day: 4,
        title: "Machu Picchu",
        description:
            "Viaje en tren, visita guiada a Machu Picchu y retorno a Cusco.",
        accommodations: "Hotel en Cusco",
        meals: ["Desayuno"],
        includes: [
            "Desayuno o box breakfast en el hotel de Ollantaytambo",
            "Transporte turístico privado de la estación de Ollantaytambo hacia su hotel en Cusco",
            "Tickets de tren turístico servicio expeditions o the voyager desde la estación de Ollantaytambo hacia Aguas Calientes y retorno",
            "Tickets de bus de Aguas Calientes a Machu Picchu y retorno de Machu Picchu a Aguas Calientes",
            "Tickets de ingreso a la Maravilla del mundo Machu Picchu",
            "Guía turístico profesional"
        ],
        notIncludes: [
            "Tickets de ingreso a la montaña de Wayna Picchu o montaña de Machu Picchu",
            "Alimentos: Almuerzo y Cena",
            "Tickets de tren servicio Vistadome Observatory",
            "Ingreso a los baños termales de Aguas Calientes",
            "Seguro de Viaje",
            "Snack, propinas",
            "Costos extras fuera de nuestro control"
        ]
    },
    {
        day: 5,
        title: "Retorno Cusco - Lima",
        description:
            "Traslado al aeropuerto según horario de vuelo.",
        accommodations: "",
        meals: ["Desayuno"],
        includes: [
            "Desayuno en el hotel de Cusco",
            "Transporte turístico de hotel hacia aeropuerto de Cusco"
        ],
        notIncludes: [
            "Vuelos internacionales",
            "Vuelos Nacionales de Cusco a Lima",
            "Seguros de Viaje y propinas"
        ]
    }
],

    includes: [
        "Transporte turístico de Aeropuerto a Hotel en el centro histórico",
        "City Tour a los 4 atractivos turísticos",
        "Transporte turístico para el city tour",
        "Guia turistico ingles-español",
        "Tickets de ingreso al templo de Coricancha",
        "Tickets de ingreso a Sacsayhuaman, Qenqo, Puca Pucara y Tambomachay",
        "Asistencia durante el recorrido",
        "Noche de hotel en Cusco",
        "Desayuno en el hotel de Cusco",
        "Transporte turístico",
        "Guia turistico ingles - español",
        "Tickets de ingreso a Salineras de Maras",
        "Tickets de ingreso al centro arqueológico de Moray",
        "Visita a centro textil en Chinchero",
        "Transporte Turístico",
        "Guia Turistico ingles - español",
        "Almuerzo Buffet en Urubamba",
        "Tickets de ingreso a centro arqueológico de Pisac",
        "Tickets de ingreso a centro arqueológico de Ollantaytambo",
        "Noche de hotel en Ollantaytambo",
        "Desayuno o box breakfast en el hotel de Ollantaytambo",
        "Transporte turístico privado de la estación de Ollantaytambo hacia su hotel en Cusco",
        "Tickets de tren turístico servicio expeditions o the voyager",
        "Tickets de bus de Aguas Calientes a Machu Picchu y retorno",
        "Tickets de ingreso a Machu Picchu",
        "Guía turístico profesional",
        "Transporte turístico de hotel hacia aeropuerto de Cusco"
    ],

    notIncludes: [
        "Desayuno, Almuerzo, Cena",
        "Costos extras",
        "Actividades extras durante el tour",
        "Vuelo nacional de lima a Cusco",
        "Seguro de viaje",
        "Gastos extras",
        "Seguros de viaje",
        "Tickets de ingreso a la montaña de Wayna Picchu o montaña de Machu Picchu",
        "Alimentos: Almuerzo y Cena",
        "Tickets de tren servicio Vistadome Observatory",
        "Ingreso a los baños termales de Aguas Calientes",
        "Snack, propinas",
        "Costos extras fuera de nuestro control",
        "Vuelos internacionales",
        "Vuelos Nacionales de Cusco a Lima",
        "Seguros de Viaje y propinas"
    ],

    whatToBring: [
        "Pasaporte original y vigente",
        "Mochila pequeña",
        "Botas de montaña cómodas",
        "Protector solar",
        "Crema hidratante",
        "Repelente de insectos",
        "Desinfectante de manos",
        "Toallitas húmedas",
        "Artículos de higiene",
        "Sombrero",
        "Ropa de lluvia",
        "Cámara de fotos",
        "Dinero extra"
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
        slug: 'peru-aventureo-13-dias-12-noches',

        description: `Vive una aventura increíble en Perú recorriendo sus lugares más atractivos en 13 días y 12 noches, descubre la gran diversidad de flora y fauna, en el desierto en Huacachina vive una aventura en los paseos en Buggies y Sandboarding y disfruta desde el espacio los geoglifos de líneas de Nazca.

        En su visita a Puno explora las islas de flotantes de Uros y Taquile navegando por el lago Titicaca, considerado el lago navegable más alto del mundo, Los andes peruanos están rodeados de una inmensidad de cadena de montañas que a lo largo de los años estas se van convirtiendo en destinos preferidos por los viajeros; En su visita a la ciudad imperial de Cusco descubrirás la majestuosidad de sus calles, templos y sus centros arqueológicos que te conectaran de manera automática con la cultura inca, este viaje será aún más increíble ya que descubrirás Machu Picchu visitando sus lugares más importantes plazas, templos y terrazas; ¿estas listo para unirte a esta aventura?`,

        shortDescription: "Descubre Perú en 13 días: Lima, Nazca, Arequipa, Puno y Cusco con Machu Picchu.",

        price: 0,
        durationDays: 13,
        durationNights: 12,

        destinations: [
            { name: "Lima", slug: "lima" },
            { name: "Paracas", slug: "paracas" },
            { name: "Ica", slug: "ica" },
            { name: "Nazca", slug: "nazca" },
            { name: "Arequipa", slug: "arequipa" },
            { name: "Puno", slug: "puno" },
            { name: "Cusco", slug: "cusco" },
            { name: "Machu Picchu", slug: "machu-picchu" }
        ],

        imageUrl: ' ',
        gallery: [],

        features: [
            "13 días / 12 noches de aventura completa",
            "Recorrido por Lima, Paracas, Ica, Nazca, Arequipa, Puno y Cusco",
            "Sobrevuelo a las Líneas de Nazca",
            "Experiencia en Buggies y Sandboarding en Huacachina",
            "Tour completo en Lago Titicaca (Uros y Taquile)",
            "Ruta del Sol Puno - Cusco con paradas turísticas",
            "City tours guiados en Lima, Arequipa y Cusco",
            "Excursión al Cañón del Colca",
            "Visita al Valle Sagrado de los Incas",
            "Tour completo a Machu Picchu con tren y bus",
            "Guías profesionales bilingües (español - inglés)",
            "Alojamiento incluido durante todo el viaje",
            "Transportes turísticos y traslados incluidos",
            "Entradas a todos los atractivos turísticos principales",
            "Ideal para viajeros que buscan aventura y cultura en un solo paquete"
        ],

        highlights: [
            "Disfrute de Lima, recorriendo sus parques y lugares turísticos",
            "Explora la costa peruana y navega por el mar peruano",
            "Visita las islas ballestas y descubre la flora y fauna marina",
            "Participa en las actividades de Buggies y sandboard en Huacachina",
            "Conoce la ciudad histórica de Cusco",
            "Explora el valle sagrado de los incas rodeado de montañas y valles andinos",
            "Conoce la historia de los incas durante su visita a los atractivos turísticos",
            "Descubre la historia y majestuosidad de la maravilla del mundo Machu Picchu",
            "Recorre sus templos, plazas, recintos y andenerías de la maravilla del mundo Machu Picchu"
        ],

        itinerary: [
            {
                day: 1,
                title: "BIENVENIDO A PERÚ - DISFRUTE DE LIMA",
                description: "Bienvenido a Perú, le recibiremos en el aeropuerto internacional de Jorge Chávez a la hora de su llegada, un transporte asignado estará esperando por usted para lo cual solicitamos que nos envíe con anticipación el número y hora de vuelo, así mismo estaremos en constante comunicación para cualquier consulta. El transporte le trasladará hasta el distrito de Miraflores para que se instale en su hotel asignado con anticipación.\n\nPor la tarde disfrute de la capital donde puede optar por ir a cenar o recorrer los lugares más importantes y cercanos a su hotel como el Larco Miraflores, el Parque Kenedy entre otros, pero si usted llega por la mañana y quiere realizar un tour por la tarde no dude en consultar más opciones.",
                accommodations: "Hotel en Lima",
                includes: [
                "Transporte turístico del aeropuerto internacional Jorge Chávez a su hotel asignado.",
                "Noche de hotel en Lima"
                ],
                notIncludes: [
                "Alimentos: Desayuno, Almuerzo y cena",
                "Costes adicionales o retrasos fuera de nuestro control",
                "Gastos extras",
                "Seguro de Viaje"
                ]
            },
            {
                day: 2,
                title: "TOUR ISLAS BALLESTAS + VITIVINÍCOLA Y AVENTURA EN HUACACHINA",
                description: "Iniciamos este dia muy temprano aproximadamente 5:00 am",
                includes: [
                "Desayuno - Box Breakfast en el hotel de Lima",
                "Transporte turístico",
                "Guia turistico Ingles - Español",
                "Tour a Islas Ballestas (si la marina dá orden de marea alta visitaremos otra isla)",
                "Visita a una vitivinicola",
                "Actividades de Sandboarding y Buggies",
                "Tickets de bus de Ica a Nazca",
                "Transporte de estación de bus de Nazca a hotel en Nazca",
                "Noche de hotel en Nazca"
                ],
                notIncludes: [
                "Alimentos: Almuerzo y cena",
                "Costes adicionales o retrasos fuera de nuestro control",
                "Gastos extras",
                "Seguro de Viaje"
                ]
            },
            {
                day: 3,
                title: "SOBREVUELO LINEAS DE NAZCA - VIAJE EN BUS A AREQUIPA",
                description: "Por la mañana pasaremos por su hotel aproximadamente 8:00am... (texto completo)",
                includes: [
                "Desayuno en el hotel de Nazca",
                "Transporte y Guia turistico para el sobrevuelo",
                "Sobrevuelo de Líneas de Nazca",
                "Tickets de bus de Nazca a Arequipa",
                "Transporte de hotel a estación de bus en Nazca",
                "Transporte de estación de bus de Nazca a hotel en Arequipa",
                "Noche de hotel en Arequipa"
                ],
                notIncludes: [
                "Alimentos: Almuerzo y cena",
                "Costes adicionales o retrasos fuera de nuestro control",
                "Gastos extras",
                "Seguro de Viaje"
                ]
            },
            {
                day: 4,
                title: "DISFRUTA DE AREQUIPA - CITY TOUR POR LA TARDE",
                description: "Desayune en el hotel por la mañana... (texto completo)",
                includes: [
                "Desayuno en el hotel de Arequipa",
                "Guia turistico para el city tour",
                "Tickets de ingreso al mirador turístico",
                "Noche de hotel en Arequipa"
                ],
                notIncludes: [
                "Alimentos: Almuerzo y cena",
                "Costes adicionales o retrasos fuera de nuestro control",
                "Gastos extras",
                "Seguro de Viaje"
                ]
            },
            {
                day: 5,
                title: "TOUR A CAÑON DE COLCA Y MIRADOR DE 3 CRUCES EN FULL DAY",
                description: "Listos para esta aventura?... (texto completo)",
                includes: [
                "Transporte Turístico",
                "Guia turistico Bilingue (Español - Ingles)",
                "Desayuno y Almuerzo en Chivay",
                "Tickets de Ingreso a Cañón de Colca",
                "Tickets de Ingreso a Aguas Termales en Chivay",
                "Noche de Hotel en Arequipa"
                ],
                notIncludes: [
                "Alimentos: Cena",
                "Costos extras adicionales no incluidos en el programa",
                "Seguro de Viaje",
                "Propinas"
                ]
            },
            {
                day: 6,
                title: "VIAJE EN BUS DE AREQUIPA A PUNO",
                description: "Disfrute del desayuno en el hotel de Arequipa... (texto completo)",
                includes: [
                "Desayuno en el hotel de Arequipa",
                "Transporte Turístico de hotel a estación de bus en Arequipa",
                "Tickets de Bus de Arequipa a Puno",
                "Transporte turístico de estación de bus a hotel en Puno",
                "Noche de hotel en Puno"
                ],
                notIncludes: [
                "Alimentos: Almuerzo y Cena",
                "Costos extras adicionales no incluidos en el programa",
                "Seguro de Viaje",
                "Propinas"
                ]
            },
            {
                day: 7,
                title: "TOUR A LAS ISLAS FLOTANTES DE UROS Y TAQUILE EN FULL DAY",
                description: "Lo recogemos de su hotel temprano aproximadamente 6:40 am... (texto completo)",
                includes: [
                "Desayuno en el hotel de Puno",
                "Transporte Fluvial Turístico",
                "Guia Bilingue (Español - Ingles)",
                "Almuerzo en Taquile",
                "Tickets de Ingreso a la Isla de Uros",
                "Tickets de Ingreso a la isla de Taquile",
                "Noche de hotel en Puno"
                ],
                notIncludes: [
                "Gastos Extras, propinas",
                "Seguro de Viaje",
                "Actividades extras en las islas",
                "Costos extras adicionales no incluidos en el programa"
                ]
            },
            {
                day: 8,
                title: "RUTA DEL SOL PUNO - CUSCO",
                description: "Es momento de despedirse de la hermosa ciudad de Puno... (texto completo)",
                includes: [
                "Desayuno-box breakfast en el hotel de Puno",
                "Transporte de su hotel a la estación de Bus",
                "Bus turístico de Puno a Cusco",
                "Visita a museo de sitio en Pucará",
                "Tickets de ingreso a centro arqueológico de Raqchi",
                "Tickets de ingreso a la capilla de Andahuaylillas",
                "Almuerzo Buffet",
                "Traslado de estación de Bus a su hotel en Cusco",
                "Noche de hotel en Cusco"
                ],
                notIncludes: [
                "Alimentos: Cena",
                "Seguro de Viaje",
                "Propinas, Snack",
                "Costos extras fuera de nuestro control"
                ]
            },
            {
                day: 9,
                title: "WALKING TOUR CUSCO",
                description: "Disfrute de su primer desayuno en la ciudad de Cusco... (texto completo)",
                includes: [
                "Desayuno en el hotel de Cusco",
                "Walking tour por la ciudad de Cusco",
                "Guia Turistico",
                "Noche de hotel en Cusco"
                ],
                notIncludes: [
                "Alimentos: Almuerzo y Cena",
                "Seguro de Viaje",
                "Propinas, Snack",
                "Costos extras fuera de nuestro control"
                ]
            },
            {
                day: 10,
                title: "VALLE SAGRADO - NOCHE EN OLLANTAYTAMBO",
                description: "Temprano lo recogemos de su hotel... (texto completo)",
                includes: [
                "Desayuno en el hotel de Cusco",
                "Transporte Turístico",
                "Guia Turistico ingles - español",
                "Almuerzo Buffet en Urubamba",
                "Tickets de ingreso a centro arqueológico de Pisac",
                "Tickets de ingreso a centro arqueológico de Ollantaytambo",
                "Noche de hotel en Ollantaytambo"
                ],
                notIncludes: [
                "Alimentos: Cena",
                "Gastos extras, propinas",
                "Actividades extras durante el tour",
                "Seguros de viaje"
                ]
            },
            {
                day: 11,
                title: "MACHU PICCHU - RETORNO A CUSCO",
                description: "Por la mañana deberá dirigirse hasta la estación... (texto completo)",
                includes: [
                "Desayuno o box breakfast en el hotel de Ollantaytambo",
                "Transporte turístico privado de la estación de Ollantaytambo hacia su hotel en Cusco",
                "Tickets de tren turístico servicio expeditions o the voyager",
                "Tickets de bus de Aguas Calientes a Machu Picchu",
                "Tickets de ingreso a Machu Picchu",
                "Guía turístico profesional",
                "Noche de hotel en Cusco"
                ],
                notIncludes: [
                "Tickets de ingreso a la montaña Wayna Picchu",
                "Alimentos: Almuerzo y Cena",
                "Tickets de tren Vistadome",
                "Ingreso a baños termales",
                "Seguro de Viaje",
                "Snack, propinas",
                "Costos extras fuera de nuestro control"
                ]
            },
            {
                day: 12,
                title: "MARAS & MORAY",
                description: "Por la mañana le recogeremos de su hotel... (texto completo)",
                includes: [
                "Desayuno en el hotel de Cusco",
                "Transporte turístico",
                "Guia turistico ingles - español",
                "Tickets de ingreso a Salineras de Maras",
                "Tickets de ingreso a Moray",
                "Visita a centro textil en Chinchero",
                "Noche de hotel en Cusco"
                ],
                notIncludes: [
                "Desayuno, Almuerzo, Cena",
                "Costos extras",
                "Actividades extras durante el tour",
                "Seguro de viaje"
                ]
            },
            {
                day: 13,
                title: "VUELO CUSCO - LIMA",
                description: "Es momento de despedirnos... (texto completo)",
                includes: [
                "Desayuno en el hotel de Cusco",
                "Transporte de Hotel a Aeropuerto en Cusco",
                "Vuelo doméstico de Cusco a Lima"
                ],
                notIncludes: [
                "Vuelos internacionales",
                "Vuelos Nacionales de Cusco a Lima",
                "Seguros de Viaje y propinas"
                ]
            }
            ],

        includes: [
            'Hoteles durante todo el recorrido (12 noches: Lima, Nazca, Arequipa, Puno, Cusco y Ollantaytambo)',
            'Traslados turísticos (aeropuerto, hoteles, estaciones y tours)',
            'Transporte terrestre completo entre destinos (Lima – Paracas – Ica – Nazca – Arequipa – Puno – Cusco)',
            'Tickets de bus entre ciudades',
            'Transporte fluvial en Lago Titicaca',
            'Tren turístico ida y retorno Ollantaytambo – Aguas Calientes',
            'Bus de subida y bajada a Machu Picchu',
            'Tours guiados bilingües (español – inglés)',
            'Entradas a todos los atractivos turísticos según itinerario',
            'Sobrevuelo a las Líneas de Nazca',
            'Tour a Islas Ballestas',
            'Actividades de aventura (Sandboarding y Buggies en Huacachina)',
            'Tour al Cañón del Colca',
            'Tour Lago Titicaca (Uros y Taquile)',
            'Tour Ruta del Sol (Pucará, Raqchi, Andahuaylillas)',
            'Tour Valle Sagrado de los Incas',
            'Ingreso a Machu Picchu',
            'Tour a Maras y Moray',
            'Walking tour en Cusco',
            'Alimentación parcial (desayunos en hoteles, 1 box breakfast y almuerzos en Chivay, Taquile, Valle Sagrado y Ruta del Sol)',
            'Vuelo doméstico Cusco – Lima'
        ],

        notIncludes: [
            'Vuelos internacionales',
            'Hotel en Lima al final del viaje',
            'Almuerzos y cenas no especificados en el itinerario',
            'Seguro de viaje',
            'Ingreso a la montaña Wayna Picchu o Montaña Machu Picchu',
            'Tren categoría superior (Vistadome Observatory)',
            'Ingreso a baños termales en Aguas Calientes',
            'Actividades opcionales o extras durante los tours',
            'Gastos personales (snacks, compras, etc.)',
            'Propinas',
            'Costos adicionales o retrasos del control de la agencia'
        ],

        whatToBring: [
            "Pasaporte original y vigente a la fecha de viaje",
            "Mochila pequeña Portadores de agua como Camelbaks",
            "Botas de montaña cómodas",
            "Crema solar",
            "Crema hidratante para la cara",
            "Repelente de insectos",
            "Desinfectante de manos",
            "Toallitas húmedas",
            "Cepillo de dientes y pasta",
            "Papel higiénico",
            "Medicación personal",
            "Sombrero para el sol",
            "Ropa de lluvia",
            "Cámara de fotos",
            "Dinero extra para cualquier emergencia"
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
            { name: "Cusco", slug: "cusco" },
            { name: "Ollantaytambo", slug: "ollantaytambo" },
            { name: "Machu Picchu", slug: "machu-picchu" },
            { name: "Puno", slug: "puno" }
        ],

        imageUrl: ' ',
        gallery: [],

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
                'Transporte Turístico',
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
            "Transporte turístico de Aeropuerto a Hotel en el centro histórico",
            "City Tour a los 4 atractivos turísticos",
            "TRansporte turístico para el city tour",
            "Guia turistico ingles-español",
            "Tickets de ingreso al templo de Coricancha",
            "Tickets de ingreso a Sacsayhuaman, Qenqo, Puca Pucará y Tambomachay",
            "Asistencia durante el recorrido",
            "Noche de hotel en Cusco",
            "Desayuno en el hotel de Cusco",
            "Transporte Turístico",
            "Almuerzo Buffet en Urubamba",
            "Tickets de ingreso a centro arqueológico de Pisac",
            "Tickets de ingreso a centro arqueológico de Ollantaytambo",
            "Noche de hotel en Ollantaytambo",
            "Desayuno o box breakfast",
            "Tickets de tren turístico",
            "Tickets de bus a Machu Picchu",
            "Tickets de ingreso a Machu Picchu",
            "Guía profesional",
            "Tour Montaña de Colores",
            "Ruta del Sol",
            "Tour Lago Titicaca",
            "Transporte fluvial",
            "Almuerzo en Taquile",
            "Traslados finales"
        ],

         notIncludes: [
            "Desayuno, Almuerzo, Cena no especificados",
            "Costos extras",
            "Actividades extras",
            "Seguro de viaje",
            "Vuelo nacional Lima - Cusco",
            "Ingreso Wayna Picchu",
            "Ingreso baños termales",
            "Snacks",
            "Propinas",
            "Hotel en Lima",
            "Vuelo Juliaca - Lima"
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
        slug: 'viaje-inolvidable-en-peru-de-10-dias-09-noches-servicio-privado',

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

        imageUrl: ' ',
        gallery: [],

        features: [
            'Hoteles incluidos',
            'Vuelos domésticos',
            'Tours privados',
            'Traslados turísticos',
            'Entradas incluidas'
        ],

        highlights: [
            "Disfrute de Lima, recorriendo sus parques y lugares turísticos",
            "Explora la costa peruana y navega por el mar peruano",
            "Disfruta de las actividades de aventura en Paracas y Huacachina",
            "Disfruta del ocaso y atardecer en el desierto de Huacachina",
            "Conoce la ciudad histórica de Cusco",
            "Explora el valle sagrado de los incas rodeado de montañas y valles andinos",
            "Conoce la historia de los incas durante su visita a los atractivos turísticos",
            "Descubre la historia y majestuosidad de la maravilla del mundo Machu Picchu",
            "Recorre sus templos, plazas, recintos y andenerías de la maravilla del mundo Machu Picchu",
            "Vive la experiencia de ascender a altitudes altas en tu recorrido a la montaña de Colores y Laguna de Humantay."
        ],

        itinerary: [
            {
            day: 1,
            title: "Bienvenido a Lima - City Tour",
            description: "Llegada a Lima, traslado a hotel y recorrido por el centro histórico, Huaca Pucllana, San Francisco y Miraflores.",
            accommodations: "Hotel en Lima",
            meals: [],
            includes: [
                "Transporte turístico privado del aeropuerto internacional Jorge Chávez a su hotel asignado.",
                "Recojo de su hotel para el city tour (Miraflores, Barranco)",
                "Transporte Turístico privado para el tour",
                "Guia privado",
                "Tickets de Ingreso a Convento San Francisco",
                "Noche de hotel en Lima"
            ],
            notIncludes: [
                "Alimentos: Desayuno, Almuerzo y cena",
                "Costes adicionales o retrasos fuera de nuestro control",
                "Gastos extras",
                "Seguro de Viaje"
            ]
            },
            {
            day: 2,
            title: "Paracas, Ica y Huacachina",
            description: "Viaje a Paracas, Islas Ballestas, viñedos en Ica y aventura en Huacachina con buggies y sandboard.",
            accommodations: "Hotel en Lima",
            meals: [],
            includes: [
                "Recojo de su hotel",
                "Transporte Turístico privado",
                "Guia turistico privado",
                "Tickets de Ingreso a Islas Ballestas, Viñedo y Huacachina",
                "Actividades de Buggies",
                "Actividad de Sandboarding",
                "Noche de Hotel en Lima"
            ],
            notIncludes: [
                "Alimentos: Almuerzo y Cena",
                "Gastos Extras y propinas",
                "Seguro de Viaje",
                "Costes adicionales o retrasos fuera de nuestro control"
            ]
            },
            {
            day: 3,
            title: "Vuelo a Cusco - Valle Sagrado",
            description: "Vuelo a Cusco, traslado al Valle Sagrado con paradas culturales.",
            accommodations: "Hotel en Valle Sagrado",
            meals: [],
            includes: [
                "Transporte turístico privado de hotel a aeropuerto en Lima",
                "Vuelo doméstico de Lima a Cusco",
                "Transporte turístico privado del aeropuerto hacia su hotel en el Valle Sagrado de los Incas",
                "Guia turistico privado",
                "Visita a Sonidos del Ande en Pisaq",
                "Noche de hotel en Valle Sagrado"
            ],
            notIncludes: [
                "Alimentos: Almuerzo y cena",
                "Costes adicionales o retrasos fuera de nuestro control",
                "Gastos extras",
                "Seguro de Viaje"
            ]
            },
            {
            day: 4,
            title: "Machu Picchu",
            description: "Viaje en tren, visita guiada a Machu Picchu y retorno.",
            accommodations: "Hotel en Valle Sagrado",
            meals: ["Desayuno"],
            includes: [
                "Desayuno o box breakfast en el hotel de Valle Sagrado",
                "Transporte turístico de su hotel hacia la estación de tren en Ollantaytambo",
                "Tickets de tren Vistadome Observatory desde la estación de Ollantaytambo hacia Aguas Calientes",
                "Tickets de tren expedition o the voyager de Aguas Calientes a la estación en Ollantaytambo",
                "Tickets de bus de Aguas Calientes a Machu Picchu y retorno de Machu Picchu a Aguas Calientes.",
                "Tickets de ingreso a la Maravilla del mundo Machu Picchu.",
                "Guía turístico privado profesional",
                "Transporte turístico privado de la estación de Ollantaytambo hacia su hotel en Valle Sagrado",
                "Noche de hotel en Valle Sagrado"
            ],
            notIncludes: [
                "Tickets de ingreso a la montaña de Wayna Picchu o montaña de Machu Picchu (consultar disponibilidad de requerir este tickets)",
                "Alimentos: Almuerzo y Cena",
                "Tickets de tren servicio Vistadome Observatory",
                "Ingreso a los baños termales de Aguas Calientes",
                "Seguro de Viaje",
                "Snack, propinas",
                "Costos extras fuera de nuestro control"
            ]
            },
            {
            day: 5,
            title: "Maras y Moray",
            description: "Visita a Moray, salineras de Maras y retorno a Cusco.",
            accommodations: "Hotel en Cusco",
            meals: ["Desayuno"],
            includes: [
                "Desayuno en el hotel de Valle Sagrado",
                "Transporte turístico privado",
                "Guia turistico privado",
                "Tickets de ingreso a Salineras de Maras",
                "Tickets de ingreso al centro arqueológico de Moray",
                " Visita a centro textil en Chinchero.",
                "Noche de hotel en Cusco"
            ],
            notIncludes: [
                "Desayuno, Almuerzo, Cena",
                "Costos extras",
                "Actividades extras durante el tour",
                "Seguro de viaje"
            ]
            },
            {
            day: 6,
            title: "City Tour Cusco",
            description: "Recorrido por Qoricancha y sitios arqueológicos cercanos.",
            accommodations: "Hotel en Cusco",
            meals: ["Desayuno"],
            includes: [
                "Desayuno en el hotel de Cusco",
                "Guia turistico privado",
                "Transporte turístico privado",
                "Tickets de ingreso al templo del sol Qoricancha",
                "Tickets de ingreso a los 4 ruinas: Sacsayhuaman, Qenqo, Puca Pucara y Tambomachay",
                "Noche de hotel en Cusco"
            ],
            notIncludes: [
                "Alimentos: Almuerzo y Cena",
                "Snack, propinas",
                "Seguros de viaje",
                "Costos extras fuera de nuestro control"
            ]
            },
            {
            day: 7,
            title: "Montaña de Colores",
            description: "Trekking a Vinicunca con desayuno y almuerzo.",
            accommodations: "Hotel en Cusco",
            meals: ["Desayuno", "Almuerzo"],
            includes: [
                "Recojo de su hotel en el centro histórico",
                "Transporte Turístico privado",
                "Guia turistico privado especializado en Trekking",
                "Desayuno y Almuerzo Buffet en Cusipata",
                "Tickets de ingreso a Montaña de Colores Vinicunca",
                "Kit de primeros auxilios",
                "Asistencia durante el recorrido",
                "Noche de hotel en Cusco"
            ],
            notIncludes: [
                "Alimentos: Cena",
                "Seguro de Viaje",
                "Propinas, Snack",
                "Caballo de Silla (si desea optar por caballo de silla el costo aproximado es de 120.00 Soles)",
                "Costos extras fuera de nuestro control"
            ]
            },
            {
            day: 8,
            title: "Laguna Humantay",
            description: "Trekking a la laguna con vistas al nevado Salkantay.",
            accommodations: "Hotel en Cusco",
            meals: ["Desayuno", "Almuerzo"],
            includes: [
                "Información antes del viaje",
                "Transporte turístico privado",
                "Guia privado especializado en trekking",
                "Desayuno y Almuerzo",
                "Tickets de ingreso a la laguna de Humantay",
                "Un bastón de trekking",
                "Botiquín de primeros auxilios",
                "Asistencia durante el recorrido"
            ],
            notIncludes: [
                "Alimentos: Cena",
                "Snack, Propina",
                "Seguro de Viaje",
                "Caballo de Silla (el costo aproximado por caballo de silla es 120.00 soles)",
                "Costos extras fuera de nuestro control"
            ]
            },
            {
            day: 9,
            title: "Día libre Cusco",
            description: "Día libre para explorar Cusco.",
            accommodations: "Hotel en Cusco",
            meals: ["Desayuno"],
            includes: [
                "Desayuno en el hotel de Cusco",
                "Noche de hotel en Cusco"
            ],
            notIncludes: [
                "Alimentos: Almuerzo y Cena",
                "Snack, Propina",
                "Seguro de Viaje",
                "Caballo de Silla (el costo aproximado por caballo de silla es 120.00 soles)"
            ]
            },
            {
            day: 10,
            title: "Vuelo a Lima",
            description: "Traslado al aeropuerto y vuelo a Lima.",
            accommodations: "",
            meals: ["Desayuno"],
            includes: [
                "Desayuno en el hotel de Cusco",
                "Transporte de Hotel a Aeropuerto en Cusco",
                "Vuelo doméstico de Cusco a Lima"
            ],
            notIncludes: [
                "Hotel en Lima",
                "Alimentos: Almuerzo y cena",
                "Seguros de viaje",
                "Costes adicionales o retrasos fuera de nuestro control"
            ]
            }
        ],

        includes: [
            "Transporte turístico privado del aeropuerto internacional Jorge Chávez a su hotel asignado.",
            "Recojo de su hotel para el city tour (Miraflores, Barranco)",
            "Transporte Turístico privado para el tour",
            "Guia privado",
            "Tickets de Ingreso a Convento San Francisco",
            "Noche de hotel en Lima",

            "Recojo de su hotel",
            "Transporte Turístico privado",
            "Guia turistico privado",
            "Tickets de Ingreso a Islas Ballestas, Viñedo y Huacachina",
            "Actividades de Buggies",
            "Actividad de Sandboarding",
            "Noche de Hotel en Lima",

            "Transporte turístico privado de hotel a aeropuerto en Lima",
            "Vuelo doméstico de Lima a Cusco",
            "Transporte turístico privado del aeropuerto hacia su hotel en el Valle Sagrado de los Incas",
            "Guia turistico privado",
            "Visita a Sonidos del Ande en Pisaq",
            "Noche de hotel en Valle Sagrado",

            "Desayuno o box breakfast en el hotel de Valle Sagrado",
            "Transporte turístico de su hotel hacia la estación de tren en Ollantaytambo",
            "Tickets de tren Vistadome Observatory desde la estación de Ollantaytambo hacia Aguas Calientes",
            "Tickets de tren expedition o the voyager de Aguas Calientes a la estación en Ollantaytambo",
            "Tickets de bus de Aguas Calientes a Machu Picchu y retorno de Machu Picchu a Aguas Calientes.",
            "Tickets de ingreso a la Maravilla del mundo Machu Picchu.",
            "Guía turístico privado profesional",
            "Transporte turístico privado de la estación de Ollantaytambo hacia su hotel en Valle Sagrado",
            "Noche de hotel en Valle Sagrado",

            "Desayuno en el hotel de Valle Sagrado",
            "Transporte turístico privado",
            "Guia turistico privado",
            "Tickets de ingreso a Salineras de Maras",
            "Tickets de ingreso al centro arqueológico de Moray",
            " Visita a centro textil en Chinchero.",
            "Noche de hotel en Cusco",

            "Desayuno en el hotel de Cusco",
            "Guia turistico privado",
            "Transporte turístico privado",
            "Tickets de ingreso al templo del sol Qoricancha",
            "Tickets de ingreso a los 4 ruinas: Sacsayhuaman, Qenqo, Puca Pucara y Tambomachay",
            "Noche de hotel en Cusco",

            "Recojo de su hotel en el centro histórico",
            "Transporte Turístico privado",
            "Guia turistico privado especializado en Trekking",
            "Desayuno y Almuerzo Buffet en Cusipata",
            "Tickets de ingreso a Montaña de Colores Vinicunca",
            "Kit de primeros auxilios",
            "Asistencia durante el recorrido",
            "Noche de hotel en Cusco",

            "Información antes del viaje",
            "Transporte turístico privado",
            "Guia privado especializado en trekking",
            "Desayuno y Almuerzo",
            "Tickets de ingreso a la laguna de Humantay",
            "Un bastón de trekking",
            "Botiquín de primeros auxilios",
            "Asistencia durante el recorrido",

            "Desayuno en el hotel de Cusco",
            "Noche de hotel en Cusco",

            "Desayuno en el hotel de Cusco",
            "Transporte de Hotel a Aeropuerto en Cusco",
            "Vuelo doméstico de Cusco a Lima"
            ],

            notIncludes: [
            "Alimentos: Desayuno, Almuerzo y cena",
            "Costes adicionales o retrasos fuera de nuestro control",
            "Gastos extras",
            "Seguro de Viaje",

            "Alimentos: Almuerzo y Cena",
            "Gastos Extras y propinas",
            "Seguro de Viaje",
            "Costes adicionales o retrasos fuera de nuestro control",

            "Alimentos: Almuerzo y cena",
            "Costes adicionales o retrasos fuera de nuestro control",
            "Gastos extras",
            "Seguro de Viaje",

            "Tickets de ingreso a la montaña de Wayna Picchu o montaña de Machu Picchu (consultar disponibilidad de requerir este tickets)",
            "Alimentos: Almuerzo y Cena",
            "Tickets de tren servicio Vistadome Observatory",
            "Ingreso a los baños termales de Aguas Calientes",
            "Seguro de Viaje",
            "Snack, propinas",
            "Costos extras fuera de nuestro control",

            "Desayuno, Almuerzo, Cena",
            "Costos extras",
            "Actividades extras durante el tour",
            "Seguro de viaje",

            "Alimentos: Almuerzo y Cena",
            "Snack, propinas",
            "Seguros de viaje",
            "Costos extras fuera de nuestro control",

            "Alimentos: Cena",
            "Seguro de Viaje",
            "Propinas, Snack",
            "Caballo de Silla (si desea optar por caballo de silla el costo aproximado es de 120.00 Soles)",
            "Costos extras fuera de nuestro control",

            "Alimentos: Cena",
            "Snack, Propina",
            "Seguro de Viaje",
            "Caballo de Silla (el costo aproximado por caballo de silla es 120.00 soles)",
            "Costos extras fuera de nuestro control",

            "Alimentos: Almuerzo y Cena",
            "Snack, Propina",
            "Seguro de Viaje",
            "Caballo de Silla (el costo aproximado por caballo de silla es 120.00 soles)",

            "Hotel en Lima",
            "Alimentos: Almuerzo y cena",
            "Seguros de viaje",
            "Costes adicionales o retrasos fuera de nuestro control"
            ],

         whatToBring: [
            "Pasaporte original y vigente a la fecha de viaje",
            "Mochila pequeña Portadores de agua como Camelbaks",
            "Botas de montaña cómodas",
            "Crema solar",
            "Crema hidratante para la cara",
            "Repelente de insectos",
            "Desinfectante de manos",
            "Toallitas húmedas",
            "Cepillo de dientes y pasta",
            "Papel higiénico",
            "Medicación personal",
            "Sombrero para el sol",
            "Ropa de lluvia",
            "Cámara de fotos",
            "Dinero extra para cualquier emergencia."
        ],

        seoTitle: 'VIAJE INOLVIDABLE EN PERÚ DE 10 DÍAS / 09 NOCHES - SERVICIO PRIVADO',
        seoDescription:
            'Viaja por Perú en 10 días visitando Lima, Paracas, Cusco, Machu Picchu y más con experiencias únicas.',

        isActive: true,
        isFeatured: true
        },

        {
        id: '6',
        title: 'Aventura en Camino Inca 4 Días 3 Noches',
        slug: 'aventura-en-camino-inca-4-dias-3-noches',

        description:
            'Vive una experiencia única recorriendo el Camino Inca en 4 días, atravesando montañas, microclimas y sitios arqueológicos hasta llegar a Machu Picchu.',

        shortDescription:
            'Trekking de 4 días por el Camino Inca con campamentos y visita a Machu Picchu.',

        price: 0,
        durationDays: 4,
        durationNights: 3,

        destinations: [
            { name: 'Cusco', slug: 'cusco' },
            { name: 'Ollantaytambo', slug: 'ollantaytambo' },
            { name: 'Camino Inca', slug: 'camino-inca' },
            { name: 'Wiñayhuayna', slug: 'winayhuayna' },
            { name: 'Machu Picchu', slug: 'machu-picchu' }
        ],

        imageUrl: '',
        gallery: [],

        features: [
            'Equipo de camping',
            'Guía profesional',
            'Alimentación incluida',
            'Porteadores y cocinero',
            'Tren de retorno'
        ],

        highlights: [
            'Camino Inca clásico 4 días',
            'Paso Warmiwañusca (4215 msnm)',
            'Campamentos en los Andes',
            'Sitios arqueológicos incas',
            'Ingreso a Machu Picchu'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Cusco – Km 82 – Ayapata',
            description:
                'Inicio del trekking desde Km 82, visita a Llactapata y llegada al campamento en Ayapata.',
            accommodations: 'Campamento en Ayapata',
            includes: [
                'Transporte Cusco - Km 82',
                'Ingreso Camino Inca',
                'Guía profesional',
                'Almuerzo y cena',
                'Equipo de camping'
            ],
            notIncludes: ['Desayuno']
            },
            {
            day: 2,
            title: 'Ayapata – Warmiwañusca – Chaquicocha',
            description:
                'Ascenso al punto más alto del trekking y descenso hacia el campamento en Chaquicocha.',
            accommodations: 'Campamento en Chaquicocha',
            meals: ['Desayuno', 'Almuerzo', 'Cena'],
            includes: [
                'Alimentación completa',
                'Guía trekking',
                'Asistencia en ruta'
            ],
            notIncludes: []
            },
            {
            day: 3,
            title: 'Chaquicocha – Wiñayhuayna',
            description:
                'Recorrido por bosques nubosos y sitios arqueológicos hasta el campamento en Wiñayhuayna.',
            accommodations: 'Campamento en Wiñayhuayna',
            meals: ['Desayuno', 'Almuerzo', 'Cena'],
            includes: [
                'Alimentación completa',
                'Guía profesional',
                'Equipo de camping'
            ],
            notIncludes: []
            },
            {
            day: 4,
            title: 'Wiñayhuayna – Machu Picchu – Cusco',
            description:
                'Ingreso por Inti Punku, visita guiada a Machu Picchu y retorno a Cusco en tren.',
            meals: ['Desayuno'],
            includes: [
                'Ingreso a Machu Picchu',
                'Guía turístico',
                'Bus a Aguas Calientes',
                'Tren de retorno',
                'Transporte a Cusco'
            ],
            notIncludes: ['Almuerzo', 'Cena']
            }
        ],

        includes: [
            'Recojo del hotel',
            'Transporte turístico',
            'Ingreso al Camino Inca',
            'Guía profesional',
            'Equipo de camping completo',
            'Alimentación durante el trekking',
            'Porteadores y cocinero',
            'Tren de retorno',
            'Bus Consettur',
            'Botiquín y oxígeno'
        ],

        notIncludes: [
            'Seguro de viaje',
            'Gastos extras',
            'Bolsa de dormir',
            'Bastones de trekking',
            'Tren Vistadome',
            'Propinas'
        ],

        whatToBring: [
            'Pasaporte original',
            'Mochila ligera',
            'Botella de agua',
            'Ropa de trekking',
            'Ropa de abrigo',
            'Bloqueador solar',
            'Repelente',
            'Poncho de lluvia',
            'Linterna',
            'Dinero extra'
        ],

        seoTitle: 'Camino Inca 4 Días 3 Noches | Trekking a Machu Picchu',
        seoDescription:
            'Realiza el Camino Inca clásico de 4 días con campamentos, guía y visita final a Machu Picchu.',

        isActive: true,
        isFeatured: true
        },

        {
        id: '7',
        title: 'Inka Jungle a Machu Picchu Caminata de 4 Días / 3 Noches',
        slug: 'inka-jungle-a-machu-picchu-caminata-de-4-dias-3-noches',

        description:
            'Si buscas una aventura extrema en tu visita a Cusco, el trekking Inka Jungle es perfecto para ti. Combina aventura, cultura y naturaleza pasando por Abra Málaga, Santa María, Santa Teresa y Aguas Calientes hasta llegar a Machu Picchu. Incluye biking, caminatas en selva, aguas termales y contacto con comunidades locales.',

        shortDescription:
            'Aventura extrema de 4 días combinando biking, trekking y selva hasta Machu Picchu.',

        price: 0,
        durationDays: 4,
        durationNights: 3,

        destinations: [
            { name: 'Cusco', slug: 'cusco' },
            { name: 'Ollantaytambo', slug: 'ollantaytambo' },
            { name: 'Abra Málaga', slug: 'abra-malaga' },
            { name: 'Santa María', slug: 'santa-maria' },
            { name: 'Santa Teresa', slug: 'santa-teresa' },
            { name: 'Hidroeléctrica', slug: 'hidroelectrica' },
            { name: 'Aguas Calientes', slug: 'aguas-calientes' },
            { name: 'Machu Picchu', slug: 'machu-picchu' }
        ],

        imageUrl: '',
        gallery: [],

        highlights: [
            'Biking desde Abra Málaga',
            'Caminata por selva tropical',
            'Visita a plantaciones de café, cacao y frutas',
            'Aguas termales de Cocalmayo',
            'Ruta Hidroeléctrica a Aguas Calientes',
            'Exploración de Machu Picchu'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Cusco – Ollantaytambo – Abra Málaga – Santa María',
            description:
                'Viaje desde Cusco hasta Abra Málaga y descenso en bicicleta hacia Santa María atravesando paisajes de selva tropical. Incluye visita a comunidades locales y experiencia con café y cacao.',
            accommodations: 'Alojamiento en Santa María',
            meals: ['Almuerzo', 'Cena'],
            includes: [
                'Briefing informativo dias antes de iniciar el tour',
                'Transporte turistico de Cusco hacia Abra Málaga',
                'Guia turistico con experiencia en trekking y aventura',
                'Equipo para la actividad de Biking (Bicicletas, guantes, chalecos, cascos)',
                'Alimentos: Almuerzo y Cena',
                'Noche de alojamiento en el pueblo de Santa Maria'
            ],
            notIncludes: [
                'Alimentos: Desayuno',
                'Costes adicionales o retrasos fuera de nuestro control',
                'Snack, Agua',
                'Seguros de viaje'
            ]
            },
            {
            day: 2,
            title: 'Santa María – Santa Teresa',
            description:
                'Caminata por la selva siguiendo el río Vilcanota, atravesando plantaciones y fauna local. Visita a las aguas termales de Cocalmayo y traslado a Santa Teresa.',
            accommodations: 'Alojamiento en Santa Teresa',
            meals: ['Desayuno', 'Almuerzo', 'Cena'],
            includes: [
                'Alimentos: Desayuno, Almuerzo y Cena',
                'Guia turistico con experiencia en trekking y aventura',
                'Tickets de ingreso a las aguas termales de Cocalmayo',
                'Asistencia permanente',
                'Noche de alojamiento en Santa Teresa'
            ],
            notIncludes: [
                'Costes adicionales o retrasos fuera de nuestro control',
                'Snack, Agua',
                'Seguros de viaje'
            ]
            },
            {
            day: 3,
            title: 'Santa Teresa – Hidroeléctrica – Aguas Calientes',
            description:
                'Caminata hacia Hidroeléctrica y recorrido por las vías del tren hasta Aguas Calientes rodeado de vegetación y fauna.',
            accommodations: 'Hotel en Aguas Calientes',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Alimentos: Desayuno, Almuerzo',
                'Guia turistico con experiencia en trekking y aventura',
                'Asistencia permanente',
                'Noche de alojamiento en Aguas Calientes'
            ],
            notIncludes: [
                'Alimentos: Cena',
                'Costes adicionales o retrasos fuera de nuestro control',
                'Snack, Agua',
                'Seguros de viaje'
            ]
            },
            {
            day: 4,
            title: 'Aguas Calientes – Machu Picchu – Cusco',
            description:
                'Visita guiada a Machu Picchu y retorno en tren hacia Ollantaytambo y Cusco.',
            meals: ['Desayuno'],
            includes: [
                'Desayuno en el hotel de Aguas Calientes',
                'Guia turistico para el recorrido en Machu Picchu inglés / español',
                'Tickets de ingreso a la maravilla del mundo Machu Picchu',
                'Tickets de bus subida de Aguas Calientes a Machu Picchu y retorno de Machu Picchu a Aguas Calientes',
                'Tickets de tren expeditions o the voyager de estacion Aguas Calientes a Ollantaytambo',
                'Transporte turístico de estacion Ollantaytambo a Cusco',
                'Asistencia permanente'
            ],
            notIncludes: [
                'Tickets de ingreso a la montaña de Wayna Picchu y montaña de Machu Picchu',
                'Costos extras adicionales',
                'Alimentos: Almuerzo y Cena',
                'Tickets de tren servicio Vistadome Observatory'
            ]
            }
        ],

        includes: [
            'Briefing informativo dias antes de iniciar el tour',
            'Transporte turistico de Cusco hacia Abra Málaga',
            'Guia turistico con experiencia en trekking y aventura',
            'Equipo para la actividad de Biking (Bicicletas, guantes, chalecos, cascos)',
            'Alimentos: Almuerzo y Cena',
            'Noche de alojamiento en el pueblo de Santa Maria',
            'Alimentos: Desayuno, Almuerzo y Cena',
            'Tickets de ingreso a las aguas termales de Cocalmayo',
            'Asistencia permanente',
            'Noche de alojamiento en Santa Teresa',
            'Alimentos: Desayuno, Almuerzo',
            'Noche de alojamiento en Aguas Calientes',
            'Desayuno en el hotel de Aguas Calientes',
            'Guia turistico para el recorrido en Machu Picchu inglés / español',
            'Tickets de ingreso a la maravilla del mundo Machu Picchu',
            'Tickets de bus subida de Aguas Calientes a Machu Picchu y retorno de Machu Picchu a Aguas Calientes',
            'Tickets de tren expeditions o the voyager de estacion Aguas Calientes a Ollantaytambo',
            'Transporte turístico de estacion Ollantaytambo a Cusco'
        ],

        notIncludes: [
            'Alimentos: Desayuno',
            'Costes adicionales o retrasos fuera de nuestro control',
            'Snack, Agua',
            'Seguros de viaje',
            'Alimentos: Cena',
            'Tickets de ingreso a la montaña de Wayna Picchu y montaña de Machu Picchu',
            'Costos extras adicionales',
            'Alimentos: Almuerzo y Cena',
            'Tickets de tren servicio Vistadome Observatory'
        ],

        whatToBring: [
            'Pasaporte original',
            'Mochila pequeña Portadores de agua como Camelback',
            'botas de montaña cómodas',
            'crema solar / bloqueadores solares',
            'crema hidratante para la cara',
            'Repelente de insectos',
            'Desinfectante de manos',
            'Toallitas húmedas',
            'cepillo de dientes y pasta',
            'Papel higiénico',
            'medicación personal',
            'Sombrero para el sol',
            'Ropa de lluvia',
            'Cámara de fotos',
            'Dinero extra para souvenirs, bebidas y propinas.',
            'Medicamentos personales'
        ],

        seoTitle: 'Inka Jungle a Machu Picchu 4 Días 3 Noches',
        seoDescription:
            'Aventura Inka Jungle a Machu Picchu en 4 días con biking, trekking, selva, aguas termales y visita guiada a la ciudadela inca.',

        isActive: true,
        isFeatured: true
        }, 

        {
        id: '8',
        title: 'Trekking a Salkantay & Laguna de Humantay y Machu Picchu 5 Días / 4 Noches',
        slug: 'trekking-a-salkantay-laguna-de-humantay-y-machu-picchu-5-dias-4-noches',

        description:
            'El Salkantay Trek es una alternativa al Camino Inca que combina alta montaña, lagunas turquesas, selva y cultura hasta llegar a Machu Picchu. Incluye la visita a la Laguna de Humantay, el paso Salkantay a más de 4600 msnm, bosque nublado, café tropical y final en la ciudadela inca.',

        shortDescription:
            'Trekking de 5 días por Salkantay con Laguna Humantay y final en Machu Picchu.',

        price: 0,
        durationDays: 5,
        durationNights: 4,

        destinations: [
            { name: 'Cusco', slug: 'cusco' },
            { name: 'Mollepata', slug: 'mollepata' },
            { name: 'Challacancha', slug: 'challacancha' },
            { name: 'Laguna Humantay', slug: 'laguna-humantay' },
            { name: 'Soraypampa', slug: 'soraypampa' },
            { name: 'Paso Salkantay', slug: 'paso-salkantay' },
            { name: 'Chaullay', slug: 'chaullay' },
            { name: 'Lucmabamba', slug: 'lucmabamba' },
            { name: 'Hidroeléctrica', slug: 'hidroelectrica' },
            { name: 'Aguas Calientes', slug: 'aguas-calientes' },
            { name: 'Machu Picchu', slug: 'machu-picchu' }
        ],

        imageUrl: '',
        gallery: [],

        highlights: [
            'Laguna de Humantay',
            'Paso Salkantay 4600 msnm',
            'Caminata por selva y bosque nublado',
            'Plantaciones de café tropical',
            'Ruta Hidroeléctrica',
            'Tour en Machu Picchu'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Cusco – Challacancha – Laguna Humantay – Soraypampa',
            description:
                'Inicio del trekking con visita a la Laguna de Humantay y campamento en Soraypampa rodeado de nevados.',
            accommodations: 'Campamento en Soraypampa',
            meals: ['Almuerzo', 'Cena'],
            includes: [
                'Transporte turístico de Cusco hacia Challacancha punto de inicio de caminata hacia la ruta Salkantay.',
                'Equipo para campamento',
                'Guía profesional con experiencia en Trekking español - inglés.',
                'Cocinero de aventuras.',
                'Arriero (encargado de transportar los caballos)',
                'Caballos de carga (peso máximo de 4 a 5 kilos)',
                'Almuerzo en Soraypampa',
                'Cena en campamento de Soraypampa',
                'Tickets de ingreso a la laguna de Humantay',
                'Oxígeno y botiquín de primeros auxilios',
                'Noche de Campamento'
            ],
            notIncludes: [
                'Bastones de trekking (costo extra: 20.00 USD por los 4 días)',
                'Matra inﬂable (costo extra: 20.00 USD por los 3 noches)',
                'Seguro de viaje',
                'Costes adicionales o retrasos fuera de nuestro control',
                'Propinas para el staff en ruta'
            ]
            },
            {
            day: 2,
            title: 'Soraypampa – Paso Salkantay – Chaullay',
            description:
                'Ascenso al punto más alto del trekking (Salkantay) y descenso hacia Chaullay.',
            accommodations: 'Campamento en Chaullay',
            meals: ['Desayuno', 'Almuerzo', 'Cena'],
            includes: [
                'Desayuno en el campamento de Soraypampa',
                'Almuerzo en ruta (Huayracmachay)',
                'Cena en campamento de Chaullay',
                'Equipo de camping (carpa de cocina, comedor con mesas y sillas).',
                'Guía profesional con experiencia en Trekking español - inglés.',
                'Cocinero de aventuras.',
                'Arriero (encargado de transportar los caballos)',
                'Caballos de carga (peso máximo de 4 a 5 kilos)',
                'NOche de Campamento en Chaullay',
                'Oxígeno y Botiquín de primeros auxilios'
            ],
            notIncludes: [
                'Caballo de Sila',
                'Bastones de trekking (costo extra: 20.00 USD por los 4 días)',
                'Matra inﬂable (costo extra: 20.00 USD por los 3 noches)',
                'Seguro de viaje',
                'Costes adicionales o retrasos fuera de nuestro control',
                'Propinas para el staff en ruta'
            ]
            },
            {
            day: 3,
            title: 'Chaullay – Playa Sahuayaco – Lucmabamba',
            description:
                'Descenso a la ceja de selva con vegetación tropical y campamento en Lucmabamba.',
            accommodations: 'Campamento en Lucmabamba',
            meals: ['Desayuno', 'Almuerzo', 'Cena'],
            includes: [
                'Desayuno en el campamento de Chaullay',
                'Almuerzo en la playa-Sahuayaco',
                'Cena en campamento de Lucmabamba',
                'Equipo de camping (carpa de cocina, comedor con mesas y sillas).',
                'Guía profesional con experiencia en Trekking español - inglés.',
                'Cocinero de aventuras.',
                'Campamento en Lucmabamba',
                'Oxígeno y Botiquín de primeros auxilios'
            ],
            notIncludes: [
                'Bastones de trekking (costo extra: 20.00 USD por los 4 días)',
                'Matra inﬂable (costo extra: 20.00 USD por los 3 noches)',
                'Seguro de viaje',
                'Costes adicionales o retrasos fuera de nuestro control',
                'Propinas para el staff en ruta'
            ]
            },
            {
            day: 4,
            title: 'Lucmabamba – Llactapata – Hidroeléctrica – Aguas Calientes',
            description:
                'Ruta por camino inca hacia Llactapata y caminata hasta Aguas Calientes.',
            accommodations: 'Hotel en Aguas Calientes',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Desayuno en el campamento de Lucmabamba',
                'Box Lunch o almuerzo en ruta',
                'Noche de hotel en Aguas Calientes',
                'Guía profesional con experiencia en Trekking español - inglés.',
                'Oxígeno y Botiquín de primeros auxilios'
            ],
            notIncludes: [
                'Alimentos: Cena',
                'Tickets de tren de Hidroeléctrica a Aguas Calientes',
                'Seguro de viaje',
                'Costes adicionales o retrasos fuera de nuestro control',
                'Propinas para el staff'
            ]
            },
            {
            day: 5,
            title: 'Aguas Calientes – Machu Picchu – Cusco',
            description:
                'Visita guiada a Machu Picchu y retorno a Cusco.',
            meals: ['Desayuno'],
            includes: [
                'Desayuno en el hotel de Aguas Calientes',
                'Guia turistico para el recorrido en Machu Picchu inglés / español',
                'Tickets de ingreso a la maravilla del mundo Machu Picchu',
                'Tickets de bus subida de Aguas Calientes a Machu Picchu y retorno de Machu Picchu a Aguas Calientes',
                'Tickets de tren expeditions o the voyager de estacion Aguas Calientes a Ollantaytambo',
                'Transporte turístico de estacion Ollantaytambo a Cusco',
                'Asistencia permanente'
            ],
            notIncludes: [
                'Tickets de ingreso a la montaña de Wayna Picchu y montaña de Machu Picchu',
                'Costos extras adicionales',
                'Alimentos: Almuerzo y Cena',
                'Tickets de tren servicio Vistadome Observatory'
            ]
            }
        ],

        includes: [
            'Transporte turístico',
            'Guía profesional',
            'Equipo de camping',
            'Alimentación durante trekking',
            'Ingreso a Humantay',
            'Ingreso a Machu Picchu',
            'Tren de retorno',
            'Bus Consettur',
            'Hotel en Aguas Calientes'
        ],

        notIncludes: [
            'Seguro de viaje',
            'Propinas',
            'Bastones de trekking',
            'Gastos personales',
            'Servicios no mencionados'
        ],

        whatToBring: [
            'Pasaporte original',
            'Mochila pequeña Portadores de agua como Camelback',
            'botas de montaña cómodas',
            'crema solar / bloqueadores solares',
            'crema hidratante para la cara',
            'Repelente de insectos',
            'Desinfectante de manos',
            'Toallitas húmedas',
            'cepillo de dientes y pasta',
            'Papel higiénico',
            'medicación personal',
            'Sombrero para el sol',
            'Ropa de lluvia',
            'Cámara de fotos',
            'Dinero extra para souvenirs, bebidas y propinas.',
            'Medicamentos personales'
        ],

        seoTitle: 'Trekking Salkantay 5 Días a Machu Picchu',
        seoDescription: 'Trekking Salkantay 5 Días a Machu Picchu'
        },

        {
        id: '9',
        title: 'Trekking a Salkantay & Laguna de Humantay y Machu Picchu 5 Días / 4 Noches',
        slug: 'trekking-a-salkantay-laguna-de-humantay-y-machu-picchu-5-dias-4-noches-duplicate',

        description:
            'El Salkantay Trek es una alternativa al Camino Inca que combina alta montaña, lagunas turquesas, selva y cultura hasta llegar a Machu Picchu. Incluye la visita a la Laguna de Humantay, el paso Salkantay a más de 4600 msnm, bosque nublado, café tropical y final en la ciudadela inca.',

        shortDescription:
            'Trekking de 5 días por Salkantay con Laguna Humantay y final en Machu Picchu.',

        price: 0,
        durationDays: 5,
        durationNights: 4,

        destinations: [
            { name: 'Cusco', slug: 'cusco' },
            { name: 'Mollepata', slug: 'mollepata' },
            { name: 'Challacancha', slug: 'challacancha' },
            { name: 'Laguna Humantay', slug: 'laguna-humantay' },
            { name: 'Soraypampa', slug: 'soraypampa' },
            { name: 'Paso Salkantay', slug: 'paso-salkantay' },
            { name: 'Chaullay', slug: 'chaullay' },
            { name: 'Lucmabamba', slug: 'lucmabamba' },
            { name: 'Hidroeléctrica', slug: 'hidroelectrica' },
            { name: 'Aguas Calientes', slug: 'aguas-calientes' },
            { name: 'Machu Picchu', slug: 'machu-picchu' }
        ],

        imageUrl: '',
        gallery: [],

        highlights: [
            'Laguna de Humantay',
            'Paso Salkantay 4600 msnm',
            'Caminata por selva y bosque nublado',
            'Plantaciones de café tropical',
            'Ruta Hidroeléctrica',
            'Tour en Machu Picchu'
        ],

        itinerary: [
            {
            day: 1,
            title: 'Cusco – Challacancha – Laguna Humantay – Soraypampa',
            description:
                'Inicio del trekking con visita a la Laguna de Humantay y campamento en Soraypampa rodeado de nevados.',
            accommodations: 'Campamento en Soraypampa',
            meals: ['Almuerzo', 'Cena'],
            includes: [
                'Transporte turístico de Cusco hacia Challacancha punto de inicio de caminata hacia la ruta Salkantay.',
                'Equipo para campamento',
                'Guía profesional con experiencia en Trekking español - inglés.',
                'Cocinero de aventuras.',
                'Arriero (encargado de transportar los caballos)',
                'Caballos de carga (peso máximo de 4 a 5 kilos)',
                'Almuerzo en Soraypampa',
                'Cena en campamento de Soraypampa',
                'Tickets de ingreso a la laguna de Humantay',
                'Oxígeno y botiquín de primeros auxilios',
                'Noche de Campamento'
            ],
            notIncludes: [
                'Bastones de trekking (costo extra: 20.00 USD por los 4 días)',
                'Matra inﬂable (costo extra: 20.00 USD por los 3 noches)',
                'Seguro de viaje',
                'Costes adicionales o retrasos fuera de nuestro control',
                'Propinas para el staff en ruta'
            ]
            },
            {
            day: 2,
            title: 'Soraypampa – Paso Salkantay – Chaullay',
            description:
                'Ascenso al punto más alto del trekking (Salkantay) y descenso hacia Chaullay.',
            accommodations: 'Campamento en Chaullay',
            meals: ['Desayuno', 'Almuerzo', 'Cena'],
            includes: [
                'Desayuno en el campamento de Soraypampa',
                'Almuerzo en ruta (Huayracmachay)',
                'Cena en campamento de Chaullay',
                'Equipo de camping (carpa de cocina, comedor con mesas y sillas).',
                'Guía profesional con experiencia en Trekking español - inglés.',
                'Cocinero de aventuras.',
                'Arriero (encargado de transportar los caballos)',
                'Caballos de carga (peso máximo de 4 a 5 kilos)',
                'NOche de Campamento en Chaullay',
                'Oxígeno y Botiquín de primeros auxilios'
            ],
            notIncludes: [
                'Caballo de Sila',
                'Bastones de trekking (costo extra: 20.00 USD por los 4 días)',
                'Matra inﬂable (costo extra: 20.00 USD por los 3 noches)',
                'Seguro de viaje',
                'Costes adicionales o retrasos fuera de nuestro control',
                'Propinas para el staff en ruta'
            ]
            },
            {
            day: 3,
            title: 'Chaullay – Playa Sahuayaco – Lucmabamba',
            description:
                'Descenso a la ceja de selva con vegetación tropical y campamento en Lucmabamba.',
            accommodations: 'Campamento en Lucmabamba',
            meals: ['Desayuno', 'Almuerzo', 'Cena'],
            includes: [
                'Desayuno en el campamento de Chaullay',
                'Almuerzo en la playa-Sahuayaco',
                'Cena en campamento de Lucmabamba',
                'Equipo de camping (carpa de cocina, comedor con mesas y sillas).',
                'Guía profesional con experiencia en Trekking español - inglés.',
                'Cocinero de aventuras.',
                'Campamento en Lucmabamba',
                'Oxígeno y Botiquín de primeros auxilios'
            ],
            notIncludes: [
                'Bastones de trekking (costo extra: 20.00 USD por los 4 días)',
                'Matra inﬂable (costo extra: 20.00 USD por los 3 noches)',
                'Seguro de viaje',
                'Costes adicionales o retrasos fuera de nuestro control',
                'Propinas para el staff en ruta'
            ]
            },
            {
            day: 4,
            title: 'Lucmabamba – Llactapata – Hidroeléctrica – Aguas Calientes',
            description:
                'Ruta por camino inca hacia Llactapata y caminata hasta Aguas Calientes.',
            accommodations: 'Hotel en Aguas Calientes',
            meals: ['Desayuno', 'Almuerzo'],
            includes: [
                'Desayuno en el campamento de Lucmabamba',
                'Box Lunch o almuerzo en ruta',
                'Noche de hotel en Aguas Calientes',
                'Guía profesional con experiencia en Trekking español - inglés.',
                'Oxígeno y Botiquín de primeros auxilios'
            ],
            notIncludes: [
                'Alimentos: Cena',
                'Tickets de tren de Hidroeléctrica a Aguas Calientes',
                'Seguro de viaje',
                'Costes adicionales o retrasos fuera de nuestro control',
                'Propinas para el staff'
            ]
            },
            {
            day: 5,
            title: 'Aguas Calientes – Machu Picchu – Cusco',
            description:
                'Visita guiada a Machu Picchu y retorno a Cusco.',
            meals: ['Desayuno'],
            includes: [
                'Desayuno en el hotel de Aguas Calientes',
                'Guia turistico para el recorrido en Machu Picchu inglés / español',
                'Tickets de ingreso a la maravilla del mundo Machu Picchu',
                'Tickets de bus subida de Aguas Calientes a Machu Picchu y retorno de Machu Picchu a Aguas Calientes',
                'Tickets de tren expeditions o the voyager de estacion Aguas Calientes a Ollantaytambo',
                'Transporte turístico de estacion Ollantaytambo a Cusco',
                'Asistencia permanente'
            ],
            notIncludes: [
                'Tickets de ingreso a la montaña de Wayna Picchu y montaña de Machu Picchu',
                'Costos extras adicionales',
                'Alimentos: Almuerzo y Cena',
                'Tickets de tren servicio Vistadome Observatory'
            ]
            }
        ],

        includes: [
            'Transporte turístico',
            'Guía profesional',
            'Equipo de camping',
            'Alimentación durante trekking',
            'Ingreso a Humantay',
            'Ingreso a Machu Picchu',
            'Tren de retorno',
            'Bus Consettur',
            'Hotel en Aguas Calientes'
        ],

        notIncludes: [
            'Seguro de viaje',
            'Propinas',
            'Bastones de trekking',
            'Gastos personales',
            'Servicios no mencionados'
        ],

        whatToBring: [
            'Pasaporte original',
            'Mochila pequeña Portadores de agua como Camelback',
            'botas de montaña cómodas',
            'crema solar / bloqueadores solares',
            'crema hidratante para la cara',
            'Repelente de insectos',
            'Desinfectante de manos',
            'Toallitas húmedas',
            'cepillo de dientes y pasta',
            'Papel higiénico',
            'medicación personal',
            'Sombrero para el sol',
            'Ropa de lluvia',
            'Cámara de fotos',
            'Dinero extra para souvenirs, bebidas y propinas.',
            'Medicamentos personales'
        ],

        seoTitle: 'Trekking Salkantay 5 Días a Machu Picchu',
        seoDescription: 'Trekking Salkantay 5 Días a Machu Picchu'
        }
    ];