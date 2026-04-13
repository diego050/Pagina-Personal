import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import api from '../api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const res = await api.post('/token', formData);
            localStorage.setItem('token', res.data.access_token);
            navigate('/admin');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md glass-panel p-8 rounded-2xl">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-primary/20 rounded-full text-primary">
                        <Lock className="w-6 h-6" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-white mb-6">Admin Access</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
