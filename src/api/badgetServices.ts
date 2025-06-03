// src/api/budgetServices.ts

const BASE_URL = `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/budget`;

export interface CreateBudgetRequest {
    userId: string;
    expenseTypeId: string;
    month: number;
    year: number;
    amount: number;
}

export interface UpdateBudgetRequest {
    id: string;
    expenseTypeId: string;
    month: number;
    year: number;
    amount: number;
}

export interface Budget {
    id: string;
    userId: string;
    expenseTypeId: string;
    month: number;
    year: number;
    amount: number;
}

// Crea un nuevo presupuesto
export async function createBudget(data: CreateBudgetRequest): Promise<Budget> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to create budget');
    }
    return await response.json();
}

// Actualiza un presupuesto existente
export async function updateBudget(data: UpdateBudgetRequest): Promise<Budget> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to update budget');
    }
    return await response.json();
}

// Obtiene un presupuesto por su ID
export async function getBudgetById(id: string): Promise<Budget> {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch budget');
    }
    return await response.json();
}

// Obtiene todos los presupuestos de un usuario
export async function getBudgetsByUserId(userId: string): Promise<Budget[]> {
    const response = await fetch(`${BASE_URL}/user/${userId}`);
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch budgets');
    }
    return await response.json();
}

// Elimina un presupuesto por su ID
export async function deleteBudget(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to delete budget');
    }
}
