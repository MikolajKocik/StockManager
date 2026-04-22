import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { userName, password });

            const token = response.data.result.value.token;
            login(token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card animate-fade">
                <header className="login-header">
                    <h2>StockManager</h2>
                    <p>Welcome back! Please login to continue.</p>
                </header>

                <form onSubmit={handleSubmit}>
                    {error && <div className="error-alert">{error}</div>}

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Login to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}
