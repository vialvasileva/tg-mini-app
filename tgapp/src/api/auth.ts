import type {User} from "../types/user.ts";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface LoginResponse {
    user: User;
}

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
        throw new Error('Login request failed');
    }

    return response.json();
};
