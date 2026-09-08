import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dashboardService";
import { AddTransactionModal } from "../components/AddTransactionModal";
import type { DashboardSummary } from "../types/dashboard";

export const Dashboard: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const fetchSummary = useCallback(async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getSummary();
            setSummary(data);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
        }).format(val);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
                <div className="p-6">
                    <div className="text-xl font-bold tracking-tight text-gray-900 mb-8">
                        Finance<span className="text-blue-600">App</span>
                    </div>
                    <nav className="space-y-1">
                        <a
                            href="#"
                            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg"
                        >
                            Overview
                        </a>
                        <a
                            href="#"
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition"
                        >
                            Transactions
                        </a>
                        <a
                            href="#"
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition"
                        >
                            Analytics
                        </a>
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center px-3.5 py-1.5 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm"
                        >
                            + Add Transaction
                        </button>
                        <div className="flex items-center space-x-2 border-l pl-4 border-gray-200">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium text-sm">
                                U
                            </div>
                            <span className="text-sm font-medium text-gray-700">Account</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    {error && (
                        <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <span className="text-sm font-medium text-gray-500">Total Balance</span>
                            <p className="text-2xl font-bold text-gray-900 mt-2">
                                {loading ? "..." : formatCurrency(summary?.total_balance ?? 0)}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <span className="text-sm font-medium text-gray-500">Monthly Income</span>
                            <p className="text-2xl font-bold text-emerald-600 mt-2">
                                {loading ? "..." : `+${formatCurrency(summary?.monthly_income ?? 0)}`}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <span className="text-sm font-medium text-gray-500">Monthly Expenses</span>
                            <p className="text-2xl font-bold text-rose-600 mt-2">
                                {loading ? "..." : `-${formatCurrency(summary?.monthly_expenses ?? 0)}`}
                            </p>
                        </div>
                    </div>

                    {/* Recent Transactions List */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Transactions</h2>

                        {loading ? (
                            <div className="text-center py-12 text-gray-400 text-sm">Loading transactions...</div>
                        ) : summary?.recent_transactions && summary.recent_transactions.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {summary.recent_transactions.map((tx) => (
                                    <div key={tx.id} className="py-3 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{tx.description}</p>
                                            <p className="text-xs text-gray-500">
                                                {tx.category} • {new Date(tx.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span
                                            className={`text-sm font-semibold ${tx.type === "income" ? "text-emerald-600" : "text-gray-900"
                                                }`}
                                        >
                                            {tx.type === "income" ? "+" : "-"}
                                            {formatCurrency(tx.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400 text-sm">
                                No transactions recorded yet.
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Transaction Modal */}
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchSummary}
            />
        </div>
    );
};