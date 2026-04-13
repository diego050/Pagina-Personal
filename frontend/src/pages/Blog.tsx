import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import api from '../api';
import SEO from '../components/SEO';

interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    created_at: string;
    is_published: boolean;
    category: string;
}

import { useLanguage } from '../context/LanguageContext';

export default function Blog() {
    const { t, language } = useLanguage();
    const [articles, setArticles] = useState<Article[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        api.get('/articles')
            .then(res => {
                const filteredArticles = res.data.filter((article: Article) =>
                    article.category !== 'Projects' && article.category !== 'Proyectos'
                );
                setArticles(filteredArticles);
            })
            .catch(err => console.error(err));
    }, []);

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative">
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
                        <div className="w-full max-w-md">
                            <input
                                type="text"
                                placeholder={t('searchArticles')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center"
                            />
                        </div>
                    )}
                </div>
            </motion.div>

            <div className="space-y-8">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => {
                        const articlePath = `/blog/${article.slug}`;
                        const localizedPath = language === 'en' ? `/en${articlePath}` : articlePath;

                        return (
                            <motion.article
                                layout
                                key={article.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-4 text-sm text-zinc-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(article.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-3">
                                    <Link to={localizedPath} className="hover:text-primary transition-colors">
                                        {article.title}
                                    </Link>
                                </h2>
                                <p className="text-zinc-400 mb-6 line-clamp-2">
                                    {article.content.substring(0, 150)}...
                                </p>
                                <Link
                                    to={localizedPath}
                                    className="inline-flex items-center gap-2 text-primary hover:text-accent font-medium transition-colors"
                                >
                                    {t('readArticle')} <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.article>
                        )
                    })
                ) : (
                    <div className="text-center py-12 text-zinc-500">
                        {articles.length > 0 ? t('noResults') : t('noItems')}
                    </div>
                )}
            </div>
        </div>
    );
}
