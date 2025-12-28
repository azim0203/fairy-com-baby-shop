// Customer Login/Signup Page
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function CustomerAuth() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { signIn, signUp } = useCustomerAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login
                await signIn(formData.email, formData.password);
                navigate('/my-orders');
            } else {
                // Signup
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                if (formData.password.length < 6) {
                    setError('Password must be at least 6 characters');
                    setLoading(false);
                    return;
                }

                await signUp(formData.email, formData.password, formData.name, formData.phone);
                setSuccess('Account created! Please check your email to verify your account.');
                setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="customer-auth-page">
            <div className="container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>{isLogin ? '👋 Welcome Back!' : '🎉 Create Account'}</h1>
                        <p>{isLogin ? 'Sign in to view your orders' : 'Join Fairy.Com for a better experience'}</p>
                    </div>

                    {/* Toggle Buttons */}
                    <div className="auth-toggle">
                        <button
                            className={`toggle-btn ${isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </button>
                        <button
                            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(false)}
                        >
                            Sign Up
                        </button>
                    </div>

                    {error && <div className="auth-error">{error}</div>}
                    {success && <div className="auth-success">{success}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <>
                                <div className="input-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="input"
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="input"
                                        placeholder="+91 98765 43210"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="input"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                className="input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                        </div>

                        {!isLogin && (
                            <div className="input-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="input"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg auth-submit"
                            disabled={loading}
                        >
                            {loading ? '⏳ Please wait...' : (isLogin ? '🔐 Sign In' : '✨ Create Account')}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                className="link-btn"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                        <Link to="/" className="back-link">← Back to Shop</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
