// src/api/monetaryFundServices.ts

const BASE_URL = `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/monetaryFund`;

export type FundType = 0 | 1; // 0 = BankAccount, 1 = PettyCash

export interface MonetaryFund {
    id: string;
    userId: string;
    name: string;
    type: FundType;
    initialBalance: number;
    currentBalance: number;
    notes?: string;
}

export interface CreateMonetaryFundRequest {
    userId: string;
    name: string;
    type: FundType;
    initialBalance: number;
    notes?: string;
}

export interface UpdateMonetaryFundRequest {
    id: string;
    name: string;
    type: FundType;
    notes?: string;
}

// Crea un nuevo fondo monetario
export async function createMonetaryFund(
    data: CreateMonetaryFundRequest
): Promise<MonetaryFund> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to create monetary fund');
    }
    return await response.json();
}

// Actualiza un fondo monetario existente (solo nombre, tipo y notas)
export async function updateMonetaryFund(
    data: UpdateMonetaryFundRequest
): Promise<MonetaryFund> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to update monetary fund');
    }
    return await response.json();
}

// Obtiene un fondo monetario por su ID
export async function getMonetaryFundById(id: string): Promise<MonetaryFund> {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch monetary fund');
    }
    return await response.json();
}

// Obtiene todos los fondos monetarios de un usuario
export async function getMonetaryFundsByUserId(
    userId: string
): Promise<MonetaryFund[]> {
    const response = await fetch(`${BASE_URL}/user/${userId}`);
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch monetary funds');
    }
    return await response.json();
}

// Elimina un fondo monetario por su ID
export async function deleteMonetaryFund(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to delete monetary fund');
    }
}
