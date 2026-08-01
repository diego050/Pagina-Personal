import { motion } from 'framer-motion';
import { ArrowRight, Mail, Calendar, Linkedin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import ContactModal from '../components/ContactModal';
import NewsletterSection from '../components/NewsletterSection';

interface Project {
    id: number;
    title: string;
    description: string;
    image_url: string;
    link_url: string;
    tags: string;
    slug?: string;
    title_en?: string;
    description_en?: string;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    image_url?: string;
    created_at: string;
    category: string;
}

export default function Home() {
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const [projects, setProjects] = useState<Project[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsRes, articlesRes] = await Promise.all([
                    api.get('/projects'),
                    api.get('/articles')
                ]);

                setProjects(projectsRes.data);

                const filteredArticles = articlesRes.data.filter((article: Article) =>
                    article.category !== 'Projects' && article.category !== 'Proyectos'
                );
                setArticles(filteredArticles);



            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // The newsletter form lives further down this same page, so the CTA scrolls
    // to it instead of navigating. scroll-mt on the section clears the fixed navbar.
    const scrollToNewsletter = () => {
        document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="relative">
            <SEO
                title={t('seoHomeTitle')}
                description={t('seoHomeDesc')}
                appendSiteName={false}
            />
            {/* Hero Section */}
            <section className="relative min-h-[70vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden py-12 md:py-20">
                <div className="absolute inset-0 bg-background" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column: Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-left flex flex-col items-center lg:items-start order-2 lg:order-1"
                        >
                            <span className="block text-primary font-bold tracking-wider uppercase text-sm mb-4">
                                {t('heroSubtitle')}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                                Diego Bazán
                            </h1>
                            <p
                                className="text-xl text-zinc-400 max-w-lg mb-4 leading-relaxed border-l-4 border-primary pl-4 text-justify lg:text-left"
                                dangerouslySetInnerHTML={{
                                    __html: t('heroRole')
                                }}
                            />
                            <p className="text-lg text-zinc-500 max-w-lg mb-6 md:mb-10 leading-relaxed text-justify">
                                {t('heroDescription')}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link
                                    to={language === 'en' ? '/en/projects' : '/proyectos'}
                                    className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                                >
                                    {t('heroButton')}
                                </Link>
                                <button
                                    type="button"
                                    onClick={scrollToNewsletter}
                                    className="px-8 py-3 bg-transparent border border-zinc-700 text-white font-medium rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2"
                                >
                                    <Mail className="w-5 h-5" />
                                    {t('heroSubscribe')}
                                </button>
                            </div>
                        </motion.div>

                        {/* Right Column: Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative flex justify-center lg:justify-end order-1 lg:order-2"
                        >
                            <div className="w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-zinc-800 border border-white/5 relative group">
                                <ResponsiveImage
                                    src="/static/uploads/profile.webp"
                                    alt="Profile"
                                    lazy={false}
                                    fetchPriority="high"
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* About Me Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
            >
                <div className="mb-4">
                    <span className="block text-primary font-bold uppercase tracking-wider text-sm mb-2">{t('aboutSectionTitle')}</span>
                    <h2 className="text-4xl font-bold text-white mb-6">{t('myProfile')}</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        {/* The summary is authored with blank lines between paragraphs */}
                        {t('aboutSummary').split(/\n\s*\n/).map((paragraph, idx) => (
                            <p key={idx} className="text-zinc-400 text-lg leading-relaxed mb-6 text-justify">
                                {paragraph}
                            </p>
                        ))}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        // grid, not flex: grid-cols-2 forces both boxes to the same width even
                        // though "2022 — 2026" is much wider than "6". Between lg and xl this
                        // column is too narrow for the date to fit, so the boxes stack there.
                        className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4"
                    >
                        {[
                            { value: '2022 — 2026', label: t('statBuildingLabel'), valueClass: 'text-base sm:text-xl' },
                            { value: '6', label: t('statCompaniesLabel'), valueClass: 'text-3xl' }
                        ].map((stat) => (
                            <div key={stat.label} className="glass-panel px-3 sm:px-4 py-6 rounded-xl text-center border border-white/10 hover:border-primary/50 transition-colors duration-300 flex flex-col justify-center">
                                <span className={`block font-bold text-white mb-1 whitespace-nowrap ${stat.valueClass}`}>{stat.value}</span>
                                <span className="text-xs text-zinc-500 uppercase tracking-wide">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {[
                        // Cube, bar chart and trending-up, matching product / data / startup ecosystem
                        { title: t('cardProductTitle'), desc: t('cardProductDesc'), iconPath: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
                        { title: t('cardDataTitle'), desc: t('cardDataDesc'), iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
                        { title: t('cardEcosystemTitle'), desc: t('cardEcosystemDesc'), iconPath: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" }
                    ].map((card, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors"
                        >
                            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6 text-primary">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.iconPath} /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {card.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Skills Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">{t('techSkills')}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-4 h-4 text-zinc-500">💻</span> {t('technology')}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {['Vue.js', 'Nuxt 3', 'Python', 'Tailwind', 'CSS', 'Figma', 'SQL', 'AWS', 'Git/GitHub'].map((skill, i) => (
                                    <motion.span
                                        key={skill}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-full text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition-colors cursor-default"
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-4 h-4 text-zinc-500">📊</span> {t('business')}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {['Product Management', 'Power BI', 'Growth Marketing', 'SEO', 'Meta Ads', 'Data-Driven Strategy'].map((skill, i) => (
                                    <motion.span
                                        key={skill}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="px-4 py-2 bg-cyan-900/30 border border-cyan-800/50 rounded-full text-cyan-400 text-sm font-medium hover:bg-cyan-900/50 transition-colors cursor-default"
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.section>

            {/* Featured Projects Section */}
            {projects.length > 0 && (
                <section className="py-12 md:py-20 px-4 bg-surface/30">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex items-end justify-between mb-12"
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">{t('featuredProjects')}</h2>
                            </div>
                            <Link to={language === 'en' ? '/en/projects' : '/proyectos'} className="text-primary hover:text-accent transition-colors flex items-center gap-1 font-medium">
                                {t('viewAllProjects')} <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 lg:grid lg:grid-cols-3 lg:gap-8 lg:pb-0 scrollbar-hide">
                            {projects.slice(0, 3).map((project, idx) => {
                                const tags = project.tags.split(',').map(t => t.trim());
                                const category = tags[0] || 'Project'; // Use first tag as category badge
                                const displayTags = tags; // Show all tags at bottom

                                const displayTitle = language === 'en' && project.title_en ? project.title_en : project.title;
                                const displayDescription = language === 'en' && project.description_en ? project.description_en : project.description;

                                return (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.5, delay: idx * 0.15 }}
                                        onClick={() => {
                                            if (project.slug) {
                                                navigate(`/project/${project.slug}`);
                                            } else if (project.link_url && project.link_url.startsWith('/')) {
                                                navigate(project.link_url);
                                            } else if (project.link_url) {
                                                window.open(project.link_url, '_blank', 'noreferrer');
                                            }
                                        }}
                                        className="group rounded-2xl glass-panel overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer min-w-[85vw] sm:min-w-[45%] lg:min-w-0 snap-center"
                                    >
                                        {/* Image Container */}
                                        <div className="relative h-48 overflow-hidden">
                                            <ResponsiveImage
                                                src={project.image_url || "https://via.placeholder.com/400x300"}
                                                alt={displayTitle}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {/* Category Badge */}
                                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 text-xs font-medium text-white">
                                                {category}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors leading-snug pb-1">
                                                {displayTitle}
                                            </h3>
                                            <p className="text-zinc-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                                                {displayDescription}
                                            </p>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2">
                                                {displayTags.map(tag => (
                                                    <span key={tag} className="px-2 py-1 bg-white/5 rounded-md text-xs font-medium text-zinc-300 border border-white/5">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )
            }

            {/* Latest Articles Section */}
            {
                articles.length > 0 && (
                    <section className="py-12 md:py-20 px-4">
                        <div className="max-w-7xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
                            >
                                <div>
                                    <h2 className="text-4xl font-bold text-white mb-3">{t('insightsTitle')}</h2>
                                    <p className="text-zinc-400 max-w-xl">
                                        {t('insightsSubtitle')}
                                    </p>
                                </div>
                                <div className="relative">
                                    {/* Visual search bar (non-functional for now) */}
                                    <input
                                        type="text"
                                        placeholder={t('searchArticles')}
                                        className="bg-zinc-900/50 border border-zinc-700 text-sm rounded-lg px-4 py-2 text-zinc-300 w-full md:w-64 focus:outline-none focus:border-primary"
                                        readOnly
                                    />
                                    <svg className="w-4 h-4 text-zinc-500 absolute right-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                            </motion.div>

                            {/* Filter Chips (Visual) */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex gap-2 mb-8 overflow-x-auto pb-2"
                            >
                                {['Todos', 'Estrategia', 'Tech & Web', 'Growth'].map((filter, i) => (
                                    <button key={filter} aria-label={`Filtrar por ${filter}`} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${i === 0 ? 'bg-cyan-500 text-black' : 'bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:text-white'}`}>
                                        {filter}
                                    </button>
                                ))}
                            </motion.div>

                            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 lg:grid lg:grid-cols-3 lg:gap-8 lg:pb-0 scrollbar-hide">
                                {articles.slice(0, 3).map((article, idx) => (
                                    <Link to={`/blog/${article.slug}`} key={article.id} className="group block h-full min-w-[85vw] sm:min-w-[45%] lg:min-w-0 snap-center">
                                        <motion.article
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{ duration: 0.5, delay: idx * 0.15 }}
                                            className="h-full bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 flex flex-col"
                                        >
                                            <div className="relative h-56 overflow-hidden">
                                                {article.image_url ? (
                                                    <ResponsiveImage src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                ) : (
                                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                                        <span className="text-zinc-600">No Image</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow">
                                                <div className="flex justify-between items-center mb-4 text-xs text-zinc-500">
                                                    <span className="uppercase tracking-wider font-semibold text-cyan-500">BLOG</span>
                                                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                    {article.title}
                                                </h3>
                                                <p className="text-zinc-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                                                    {article.content.substring(0, 100)}...
                                                </p>
                                                <div className="flex items-center text-cyan-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                                    {t('readArticle')} <ArrowRight className="w-4 h-4 ml-1" />
                                                </div>
                                            </div>
                                        </motion.article>
                                    </Link>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mt-12 text-center"
                            >
                                <Link to={language === 'en' ? '/en/blog' : '/blog'} className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                                    {t('viewAllArticles')} <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        </div>
                    </section>
                )
            }

            {/* Newsletter Section */}
            <NewsletterSection />

            {/* CTA Section */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="py-12 md:py-24 px-4 text-center"
            >
                <div className="max-w-4xl mx-auto">
                    <span className="block text-primary font-bold tracking-wider uppercase text-sm mb-4">{t('haveProject')}</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('letsTalk')}</h2>
                    <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        {t('letsTalkDesc')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <button
                            onClick={() => setIsContactModalOpen(true)}
                            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center gap-2"
                        >
                            <Mail className="w-5 h-5" />
                            {t('sendEmail')}
                        </button>
                        <a href="https://calendar.app.google/ZuwQ3J9iyWXQjpNw5" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-transparent border border-zinc-700 text-white font-medium rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {t('scheduleMeeting')}
                        </a>
                    </div>

                    <div className="flex justify-center gap-8">
                        <a href="https://www.linkedin.com/in/diego-baz%C3%A1n/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors" aria-label="LinkedIn de Diego Bazán">
                            <Linkedin className="w-8 h-8" />
                        </a>
                        <a href="https://wa.me/51950051707" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors" aria-label="WhatsApp de Diego Bazán">
                            <div className="w-8 h-8">
                                <svg fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>
            </motion.section>

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </div >
    );
}
