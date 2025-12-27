// Admin Login Page - No credentials shown
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (login(username, password)) {
            navigate('/admin/dashboard');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="admin-login">
            <div className="login-card">
                <h1 className="login-logo">Fairy.Com</h1>
                <p className="login-subtitle">Admin Access Only</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button type="submit" className="btn btn-primary login-btn">
                        🔐 Login
                    </button>
                </form>
            </div>
        </div>
    );
}
