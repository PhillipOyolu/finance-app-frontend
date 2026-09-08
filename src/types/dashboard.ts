export interface Transaction {
    id: number;
    amount: number;
    description: string;
    category: string;
    type: "income" | "expense";
    date: string;
}

export interface DashboardSummary {
    total_balance: number;
    monthly_income: number;
    monthly_expenses: number
    recent_transactions: Transaction[]
}

export interface CreateTransactionPayload {
    amount: number;
    description: string;
    category_name: string;
    type: "income" | "expense";
}