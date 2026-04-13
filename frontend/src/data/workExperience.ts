
export interface ExperienceItem {
    id: number;
    title: string;
    company: string;
    type?: string;
    period: string;
    duration: string;
    location: string;
    description: string;
    achievements?: string[];
    skills?: string[];
}

export const workExperience: ExperienceItem[] = [
    {
        id: 8,
        title: "Food Service",
        company: "Sips & Nibbles (The Stardust Motel)",
        type: "Presencial",
        period: "dic. 2025 - mar. 2026",
        duration: "3 meses",
        location: "Wallace, Idaho, EE.UU.",
        description: "Fui parte del equipo fundacional de un food truck, contribuyendo en la estructuración de sus procesos comerciales, tecnológicos y visuales desde el día cero. \n👉 [Ver artículo del proyecto](/project/food-truck-operaciones)",
        achievements: [
            "Estandarización de Procesos: Redacté el primer recetario oficial del negocio, calculando las proporciones exactas de los insumos para garantizar la consistencia del producto.",
            "Optimización de POS y Canal Digital: Optimicé el backend del sistema Toast (limpieza de modificadores) y digitalicé el menú con fotos y descripciones, habilitando un canal de ventas room-service directo para el motel adyacente.",
            "Ejecución de Marketing Ágil: Aproveché los tiempos operativos muertos para diseñar menús físicos y flyers promocionales para impulsar la adquisición de tráfico peatonal."
        ],
        skills: ["POS", "Canva", "Operaciones", "Customer Experience (CX)", "Gestión de Procesos"]
    },
    {
        id: 1,
        title: "Investment Intern",
        company: "UTEC Ventures",
        type: "Contrato de prácticas",
        period: "jun. 2025 - dic. 2025",
        duration: "7 meses",
        location: "Perú · Híbrido",
        description: "",
        achievements: [
            "Co-organización del Demo Day 14G: Lideré la logística operativa reuniendo a +40 inversionistas. Desarrollé una plataforma web a medida para facilitar el matchmaking entre startups y fondos. \n👉 [Ver articulo del Demo Day ↗](/project/demo-day-14g)",
            "Gestión de Portafolio & Análisis: Diseñé y estructuré el Portafolio de Inversiones, consolidando la información clave de las startups para dar visibilidad clara sobre su estado y métricas. \n👉 [Ver articulo del Portafolio ↗](/project/utec-ventures-data)",
            "Startup Perú (Fondos No Reembolsables): Acompañamiento estratégico a fundadores en la postulación y seguimiento de hitos.",
            "Soft Skills: Desarrollo de capacidad analítica para evaluar el Investment Fit"
        ],
        skills: ["Bases de datos", "Seguimiento de Programas"]
    },
    {
        id: 2,
        title: "Product Manager",
        company: "UTEC (Cliente: Fe y Alegría)",
        type: "Proyecto Académico",
        period: "ago. 2025 - nov. 2025",
        duration: "4 meses",
        location: "Lima, Perú · En remoto",
        description: "Como parte del curso de Ingeniería de Software, lideré el desarrollo de una solución EdTech real para el colegio Fe y Alegría. \n👉 [Ver artículo del proyecto](/project/tutor-ai)",
        achievements: [
            "Liderazgo de Equipo Multidisciplinario: Dirigí a 4 desarrolladores de Ciencias de la Computación, alineando la visión del producto con la viabilidad técnica para asegurar la entrega del MVP.",
            "Validación en Campo: Coordiné y ejecuté un piloto presencial con 22 alumnos, validando la usabilidad de la plataforma gamificada en un entorno real.",
            "Gestión Data-Driven: Priorización de funcionalidades (Backlog) basada en métricas de aprendizaje y feedback directo de los docentes."
        ],
        skills: ["Gestión de productos", "Gamificación"]
    },
    {
        id: 7,
        title: "Frontend Developer & UI Designer",
        company: "Intuitus Legal",
        type: "Freelance",
        period: "jul. 2025 - ago. 2025",
        duration: "2 meses",
        location: "Lima, Perú · Remoto",
        description: "Creé la identidad digital de una nueva firma legal. El objetivo fue diseñar una plataforma que proyectara autoridad y solidez profesional desde el primer día para competir en un mercado tradicional. \n👉 [Ver proyecto completo ↗](/project/intuitus-legal)",
        achievements: [
            "Diseño de Marca (Figma): Creé una interfaz limpia y moderna que transmite profesionalismo y facilita la lectura.",
            "Desarrollo con Vue.js: Construí una interfaz moderna basada en componentes, asegurando una navegación rápida y una estructura de código escalable.",
            "Experiencia Móvil: Optimización responsive prioritaria, facilitando el contacto rápido para consultas legales urgentes desde celulares."
        ],
        skills: ["Figma", "Vue.js"]
    },
    {
        id: 3,
        title: "Especialista en Marketing Digital y Desarrollo Web",
        company: "Residencia Geriátrica El Rosedal",
        type: "Freelance",
        period: "feb. 2025 - abr. 2025",
        duration: "3 meses",
        location: "Lima, Perú · Híbrido",
        description: "Potencié la presencia digital de la residencia integrando una nueva página web y campañas publicitarias para aumentar la captación de clientes. \n👉 [Ver proyecto completo ↗](/project/digitalizando-el-rosedal)",
        achievements: [
            "Desarrollo Web (Conversion-First): Creé una Landing Page estructurada como embudo de ventas, priorizando la experiencia móvil y la conexión directa vía WhatsApp.",
            "Estrategia de Contenidos & Ads: Implementé campañas en Meta Ads y una parrilla de contenidos basada en storytelling para generar confianza en un mercado sensible.",
            "Impacto de Negocio: Estas acciones lograron aumentar en un 200% la generación de leads cualificados en solo dos meses."
        ],
        skills: ["Marketing digital", "meta ads", "Figma", "Vue.js"]
    },
    {
        id: 4,
        title: "Desarrollador de front-end",
        company: "Rlinteriordesign",
        type: "Freelance",
        period: "ene. 2024 - feb. 2024",
        duration: "2 meses",
        location: "Lima, Perú · Híbrido",
        description: "Desarrollé el portafolio web para una profesional independiente de diseño de interiores. El objetivo fue crear una galería visual elegante que cargara rápido, permitiendo mostrar su trabajo sin distracciones. \n👉 [Ver proyecto completo ↗](/project/rl-interior-design)",
        achievements: [
            "Desarrollo con Nuxt 3: Creación de un sitio rápido y ligero, optimizado para que las imágenes de alta calidad no ralenticen la navegación.",
            "Diseño UI Minimalista: Propuesta visual limpia en Figma que pone el foco totalmente en las fotografías de los espacios diseñados.",
            "Performance: Implementación de buenas prácticas de carga para asegurar que el sitio funcione fluido tanto en móviles como en escritorio."
        ],
    },
    {
        id: 5,
        title: "Desarrollador de front-end",
        company: "RSpharma",
        type: "Freelance",
        period: "feb. 2023 - jul. 2023",
        duration: "6 meses",
        location: "Lima, Perú · Híbrido",
        description: "Creé la página web de RSpharma para exponer su catálogo de productos en internet. El objetivo fue construir un sitio profesional que generara confianza en nuevos clientes. \n👉 [Ver proyecto completo ↗](/project/rspharma-catalogo)",
        achievements: [
            "Diseño UI Limpio: Diseñé en Figma una interfaz ordenada y estética que transmite confianza y profesionalismo a los clientes.",
            "Desarrollo en Vue.js: Programé el sitio como una aplicación rápida para que navegar entre los productos sea fluido e instantáneo."
        ],
        skills: ["Figma", "Nuxt 3", "Python", "vercel"]
    },
    {
        id: 6,
        title: "Desarrollador de front-end",
        company: "LOGICORPERÚ S.A.C.",
        type: "Freelance",
        period: "dic. 2022 - may. 2023",
        duration: "6 meses",
        location: "Lima, Perú · Híbrido",
        description: "Desarrollé la plataforma para una empresa de logística industrial. El objetivo fue mejorar el posicionamiento en buscadores (SEO) para captar clientes corporativos sin depender de publicidad pagada. \n👉 [Ver proyecto completo ↗](/project/logicor-peru-web)",
        achievements: [
            "SEO Técnico con Nuxt 3: Implementé Server-Side Rendering (SSR) para garantizar que Google indexara correctamente los servicios clave de la empresa.",
            "Automatización con Python: Integré scripts de backend para procesar los datos de contacto y asegurar que ningún lead potencial se perdiera.",
            "Resultados: La optimización de velocidad y estructura aumentó el tráfico orgánico, generando más consultas a través de la web."
        ],
        skills: ["Nuxt 3", "Python"]
    }
];
