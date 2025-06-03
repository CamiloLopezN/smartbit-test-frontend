export interface IMonetaryFund {
    id: string;
    name: string;
    type: 'BankAccount' | 'PettyCash';
    initialBalance: number;
    currentBalance: number;
    notes?: string;
}