const BASE_URL = `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/user`;

export interface LoginRequest {
    userName: string;
    password: string;
}

export interface User {
    id: string;
    userName: string;
    passwordHash: string;
    userTypeId: number;
}

export interface CreateUserRequest {
    userName: string;
    password: string;
    userTypeId: number;
}

// 1. Iniciar sesión
export async function login(request: LoginRequest): Promise<User> {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Error al iniciar sesión');
    }

    return await response.json();
}

// 2. Crear nuevo usuario
export async function createUser(request: CreateUserRequest): Promise<User> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Error al crear usuario');
    }

    return await response.json();
}
