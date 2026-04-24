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
    tags: string;
    title_en?: string;
    description_en?: string;
    content_en?: string;
    secondary_link_url?: string;
    secondary_link_label_en?: string;
    additional_links?: string;
    image_alt?: string;
    link_url?: string;
    secondary_link_label?: string;
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
                <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-6 mx-auto leading-tight pb-2">
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

                <div className="flex flex-wrap justify-center gap-4">
                    {(() => {
                        const allLinks = [];
                        
                        // Add legacy primary link if exists
                        if (project.link_url) {
                            allLinks.push({
                                url: project.link_url,
                                label: t('visitSite'),
                                label_en: 'Visit Site'
                            });
                        }
                        
                        // Add legacy secondary link if exists
                        if (project.secondary_link_url) {
                            allLinks.push({
                                url: project.secondary_link_url,
                                label: project.secondary_link_label || 'Link Secundario',
                                label_en: project.secondary_link_label_en || 'Secondary Link'
                            });
                        }
                        
                        // Add dynamic additional links
                        if (project.additional_links) {
                            try {
                                const parsedLinks = JSON.parse(project.additional_links);
                                if (Array.isArray(parsedLinks)) {
                                    allLinks.push(...parsedLinks);
                                }
                            } catch (e) {
                                // Ignore parse error
                            }
                        }

                        if (allLinks.length === 0) return null;

                        // Deduplicate by URL to prevent showing the same button twice
                        // if user migrated data to additional_links
                        const uniqueLinks = Array.from(new Map(allLinks.map(item => [item.url, item])).values());

                        return uniqueLinks.map((link: any, i: number) => (
                            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all duration-300 active:scale-95 hover:-translate-y-1 hover:shadow-xl ${
                                    i === 0 
                                        ? 'bg-primary text-black hover:bg-accent hover:shadow-primary/20' 
                                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:shadow-white/5'
                                }`}>
                                <Globe className="w-5 h-5" />
                                {language === 'en' && link.label_en ? link.label_en : (link.label || 'Link')}
                            </a>
                        ));
                    })()}
                </div>
            </header>

            {project.image_url && (
                <ResponsiveImage 
                    src={project.image_url} 
                    alt={project.image_alt || displayTitle} 
                    className="w-full h-auto block rounded-2xl border border-white/10 shadow-2xl shadow-primary/5 mb-12" 
                />
            )}

            <div className="prose prose-invert prose-lg max-w-none text-justify prose-img:mx-auto">
                <ReactMarkdown 
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        p: ({ children }) => {
                            // Detect if this paragraph only contains badges (images from shields.io)
                            const isBadgeContainer = Array.isArray(children) && children.some(child => 
                                typeof child === 'object' && 
                                (child as any)?.props?.src?.includes('img.shields.io')
                            );

                            return (
                                <p className={`mb-6 ${isBadgeContainer ? 'text-center flex flex-wrap justify-center gap-4' : ''}`}>
                                    {children}
                                </p>
                            );
                        },
                        img: ({ ...props }) => {
                            const isBadge = props.src?.includes('img.shields.io');
                            
                            if (isBadge) {
                                return (
                                    <img 
                                        {...(props as any)} 
                                        className="h-7 w-auto inline-block align-middle transition-transform hover:scale-110 !m-0" 
                                    />
                                );
                            }

                            return (
                                <ResponsiveImage 
                                    {...(props as any)} 
                                    className="w-full h-auto block rounded-2xl border border-white/10 shadow-2xl shadow-primary/5 my-8 sm:my-12" 
                                    sizes="(max-width: 768px) 100vw, 800px"
                                />
                            );
                        }
                    }}
                >
                    {displayContent}
                </ReactMarkdown>
            </div>
        </motion.article>
    );
}
