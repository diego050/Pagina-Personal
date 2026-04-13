import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';

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

import { useLanguage } from '../context/LanguageContext';

export default function Projects() {
    const { t } = useLanguage();
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        api.get('/projects')
            .then(res => setProjects(res.data))
            .catch(err => console.error(err));
    }, []);

    const filteredProjects = projects.filter(project => {
        // Search across all content fields (including English)
        const q = searchQuery.toLowerCase();
        return (project.title.toLowerCase().includes(q) ||
            project.description.toLowerCase().includes(q) ||
            project.tags.toLowerCase().includes(q) ||
            (project.title_en && project.title_en.toLowerCase().includes(q)) ||
            (project.description_en && project.description_en.toLowerCase().includes(q)));
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
            <SEO
                title={t('seoProjectsTitle')}
                description={t('seoProjectsDesc')}
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="flex flex-col items-center text-center gap-6 mb-8">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-bold text-white mb-4">{t('projectsTitle')}</h1>
                        <p className="text-zinc-400">
                            {t('projectsSubtitle')}
                        </p>
                    </div>

                    {projects.length > 0 && (
                        <div className="w-full max-w-md">
                            <input
                                type="text"
                                placeholder={t('searchProjects')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center"
                            />
                        </div>
                    )}
                </div>
            </motion.div>

            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                    {filteredProjects.length === 0 && (
                        <div className="col-span-full text-center py-12 text-zinc-500">
                            {t('noResults')}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12 text-zinc-500">
                    {t('noItems')}
                </div>
            )}
        </div>
    );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const navigate = useNavigate();
    const { language } = useLanguage();

    const displayTitle = language === 'en' && project.title_en ? project.title_en : project.title;
    const displayDescription = language === 'en' && project.description_en ? project.description_en : project.description;

    const handleClick = () => {
        if (project.slug) {
            // Localize navigation
            const basePath = `/project/${project.slug}`;
            const path = language === 'en' ? `/en${basePath}` : basePath;
            navigate(path);
        } else if (project.link_url.startsWith('/')) {
            // Check if internal link needs localization
            let path = project.link_url;
            if (language === 'en' && !path.startsWith('/en')) {
                path = `/en${path}`;
            }
            navigate(path);
        } else {
            window.open(project.link_url, '_blank', 'noreferrer');
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
            onClick={handleClick}
            className="glass-panel rounded-2xl overflow-hidden hover:border-primary/50 transition-colors group flex flex-col h-full cursor-pointer"
        >
            <div className="h-48 overflow-hidden relative flex-shrink-0">
                <ResponsiveImage
                    src={project.image_url || "https://via.placeholder.com/400x300"}
                    alt={displayTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{displayTitle}</h3>

                <p className="text-zinc-400 text-sm mb-4 line-clamp-3">
                    {displayDescription}
                </p>

                <div className="mt-auto flex flex-wrap gap-2">
                    {project.tags.split(',').map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs font-medium bg-white/5 text-zinc-300 rounded-md">
                            {tag.trim()}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
