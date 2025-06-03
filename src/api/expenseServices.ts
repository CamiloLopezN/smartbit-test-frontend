// src/api/expenseServices.ts

const BASE_URL = `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/expense`;

export interface ExpenseDetailDto {
    id?: string; // Para nuevos detalles, puede omitirse o ser string vacío
    expenseTypeId: string;
    amount: number;
}

export interface CreateExpenseRequest {
    userId: string;
    date: string; // ISO, por ejemplo: "2025-06-02T00:00:00Z"
    monetaryFundId: string;
    commerceName: string;
    documentType: 'Comprobante' | 'Factura' | 'Otro';
    observations?: string;
    details: ExpenseDetailDto[];
}

export interface UpdateExpenseRequest {
    id: string;
    date: string; // ISO
    monetaryFundId: string;
    commerceName: string;
    documentType: 'Comprobante' | 'Factura' | 'Otro';
    observations?: string;
    details: ExpenseDetailDto[];
}

export interface ExpenseDetail {
    id: string;
    expenseHeaderId: string;
    expenseTypeId: string;
    amount: number;
}

export interface ExpenseHeader {
    id: string;
    userId: string;
    date: string;
    monetaryFundId: string;
    commerceName: string;
    documentType: 'Comprobante' | 'Factura' | 'Otro';
    observations?: string;
    totalAmount: number;
    expenseDetails: ExpenseDetail[];
}

// Crea un nuevo gasto (header + detalles)
export async function createExpense(
    data: CreateExpenseRequest
): Promise<ExpenseHeader> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to create expense');
    }
    return await response.json();
}

// Actualiza un gasto existente
export async function updateExpense(
    data: UpdateExpenseRequest
): Promise<ExpenseHeader> {
    const response = await fetch(`${BASE_URL}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to update expense');
    }
    return await response.json();
}

// Obtiene un gasto por su ID
export async function getExpenseById(id: string): Promise<ExpenseHeader> {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch expense');
    }
    return await response.json();
}

export async function getExpensesByUser(userId: string): Promise<ExpenseHeader[]> {
    const response = await fetch(`${BASE_URL}/user/${userId}`);
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch expenses');
    }
    return await response.json();
}

// Obtiene todos los gastos de un usuario dentro de un rango de fechas
export async function getExpensesByUserAndDateRange(
    userId: string,
    start: string, // ISO string: "2025-06-01T00:00:00Z"
    end: string    // ISO string: "2025-06-30T23:59:59Z"
): Promise<ExpenseHeader[]> {
    const params = new URLSearchParams({ start, end });
    const response = await fetch(
        `${BASE_URL}/user/${userId}/range?${params.toString()}`
    );
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch expenses');
    }
    return await response.json();
}

// Elimina un gasto por su ID
export async function deleteExpense(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to delete expense');
    }
}
