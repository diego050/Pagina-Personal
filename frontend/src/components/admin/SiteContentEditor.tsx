import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface CertificationItem {
    title: string;
    issuer: string;
    year: string;
    description: string;
    color: string;
}

interface CertificationCategory {
    category: string;
    items: CertificationItem[];
}

interface SiteContent {
    label: string;
    input_type: string;
    category: string;
}

interface SiteContentEditorProps {
    item: SiteContent;
    value: string;
    onChange: (val: string) => void;
    onSave: () => void;
    onCancel: () => void;
    uploading?: boolean;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SiteContentEditor({ item, value, onChange, onSave, onCancel, onImageUpload }: SiteContentEditorProps) {
    // If it's a JSON array of strings (Tags)
    const isTagList = item.label.includes('Skills');
    
    // If it's the complex Certifications JSON
    const isCertifications = item.label.includes('Certifications');

    const isExperience = item.label.includes('Experience');
    const isEducation = item.label.includes('Education');

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
            onClick={onCancel}
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
                className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl max-h-[90vh] flex flex-col shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-start bg-zinc-900/50 rounded-t-2xl">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-wider border border-cyan-500/20">
                                {item.input_type}
                            </span>
                            {isTagList && <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">List</span>}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{item.label}</h3>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest">{item.category} PAGE</p>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5 text-zinc-400" /></button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {isTagList ? (
                        <TagEditor value={value} onChange={onChange} />
                    ) : isCertifications ? (
                        <CertificationsEditor value={value} onChange={onChange} />
                    ) : isExperience ? (
                        <ExperienceEditor value={value} onChange={onChange} />
                    ) : isEducation ? (
                        <EducationEditor value={value} onChange={onChange} />
                    ) : item.input_type === 'image' ? (
                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group cursor-pointer relative">
                                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={onImageUpload} />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-4 bg-white/5 rounded-full group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium text-zinc-300 group-hover:text-cyan-400">Upload new image</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Or Image URL</label>
                                <input
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-all font-mono text-sm"
                                    value={value}
                                    onChange={e => onChange(e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                            {value && (
                                <div className="h-48 rounded-xl bg-black/50 border border-white/5 overflow-hidden flex items-center justify-center relative mt-4">
                                    <img src={value} alt="Preview" className="h-full object-contain" />
                                </div>
                            )}
                        </div>
                    ) : item.input_type === 'textarea' ? (
                        <textarea
                            className="w-full min-h-[300px] bg-black/40 border border-white/10 rounded-xl p-4 text-zinc-300 font-sans text-sm focus:border-cyan-500 focus:outline-none transition-all resize-y leading-relaxed"
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            placeholder="Enter content..."
                        />
                    ) : (
                        <input
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 focus:outline-none transition-all text-lg"
                            value={value}
                            onChange={e => onChange(e.target.value)}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-zinc-900/80 flex gap-3 rounded-b-2xl">
                    <button onClick={onCancel} className="flex-1 py-3 rounded-xl font-bold text-zinc-400 border border-zinc-700 hover:text-white hover:bg-zinc-800 transition-colors">
                        Cancel
                    </button>
                    <button onClick={onSave} className="flex-[2] bg-white text-black hover:bg-cyan-400 font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
                
            </motion.div>
        </motion.div>
    );
}

// Sub-component: TagEditor (Array of Strings)
function TagEditor({ value, onChange }: { value: string, onChange: (v: string) => void }) {
    const [tags, setTags] = useState<string[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) setTags(parsed);
        } catch { }
    }, [value]);

    const addTag = () => {
        const val = input.trim();
        if (val && !tags.includes(val)) {
            const newTags = [...tags, val];
            setTags(newTags);
            onChange(JSON.stringify(newTags, null, 2));
            setInput('');
        }
    };

    const removeTag = (index: number) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags);
        onChange(JSON.stringify(newTags, null, 2));
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <input
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-all"
                    placeholder="Enter skill (e.g. React) and press enter"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                />
                <button type="button" onClick={addTag} className="px-4 bg-zinc-800 hover:bg-cyan-500 hover:text-black rounded-xl transition-colors font-bold text-white">
                    <Plus className="w-5 h-5" />
                </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-white/10 rounded-lg text-sm text-zinc-300">
                        {tag}
                        <button onClick={() => removeTag(i)} className="text-zinc-500 hover:text-red-400"><X className="w-3 h-3" /></button>
                    </div>
                ))}
                {tags.length === 0 && <span className="text-sm text-zinc-600 italic">No items yet.</span>}
            </div>
            {/* Hidden raw sync */}
        </div>
    );
}

