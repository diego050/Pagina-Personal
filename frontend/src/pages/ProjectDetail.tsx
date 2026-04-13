import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import api from '../api';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { STATIC_ROUTES } from '../utils/routeMappings';

interface Project {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    image_url: string;
    link_url: string;
    tags: string;
    title_en?: string;
    description_en?: string;
    content_en?: string;
    secondary_link_url?: string;
    secondary_link_label?: string;
    image_alt?: string;
    image_width?: number;
    image_height?: number;
}

import { useLanguage } from '../context/LanguageContext';

export default function ProjectDetail() {
    const { slug } = useParams();
    const { t, language } = useLanguage();
    const location = useLocation();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/projects/${slug}`)
            .then(res => {
                setProject(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug]);

    // Restore scroll position after loading if available in state
    useEffect(() => {
        const state = location.state as { scrollPosition?: number } | null;
        if (!loading && state?.scrollPosition !== undefined) {
            window.scrollTo(0, state.scrollPosition);
        }
    }, [loading, location.state]);

    if (loading) return <div className="text-center py-20 text-white">Loading...</div>;
    if (!project) return <div className="text-center py-20 text-white">Project not found</div>;

    const tags = project.tags ? project.tags.split(',').map(t => t.trim()) : [];

    // Multilingual content selection
    const displayTitle = language === 'en' && project.title_en ? project.title_en : project.title;
    const displayDescription = language === 'en' && project.description_en ? project.description_en : project.description;
    const displayContent = language === 'en' && project.content_en ? project.content_en : (project.content || project.description);

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
            <SEO
                title={displayTitle}
                description={displayDescription}
                image={project.image_url}
                imageAlt={project.image_alt || displayTitle}
                imageWidth={project.image_width}
                imageHeight={project.image_height}
            />
            <Link to={STATIC_ROUTES.projects[language]} className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> {t('backToProjects')}
            </Link>

            <header className="mb-12 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-6 mx-auto">
                    {displayTitle}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                    {tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                            {tag}
                        </span>
                    ))}
                </div>

                <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed text-justify">
                    {displayDescription}
                </p>

                <div className="flex justify-center gap-4">
                    {project.link_url && (
                        <a href={project.link_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-zinc-200 transition-colors">
                            <Globe className="w-4 h-4" /> {t('visitSite')}
                        </a>
                    )}
                    {project.secondary_link_url && (
                        <a href={project.secondary_link_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-zinc-200 transition-colors">
                            <Globe className="w-4 h-4" /> {project.secondary_link_label || 'Link Secundario'}
                        </a>
                    )}
                </div>
            </header>

            {project.image_url && (
                <div className="mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/5">
                    <ResponsiveImage src={project.image_url} alt={project.image_alt || displayTitle} className="w-full h-auto object-cover" />
                </div>
            )}

            <div className="prose prose-invert prose-lg max-w-none text-justify prose-img:mx-auto">
                <ReactMarkdown 
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        // @ts-ignore
                        img: ResponsiveImage
                    }}
                >
                    {displayContent}
                </ReactMarkdown>
            </div>
        </motion.article>
    );
}
