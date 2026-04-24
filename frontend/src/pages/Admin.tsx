import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ChevronDown, ChevronRight, PenTool, Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon, Trash2, AlignLeft, AlignCenter, AlignJustify, Upload, Save, X, Layout, Plus, LogOut } from 'lucide-react';
import api, { getContent, updateContent, getMedia, uploadMedia, createMediaFolder, renameMedia, deleteMedia, updateMediaMeta } from '../api';
import SiteContentEditor from '../components/admin/SiteContentEditor';

interface SiteContent {
    key: string;
    value: string;
    category: string;
    label: string;
    input_type: string;
}

export default function Admin() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'articles' | 'projects' | 'content' | 'media'>('articles');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    // Content State
    const [openCategory, setOpenCategory] = useState<string>('home');
    const [contentLang, setContentLang] = useState<'es' | 'en'>('es');
    const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
    const [editingContent, setEditingContent] = useState<SiteContent | null>(null);
    const [contentValue, setContentValue] = useState('');
    const [uploading, setUploading] = useState(false);

    // Media State
    const [mediaFiles, setMediaFiles] = useState<any[]>([]);
    const [currentPath, setCurrentPath] = useState<string>('');

    // Article Form State
    const [showPreview, setShowPreview] = useState(false);
    const [showPreviewEn, setShowPreviewEn] = useState(false);
    const [articleTitle, setArticleTitle] = useState('');
    const [articleTitleEn, setArticleTitleEn] = useState('');
    const [articleSlug, setArticleSlug] = useState('');
    const [articleExcerpt, setArticleExcerpt] = useState('');
    const [articleExcerptEn, setArticleExcerptEn] = useState('');
    const [articleContent, setArticleContent] = useState('');
    const [articleContentEn, setArticleContentEn] = useState('');
    const [articleCategory, setArticleCategory] = useState('');
    const [articleTags, setArticleTags] = useState('');
    const [articleImage, setArticleImage] = useState('');

    // Data State
    const [articles, setArticles] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Project Form State
    const [projectTitle, setProjectTitle] = useState('');
    const [projectTitleEn, setProjectTitleEn] = useState(''); // New
    const [projectSlug, setProjectSlug] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [projectDescEn, setProjectDescEn] = useState(''); // New
    const [projectContent, setProjectContent] = useState('');
    const [projectContentEn, setProjectContentEn] = useState(''); // New
    const [additionalLinks, setAdditionalLinks] = useState<{url: string, label: string, label_en: string}[]>([]);
    const [projectImage, setProjectImage] = useState('');
    const [projectTags, setProjectTags] = useState('');

    // Modals State
    const [editMediaTarget, setEditMediaTarget] = useState<any | null>(null);
    const [deleteMediaTarget, setDeleteMediaTarget] = useState<any | null>(null);
    const [editMediaForm, setEditMediaForm] = useState({ name: '', alt_text: '', title_tag: '' });
    const [showMediaSelector, setShowMediaSelector] = useState(false);
    const [mediaSelectorCallback, setMediaSelectorCallback] = useState<((url: string) => void) | null>(null);

    const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    // UI View State
    const [showTechMeta, setShowTechMeta] = useState(false);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    const addAdditionalLink = () => {
        setAdditionalLinks([...additionalLinks, { url: '', label: '', label_en: '' }]);
    };

    const removeAdditionalLink = (index: number) => {
        setAdditionalLinks(additionalLinks.filter((_, i) => i !== index));
    };

    const updateAdditionalLink = (index: number, field: string, value: string) => {
        const newLinks = [...additionalLinks];
        newLinks[index] = { ...newLinks[index], [field]: value } as any;
        setAdditionalLinks(newLinks);
    };

    const openMediaSelector = (callback: (url: string) => void) => {
        setMediaSelectorCallback(() => callback);
        setShowMediaSelector(true);
    };

    useEffect(() => {
        fetchData();
        fetchContent();
        fetchMedia(currentPath);
    }, [currentPath]);

    const fetchData = async () => {
        try {
            const [artRes, projRes] = await Promise.all([
                api.get('/articles'),
                api.get('/projects')
            ]);
            setArticles(artRes.data);
            setProjects(projRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchContent = async () => {
        try {
            const res = await getContent();
            setSiteContent(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMedia = async (path: string = '') => {
        try {
            const res = await getMedia(path);
            setMediaFiles(res.data);
        } catch (error) {
            console.error("Error fetching media:", error);
        }
    };

    const handleSaveContent = async () => {
        if (!editingContent) return;
        try {
            // Basic JSON validation
            if (editingContent.input_type === 'json') {
                try {
                    JSON.parse(contentValue); // Validate but optimize minification if needed
                } catch (e) {
                    alert('Invalid JSON format');
                    return;
                }
            }

            await updateContent(editingContent.key, contentValue);
            setEditingContent(null);
            fetchContent();
        } catch (error) {
            console.error(error);
            alert('Error updating content');
        }
    };

    const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setContentValue(res.data.url);
            fetchMedia(); // Refresh media
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleNewMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            await uploadMedia(file, currentPath);
            fetchMedia(currentPath);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleCreateFolder = () => {
        setNewFolderName('');
        setShowCreateFolderModal(true);
    };

    const submitCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;
        try {
            await createMediaFolder(currentPath, newFolderName.trim());
            setShowCreateFolderModal(false);
            fetchMedia(currentPath);
        } catch (err) {
            alert('Failed to create folder');
        }
    };

    const openEditMediaModal = (file: any) => {
        setEditMediaTarget(file);
        setEditMediaForm({ 
            name: file.name, 
            alt_text: file.alt_text || '', 
            title_tag: file.title_tag || '' 
        });
    };
    const submitEditMedia = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editMediaTarget) return;

        try {
            const prefix = currentPath ? currentPath + '/' : '';
            const newPath = prefix + editMediaForm.name;
            
            // If name changed, rename it
            if (editMediaForm.name !== editMediaTarget.name) {
                await renameMedia(editMediaTarget.path, newPath);
            }

            // Only update meta if it's a file (folders don't usually need alt-text in this context, but allowed)
            await updateMediaMeta(newPath, editMediaForm.alt_text, editMediaForm.title_tag);
            
            setEditMediaTarget(null);
            fetchMedia(currentPath);
        } catch (err) {
            alert('Failed to update media details');
        }
    };

    const confirmDeleteMedia = async () => {
        if (!deleteMediaTarget) return;
        try {
            await deleteMedia(deleteMediaTarget.path);
            setDeleteMediaTarget(null);
            fetchMedia(currentPath);
        } catch (err) {
            alert('Failed to delete media');
        }
    };

    const handleEditArticle = (article: any) => {
        setEditingId(article.id);
        setActiveTab('articles');
        setArticleTitle(article.title);
        setArticleTitleEn(article.title_en || '');
        setArticleSlug(article.slug);
        setArticleExcerpt(article.excerpt || '');
        setArticleExcerptEn(article.excerpt_en || '');
        setArticleContent(article.content);
        setArticleContentEn(article.content_en || '');
        setArticleCategory(article.category || '');
        setArticleTags(article.tags || '');
        setArticleImage(article.image_url || '');
        try {
            const extra = article.additional_links ? JSON.parse(article.additional_links) : [];
            setAdditionalLinks(Array.isArray(extra) ? extra : []);
        } catch (e) {
            setAdditionalLinks([]);
        }
    };

    const handleEditProject = (project: any) => {
        setEditingId(project.id);
        setActiveTab('projects');
        setProjectTitle(project.title);
        setProjectTitleEn(project.title_en || '');
        setProjectSlug(project.slug || '');
        setProjectDesc(project.description || '');
        setProjectDescEn(project.description_en || '');
        setProjectContent(project.content || '');
        setProjectContentEn(project.content_en || '');
        try {
            const extra = project.additional_links ? JSON.parse(project.additional_links) : [];
            setAdditionalLinks(Array.isArray(extra) ? extra : []);
        } catch (e) {
            setAdditionalLinks([]);
        }
        setProjectImage(project.image_url);
        setProjectTags(project.tags);
    };

    const handleDeleteArticle = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        try {
            await api.delete(`/articles/${id}`);
            alert('Article deleted');
            if (editingId === id) resetForm();
            fetchData();
        } catch (error) {
            console.error("Error deleting article:", error);
            alert('Failed to delete article');
        }
    };

    const handleDeleteProject = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.delete(`/projects/${id}`);
            alert('Project deleted');
            if (editingId === id) resetForm();
            fetchData();
        } catch (error) {
            console.error("Error deleting project:", error);
            alert('Failed to delete project');
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setArticleTitle(''); setArticleTitleEn('');
        setArticleSlug('');
        setArticleExcerpt(''); setArticleExcerptEn('');
        setArticleContent(''); setArticleContentEn('');
        setArticleCategory(''); setArticleTags(''); setArticleImage('');
        setProjectTitle(''); setProjectTitleEn('');
        setProjectDesc(''); setProjectDescEn('');
        setAdditionalLinks([]);
        setProjectImage(''); setProjectTags(''); setProjectSlug('');
        setProjectContent(''); setProjectContentEn('');
    };

    const insertMarkdownAt = (prefix: string, suffix: string, editorId: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        const textarea = document.getElementById(editorId) as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const selected = text.substring(start, end);
        const after = text.substring(end);

        const newText = `${before}${prefix}${selected}${suffix}${after}`;

        setter(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    };

    const handleInsertImageFromMedia = (editorId: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        const textarea = document.getElementById(editorId) as HTMLTextAreaElement;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end);

        openMediaSelector((url) => {
            const currentText = textarea.value; 
            const before = currentText.substring(0, start);
            const after = currentText.substring(end);
            
            let imageMarkdown = `![${selected || 'Image'}](${url})`;
            if (selected.startsWith('![') && selected.includes('](')) {
                imageMarkdown = `![Image](${url})`;
            }

            setter(`${before}${imageMarkdown}${after}`);

            setTimeout(() => {
                textarea.focus();
                const newPos = start + imageMarkdown.length;
                textarea.setSelectionRange(newPos, newPos);
            }, 0);
        });
    };

    const handleImageUploadGeneric = async (e: React.ChangeEvent<HTMLInputElement>, editorId: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
            insertMarkdownAt(`![Image](${res.data.url})`, '', editorId, setter);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
        }
    };

    const handleSaveArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                title: articleTitle,
                title_en: articleTitleEn,
                slug: articleSlug,
                excerpt: articleExcerpt,
                excerpt_en: articleExcerptEn,
                content: articleContent,
                content_en: articleContentEn,
                category: articleCategory || 'General',
                tags: articleTags,
                image_url: articleImage,
                is_published: true,
                additional_links: JSON.stringify(additionalLinks)
            };

            if (editingId) {
                await api.put(`/articles/${editingId}`, payload);
                alert('Article updated!');
            } else {
                await api.post('/articles', payload);
                alert('Article created!');
            }
            resetForm();
            fetchData();
        } catch (err) {
            alert('Error saving article');
            console.error(err);
        }
    };

    const handleSaveProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                title: projectTitle,
                title_en: projectTitleEn, // New
                slug: projectSlug,
                description: projectDesc,
                description_en: projectDescEn, // New
                content_en: projectContentEn, // New
                additional_links: JSON.stringify(additionalLinks),
                image_url: projectImage,
                tags: projectTags
            };

            if (editingId) {
                await api.put(`/projects/${editingId}`, payload);
                alert('Project updated!');
            } else {
                await api.post('/projects', payload);
                alert('Project created!');
            }
            resetForm();
            fetchData();
        } catch (err) {
            alert('Error saving project');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-primary/30">
            {/* Navbar */}
            <nav className="border-b border-white/10 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-end h-16 items-center gap-4">
                        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                            {[
                                { id: 'articles', label: 'Articles', icon: <PenTool className="w-4 h-4" /> },
                                { id: 'projects', label: 'Projects', icon: <Layout className="w-4 h-4" /> },
                                { id: 'content', label: 'Site Content', icon: <Layout className="w-4 h-4" /> },
                                { id: 'media', label: 'Media', icon: <ImageIcon className="w-4 h-4" /> }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                                        ? 'bg-zinc-800 text-white shadow-sm'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                            title="Desconectar"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === 'content' ? (
                    <div className="space-y-12 animate-in fade-in duration-500">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Site Content</h2>
                                <p className="text-zinc-400">Customize your website's text, images, and structure efficiently.</p>
                            </div>
                            <div className="flex bg-black/50 border border-white/10 p-1 rounded-xl shrink-0">
                                <button 
                                    onClick={() => setContentLang('es')} 
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${contentLang === 'es' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    Español
                                </button>
                                <button 
                                    onClick={() => setContentLang('en')} 
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${contentLang === 'en' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    English
                                </button>
                            </div>
                        </div>

                        {/* Sections Accordion */}
                        <div className="space-y-4">
                            {['home', 'about'].map(category => {
                                const isOpen = openCategory === category;
                                return (
                                    <section key={category} className="bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden transition-all">
                                        <div 
                                            onClick={() => setOpenCategory(isOpen ? '' : category)}
                                            className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors"
                                        >
                                            <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-3">
                                                {category} Page
                                            </h3>
                                            <div className="p-2 text-zinc-500">
                                                {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                            </div>
                                        </div>

                                        {isOpen && (
                                            <div className="p-6 pt-0 border-t border-white/5">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                                                    {siteContent.filter(c => {
                                                        if (c.category !== category) return false;
                                                        if (contentLang === 'es') return !c.label.includes('(EN)');
                                                        return !c.label.includes('(ES)');
                                                    }).map(item => (
                                                        <div
                                                            key={item.key}
                                                            onClick={() => {
                                                                setEditingContent(item);
                                                                setContentValue(item.value);
                                                            }}
                                                            className="group bg-zinc-950/50 border border-white/5 rounded-2xl p-5 hover:border-cyan-500/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-cyan-900/10 relative overflow-hidden flex flex-col justify-between"
                                                        >
                                                            <div>
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border border-white/5 group-hover:bg-cyan-950 group-hover:text-cyan-400 transition-colors">
                                                                        {item.input_type}
                                                                    </span>
                                                                    <div className="p-2 rounded-full bg-white/5 text-zinc-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                                                                        <PenTool className="w-3 h-3" />
                                                                    </div>
                                                                </div>

                                                                <h4 className="font-semibold text-white mb-2 pr-6">{item.label}</h4>
                                                            </div>

                                                            <div className="mt-4 pt-4 border-t border-white/5">
                                                                {item.input_type === 'image' ? (
                                                                    <div className="h-24 w-full bg-black/50 rounded-lg overflow-hidden border border-white/5 relative group-hover:border-cyan-500/30 transition-colors">
                                                                        {item.value ? (
                                                                            <img src={item.value} alt={item.label} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <div className="flex items-center justify-center h-full text-zinc-600 text-xs">No image</div>
                                                                        )}
                                                                    </div>
                                                                ) : (() => {
                                                                    if (!item.value) return <p className="text-sm text-zinc-400"><span className="text-zinc-600 italic">Empty</span></p>;
                                                                    try {
                                                                        const parsed = JSON.parse(item.value);
                                                                        if (Array.isArray(parsed)) {
                                                                            if (typeof parsed[0] === 'string') {
                                                                                return (
                                                                                    <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-12">
                                                                                        {parsed.slice(0, 3).map((tag, i) => (
                                                                                            <span key={i} className="px-2 py-0.5 bg-zinc-800/80 text-zinc-300 text-[10px] rounded-md border border-white/5 truncate max-w-[120px]">
                                                                                                {tag}
                                                                                            </span>
                                                                                        ))}
                                                                                        {parsed.length > 3 && (
                                                                                            <span className="px-2 py-0.5 bg-zinc-800/50 text-cyan-500 font-bold text-[10px] rounded-md border border-white/5">
                                                                                                +{parsed.length - 3}
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            } else if (typeof parsed[0] === 'object') {
                                                                                return (
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className="px-2 py-1 bg-purple-500/10 text-purple-400 font-bold text-[10px] rounded-md border border-purple-500/20">
                                                                                            {parsed.length} JSON Object{parsed.length !== 1 ? 's' : ''}
                                                                                        </span>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        }
                                                                    } catch (e) {}
                                                                    return (
                                                                        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed group-hover:text-zinc-300 transition-colors">
                                                                            {item.value}
                                                                        </p>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </section>
                                );
                            })}
                        </div>
                    </div>
                ) : activeTab === 'media' ? (
                    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-end justify-between border-b border-white/10 pb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Media Manager</h2>
                                <p className="text-zinc-400">Manage your assets structure.</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleCreateFolder} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                                    New Folder
                                </button>
                                <label className="cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
                                    {uploading ? <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" /> : <Upload className="w-4 h-4" />}
                                    Upload
                                    <input type="file" accept="image/*" onChange={handleNewMediaUpload} className="hidden" disabled={uploading} />
                                </label>
                            </div>
                        </div>

                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-900/40 p-4 rounded-xl border border-white/5">
                            <button onClick={() => setCurrentPath('')} className="hover:text-white transition-colors">ROOT</button>
                            {currentPath && currentPath.split('/').map((part, index, arr) => (
                                <React.Fragment key={index}>
                                    <ChevronRight className="w-4 h-4" />
                                    <button 
                                        onClick={() => setCurrentPath(arr.slice(0, index + 1).join('/'))}
                                        className="hover:text-white transition-colors"
                                    >
                                        {part}
                                    </button>
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {mediaFiles.map((file, idx) => (
                                <div key={idx} 
                                    onDoubleClick={() => file.type === 'folder' && setCurrentPath(file.path)}
                                    className="group relative bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all cursor-pointer"
                                >
                                    {file.type === 'folder' ? (
                                        <div className="aspect-square flex items-center justify-center bg-black/50 text-cyan-500/50 group-hover:text-cyan-400 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                                        </div>
                                    ) : (
                                        <div className="aspect-square bg-black/50 relative overflow-hidden">
                                            <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText(file.url);
                                                    }}
                                                    className="bg-cyan-500 text-black px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg hover:scale-105 transition-transform"
                                                >
                                                    Copy URL
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-3 border-t border-white/5">
                                        <p className="text-xs text-zinc-300 font-medium truncate" title={file.name}>{file.name}</p>
                                        {file.type === 'file' && <p className="text-[10px] text-zinc-600 mt-1">{(file.size / 1024).toFixed(1)} KB</p>}
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); openEditMediaModal(file); }} className="p-1.5 bg-black/80 text-white rounded hover:bg-cyan-500 hover:text-black transition-colors" title="Edit Metadata & Rename"><PenTool className="w-3 h-3" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); setDeleteMediaTarget(file); }} className="p-1.5 bg-black/80 text-white rounded hover:bg-red-500 hover:text-white transition-colors" title="Delete"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                </div>
                            ))}
                            {mediaFiles.length === 0 && (
                                <div className="col-span-full py-20 text-center text-zinc-500 border border-dashed border-white/10 rounded-2xl">
                                    Empty Directory
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Existing Forms (Articles / Projects)
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in-95 duration-200">
                        {/* Editor Section */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="glass-panel p-8 rounded-2xl border border-white/5 bg-zinc-900/50">
                                {activeTab === 'articles' ? (
                                    <form onSubmit={handleSaveArticle} className="space-y-6">                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Title (ES)</label>
                                                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all placeholder:text-zinc-700"
                                                    value={articleTitle} onChange={e => setArticleTitle(e.target.value)} required placeholder="Mi artículo increíble" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Title (EN)</label>
                                                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all placeholder:text-zinc-700"
                                                    value={articleTitleEn} onChange={e => setArticleTitleEn(e.target.value)} placeholder="My Amazing Article" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Slug</label>
                                                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-zinc-300 font-mono text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all placeholder:text-zinc-700"
                                                    value={articleSlug} onChange={e => setArticleSlug(e.target.value)} required placeholder="my-amazing-article" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Excerpt (ES)</label>
                                                <textarea className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-zinc-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all placeholder:text-zinc-700 resize-none"
                                                    value={articleExcerpt} onChange={e => setArticleExcerpt(e.target.value)} placeholder="Breve resumen..." />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Excerpt (EN)</label>
                                                <textarea className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-zinc-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all placeholder:text-zinc-700 resize-none"
                                                    value={articleExcerptEn} onChange={e => setArticleExcerptEn(e.target.value)} placeholder="Short summary..." />
                                            </div>
                                        </div>

                                        {/* Content Editor ES */}
                                        <div className="bg-black/40 rounded-xl border border-white/10 overflow-hidden focus-within:border-cyan-500/50 transition-colors">
                                            <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5 gap-2">
                                                <span className="hidden sm:block text-xs font-bold text-zinc-500 uppercase">Content (ES)</span>
                                                <div className="flex flex-wrap items-center gap-1">
                                                    <button type="button" onClick={() => insertMarkdownAt('**', '**', 'article-editor', setArticleContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Bold"><Bold className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('*', '*', 'article-editor', setArticleContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Italic"><Italic className="w-3 h-3" /></button>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt('# ', '', 'article-editor', setArticleContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Heading 1"><Heading1 className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('## ', '', 'article-editor', setArticleContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Heading 2"><Heading2 className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('### ', '', 'article-editor', setArticleContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Heading 3"><Heading3 className="w-3 h-3" /></button>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt('- ', '', 'article-editor', setArticleContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Bullet List"><List className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('1. ', '', 'article-editor', setArticleContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Ordered List"><ListOrdered className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('> ', '', 'article-editor', setArticleContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Quote"><Quote className="w-3 h-3" /></button>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt('[', '](url)', 'article-editor', setArticleContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Link"><LinkIcon className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => handleInsertImageFromMedia('article-editor', setArticleContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Insert Image from Media"><ImageIcon className="w-3 h-3" /></button>
                                                    <label className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded cursor-pointer" title="Direct Upload Image">
                                                        <Upload className="w-3 h-3" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUploadGeneric(e, 'article-editor', setArticleContent)} />
                                                    </label>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt(`<div style="text-align: left">\n\n`, '\n\n</div>', 'article-editor', setArticleContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Align Left"><AlignLeft className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt(`<div style="text-align: center">\n\n`, '\n\n</div>', 'article-editor', setArticleContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Align Center"><AlignCenter className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt(`<div style="text-align: justify">\n\n`, '\n\n</div>', 'article-editor', setArticleContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Justify"><AlignJustify className="w-3 h-3" /></button>
                                                    <div className="flex bg-black/50 rounded-md p-0.5 ml-2 border border-white/5">
                                                        <button type="button" onClick={() => setShowPreview(false)} className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${!showPreview ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Edit</button>
                                                        <button type="button" onClick={() => setShowPreview(true)} className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${showPreview ? 'bg-cyan-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Preview</button>
                                                    </div>
                                                </div>
                                            </div>
                                            {showPreview ? (
                                                <div className="p-6 prose prose-invert prose-sm max-w-none h-[400px] overflow-y-auto bg-zinc-900">
                                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{articleContent}</ReactMarkdown>
                                                </div>
                                            ) : (
                                                <textarea id="article-editor" className="w-full h-[300px] bg-transparent p-6 text-zinc-300 font-mono text-sm focus:outline-none resize-none leading-relaxed"
                                                    value={articleContent} onChange={e => setArticleContent(e.target.value)} placeholder="# Contenido en español..." required />
                                            )}
                                        </div>

                                        {/* Content Editor EN */}
                                        <div className="bg-black/40 rounded-xl border border-white/10 overflow-hidden focus-within:border-cyan-500/50 transition-colors">
                                            <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5 gap-2">
                                                <span className="hidden sm:block text-xs font-bold text-zinc-500 uppercase">Content (EN)</span>
                                                <div className="flex flex-wrap items-center gap-1">
                                                    <button type="button" onClick={() => insertMarkdownAt('**', '**', 'article-editor-en', setArticleContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Bold"><Bold className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('*', '*', 'article-editor-en', setArticleContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Italic"><Italic className="w-3 h-3" /></button>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt('# ', '', 'article-editor-en', setArticleContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Heading 1"><Heading1 className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('## ', '', 'article-editor-en', setArticleContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Heading 2"><Heading2 className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('### ', '', 'article-editor-en', setArticleContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Heading 3"><Heading3 className="w-3 h-3" /></button>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt('- ', '', 'article-editor-en', setArticleContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Bullet List"><List className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('1. ', '', 'article-editor-en', setArticleContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Ordered List"><ListOrdered className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('> ', '', 'article-editor-en', setArticleContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Quote"><Quote className="w-3 h-3" /></button>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt('[', '](url)', 'article-editor-en', setArticleContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Link"><LinkIcon className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => handleInsertImageFromMedia('article-editor-en', setArticleContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Insert Image from Media"><ImageIcon className="w-3 h-3" /></button>
                                                    <label className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded cursor-pointer" title="Direct Upload Image">
                                                        <Upload className="w-3 h-3" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUploadGeneric(e, 'article-editor-en', setArticleContentEn)} />
                                                    </label>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt(`<div style="text-align: left">\n\n`, '\n\n</div>', 'article-editor-en', setArticleContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Align Left"><AlignLeft className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt(`<div style="text-align: center">\n\n`, '\n\n</div>', 'article-editor-en', setArticleContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Align Center"><AlignCenter className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt(`<div style="text-align: justify">\n\n`, '\n\n</div>', 'article-editor-en', setArticleContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Justify"><AlignJustify className="w-3 h-3" /></button>
                                                    <div className="flex bg-black/50 rounded-md p-0.5 ml-2 border border-white/5">
                                                        <button type="button" onClick={() => setShowPreviewEn(false)} className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${!showPreviewEn ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Edit</button>
                                                        <button type="button" onClick={() => setShowPreviewEn(true)} className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${showPreviewEn ? 'bg-cyan-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Preview</button>
                                                    </div>
                                                </div>
                                            </div>
                                            {showPreviewEn ? (
                                                <div className="p-6 prose prose-invert prose-sm max-w-none h-[400px] overflow-y-auto bg-zinc-900">
                                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{articleContentEn}</ReactMarkdown>
                                                </div>
                                            ) : (
                                                <textarea id="article-editor-en" className="w-full h-[300px] bg-transparent p-6 text-zinc-300 font-mono text-sm focus:outline-none resize-none leading-relaxed"
                                                    value={articleContentEn} onChange={e => setArticleContentEn(e.target.value)} placeholder="Detailed content in English..." />
                                            )}
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Category</label>
                                                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-all"
                                                    value={articleCategory} onChange={e => setArticleCategory(e.target.value)} placeholder="Tech" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Image URL</label>
                                                <div className="flex gap-2">
                                                    <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-all"
                                                        value={articleImage} onChange={e => setArticleImage(e.target.value)} placeholder="https://..." />
                                                    <button type="button" onClick={() => openMediaSelector((url) => setArticleImage(url))} className="bg-zinc-800 hover:bg-cyan-500 hover:text-black border border-white/10 text-white px-3 rounded-xl transition-colors shrink-0 flex items-center justify-center">
                                                        <ImageIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Tags</label>
                                                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-all"
                                                    value={articleTags} onChange={e => setArticleTags(e.target.value)} placeholder="React, Python" />
                                            </div>
                                        </div>
                                        <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Additional Links</h4>
                                                <button type="button" onClick={addAdditionalLink} className="flex items-center gap-1 text-[10px] bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-black px-2 py-1 rounded-full transition-all font-bold">
                                                    <Plus className="w-3 h-3" /> Add Link
                                                </button>
                                            </div>
                                            
                                            {additionalLinks.length === 0 && (
                                                <div className="text-center py-4 border-2 border-dashed border-white/5 rounded-lg">
                                                    <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">No additional links</p>
                                                </div>
                                            )}

                                            <div className="space-y-3">
                                                {additionalLinks.map((link, index) => (
                                                    <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,1fr,1fr,auto] gap-3 p-3 bg-black/40 rounded-lg border border-white/5 relative group">
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-bold text-zinc-500 uppercase">URL</label>
                                                            <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-cyan-500 focus:outline-none transition-all"
                                                                value={link.url} onChange={e => updateAdditionalLink(index, 'url', e.target.value)} placeholder="https://..." />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-bold text-zinc-500 uppercase">Label (ES)</label>
                                                            <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-cyan-500 focus:outline-none transition-all"
                                                                value={link.label} onChange={e => updateAdditionalLink(index, 'label', e.target.value)} placeholder="Ver..." />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-bold text-zinc-500 uppercase">Label (EN)</label>
                                                            <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-cyan-500 focus:outline-none transition-all"
                                                                value={link.label_en} onChange={e => updateAdditionalLink(index, 'label_en', e.target.value)} placeholder="View..." />
                                                        </div>
                                                        <div className="flex items-end">
                                                            <button type="button" onClick={() => removeAdditionalLink(index)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full bg-white text-black hover:bg-cyan-400 font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2">
                                            {editingId ? <><Save className="w-4 h-4" /> Update Article</> : <><Plus className="w-4 h-4" /> Publish Article</>}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleSaveProject} className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Title (ES)</label>
                                                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-all"
                                                    value={projectTitle} onChange={e => setProjectTitle(e.target.value)} required placeholder="Nombre del proyecto" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Title (EN)</label>
                                                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-all"
                                                    value={projectTitleEn} onChange={e => setProjectTitleEn(e.target.value)} placeholder="Project Name" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Slug</label>
                                                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-zinc-300 font-mono text-sm focus:border-cyan-500 focus:outline-none transition-all"
                                                    value={projectSlug} onChange={e => setProjectSlug(e.target.value)} required placeholder="project-slug" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Short Description (ES)</label>
                                                <textarea className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-all resize-none"
                                                    value={projectDesc} onChange={e => setProjectDesc(e.target.value)} placeholder="Resumen..." />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Short Description (EN)</label>
                                                <textarea className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-all resize-none"
                                                    value={projectDescEn} onChange={e => setProjectDescEn(e.target.value)} placeholder="Summary..." />
                                            </div>
                                        </div>

                                        <div className="bg-black/40 rounded-xl border border-white/10 overflow-hidden focus-within:border-cyan-500/50 transition-colors">
                                            <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5 gap-2">
                                                <span className="hidden sm:block text-xs font-bold text-zinc-500 uppercase">Content (ES)</span>
                                                <div className="flex flex-wrap items-center gap-1">
                                                    <button type="button" onClick={() => insertMarkdownAt('**', '**', 'project-editor', setProjectContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Bold"><Bold className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('*', '*', 'project-editor', setProjectContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Italic"><Italic className="w-3 h-3" /></button>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt('# ', '', 'project-editor', setProjectContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Heading 1"><Heading1 className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('## ', '', 'project-editor', setProjectContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Heading 2"><Heading2 className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('### ', '', 'project-editor', setProjectContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Heading 3"><Heading3 className="w-3 h-3" /></button>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt('- ', '', 'project-editor', setProjectContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Bullet List"><List className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('1. ', '', 'project-editor', setProjectContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Ordered List"><ListOrdered className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('> ', '', 'project-editor', setProjectContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Quote"><Quote className="w-3 h-3" /></button>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt('[', '](url)', 'project-editor', setProjectContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Link"><LinkIcon className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => handleInsertImageFromMedia('project-editor', setProjectContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Insert Image from Media">
                                                        <ImageIcon className="w-3 h-3" />
                                                    </button>
                                                    <label className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded cursor-pointer" title="Direct Upload Image">
                                                        <Upload className="w-3 h-3" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUploadGeneric(e, 'project-editor', setProjectContent)} />
                                                    </label>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt(`<div style="text-align: left">\n\n`, '\n\n</div>', 'project-editor', setProjectContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Align Left"><AlignLeft className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt(`<div style="text-align: center">\n\n`, '\n\n</div>', 'project-editor', setProjectContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Align Center"><AlignCenter className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt(`<div style="text-align: justify">\n\n`, '\n\n</div>', 'project-editor', setProjectContent)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Justify"><AlignJustify className="w-3 h-3" /></button>

                                                    <div className="flex bg-black/50 rounded-md p-0.5 ml-2 border border-white/5">
                                                        <button type="button" onClick={() => setShowPreview(false)} className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${!showPreview ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Edit</button>
                                                        <button type="button" onClick={() => setShowPreview(true)} className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${showPreview ? 'bg-cyan-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Preview</button>
                                                    </div>
                                                </div>
                                            </div>
                                            {showPreview ? (
                                                <div className="p-6 prose prose-invert prose-sm max-w-none h-[400px] overflow-y-auto bg-zinc-900">
                                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{projectContent}</ReactMarkdown>
                                                </div>
                                            ) : (
                                                <textarea id="project-editor" className="w-full h-[400px] bg-transparent p-6 text-zinc-300 font-mono text-sm focus:outline-none resize-none leading-relaxed"
                                                    value={projectContent} onChange={e => setProjectContent(e.target.value)} placeholder="Contenido detallado en Markdown..." required />
                                            )}
                                        </div>

                                        <div className="bg-black/40 rounded-xl border border-white/10 overflow-hidden focus-within:border-cyan-500/50 transition-colors mt-6">
                                            <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5 gap-2">
                                                <span className="hidden sm:block text-xs font-bold text-zinc-500 uppercase">Content (EN) - Markdown</span>
                                                <div className="flex flex-wrap items-center gap-1">
                                                    <button type="button" onClick={() => insertMarkdownAt('**', '**', 'project-editor-en', setProjectContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Bold"><Bold className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('*', '*', 'project-editor-en', setProjectContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Italic"><Italic className="w-3 h-3" /></button>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt('# ', '', 'project-editor-en', setProjectContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Heading 1"><Heading1 className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('## ', '', 'project-editor-en', setProjectContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Heading 2"><Heading2 className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('### ', '', 'project-editor-en', setProjectContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Heading 3"><Heading3 className="w-3 h-3" /></button>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt('- ', '', 'project-editor-en', setProjectContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Bullet List"><List className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('1. ', '', 'project-editor-en', setProjectContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Ordered List"><ListOrdered className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt('> ', '', 'project-editor-en', setProjectContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Quote"><Quote className="w-3 h-3" /></button>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt('[', '](url)', 'project-editor-en', setProjectContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Link"><LinkIcon className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => handleInsertImageFromMedia('project-editor-en', setProjectContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Insert Image from Media">
                                                        <ImageIcon className="w-3 h-3" />
                                                    </button>
                                                    <label className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded cursor-pointer" title="Direct Upload Image">
                                                        <Upload className="w-3 h-3" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUploadGeneric(e, 'project-editor-en', setProjectContentEn)} />
                                                    </label>
                                                    <div className="w-px h-3 bg-white/10 mx-1"></div>
                                                    <button type="button" onClick={() => insertMarkdownAt(`<div style="text-align: left">\n\n`, '\n\n</div>', 'project-editor-en', setProjectContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Align Left"><AlignLeft className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt(`<div style="text-align: center">\n\n`, '\n\n</div>', 'project-editor-en', setProjectContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Align Center"><AlignCenter className="w-3 h-3" /></button>
                                                    <button type="button" onClick={() => insertMarkdownAt(`<div style="text-align: justify">\n\n`, '\n\n</div>', 'project-editor-en', setProjectContentEn)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded" title="Justify"><AlignJustify className="w-3 h-3" /></button>

                                                    <div className="flex bg-black/50 rounded-md p-0.5 ml-2 border border-white/5">
                                                        <button type="button" onClick={() => setShowPreviewEn(false)} className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${!showPreviewEn ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Edit</button>
                                                        <button type="button" onClick={() => setShowPreviewEn(true)} className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${showPreviewEn ? 'bg-cyan-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Preview</button>
                                                    </div>
                                                </div>
                                            </div>
                                            {showPreviewEn ? (
                                                <div className="p-6 prose prose-invert prose-sm max-w-none h-[400px] overflow-y-auto bg-zinc-900">
                                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{projectContentEn}</ReactMarkdown>
                                                </div>
                                            ) : (
                                                <textarea id="project-editor-en" className="w-full h-[300px] bg-transparent p-6 text-zinc-300 font-mono text-sm focus:outline-none resize-none leading-relaxed"
                                                    value={projectContentEn} onChange={e => setProjectContentEn(e.target.value)} placeholder="Detailed markdown content in English..." />
                                            )}
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Image URL</label>
                                                <div className="flex gap-2">
                                                    <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-all"
                                                        value={projectImage} onChange={e => setProjectImage(e.target.value)} required placeholder="https://..." />
                                                    <button type="button" onClick={() => openMediaSelector((url) => setProjectImage(url))} className="bg-zinc-800 hover:bg-cyan-500 hover:text-black border border-white/10 text-white px-3 rounded-xl transition-colors shrink-0 flex items-center justify-center">
                                                        <ImageIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Tags</label>
                                                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-all"
                                                    value={projectTags} onChange={e => setProjectTags(e.target.value)} required placeholder="React, AI" />
                                            </div>
                                        </div>
                                        <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Additional Links</h4>
                                                <button type="button" onClick={addAdditionalLink} className="flex items-center gap-1 text-[10px] bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-black px-2 py-1 rounded-full transition-all font-bold">
                                                    <Plus className="w-3 h-3" /> Add Link
                                                </button>
                                            </div>
                                            
                                            {additionalLinks.length === 0 && (
                                                <div className="text-center py-4 border-2 border-dashed border-white/5 rounded-lg">
                                                    <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">No additional links</p>
                                                </div>
                                            )}

                                            <div className="space-y-3">
                                                {additionalLinks.map((link, index) => (
                                                    <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,1fr,1fr,auto] gap-3 p-3 bg-black/40 rounded-lg border border-white/5 relative group">
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-bold text-zinc-500 uppercase">URL</label>
                                                            <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-cyan-500 focus:outline-none transition-all"
                                                                value={link.url} onChange={e => updateAdditionalLink(index, 'url', e.target.value)} placeholder="https://..." />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-bold text-zinc-500 uppercase">Label (ES)</label>
                                                            <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-cyan-500 focus:outline-none transition-all"
                                                                value={link.label} onChange={e => updateAdditionalLink(index, 'label', e.target.value)} placeholder="Ver..." />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-bold text-zinc-500 uppercase">Label (EN)</label>
                                                            <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-cyan-500 focus:outline-none transition-all"
                                                                value={link.label_en} onChange={e => updateAdditionalLink(index, 'label_en', e.target.value)} placeholder="View..." />
                                                        </div>
                                                        <div className="flex items-end">
                                                            <button type="button" onClick={() => removeAdditionalLink(index)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full bg-white text-black hover:bg-cyan-400 font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2">
                                            {editingId ? <><Save className="w-4 h-4" /> Update Project</> : <><Plus className="w-4 h-4" /> Add Project</>}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Sidebar List */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">
                                Existing {activeTab === 'articles' ? 'Articles' : 'Projects'}
                            </h3>
                            <div className="space-y-2 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {activeTab === 'articles' ? articles.map(article => (
                                    <div key={article.id} onClick={() => handleEditArticle(article)} className="group p-4 bg-zinc-900/50 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-zinc-300 group-hover:text-white transition-colors">{article.title}</h4>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => { e.stopPropagation(); handleEditArticle(article); }} className="p-1.5 bg-white/10 rounded hover:bg-cyan-500 hover:text-black transition-colors"><PenTool className="w-3 h-3" /></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteArticle(article.id); }} className="p-1.5 bg-white/10 rounded hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-3 h-3" /></button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-wide">
                                            <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{article.category}</span>
                                            <span>•</span>
                                            <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )) : projects.map(project => (
                                    <div key={project.id} onClick={() => handleEditProject(project)} className="group p-4 bg-zinc-900/50 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-zinc-300 group-hover:text-white transition-colors">{project.title}</h4>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => { e.stopPropagation(); handleEditProject(project); }} className="p-1.5 bg-white/10 rounded hover:bg-cyan-500 hover:text-black transition-colors"><PenTool className="w-3 h-3" /></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }} className="p-1.5 bg-white/10 rounded hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-3 h-3" /></button>
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-zinc-500 truncate">{project.slug}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* Global Edit Drawer */}
            <AnimatePresence>
                {editingContent && (
                    <SiteContentEditor
                        item={editingContent}
                        value={contentValue}
                        onChange={setContentValue}
                        onSave={handleSaveContent}
                        onCancel={() => setEditingContent(null)}
                        uploading={uploading}
                        onImageUpload={handleContentImageUpload}
                    />
                )}
            </AnimatePresence>

            {/* Edit Media Modal */}
            <AnimatePresence>
                {editMediaTarget && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-zinc-950 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Edit Media</h3>
                                <button onClick={() => setEditMediaTarget(null)} className="text-zinc-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                            </div>
                            
                            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                <form onSubmit={submitEditMedia} className="space-y-4 pb-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Filename</label>
                                    <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-all"
                                        value={editMediaForm.name} onChange={e => setEditMediaForm({...editMediaForm, name: e.target.value})} required />
                                </div>
                                {editMediaTarget.type === 'file' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 mt-4 text-cyan-500">SEO: Alt Text</label>
                                            <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-zinc-300 focus:border-cyan-500 focus:outline-none transition-all"
                                                value={editMediaForm.alt_text} onChange={e => setEditMediaForm({...editMediaForm, alt_text: e.target.value})} placeholder="Describe image for screen readers" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 text-cyan-500">SEO: Title Tag</label>
                                            <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-zinc-300 focus:border-cyan-500 focus:outline-none transition-all"
                                                value={editMediaForm.title_tag} onChange={e => setEditMediaForm({...editMediaForm, title_tag: e.target.value})} placeholder="Hover tooltip text" />
                                        </div>

                                        {(editMediaTarget.width || editMediaTarget.height || editMediaTarget.mime_type) && (
                                            <div className="mt-6 border border-white/5 rounded-xl overflow-hidden bg-white/5">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowTechMeta(!showTechMeta)}
                                                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                                                >
                                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] cursor-pointer">Technical SEO Metadata</label>
                                                    {showTechMeta ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
                                                </button>
                                                
                                                <AnimatePresence>
                                                    {showTechMeta && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-4 pb-4 grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <span className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">og:image:width</span>
                                                                    <code className="text-xs text-cyan-400 font-bold">{editMediaTarget.width}px</code>
                                                                </div>
                                                                <div>
                                                                    <span className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">og:image:height</span>
                                                                    <code className="text-xs text-cyan-400 font-bold">{editMediaTarget.height}px</code>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <span className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">og:image:type</span>
                                                                    <code className="text-xs text-zinc-300">{editMediaTarget.mime_type || 'image/webp'}</code>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                        
                                        {editMediaTarget.url && editMediaTarget.url.endsWith('.webp') && (
                                            <div className="mt-6 border-t border-white/5 pt-4">
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Optimized Variants (Auto-Generated)</label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div 
                                                        onClick={() => setZoomedImage(`${editMediaTarget.url.substring(0, editMediaTarget.url.lastIndexOf('.'))}-sm.webp`)}
                                                        className="flex flex-col items-center bg-black/30 p-2 rounded-xl border border-white/5 cursor-zoom-in hover:border-cyan-500/50 transition-colors group"
                                                    >
                                                        <img src={`${editMediaTarget.url.substring(0, editMediaTarget.url.lastIndexOf('.'))}-sm.webp`} alt="Small Variant" className="h-16 object-scale-down mb-2 group-hover:scale-105 transition-transform" />
                                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-center">Small<br/>400px</span>
                                                    </div>
                                                    <div 
                                                        onClick={() => setZoomedImage(`${editMediaTarget.url.substring(0, editMediaTarget.url.lastIndexOf('.'))}-md.webp`)}
                                                        className="flex flex-col items-center bg-black/30 p-2 rounded-xl border border-white/5 cursor-zoom-in hover:border-cyan-500/50 transition-colors group"
                                                    >
                                                        <img src={`${editMediaTarget.url.substring(0, editMediaTarget.url.lastIndexOf('.'))}-md.webp`} alt="Medium Variant" className="h-16 object-scale-down mb-2 group-hover:scale-105 transition-transform" />
                                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-center">Medium<br/>800px</span>
                                                    </div>
                                                    <div 
                                                        onClick={() => setZoomedImage(`${editMediaTarget.url.substring(0, editMediaTarget.url.lastIndexOf('.'))}-lg.webp`)}
                                                        className="flex flex-col items-center bg-black/30 p-2 rounded-xl border border-white/5 cursor-zoom-in hover:border-cyan-500/50 transition-colors group"
                                                    >
                                                        <img src={`${editMediaTarget.url.substring(0, editMediaTarget.url.lastIndexOf('.'))}-lg.webp`} alt="Large Variant" className="h-16 object-scale-down mb-2 group-hover:scale-105 transition-transform" />
                                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-center">Large<br/>1200px</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                <div className="pt-4 flex justify-end gap-3 border-t border-white/5 mt-6">
                                    <button type="button" onClick={() => setEditMediaTarget(null)} className="px-5 py-2.5 rounded-xl font-medium text-zinc-400 hover:text-white transition-colors">Cancel</button>
                                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-bold transition-transform hover:scale-[1.02]">Save Changes</button>
                                </div>
                            </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Zoomed Image Overlay */}
            <AnimatePresence>
                {zoomedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setZoomedImage(null)}
                        className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] cursor-zoom-out p-8"
                    >
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={zoomedImage}
                            alt="Zoomed Review"
                            className="max-w-full max-h-full rounded-lg shadow-2xl border border-white/10"
                        />
                        <button 
                            onClick={(e) => { e.stopPropagation(); setZoomedImage(null); }}
                            className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Media Confirmation */}
            <AnimatePresence>
                {deleteMediaTarget && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-zinc-950 border border-red-500/30 p-6 rounded-2xl w-full max-w-sm shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                                    <Trash2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Delete Record</h3>
                                    <p className="text-sm text-zinc-400">This action cannot be undone.</p>
                                </div>
                            </div>
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5 mb-6">
                                <p className="text-xs text-zinc-500 break-all">{deleteMediaTarget.path}</p>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setDeleteMediaTarget(null)} className="px-5 py-2.5 rounded-xl font-medium text-zinc-400 hover:text-white transition-colors">Cancel</button>
                                <button onClick={confirmDeleteMedia} className="bg-red-500 hover:bg-red-400 text-white px-5 py-2.5 rounded-xl font-bold transition-transform hover:scale-[1.02]">Delete Permanently</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Folder Modal */}
            <AnimatePresence>
                {showCreateFolderModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-zinc-950 border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-cyan-500" />
                                    New Folder
                                </h3>
                                <button onClick={() => setShowCreateFolderModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={submitCreateFolder} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Folder Name</label>
                                    <input 
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-all"
                                        value={newFolderName} 
                                        onChange={e => setNewFolderName(e.target.value)} 
                                        placeholder="e.g., certificates"
                                        autoFocus
                                        required 
                                    />
                                </div>
                                <div className="pt-2 flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowCreateFolderModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-zinc-400 hover:text-white transition-colors">Cancel</button>
                                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-bold transition-transform hover:scale-[1.02]">Create</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Media Selector Modal */}
            <AnimatePresence>
                {showMediaSelector && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-zinc-950 border border-white/10 p-6 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]"
                        >
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-cyan-500" />
                                Select Media
                            </h3>
                            <button onClick={() => setShowMediaSelector(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Breadcrumbs for Selector */}
                        <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-900/40 p-4 rounded-xl border border-white/5 mb-6 shrink-0">
                            <button onClick={() => setCurrentPath('')} className="hover:text-white transition-colors">ROOT</button>
                            {currentPath && currentPath.split('/').map((part, index, arr) => (
                                <React.Fragment key={index}>
                                    <ChevronRight className="w-4 h-4" />
                                    <button 
                                        onClick={() => setCurrentPath(arr.slice(0, index + 1).join('/'))}
                                        className="hover:text-white transition-colors"
                                    >
                                        {part}
                                    </button>
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {mediaFiles.map((file, idx) => (
                                    <div key={idx} 
                                        onClick={() => {
                                            if (file.type === 'folder') {
                                                setCurrentPath(file.path);
                                            } else {
                                                if (mediaSelectorCallback) mediaSelectorCallback(file.url);
                                                setShowMediaSelector(false);
                                            }
                                        }}
                                        className="group relative bg-zinc-900/40 border border-white/5 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all cursor-pointer"
                                    >
                                        {file.type === 'folder' ? (
                                            <div className="aspect-square flex items-center justify-center bg-black/50 text-cyan-500/50 group-hover:text-cyan-400 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                                            </div>
                                        ) : (
                                            <div className="aspect-square bg-black/50 relative overflow-hidden">
                                                <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                        )}
                                        <div className="p-2 border-t border-white/5">
                                            <p className="text-xs text-center text-zinc-300 font-medium truncate" title={file.name}>{file.name}</p>
                                        </div>
                                    </div>
                                ))}
                                {mediaFiles.length === 0 && (
                                    <div className="col-span-full py-10 text-center text-zinc-500 border border-dashed border-white/10 rounded-xl">
                                        Empty Directory
                                    </div>
                                )}
                            </div>                        </div>
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}
