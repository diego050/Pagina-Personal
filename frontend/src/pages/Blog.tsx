import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, ChevronDown } from 'lucide-react';
import api from '../api';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
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
    created_at: string;
    is_published: boolean;
    category: string;
    image_url?: string;
    image_alt?: string;
}

export default function Blog() {
    const { t, language } = useLanguage();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    useEffect(() => {
        let isMounted = true;
        api.get('/articles')
            .then(res => {
                if (isMounted) {
                    const data = Array.isArray(res.data) ? res.data : [];
                    const filteredArticles = data.filter((article: Article) =>
                        article.category !== 'Projects' && article.category !== 'Proyectos'
                    );
                    setArticles(filteredArticles);
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    const filteredAndSortedArticles = articles
        .filter(article => {
            const q = searchQuery.toLowerCase();
            const title = ((language === 'en' && article.title_en) ? article.title_en : article.title) || '';
            const content = ((language === 'en' && article.content_en) ? article.content_en : article.content) || '';
            const excerpt = ((language === 'en' && article.excerpt_en) ? article.excerpt_en : (article.excerpt || '')) || '';

            return title.toLowerCase().includes(q) ||
                   content.toLowerCase().includes(q) ||
                   excerpt.toLowerCase().includes(q);
        })
        .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
            <SEO
                title={t('seoBlogTitle')}
                description={t('seoBlogDesc')}
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="flex flex-col items-center text-center gap-6 mb-8">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-bold text-white mb-4">{t('blogTitle')}</h1>
                        <p className="text-zinc-400">
                            {t('blogSubtitle')}
                        </p>
                    </div>

                    {articles.length > 0 && (
                        <div className="w-full max-w-xl flex flex-col gap-6 items-center">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder={t('searchArticles')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <label htmlFor="sort" className="text-sm text-zinc-500 whitespace-nowrap">
                                    {language === 'es' ? 'Ordenar por:' : 'Sort by:'}
                                </label>
                                <div className="relative">
                                    <select
                                        id="sort"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                                        className="appearance-none bg-zinc-900 border border-white/10 rounded-lg pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[160px]"
                                    >
                                        <option value="newest">{language === 'es' ? 'Más recientes' : 'Newest'}</option>
                                        <option value="oldest">{language === 'es' ? 'Más antiguos' : 'Oldest'}</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="glass-panel rounded-2xl overflow-hidden h-96 animate-pulse flex flex-col">
                            <div className="h-48 bg-white/5" />
                            <div className="p-6 flex flex-col gap-4 flex-grow">
                                <div className="h-4 bg-white/5 rounded w-1/3" />
                                <div className="h-6 bg-white/10 rounded w-3/4" />
                                <div className="h-4 bg-white/5 rounded w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAndSortedArticles.map((article, index) => (
                        <ArticleCard key={article.id} article={article} index={index} />
                    ))}
                    {filteredAndSortedArticles.length === 0 && (
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

function ArticleCard({ article, index }: { article: Article; index: number }) {
    const { t, language } = useLanguage();

    const articlePath = `/blog/${article.slug}`;
    const localizedPath = language === 'en' ? `/en${articlePath}` : articlePath;
    const displayTitle = (language === 'en' && article.title_en) ? article.title_en : article.title;
    const displayExcerpt = (language === 'en' && article.excerpt_en)
        ? article.excerpt_en
        : (article.excerpt || (article.content || '').substring(0, 150) + "...");

    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
            className="glass-panel rounded-2xl overflow-hidden hover:border-primary/50 transition-colors group flex flex-col h-full relative"
        >
            <div className="h-48 overflow-hidden relative flex-shrink-0">
                {article.image_url ? (
                    <ResponsiveImage
                        src={article.image_url}
                        alt={article.image_alt || displayTitle}
                        lazy={index !== 0}
                        fetchPriority={index === 0 ? "high" : "auto"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-white/5 to-accent/20 transition-transform duration-500 group-hover:scale-110" />
                )}
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(article.created_at).toLocaleDateString()}
                    </span>
                    {article.category && (
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                            {article.category}
                        </span>
                    )}
                </div>

                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors leading-snug pb-1">
                    {/* The pseudo-element turns the whole card into the link's hit area
                        while keeping a single crawlable anchor for the article. */}
                    <Link to={localizedPath} className="before:absolute before:inset-0 before:content-['']">
                        {displayTitle}
                    </Link>
                </h2>

                <p className="text-zinc-400 text-sm mb-4 line-clamp-3">
                    {displayExcerpt}
                </p>

                <span className="mt-auto inline-flex items-center gap-2 text-primary group-hover:text-accent font-medium text-sm transition-colors">
                    {t('readArticle')} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
            </div>
        </motion.article>
    );
}
