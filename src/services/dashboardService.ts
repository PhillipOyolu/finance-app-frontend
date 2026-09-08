import api from "./api";
import type { DashboardSummary, CreateTransactionPayload, Transaction } from "../types/dashboard";

export const dashboardService = {
    getSummary: async (): Promise<DashboardSummary> => {
        const response = await api.get<DashboardSummary>("/dashboard/summary");
        return response.data;
    },

    createTransaction: async (data: CreateTransactionPayload): Promise<Transaction> => {
        const response = await api.post<Transaction>("/dashboard/transaction", data);
        return response.data;
    },
};