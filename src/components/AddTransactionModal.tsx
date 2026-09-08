import React, { useState } from "react";
import { dashboardService } from "../services/dashboardService";
import type { CreateTransactionPayload } from "../types/dashboard";

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [type, setType] = useState<"expense" | "income">("expense");
    const [amount, setAmount] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [categoryName, setCategoryName] = useState<string>("General");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Please enter a valid amount greater than 0.");
            return;
        }

        if (!description.trim()) {
            setError("Please provide a description.");
            return;
        }

        const payload: CreateTransactionPayload = {
            amount: parsedAmount,
            description: description.trim(),
            category_name: categoryName.trim() || "General",
            type,
        };

        try {
            setIsSubmitting(true);
            await dashboardService.createTransaction(payload);
            setAmount("");
            setDescription("");
            setCategoryName("General");
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to create transaction.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Add Transaction</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition text-lg"
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* Type Segment Control */}
                    <div className="flex rounded-lg bg-gray-100 p-1">
                        <button
                            type="button"
                            onClick={() => setType("expense")}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${type === "expense"
                                    ? "bg-white text-rose-600 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setType("income")}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${type === "income"
                                    ? "bg-white text-emerald-600 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Income
                        </button>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Amount (£)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Description
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Sainsbury's Groceries"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Category
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Groceries, Rent, Salary"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm disabled:opacity-50"
                        >
                            {isSubmitting ? "Adding..." : "Add Transaction"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};