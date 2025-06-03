// src/api/expenseTypeServices.ts

const BASE_URL = `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/expenseType`;

export interface ExpenseType {
    id: string;
    code: string;
    name: string;
    description?: string;
    userId: string;
}

export interface CreateExpenseTypeRequest {
    userId: string;
    name: string;
    description?: string;
}

export interface UpdateExpenseTypeRequest {
    id: string;
    name: string;
    description?: string;
}

// Crea un nuevo tipo de gasto
export async function createExpenseType(
    data: CreateExpenseTypeRequest
): Promise<ExpenseType> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to create expense type');
    }
    return await response.json();
}

// Actualiza un tipo de gasto existente
export async function updateExpenseType(
    data: UpdateExpenseTypeRequest
): Promise<ExpenseType> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to update expense type');
    }
    return await response.json();
}

// Obtiene todos los tipos de gasto de un usuario
export async function getExpenseTypesByUserId(
    userId: string
): Promise<ExpenseType[]> {
    const response = await fetch(`${BASE_URL}/user/${userId}`);
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch expense types');
    }
    return await response.json();
}

// Obtiene un tipo de gasto por su ID
export async function getExpenseTypeById(id: string): Promise<ExpenseType> {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch expense type');
    }
    return await response.json();
}

// Elimina un tipo de gasto por su ID
export async function deleteExpenseType(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to delete expense type');
    }
}
