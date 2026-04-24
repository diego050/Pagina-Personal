import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({ name: '', email: '', message: '', honeypot: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await api.post('/contact', formData);
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ name: '', email: '', message: '', honeypot: '' });
            }, 3000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />
                    
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-lg bg-zinc-950/50 border border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl max-h-[calc(100dvh-2rem)] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header Decoration */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                        
                        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                             <div className="flex justify-between items-center mb-6 sm:mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{t('letsTalk')}</h2>
                                    <p className="text-zinc-400 text-sm">{t('letsTalkDesc')}</p>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {status === 'success' ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-12 text-center"
                                >
                                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-cyan-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{t('messageSent')}</h3>
                                    <p className="text-zinc-400">{t('messageSentDesc')}</p>
                                </motion.div>
                            ) : (
                                 <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                                            {t('name')}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-cyan-500 transition-colors">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                placeholder={t('name')}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                                            {t('email')}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-cyan-500 transition-colors">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={e => setFormData({...formData, email: e.target.value})}
                                                placeholder="your@email.com"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">
                                            {t('message')}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute top-3 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-cyan-500 transition-colors">
                                                <MessageSquare className="w-4 h-4" />
                                            </div>
                                            <textarea
                                                required
                                                rows={3}
                                                value={formData.message}
                                                onChange={e => setFormData({...formData, message: e.target.value})}
                                                placeholder={t('letsTalkDesc')}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="hidden" aria-hidden="true">
                                        <input
                                            type="text"
                                            name="subject_id"
                                            tabIndex={-1}
                                            autoComplete="off"
                                            value={formData.honeypot}
                                            onChange={e => setFormData({...formData, honeypot: e.target.value})}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                                    >
                                        {status === 'loading' ? (
                                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                {t('sendButton')}
                                            </>
                                        )}
                                    </button>

                                    {status === 'error' && (
                                        <p className="text-red-400 text-sm text-center">
                                            {t('errorSending')}
                                        </p>
                                    )}
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ContactModal;
