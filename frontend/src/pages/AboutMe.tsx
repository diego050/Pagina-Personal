import { motion } from 'framer-motion';
import { Download, Mail, Briefcase, GraduationCap, Award, Calendar, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import ContactModal from '../components/ContactModal';
import api from '../api';

interface CertificationItem {
    title: string;
    issuer: string;
    year: string;
    description: string;
    icon?: any;
    color: string;
    badge?: string;
    href?: string;
}

interface CertificationCategory {
    category: string;
    items: CertificationItem[];
}

interface ExperienceItem {
    id: number;
    title: string;
    company: string;
    type?: string;
    period: string;
    duration: string;
    location: string;
    description: string;
    achievements?: string[];
    skills?: string[];
}

interface StudyItem {
    degree: string;
    university: string;
    period: string;
    description: string;
}

export default function AboutMe() {
    const { t, language } = useLanguage();

    const [certifications, setCertifications] = useState<CertificationCategory[]>([]);
    const [experienceList, setExperienceList] = useState<ExperienceItem[]>([]);
    const [educationList, setEducationList] = useState<StudyItem[]>([]);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const res = await api.get('/content?category=about');
                const content = res.data;
                const langSuffix = language === 'es' ? '_es' : '_en';

                const findVal = (key: string) => content.find((c: any) => c.key === key)?.value;

                const cRaw = findVal(`about_certifications${langSuffix}`) || findVal('about_certifications');
                if (cRaw) setCertifications(JSON.parse(cRaw));

                const expRaw = findVal(`about_experience${langSuffix}`);
                if (expRaw) setExperienceList(JSON.parse(expRaw));

                const eduRaw = findVal(`about_education${langSuffix}`);
                if (eduRaw) setEducationList(JSON.parse(eduRaw));

            } catch (err) {
                console.error('Failed to load about content', err);
            }
        };
        loadContent();
    }, [language]);

    return (
        <div className="min-h-screen pt-4 md:pt-10 pb-20">
            <SEO
                title={t('seoAboutTitle')}
                description={t('seoAboutDesc')}
            />
            {/* Hero Section */}
            <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10 md:mb-24">
                <div
                    className="glass-panel rounded-3xl p-6 md:p-12 relative overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-1000"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="flex flex-col items-center lg:items-start text-center lg:text-left"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 md:mb-8 lg:mb-6">
                                {t('aboutProfile')} <span className="text-cyan-500">{language === 'es' ? 'Mí' : 'Me'}</span>
                            </h1>

                            {/* Mobile Image - Visible only on small screens < lg */}
                            <div
                                className="relative lg:hidden w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group mb-6 md:mb-8 mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both"
                            >
                                <ResponsiveImage
                                    src="/static/uploads/profile-2.webp"
                                    alt="Profile"
                                    loading="eager"
                                    fetchPriority="high"
                                    className="w-full h-full object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>

                            <p className="text-lg text-zinc-400 mb-6 md:mb-8 leading-relaxed text-justify">
                                {t('aboutIntro')}
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <a href="/cv.pdf" download="Diego_Bazan_CV.pdf" className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg transition-colors">
                                    <Download className="w-5 h-5" />
                                    {t('downloadCV')}
                                </a>
                                <button 
                                    onClick={() => setIsContactModalOpen(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
                                >
                                    <Mail className="w-5 h-5" />
                                    {t('contactMe')}
                                </button>
                            </div>
                        </motion.div>
                        <div
                            className="hidden lg:flex justify-end animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both"
                        >
                            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                                <ResponsiveImage
                                    src="/static/uploads/profile-2.webp"
                                    alt="Profile"
                                    loading="eager"
                                    fetchPriority="high"
                                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Work Experience Section */}
            <section id="experience" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10 md:mb-24">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">{language === 'es' ? 'Experiencia Laboral' : 'Work Experience'}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:gap-8">
                    {experienceList.map((job) => (
                        <ExperienceCard key={job.id} job={job} />
                    ))}
                </div>
            </section>

            {/* Education Section */}
            <section id="education" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-4 md:mb-8">
                    <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">{t('educationTitle')}</h2>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {educationList.map((study, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:border-cyan-500/30 transition-colors mb-6 md:mb-8"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative z-10">
                                <div className="flex justify-center lg:justify-start">
                                    <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/5">
                                        <GraduationCap className="w-8 h-8 text-cyan-500" />
                                    </div>
                                </div>
                                
                                <div className="flex-1 text-center lg:text-left">
                                    <h3 className="text-2xl font-bold text-white mb-2">{study.degree}</h3>
                                    <h4 className="text-lg text-cyan-500 font-medium mb-4">{study.university}</h4>
                                    
                                    <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-zinc-400 text-sm mb-4 md:mb-6">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{study.period}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-zinc-950/30 rounded-xl p-4 sm:p-5 border border-white/5 w-full">
                                        <p className="text-zinc-300 text-sm leading-relaxed text-justify">
                                            {study.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Certifications Grid */}
                    <div className="mt-4 md:mt-8">
                        <h4 className="flex items-center gap-2 text-2xl font-bold text-white mb-6 md:mb-8">
                            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                            {t('certificationsTitle')}
                        </h4>

                        <div className="space-y-8 md:space-y-12">
                            {certifications.length > 0 ? (
                                certifications.map((cat, idx) => (
                                    <div key={idx}>
                                        <h5 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">{cat.category}</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {cat.items.map((cert, certIdx) => (
                                                <CertificationCard
                                                    key={certIdx}
                                                    title={cert.title}
                                                    issuer={cert.issuer}
                                                    year={cert.year}
                                                    description={cert.description}
                                                    icon={<Award className="w-5 h-5" />}
                                                    color={cert.color}
                                                    href={cert.href}
                                                    badge={cert.badge}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-zinc-500 italic">No certifications found in content.</div>
                            )}
                        </div>
                    </div>
                </div>
            </section >

            {/* Fixed Bottom Navigation */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5 shadow-xl shadow-black/50 flex items-center gap-1">
                    <a
                        href="#experience"
                        aria-label={language === 'es' ? 'Ir a Experiencia' : 'Go to Experience'}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <Briefcase className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">{language === 'es' ? 'Experiencia' : 'Experience'}</span>
                    </a>
                    <div className="w-px h-4 bg-white/10"></div>
                    <a
                        href="#education"
                        aria-label={language === 'es' ? 'Ir a Educación' : 'Go to Education'}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <GraduationCap className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">{language === 'es' ? 'Educación' : 'Education'}</span>
                    </a>
                </div>
            </div>
            <ContactModal 
                isOpen={isContactModalOpen} 
                onClose={() => setIsContactModalOpen(false)} 
            />
        </div >
    );
}

const RichTextRenderer = ({ text }: { text: string }) => {
    const { language } = useLanguage();
    // Basic markdown link parser: [text](url)
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return (
        <>
            {parts.map((part, index) => {
                const match = part.match(/\[(.*?)\]\((.*?)\)/);
                if (match) {
                    let url = match[2];
                    const isInternal = url.startsWith('/');
                    const linkText = match[1];

                    if (isInternal) {
                        // Localize URL if needed
                        if (language === 'en' && !url.startsWith('/en')) {
                            url = `/en${url}`;
                        }
                        return (
                            <Link
                                key={index}
                                to={url}
                                className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/30 hover:decoration-cyan-300 transition-colors"
                            >
                                {linkText}
                            </Link>
                        );
                    }
                    // ...

                    return (
                        <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/30 hover:decoration-cyan-300 transition-colors"
                        >
                            {linkText}
                        </a>
                    );
                }
                return part;
            })}
        </>
    );
};

interface CertificationCardProps {
    title: string;
    issuer: string;
    year: string;
    description: string;
    icon: any;
    color: string;
    badge?: string;
    href?: string;
}

function CertificationCard({ title, issuer, year, description, icon, color, badge, href }: CertificationCardProps) {
    const colorClasses: any = {
        blue: "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20",
        green: "bg-green-500/10 text-green-400 group-hover:bg-green-500/20",
        purple: "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20",
        orange: "bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20",
    };

    const selectedColor = colorClasses[color] || colorClasses.blue;

    const Component = href ? motion.a : motion.div;
    const props = href ? { href, target: "_blank", rel: "noopener noreferrer", download: true } : {};

    return (
        <Component
            {...props}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`glass-panel rounded-xl p-6 hover:border-white/20 transition-all group h-full flex flex-col ${href ? 'cursor-pointer' : ''}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg transition-colors ${selectedColor}`}>
                    {icon}
                </div>
                <div className="flex gap-2 items-center">
                    {href && (
                        <div className="p-1.5 rounded-md bg-white/5 text-white/50 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                            <Download className="w-3.5 h-3.5" />
                        </div>
                    )}
                    {badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/70 px-2 py-1 rounded border border-white/5">{badge}</span>
                    )}
                    <span className="text-xs font-mono text-zinc-500 border border-zinc-800 px-2 py-1 rounded">{year}</span>
                </div>
            </div>
            <h3 className="text-white font-bold mb-2 group-hover:text-cyan-400 transition-colors leading-snug pb-1">{title}</h3>
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-3">{issuer}</p>
            <p className="text-sm text-zinc-400 leading-relaxed mt-auto">{description}</p>
        </Component>
    );
}

function ExperienceCard({ job }: { job: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all group relative overflow-hidden"
        >
            <div className="flex flex-col lg:flex-row lg:items-start gap-6 relative z-10">
                {/* Icon Wrapper - Centered on mobile/tablet */}
                <div className="flex justify-center lg:justify-start">
                    <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                        <Briefcase className="w-8 h-8 text-cyan-500" />
                    </div>
                </div>

                <div className="flex-1 text-center lg:text-left">
                    {/* Job Type Badge - Centered on mobile/tablet */}
                    {job.type && (
                        <div className="flex justify-center lg:justify-start mb-3">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-cyan-900/30 text-cyan-400 border border-cyan-800/50 uppercase tracking-wider">
                                {job.type}
                            </span>
                        </div>
                    )}

                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{job.title}</h3>

                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-3 gap-y-1 text-zinc-400 text-sm mb-4 md:mb-6">
                        <span className="font-medium text-zinc-300">{job.company}</span>
                        <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-600"></span>
                        <span>{job.period}</span>
                        <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-600"></span>
                        <span>{job.duration}</span>
                        <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-600"></span>
                        <span>{job.location}</span>
                    </div>

                    <div className="bg-zinc-950/30 rounded-xl p-4 md:p-5 border border-white/5 w-full text-left">
                        {job.description && (
                            <p className="text-zinc-300 mb-4 leading-relaxed whitespace-pre-line text-justify">
                                <RichTextRenderer text={job.description} />
                            </p>
                        )}

                        {job.achievements && job.achievements.length > 0 && (
                            <ul className="space-y-2 mb-6 text-zinc-400">
                                {job.achievements.map((item: string, i: number) => {
                                    const [title, text] = item.includes(': ') ? item.split(': ') : [item, ''];
                                    return (
                                        <li key={i} className="flex gap-2">
                                            <div className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-cyan-500/50 flex-shrink-0"></div>
                                            <p className="text-sm leading-relaxed text-justify">
                                                {text ? (
                                                    <>
                                                        <span className="font-semibold text-zinc-300">{title}:</span>{' '}
                                                        {text.split(/(\[.*?\]\(.*?\))/g).map((part, index) => {
                                                            const match = part.match(/\[(.*?)\]\((.*?)\)/);
                                                            if (match) {
                                                                const url = match[2];
                                                                const isInternal = url.startsWith('/');

                                                                if (isInternal) {
                                                                    return (
                                                                        <Link
                                                                            key={index}
                                                                            to={url}
                                                                            className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/30 hover:decoration-cyan-300 transition-colors"
                                                                        >
                                                                            {match[1]}
                                                                        </Link>
                                                                    );
                                                                }

                                                                return (
                                                                    <a
                                                                        key={index}
                                                                        href={url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/30 hover:decoration-cyan-300 transition-colors"
                                                                    >
                                                                        {match[1]}
                                                                    </a>
                                                                );
                                                            }
                                                            return part;
                                                        })}
                                                    </>
                                                ) : (
                                                    title
                                                )}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        {job.skills && job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center lg:justify-start pt-2 border-t border-white/5">
                                {job.skills.map((skill: string, i: number) => (
                                    <span key={i} className="text-xs font-medium text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/10 hover:bg-cyan-500/20 transition-colors">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
