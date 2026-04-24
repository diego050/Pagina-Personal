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
        seoHomeTitle: 'Diego Bazán | Estrategia Digital & Desarrollo Full-Stack',
        seoHomeDesc: 'Potencia tu negocio con soluciones digitales estratégicas. Especialista en desarrollo web, marketing digital y modelos de negocio escalables.',
        seoAboutTitle: 'Sobre Mí',
        seoAboutDesc: 'Conoce más sobre mi trayectoria híbrida entre los negocios digitales y el desarrollo de software.',
        seoProjectsTitle: 'Portafolio de Proyectos',
        seoProjectsDesc: 'Explora mis proyectos más recientes en desarrollo web, automatización y consultoría digital.',
        seoBlogTitle: 'Insights & Artículos',
        seoBlogDesc: 'Reflexiones y guías sobre tecnología, emprendimiento y marketing digital.',
        heroSubtitle: 'NEGOCIOS DIGITALES & DESARROLLO FULL-STACK',
        heroDescription: 'Más que código, ofrezco soluciones estratégicas. Combino mi formación de negocios con el desarrollo de software para crear productos digitales escalables y de alto valor. Combino la innovación tecnológica con el marketing digital para construir productos que maximizan la conversión y fidelizan al usuario.',
        heroRole: "Estudiante de Administración y Negocios Digitales <span class='text-primary'>| Tercio Superior en UTEC</span>",
        heroButton: 'Ver Portafolio',
        aboutSectionTitle: 'Sobre mí',
        myProfile: 'Perfil Híbrido',
        aboutSummary: "Mi formación en Administración y Negocios Digitales en UTEC me permite alinear la estrategia comercial con la ejecución técnica. Como Desarrollador, no me limito a escribir líneas de código; creo activos digitales que aportan valor medible a la empresa. Me especializo en desarrollar plataformas escalables que impulsan el crecimiento del negocio y mejoran la retención de los usuarios.",
        yearsExp: 'Año de experiencia profesional',
        projectsDelivered: 'Proyectos de alto impacto entregados',

        // Feature Cards (Home)
        cardStrategyTitle: 'Estrategia Digital',
        cardStrategyDesc: 'Planificación y ejecución de campañas basadas en datos y KPIs de negocio.',
        cardDevTitle: 'Desarrollo Web',
        cardDevDesc: 'Creación de sitios web modernos, responsivos y optimizados con tecnologías actuales.',
        cardMarketingTitle: 'Marketing',
        cardMarketingDesc: 'Optimización SEO, gestión de redes sociales y branding personal.',

        techSkills: 'Habilidades Técnicas & Soft Skills',
        technology: 'TECNOLOGÍA',
        business: 'NEGOCIOS',
        featuredProjects: 'Proyectos Destacados',
        viewAllProjects: 'Ver todos los proyectos',
        insightsTitle: 'Insights & Artículos',
        insightsSubtitle: 'Reflexiones sobre el ecosistema startup, tendencias de marketing y desarrollo web.',
        searchArticles: 'Buscar artículo...',
        viewAllArticles: 'Ver Todos los Artículos',
        haveProject: '¿TIENES UN PROYECTO EN MENTE?',
        letsTalk: 'Hablemos de negocios',
        letsTalkDesc: 'Estoy siempre abierto a nuevas oportunidades, colaboraciones o simplemente para charlar sobre tecnología y negocios.',
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
        aboutIntro: "En un mundo donde la tecnología avanza rápido, la adaptabilidad es la única ventaja competitiva sostenible. Mi perfil se define por el aprendizaje continuo y la ejecución.\nDesde organizar eventos de emprendimiento hasta desplegar aplicaciones web complejas, mi enfoque siempre es el mismo: calidad, impacto y escalabilidad. Me estoy preparando no solo para participar en la industria tecnológica, sino para ayudar a darle forma con soluciones innovadoras.",
        educationTitle: 'Formación y Certificaciones',
        universityDegree: 'GRADO UNIVERSITARIO',
        degreeTitle: 'Administración y Negocios Digitales',
        universityName: 'UTEC - Universidad de Ingeniería y Tecnología',
        degreeDetails: '2021 - 2026 | 9no Ciclo - Tercio Superior',
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
        seoHomeTitle: 'Diego Bazán | Digital Strategy & Full-Stack Development',
        seoHomeDesc: 'Power your business with strategic digital solutions. Specialist in web development, digital marketing, and scalable business models.',
        seoAboutTitle: 'About Me',
        seoAboutDesc: 'Learn more about my hybrid background between digital business and software development.',
        seoProjectsTitle: 'Project Portfolio',
        seoProjectsDesc: 'Explore my latest projects in web development, automation, and digital consulting.',
        seoBlogTitle: 'Insights & Articles',
        seoBlogDesc: 'Reflections and guides on technology, entrepreneurship, and digital marketing.',
        heroSubtitle: 'DIGITAL BUSINESS & FULL-STACK ENGINEERING',
        heroDescription: 'More than just code, I deliver strategic solutions. I combine my business background with software development to build scalable, high-value digital products. I combine technological innovation with digital marketing to build products that maximize conversion and retain users.',
        heroRole: "Student of Business Administration and Digital Business <span class='text-primary'>| Top Third at UTEC</span>",
        heroButton: 'View Portfolio',
        aboutSectionTitle: 'About me',
        myProfile: 'Hybrid Profile',
        aboutSummary: "My background in Digital Business at UTEC allows me to align commercial strategy with technical execution. As a Developer, I don’t just write lines of code; I build digital assets that deliver measurable value to the company. I specialize in developing scalable platforms that drive business growth and improve user retention.",
        yearsExp: 'Year of professional experience',
        projectsDelivered: 'High-impact projects delivered',

        // Feature Cards (Home)
        cardStrategyTitle: 'Digital Strategy',
        cardStrategyDesc: 'Planning and execution of campaigns based on data and business KPIs.',
        cardDevTitle: 'Web Development',
        cardDevDesc: 'Creation of modern, responsive websites optimized with current technologies.',
        cardMarketingTitle: 'Marketing',
        cardMarketingDesc: 'SEO optimization, social media management, and personal branding.',

        techSkills: 'Technical & Soft Skills',
        technology: 'TECHNOLOGY',
        business: 'BUSINESS',
        featuredProjects: 'Featured Projects',
        viewAllProjects: 'View all projects',
        insightsTitle: 'Insights & Articles',
        insightsSubtitle: 'Reflections on the startup ecosystem, marketing trends, and web development.',
        searchArticles: 'Search article...',
        viewAllArticles: 'View All Articles',
        haveProject: 'HAVE A PROJECT IN MIND?',
        letsTalk: 'Let\'s talk business',
        letsTalkDesc: 'I am always open to new opportunities, collaborations, or just to chat about technology and business.',
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
        aboutIntro: "In a world where technology moves fast, adaptability is the only sustainable competitive advantage. My profile is defined by continuous learning and execution.\nFrom organizing entrepreneurship events to deploying complex web applications, my approach is always the same: quality, impact, and scalability. I am preparing myself not just to participate in the tech industry, but to help shape it with innovative solutions.",
        educationTitle: 'Education and Certifications',
        universityDegree: 'UNIVERSITY DEGREE',
        degreeTitle: 'Administration and Digital Business',
        universityName: 'UTEC - University of Engineering and Technology',
        degreeDetails: '2021 - 2026 | 9th Cycle - Top Third',
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

