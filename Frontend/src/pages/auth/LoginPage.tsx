import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
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

                    <Input
                        label="Username"
                        type="text"
                        placeholder="Enter your username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        className="login-input"
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-input"
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={loading}
                        className="login-btn-submit"
                    >
                        Log In
                    </Button>
                </form>
            </div>
        </div>
    );
}