// Sub-component: Certifications Editor
function CertificationsEditor({ value, onChange }: { value: string, onChange: (v: string) => void }) {
    const [categories, setCategories] = useState<CertificationCategory[]>([]);
    
    useEffect(() => {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) setCategories(parsed);
        } catch { } // If invalid JSON, let it fall back or show empty
    }, [value]);

    const updateCategories = (newCategories: CertificationCategory[]) => {
        setCategories(newCategories);
        onChange(JSON.stringify(newCategories, null, 2));
    };

    const addCategory = () => {
        updateCategories([...categories, { category: 'New Category', items: [] }]);
    };

    const removeCategory = (catIdx: number) => {
        const newCats = [...categories];
        newCats.splice(catIdx, 1);
        updateCategories(newCats);
    };

    const updateCategoryName = (catIdx: number, val: string) => {
        const newCats = [...categories];
        newCats[catIdx].category = val;
        updateCategories(newCats);
    };

    const addItem = (catIdx: number) => {
        const newCats = [...categories];
        newCats[catIdx].items.push({ title: 'New Cert', issuer: '', year: '2026', description: '', color: 'blue' });
        updateCategories(newCats);
    };

    const updateItem = (catIdx: number, itemIdx: number, field: string, val: string) => {
        const newCats = [...categories];
        (newCats[catIdx].items[itemIdx] as any)[field] = val;
        updateCategories(newCats);
    };

    const removeItem = (catIdx: number, itemIdx: number) => {
        const newCats = [...categories];
        newCats[catIdx].items.splice(itemIdx, 1);
        updateCategories(newCats);
    };

    return (
        <div className="space-y-8 pb-10">
            {categories.map((cat, catIdx) => (
                <div key={catIdx} className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden relative">
                    <div className="bg-black/30 p-4 border-b border-white/5 flex gap-3 items-center">
                        <input
                            value={cat.category}
                            onChange={(e) => updateCategoryName(catIdx, e.target.value)}
                            className="flex-1 bg-transparent border-none text-cyan-400 font-bold focus:outline-none"
                        />
                        <button onClick={() => removeCategory(catIdx)} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="p-4 space-y-4">
                        {cat.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="bg-zinc-800/30 border border-white/5 rounded-xl p-4 relative group">
                                <button onClick={() => removeItem(catIdx, itemIdx)} className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                
                                <div className="grid grid-cols-2 gap-3 pr-8 mb-3">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-zinc-500">Title</label>
                                        <input value={item.title} onChange={e => updateItem(catIdx, itemIdx, 'title', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-zinc-500">Issuer</label>
                                        <input value={item.issuer} onChange={e => updateItem(catIdx, itemIdx, 'issuer', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-zinc-500">Year</label>
                                        <input value={item.year} onChange={e => updateItem(catIdx, itemIdx, 'year', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-zinc-500">Color</label>
                                        <select value={item.color} onChange={e => updateItem(catIdx, itemIdx, 'color', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500">
                                            <option value="blue">Blue</option>
                                            <option value="cyan">Cyan</option>
                                            <option value="green">Green</option>
                                            <option value="purple">Purple</option>
                                            <option value="orange">Orange</option>
                                        </select>
                                    </div>
                                </div>
                                <label className="text-[10px] uppercase font-bold text-zinc-500">Description</label>
                                <textarea value={item.description} onChange={e => updateItem(catIdx, itemIdx, 'description', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none h-20" />
                            </div>
                        ))}
                        <button onClick={() => addItem(catIdx)} className="w-full py-2 border border-dashed border-white/20 rounded-xl text-zinc-400 text-sm hover:border-cyan-500/50 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" /> Add Item
                        </button>
                    </div>
                </div>
            ))}
            
            <button onClick={addCategory} className="w-full py-4 border border-white/10 rounded-2xl text-white font-medium bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Add Category
            </button>
        </div>
    );
}

// Sub-component: Experience Editor
function ExperienceEditor({ value, onChange }: { value: string, onChange: (v: string) => void }) {
    const [jobs, setJobs] = useState<any[]>([]);

    useEffect(() => {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) setJobs(parsed);
        } catch { }
    }, [value]);

    const updateJobs = (newJobs: any[]) => {
        setJobs(newJobs);
        onChange(JSON.stringify(newJobs, null, 2));
    };

    const addJob = () => {
        updateJobs([...jobs, { 
            id: Date.now(), title: 'New Role', company: '', type: '', period: '', duration: '', location: '', description: '', achievements: [], skills: [] 
        }]);
    };

    const removeJob = (idx: number) => {
        const newJobs = [...jobs];
        newJobs.splice(idx, 1);
        updateJobs(newJobs);
    };

    const updateJob = (idx: number, field: string, val: any) => {
        const newJobs = [...jobs];
        newJobs[idx][field] = val;
        updateJobs(newJobs);
    };

    const updateArrayField = (jobIdx: number, field: 'achievements' | 'skills', val: string) => {
        const newJobs = [...jobs];
        let arr = val.split('\n').filter(s => s.trim() !== '');
        newJobs[jobIdx][field] = arr;
        updateJobs(newJobs);
    };

    return (
        <div className="space-y-6 pb-10">
            {jobs.map((job, idx) => (
                <div key={job.id || idx} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4 relative group">
                    <button onClick={() => removeJob(idx)} className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-3 pr-8 mb-3">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Title</label>
                            <input value={job.title || ''} onChange={e => updateJob(idx, 'title', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Company</label>
                            <input value={job.company || ''} onChange={e => updateJob(idx, 'company', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Type</label>
                            <input value={job.type || ''} onChange={e => updateJob(idx, 'type', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Location</label>
                            <input value={job.location || ''} onChange={e => updateJob(idx, 'location', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Period</label>
                            <input value={job.period || ''} onChange={e => updateJob(idx, 'period', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Duration</label>
                            <input value={job.duration || ''} onChange={e => updateJob(idx, 'duration', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Description</label>
                            <textarea value={job.description || ''} onChange={e => updateJob(idx, 'description', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none h-20" />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Achievements (One per line)</label>
                            <textarea value={(job.achievements || []).join('\n')} onChange={e => updateArrayField(idx, 'achievements', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-y h-24 whitespace-pre-wrap" />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Skills / Tags (One per line)</label>
                            <textarea value={(job.skills || []).join('\n')} onChange={e => updateArrayField(idx, 'skills', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none h-16" />
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addJob} className="w-full py-4 border border-white/10 rounded-2xl text-white font-medium bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Add Job Role
            </button>
        </div>
    );
}

// Sub-component: Education Editor
function EducationEditor({ value, onChange }: { value: string, onChange: (v: string) => void }) {
    const [studies, setStudies] = useState<any[]>([]);

    useEffect(() => {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) setStudies(parsed);
        } catch { } // Fallback to empty
    }, [value]);

    const updateStudies = (newStudies: any[]) => {
        setStudies(newStudies);
        onChange(JSON.stringify(newStudies, null, 2));
    };

    const addStudy = () => {
        updateStudies([...studies, { degree: 'New Degree', university: '', period: '', description: '' }]);
    };

    const removeStudy = (idx: number) => {
        const newStudies = [...studies];
        newStudies.splice(idx, 1);
        updateStudies(newStudies);
    };

    const updateStudy = (idx: number, field: string, val: string) => {
        const newStudies = [...studies];
        newStudies[idx][field] = val;
        updateStudies(newStudies);
    };

    return (
        <div className="space-y-6 pb-10">
            {studies.map((study, idx) => (
                <div key={idx} className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4 relative group">
                    <button onClick={() => removeStudy(idx)} className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 gap-3 pr-8 mb-3">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Degree / Title</label>
                            <input value={study.degree || ''} onChange={e => updateStudy(idx, 'degree', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">University / Institution</label>
                            <input value={study.university || ''} onChange={e => updateStudy(idx, 'university', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Period</label>
                            <input value={study.period || ''} onChange={e => updateStudy(idx, 'period', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Description</label>
                            <textarea value={study.description || ''} onChange={e => updateStudy(idx, 'description', e.target.value)} className="w-full bg-black/40 rounded p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none h-20" />
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addStudy} className="w-full py-4 border border-white/10 rounded-2xl text-white font-medium bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Add Study
            </button>
        </div>
    );
}
