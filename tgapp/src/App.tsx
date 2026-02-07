import { useEffect, useState } from 'react';
import type { User } from './types/user';
import { login } from './api/auth';
import './App.css';
import { retrieveLaunchParams } from '@tma.js/sdk';

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { initDataRaw } = retrieveLaunchParams();

                if (!initDataRaw || typeof initDataRaw !== 'string') {
                    throw new Error('initData не найдена. Откройте через Telegram бота.');
                }

                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const response = await login(initDataRaw, timezone);

                setUser(response.user);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="app">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Авторизация...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app">
                <div className="error-card">
                    <div className="error-icon">❌</div>
                    <h2>Ошибка авторизации</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <div className="card">
                <div className="header">
                    <h1>✅ Авторизация успешна!</h1>
                    {user?.is_premium && (
                        <span className="premium-badge">⭐ Premium</span>
                    )}
                </div>

                {user?.photo_url && (
                    <div className="avatar-container">
                        <img src={user.photo_url} alt="Avatar" className="avatar" />
                    </div>
                )}

                <div className="user-info">
                    <div className="info-row">
                        <span className="label">ID</span>
                        <span className="value">{user?.id}</span>
                    </div>

                    <div className="info-row">
                        <span className="label">Имя</span>
                        <span className="value">{user?.first_name}</span>
                    </div>

                    {user?.last_name && (
                        <div className="info-row">
                            <span className="label">Фамилия</span>
                            <span className="value">{user.last_name}</span>
                        </div>
                    )}

                    {user?.username && (
                        <div className="info-row">
                            <span className="label">Username</span>
                            <span className="value">@{user.username}</span>
                        </div>
                    )}

                    {user?.language_code && (
                        <div className="info-row">
                            <span className="label">Язык</span>
                            <span className="value">{user.language_code.toUpperCase()}</span>
                        </div>
                    )}

                    {user?.allows_write_to_pm !== undefined && (
                        <div className="info-row">
                            <span className="label">Разрешены ЛС</span>
                            <span className="value">{user.allows_write_to_pm ? 'Да' : 'Нет'}</span>
                        </div>
                    )}
                </div>

                <details className="json-details">
                    <summary>Показать все данные (JSON)</summary>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </details>
            </div>
        </div>
    );
}

export default App;