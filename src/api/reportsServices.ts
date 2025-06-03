const BASE_URL = `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/reports`;

export interface BudgetVsExecuted {
    budgets: {
        id: string;
        userId: string;
        expenseTypeId: string;
        month: number;
        year: number;
        amount: number;
    }[];
    executed: {
        expenseTypeId: string;
        executed: number;
    }[];
}

export interface Movement {
    id: string;
    userId: string;
    monetaryFundId: string;
    amount: number;
    description: string;
    date: string;
    type: 'deposit' | 'expense';
    expenseDetails?: {
        expenseTypeId: string;
        amount: number;
    }[];
}

export interface SummaryReport {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
}

// 1. Consulta comparativa presupuestado vs ejecutado
export async function getBudgetVsExecuted(
    userId: string,
    start: string,
    end: string
): Promise<BudgetVsExecuted> {
    const response = await fetch(`${BASE_URL}/budget-vs-executed?userId=${userId}&start=${start}&end=${end}`);
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch budget vs executed');
    }
    return await response.json();
}

// 2. Consulta de movimientos (gastos + depósitos) por rango
export async function getMovements(
    userId: string,
    start: string,
    end: string
): Promise<Movement[]> {
    const response = await fetch(`${BASE_URL}/movements?userId=${userId}&start=${start}&end=${end}`);
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch movements');
    }
    return await response.json();
}

// 3. Reporte resumen histórico (total ingresos, gastos, balance)
export async function getSummaryReport(userId: string): Promise<SummaryReport> {
    const response = await fetch(`${BASE_URL}/historical-summary?userId=${userId}`);
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to fetch summary report');
    }
    return await response.json();
}
