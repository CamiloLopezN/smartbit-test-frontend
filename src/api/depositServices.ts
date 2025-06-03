// src/api/depositServices.ts

const BASE_URL = `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/deposit`;

export interface CreateDepositRequest {
    userId: string;
    date: string; // ISO string, e.g. "2025-06-02T00:00:00Z"
    monetaryFundId: string;
    amount: number;
    description?: string;
}

export interface UpdateDepositRequest {
    id: string;
    date: string; // ISO string
    monetaryFundId: string;
    amount: number;
    description?: string;
}

export interface Deposit {
    id: string;
    userId: string;
    date: string; // ISO string
    monetaryFundId: string;
    amount: number;
    description?: string;
}

// Crea un nuevo depósito
export async function createDeposit(data: CreateDepositRequest): Promise<Deposit> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to create deposit');
    }
    return await response.json();
}

// Actualiza un depósito existente
export async function updateDeposit(data: UpdateDepositRequest): Promise<Deposit> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to update deposit');
    }
    return await response.json();
}

// Obtiene un depósito por su ID
export async function getDepositById(id: string): Promise<Deposit> {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch deposit');
    }
    return await response.json();
}

// Obtiene todos los depósitos de un usuario
export async function getDepositsByUserId(userId: string): Promise<Deposit[]> {
    const response = await fetch(`${BASE_URL}/user/${userId}`);
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch deposits');
    }
    return await response.json();
}

// Elimina un depósito por su ID
export async function deleteDepositById(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to delete deposit');
    }
}
