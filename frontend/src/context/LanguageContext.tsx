export type Language = 'es' | 'en';

export const translations = {
    es: {
        // Navbar
        home: 'Inicio',
        about: 'Sobre Mí',
        projects: 'Proyectos',
        blog: 'Insights',
        admin: 'Admin',
        // Common
        backToProjects: 'Volver a Proyectos',
        backToBlog: 'Volver a Insights',
        visitSite: 'Visitar Sitio',
        readArticle: 'Leer artículo',
        viewAll: 'Ver todos',
        search: 'Buscar...',
        noResults: 'No se encontraron resultados.',
        noItems: 'No hay elementos disponibles.',
        downloadCV: 'Descargar CV',
        contactMe: 'Contactarme',
        openMenu: 'Abrir menú de navegación',
        closeMenu: 'Cerrar menú de navegación',
        changeLanguage: 'Cambiar idioma',
        // Home
        heroTitle: 'Transformando Ideas en Experiencias Digitales',
        // Localized SEO
        seoHomeTitle: 'Diego Bazán | Producto, Datos y Venture Capital',
        seoHomeDesc: 'Construyo productos digitales de punta a punta —diseño, código y lanzamiento— y explico cómo funciona el venture capital en Perú y LatAm.',
        seoAboutTitle: 'Sobre Mí',
        seoAboutDesc: 'Vengo de negocios digitales y aprendí a construir. Diseño, programo y lanzo productos, y sigo de cerca el ecosistema startup.',
        seoProjectsTitle: 'Portafolio de Proyectos',
        seoProjectsDesc: 'Explora mis proyectos más recientes en desarrollo web, automatización y consultoría digital.',
        seoBlogTitle: 'Insights & Artículos',
        seoBlogDesc: 'Reflexiones y guías sobre tecnología, emprendimiento y marketing digital.',
        heroSubtitle: 'PRODUCTO · DATOS · VENTURE CAPITAL',
        heroDescription: 'Vengo de negocios pero construyo. Diseño, programo y lanzo productos digitales, y explico cómo funciona el venture capital en Perú y LatAm.',
        heroRole: "Construyo productos digitales y cuento sobre <span class='text-primary'>startups y venture capital</span>",
        heroButton: 'Ver proyectos',
        heroSubscribe: 'Suscríbete',
        aboutSectionTitle: 'Sobre mí',
        myProfile: 'Negocios y producto',
        // Blank line separates paragraphs; Home renders each one as its own <p>.
        aboutSummary: "Estudio negocios digitales, pero aprendí a construir. Diseño en Figma, programo el frontend, conecto el backend, testeo y lanzo. Esa combinación me permite tomar decisiones de producto sin depender de traducir lo que quiero a otra persona.\n\nTambién estuve del lado que evalúa, viendo por qué unas startups consiguen inversión y otras se caen en la primera revisión. Construyo con eso en mente.",
        statBuildingLabel: 'construyendo',
        statCompaniesLabel: 'empresas atendidas',

        // Feature Cards (Home)
        cardProductTitle: 'Producto',
        cardProductDesc: 'De la idea al MVP: diseño, build, lanzo.',
        cardDataTitle: 'Datos',
        cardDataDesc: 'Estructuro, automatizo y visualizo.',
        cardEcosystemTitle: 'Ecosistema startup',
        cardEcosystemDesc: 'Cómo se financian y evalúan las startups en Perú.',

        techSkills: 'Habilidades Técnicas & Soft Skills',
        technology: 'TECNOLOGÍA',
        business: 'NEGOCIOS',
        featuredProjects: 'Proyectos Destacados',
        viewAllProjects: 'Ver todos los proyectos',
        insightsTitle: 'Insights & Artículos',
        insightsSubtitle: 'Reflexiones sobre el ecosistema startup, tendencias de marketing y desarrollo web.',
        searchArticles: 'Buscar artículo...',
        viewAllArticles: 'Ver Todos los Artículos',
        haveProject: '¿ESTÁS CONSTRUYENDO ALGO?',
        letsTalk: 'Hablemos',
        letsTalkDesc: 'Si estás construyendo un producto o metido en el mundo startup, me interesa conversar.',
        sendEmail: 'Enviar Correo',
        scheduleMeeting: 'Agendar Reunión',

        // Skills
        skillMarketing: 'Marketing Digital',
        skillSEO: 'SEO / SEM',
        skillAnalytics: 'Google Analytics',
        skillPM: 'Gestión de Proyectos',
        skillEcommerce: 'E-commerce',
        skillLeadership: 'Liderazgo',
        skillCommunication: 'Comunicación Efectiva',

        // Projects
        projectsTitle: 'Proyectos',
        projectsSubtitle: 'Una colección de mi trabajo, desde aplicaciones web hasta bibliotecas de código abierto.',
        searchProjects: 'Buscar proyectos...',
        // Blog
        blogTitle: 'Insights & Artículos',
        blogSubtitle: 'Pensamientos sobre ingeniería de software, diseño y tecnología.',
        // About
        aboutProfile: 'Sobre',
        aboutIntro: "Empecé haciendo webs para clientes y terminé metido en cosas bastante distintas: un piloto educativo con usuarios reales, la estructuración de datos de un portafolio de venture capital, la operación de un negocio desde cero. Sectores que no tienen nada que ver entre sí.\n\nEl hilo es siempre el mismo. Entender cómo funciona algo y construir la pieza que le falta.",
        educationTitle: 'Formación y Certificaciones',
        universityDegree: 'GRADO UNIVERSITARIO',
        degreeTitle: 'Administración y Negocios Digitales',
        universityName: 'UTEC - Universidad de Ingeniería y Tecnología',
        degreeDetails: '2021 - 2026 | Décimo Ciclo',
        degreeDescription: 'Primera carrera de administración y negocios digitales en el Perú. Formación centrada en transformación digital, business intelligence, productos digitales, marketing digital, análisis de datos y gestión ágil. Orientada al liderazgo de digitalización empresarial, gestión de startups e innovación organizacional.',
        certificationsTitle: 'Certificaciones Profesionales',

        // Footer
        footerText: 'Creado con React y FastAPI.',
        // Contact Form
        name: 'Nombre',
        email: 'Email',
        message: 'Mensaje',
        sendButton: 'Enviar Mensaje',
        messageSent: '¡Mensaje Enviado!',
        messageSentDesc: 'Me pondré en contacto contigo lo antes posible.',
        errorSending: 'Algo salió mal. Por favor, inténtalo de nuevo.',
        // Newsletter
        newsletterTitle: 'Únete a mi Newsletter',
        newsletterSubtitle: 'Recibe noticias sobre tecnología, negocios y mis últimos proyectos directamente en tu correo.',
        newsletterSuccess: '¡Suscripción enviada!',
        newsletterSuccessDesc: 'Gracias por suscribirte. Te mantendré informado.',
        subscribeButton: 'Suscribirse'
    },
    en: {
        // Navbar
        home: 'Home',
        about: 'About Me',
        projects: 'Projects',
        blog: 'Insights',
        admin: 'Admin',
        // Common
        backToProjects: 'Back to Projects',
        backToBlog: 'Back to Insights',
        visitSite: 'Visit Site',
        readArticle: 'Read article',
        viewAll: 'View all',
        search: 'Search...',
        noResults: 'No results found.',
        noItems: 'No items available.',
        downloadCV: 'Download CV',
        contactMe: 'Contact Me',
        openMenu: 'Open navigation menu',
        closeMenu: 'Close navigation menu',
        changeLanguage: 'Change language',
        // Home
        heroTitle: 'Transforming Ideas into Digital Experiences',
        // Localized SEO
        seoHomeTitle: 'Diego Bazán | Product, Data and Venture Capital',
        seoHomeDesc: 'I build digital products end to end —design, code and launch— and explain how venture capital works in Peru and LatAm.',
        seoAboutTitle: 'About Me',
        seoAboutDesc: 'I come from digital business and learned to build. I design, code and ship products, and follow the startup ecosystem closely.',
        seoProjectsTitle: 'Project Portfolio',
        seoProjectsDesc: 'Explore my latest projects in web development, automation, and digital consulting.',
        seoBlogTitle: 'Insights & Articles',
        seoBlogDesc: 'Reflections and guides on technology, entrepreneurship, and digital marketing.',
        heroSubtitle: 'PRODUCT · DATA · VENTURE CAPITAL',
        heroDescription: 'I come from business, but I build. I design, code and ship digital products, and I break down how venture capital works in Peru and LatAm.',
        heroRole: "I build digital products and write about <span class='text-primary'>startups and venture capital</span>",
        heroButton: 'View projects',
        heroSubscribe: 'Subscribe',
        aboutSectionTitle: 'About me',
        myProfile: 'Business and product',
        // Blank line separates paragraphs; Home renders each one as its own <p>.
        aboutSummary: "I study digital business, but I learned to build. I design in Figma, code the frontend, wire up the backend, test and ship. That combination lets me make product decisions without depending on someone else to translate what I want.\n\nI have also been on the side that evaluates, seeing why some startups raise and others fall apart in the first review. I build with that in mind.",
        statBuildingLabel: 'building',
        statCompaniesLabel: 'companies served',

        // Feature Cards (Home)
        cardProductTitle: 'Product',
        cardProductDesc: 'From idea to MVP: design, build, ship.',
        cardDataTitle: 'Data',
        cardDataDesc: 'I structure, automate and visualize it.',
        cardEcosystemTitle: 'Startup ecosystem',
        cardEcosystemDesc: 'How startups get funded and evaluated in Peru.',

        techSkills: 'Technical & Soft Skills',
        technology: 'TECHNOLOGY',
        business: 'BUSINESS',
        featuredProjects: 'Featured Projects',
        viewAllProjects: 'View all projects',
        insightsTitle: 'Insights & Articles',
        insightsSubtitle: 'Reflections on the startup ecosystem, marketing trends, and web development.',
        searchArticles: 'Search article...',
        viewAllArticles: 'View All Articles',
        haveProject: 'ARE YOU BUILDING SOMETHING?',
        letsTalk: 'Let\'s talk',
        letsTalkDesc: 'If you are building a product or deep in the startup world, I would like to hear about it.',
        sendEmail: 'Send Email',
        scheduleMeeting: 'Schedule Meeting',

        // Skills
        skillMarketing: 'Digital Marketing',
        skillSEO: 'SEO / SEM',
        skillAnalytics: 'Google Analytics',
        skillPM: 'Project Management',
        skillEcommerce: 'E-commerce',
        skillLeadership: 'Leadership',
        skillCommunication: 'Effective Communication',

        // Projects
        projectsTitle: 'Projects',
        projectsSubtitle: 'A collection of my work, from web applications to open source libraries.',
        searchProjects: 'Search projects...',
        // Blog
        blogTitle: 'Insights & Articles',
        blogSubtitle: 'Thoughts on software engineering, design, and technology.',
        // About
        aboutProfile: 'About',
        aboutIntro: "I started building websites for clients and ended up in fairly different places: an education pilot with real users, structuring the portfolio data of a venture capital fund, running a business from day zero. Sectors with nothing in common.\n\nThe thread is always the same. Understand how something works and build the piece it is missing.",
        educationTitle: 'Education and Certifications',
        universityDegree: 'UNIVERSITY DEGREE',
        degreeTitle: 'Administration and Digital Business',
        universityName: 'UTEC - University of Engineering and Technology',
        degreeDetails: '2021 - 2026 | 10th Cycle',
        degreeDescription: 'First degree program in Digital Business Administration in Peru. Training focused on digital transformation, business intelligence, digital products, digital marketing, data analytics, and agile management. Oriented towards leadership in business digitalization, startup management, and organizational innovation.',
        certificationsTitle: 'Professional Certifications',

        // Footer
        footerText: 'Built with React & FastAPI.',
        // Contact Form
        name: 'Name',
        email: 'Email',
        message: 'Message',
        sendButton: 'Send Message',
        messageSent: 'Message Sent!',
        messageSentDesc: "I'll get back to you as soon as possible.",
        errorSending: 'Something went wrong. Please try again.',
        // Newsletter
        newsletterTitle: 'Join my Newsletter',
        newsletterSubtitle: 'Get news about technology, business and my latest projects directly in your inbox.',
        newsletterSuccess: 'Subscription sent!',
        newsletterSuccessDesc: 'Thanks for subscribing. I will keep you posted.',
        subscribeButton: 'Subscribe'
    }
};

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAlternateUrl } from '../utils/routeMappings';
import api from '../api';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof translations['es']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();

    // Store dynamic translations loaded from CMS
    const [dynamicCMS, setDynamicCMS] = useState<Record<string, Record<string, string>>>({ es: {}, en: {} });

    // Determine language from URL
    const isEnglishUrl = location.pathname.startsWith('/en');
    const language: Language = isEnglishUrl ? 'en' : 'es';

    // Persist preference, though URL is source of truth
    useEffect(() => {
        localStorage.setItem('language', language);
        // Set HTML lang attribute
        document.documentElement.lang = language;
    }, [language]);

    // Fetch CMS Content
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await api.get('/content');
                const contentData = res.data;
                const newDynamic: Record<string, Record<string, string>> = { es: {}, en: {} };

                const sourceKeyMapping: Record<string, string> = {
                    'home_subtitle': 'heroSubtitle',
                    'home_title': 'heroTitle',
                    'home_role': 'heroRole',
                    'home_description': 'heroDescription',
                    'home_about_summary': 'aboutSummary',
                    'about_intro': 'aboutIntro',
                    'about_degree_title': 'degreeTitle',
                    'about_degree_university': 'universityName',
                    'about_degree_details': 'degreeDetails',
                    'about_degree_description': 'degreeDescription'
                };

                contentData.forEach((item: any) => {
                    // It separates keys like home_subtitle_es -> home_subtitle and es
                    let baseKey = item.key;
                    let lang: Language | null = null;
                    if (baseKey.endsWith('_es')) {
                        baseKey = baseKey.replace('_es', '');
                        lang = 'es';
                    } else if (baseKey.endsWith('_en')) {
                        baseKey = baseKey.replace('_en', '');
                        lang = 'en';
                    }

                    if (lang && sourceKeyMapping[baseKey]) {
                        newDynamic[lang][sourceKeyMapping[baseKey]] = item.value;
                    }
                });
                
                setDynamicCMS(newDynamic);
            } catch (error) {
                console.error("Failed to load CMS content:", error);
            }
        };
        fetchContent();
    }, []);

    const setLanguage = (targetLang: Language) => {
        if (targetLang === language) return;

        // Calculate the target URL for the current path in the target language
        const distinctPath = location.pathname;
        const newUrl = getAlternateUrl(distinctPath, language);

        navigate(newUrl, { state: { scrollPosition: window.scrollY } });
    };

    const t = (key: keyof typeof translations['es']) => {
        // Fallback to static translations if CMS hasn't loaded or doesn't have the key
        return dynamicCMS[language][key] || translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

