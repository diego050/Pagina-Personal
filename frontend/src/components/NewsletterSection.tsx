import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Send, User, Mail, CheckCircle, X, Sparkles } from 'lucide-react';
import { subscribe } from '../api';
import { useLanguage } from '../context/LanguageContext';

const NewsletterSection: React.FC = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [showToast, setShowToast] = useState(false);

    // Spotlight effect logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const springConfig = { damping: 20, stiffness: 150 };
    const shadowX = useSpring(mouseX, springConfig);
    const shadowY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const { left, top } = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await subscribe(formData.name, formData.email);
            setStatus('success');
            setShowToast(true);
            setFormData({ name: '', email: '' });
            
            setTimeout(() => {
                setShowToast(false);
                setStatus('idle');
            }, 5000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <section className="py-32 px-4 relative overflow-hidden bg-background">
            {/* Background Image Layer */}
            <div 
                className="absolute inset-0 z-0 pointer-events-none"
                style={{ 
                    backgroundImage: 'url("/static/newsletter_bg.webp")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.5
                }}
            />
            
            {/* Edge Fading Gradients */}
            <div 
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{ 
                    background: 'linear-gradient(to bottom, #0a0a0a, transparent 20%, transparent 80%, #0a0a0a), linear-gradient(to right, #0a0a0a, transparent 20%, transparent 80%, #0a0a0a)' 
                }}
            />

            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
            
            <div className="max-w-5xl mx-auto relative z-10">
                <motion.div 
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative group rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/[0.08] backdrop-blur-2xl shadow-2xl"
                >
                    {/* Interactive Spotlight Mask */}
                    <motion.div 
                        className="absolute inset-0 z-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: `radial-gradient(600px circle at ${shadowX}px ${shadowY}px, rgba(59, 130, 246, 0.08), transparent 40%)`
                        }}
                    />

                    <div className="relative z-10 p-8 md:p-16">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
                            
                            {/* Left Content */}
                            <div className="lg:col-span-2">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                                        <Sparkles className="w-3 h-3" />
                                        {t('newsletterTitle').split(' ')[0]}
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1]">
                                        {t('newsletterTitle')}
                                    </h2>
                                    <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                                        {t('newsletterSubtitle')}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Right Form */}
                            <div className="lg:col-span-3">
                                <form onSubmit={handleSubmit} className="space-y-5 bg-white/5 p-8 rounded-3xl border border-white/5 backdrop-blur-md">
                                    <div className="space-y-4">
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within/input:text-primary transition-colors">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                placeholder={t('name')}
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-zinc-950/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-0 focus:border-primary/50 focus:bg-zinc-950/60 transition-colors shadow-inner"
                                            />
                                        </div>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within/input:text-primary transition-colors">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <input
                                                required
                                                type="email"
                                                placeholder={t('email')}
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-zinc-950/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-0 focus:border-primary/50 focus:bg-zinc-950/60 transition-colors shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full relative overflow-hidden p-[1px] rounded-2xl group/btn"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient-x opacity-80 group-hover/btn:opacity-100 transition-opacity" />
                                        <div className="relative bg-zinc-950 hover:bg-zinc-950/50 transition-colors py-4 rounded-2xl flex items-center justify-center gap-3">
                                            {status === 'loading' ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <span className="text-white font-bold tracking-wide">{t('subscribeButton')}</span>
                                                    <Send className="w-5 h-5 text-primary group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                    </motion.button>

                                    {status === 'error' && (
                                        <motion.p 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-400 text-sm text-center font-medium"
                                        >
                                            {t('errorSending')}
                                        </motion.p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Success Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="fixed top-24 right-4 md:right-8 z-[200] max-w-sm w-full bg-zinc-950/90 border border-green-500/30 rounded-3xl shadow-2xl p-5 flex items-center gap-5 backdrop-blur-xl"
                    >
                        <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-green-500/20">
                            <CheckCircle className="w-7 h-7 text-green-500" />
                        </div>
                        <div className="flex-grow">
                            <h4 className="text-white font-bold text-base mb-0.5">{t('newsletterSuccess')}</h4>
                            <p className="text-zinc-400 text-sm leading-tight">{t('newsletterSuccessDesc')}</p>
                        </div>
                        <button 
                            onClick={() => setShowToast(false)}
                            className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
                            aria-label="Cerrar notificación"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default NewsletterSection;
