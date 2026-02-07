import type { LoginResponse } from '../types/user';

const API_BASE_URL = 'https://tma-api.dobryapi.online/tg-api/v1';

export const login = async (
    initData: string,
    timezone: string
): Promise<LoginResponse> => {
    const body = {
        init_data: initData,
        timezone: timezone,
    };

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();

        let errorData;
        try {
            errorData = JSON.parse(errorText);
        } catch {
            errorData = { detail: errorText };
        }

        throw new Error(errorData?.detail || `HTTP error ${response.status}`);
    }

    const data = await response.json();

    return data;
};