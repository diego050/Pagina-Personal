import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import api from '../api';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { STATIC_ROUTES } from '../utils/routeMappings';
import { useLanguage } from '../context/LanguageContext';

interface Article {
    id: number;
    title: string;
    title_en?: string;
    slug: string;
    excerpt?: string;
    excerpt_en?: string;
    content: string;
    content_en?: string;
    image_url?: string;
    created_at: string;
    category: string;
    image_alt?: string;
    image_width?: number;
    image_height?: number;
    additional_links?: string;
}

export default function Article() {
    const { slug } = useParams();
    const { t, language } = useLanguage();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/articles/${slug}`)
            .then(res => {
                setArticle(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug]);

    if (loading) return <div className="text-center py-20">Cargando...</div>;
    if (!article) return <div className="text-center py-20">Artículo no encontrado</div>;

    const isProject = article.category === 'Projects' || article.category === 'Proyectos';
    const backLink = isProject ? STATIC_ROUTES.projects[language] : STATIC_ROUTES.blog[language];
    const backText = isProject ? t('backToProjects') : t('backToBlog'); // Assuming translation keys exist or fallback

    const displayTitle = (language === 'en' && article.title_en) ? article.title_en : article.title;
    const displayContent = (language === 'en' && article.content_en) ? article.content_en : article.content;
    const displayExcerpt = (language === 'en' && article.excerpt_en) ? article.excerpt_en : (article.excerpt || article.content.substring(0, 150) + "...");

    return (
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <SEO
                title={displayTitle}
                description={displayExcerpt}
                image={article.image_url}
                imageAlt={article.image_alt || displayTitle}
                imageWidth={article.image_width}
                imageHeight={article.image_height}
                type="article"
            />
            <Link to={backLink} className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> {backText}
            </Link>

            <header className="mb-12">
                {/* Title removed to avoid duplication with markdown content */}
                {/* Only showing metadata like date and category if needed, or keeping it minimal */}
                <div className="flex items-center gap-4 text-zinc-500">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.created_at).toLocaleDateString()}
                    </span>
                    {article.category && (
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs border border-white/5">
                            {article.category}
                        </span>
                    )}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                    {/* Render dynamic additional links list */}
                    {article.additional_links && (() => {
                        try {
                            const links = JSON.parse(article.additional_links);
                            if (!Array.isArray(links)) return null;
                            return links.map((link: any, i: number) => (
                                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 active:scale-95 hover:-translate-y-1 hover:shadow-xl ${
                                        i === 0 
                                            ? 'bg-primary text-black hover:bg-accent hover:shadow-primary/20' 
                                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:shadow-white/5'
                                    }`}>
                                    <Globe className="w-4 h-4" />
                                    {language === 'en' && link.label_en ? link.label_en : (link.label || 'Link')}
                                </a>
                            ));
                        } catch (e) {
                            return null;
                        }
                    })()}
                </div>
            </header>

            {/* Image removed from here because it's usually embedded in the markdown content for projects */}
            {/* If it's a regular blog post that uses image_url but not in markdown, we might want to keep it conditionally. 
                For Tutor AI specifically, the user seems to want it cleaner. 
                I'll keep it but only if it's NOT a project to avoid double image if the user put it in markdown.
                Or better, I'll comment it out as requested by the user's implicit "duplication" complaint. 
             */}

            {!isProject && article.image_url && (
                <div className="mb-12 rounded-2xl overflow-hidden">
                    <ResponsiveImage src={article.image_url} alt={article.image_alt || article.title} className="w-full h-auto object-cover" />
                </div>
            )}

            <div className="prose prose-invert prose-lg max-w-none">
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
        </article>
    );
}
