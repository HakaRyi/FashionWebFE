import React, { useState, useEffect } from 'react';
import styles from './Authentication.module.scss';
import { Eye, EyeOff } from 'lucide-react';
import authService from '../../services/authService';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    // Reset
    useEffect(() => {
        setErrors({});
        setIsShaking(false);
        setShowPassword(false);
    }, [isLogin]);

    const redirectUser = (role) => {
        if (role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
        } else {
            navigate('/shop', { replace: true });
        }
    };

    // input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    //Validation
    const validateForm = () => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!isLogin && !formData.fullName.trim()) {
            newErrors.fullName = 'Please enter your full name';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid luxury email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        return newErrors;
    };

    //Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const data = isLogin
                ? await authService.login(formData.email, formData.password)
                : await authService.register(formData);

            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('userRole', data.user.role);

            redirectUser(data.user.role);
        } catch (error) {
            const serverMsg = error.response?.data?.message || 'Authentication failed. Please try again.';
            setErrors({ apiError: serverMsg });
            triggerShake();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles['auth-container']}>
            <div className={styles['auth-visual']}>
                <div className={styles.overlay}>
                    <h1>
                        Vogue
                        <br />& Elegance
                    </h1>
                    <p>Spring Summer 2026</p>
                </div>
            </div>

            <div className={styles['auth-form-section']}>
                <div className={`${styles['form-box']} ${isShaking ? styles.shake : ''}`}>
                    <h2>{isLogin ? 'Sign In' : 'Join Us'}</h2>
                    <span className={styles.subtitle}>
                        {isLogin
                            ? 'Enter your credentials to access your account'
                            : 'Become a member of our fashion community'}
                    </span>

                    <form onSubmit={handleSubmit} noValidate>
                        {!isLogin && (
                            <div className={styles['input-group']}>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={errors.fullName ? styles['input-error'] : ''}
                                />
                                {errors.fullName && <span className={styles['error-msg']}>{errors.fullName}</span>}
                            </div>
                        )}

                        <div className={styles['input-group']}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? styles['input-error'] : ''}
                            />
                            {errors.email && <span className={styles['error-msg']}>{errors.email}</span>}
                        </div>

                        <div className={styles['input-group']}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? styles['input-error'] : ''}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setTimeout(() => setIsPasswordFocused(false), 200)}
                                autoComplete="current-password"
                            />

                            {/* Nút toggle xuất hiện dựa trên focus và độ dài text */}
                            {(isPasswordFocused || formData.password.length > 0) && (
                                <button
                                    type="button"
                                    className={styles['password-toggle']}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} strokeWidth={1.5} />
                                    ) : (
                                        <Eye size={18} strokeWidth={1.5} />
                                    )}
                                </button>
                            )}

                            {errors.password && <span className={styles['error-msg']}>{errors.password}</span>}
                        </div>

                        <button type="submit" className={styles['btn-submit']} disabled={loading}>
                            {loading ? (
                                <div className={styles.spinner}></div>
                            ) : isLogin ? (
                                'Authenticate'
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className={styles['switch-mode']}>
                        <span>{isLogin ? 'New to Vogue?' : 'Already have an account?'}</span>
                        <button type="button" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Register Now' : 'Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
