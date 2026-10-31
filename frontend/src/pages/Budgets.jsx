
import { useEffect, useState } from "react";
import { Wallet, Plus, Trash2, TrendingUp } from "lucide-react";
import api from "../api/api";

const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount ?? 0));

export default function Budgets() {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        categoryId: "",
        amount: "",
        month: new Date().toISOString().slice(0, 7),
    });

    async function loadData() {
        setLoading(true);
        setError("");

        try {
            const [budgetResponse, summaryResponse, categoryResponse] =
                await Promise.all([
                    api.get("/budgets"),
                    api.get("/budgets/summary"),
                    api.get("/categories"),
                ]);

            const rawBudgets = budgetResponse.data;
            const summaries = summaryResponse.data;
            const categoryList = categoryResponse.data;

            setCategories(categoryList);

            // Match budget summaries with their corresponding budget records.
            const mergedBudgets = rawBudgets.map((budget) => {
                const summary = summaries.find(
                    (item) => String(item.budgetId) === String(budget.id)
                );

                return {
                    ...budget,
                    spent: Number(summary?.spent ?? 0),
                    remaining: Number(
                        summary?.remaining ??
                        Number(budget.amount ?? budget.budgetAmount ?? 0)
                    ),
                    percentageUsed: Number(summary?.percentageUsed ?? 0),
                    category:
                        summary?.category ||
                        budget.categoryName ||
                        budget.category?.name ||
                        "Category",
                    displayAmount: Number(
                        summary?.budgetAmount ??
                        budget.amount ??
                        budget.budgetAmount ??
                        0
                    ),
                };
            });

            setBudgets(mergedBudgets);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not load budgets. Check that the backend is running."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (!form.categoryId) {
            setError("Please select an expense category.");
            return;
        }

        setSaving(true);

        try {
            const [year, month] = form.month.split("-").map(Number);

            await api.post("/budgets", {
                category: { id: Number(form.categoryId) },
                amount: Number(form.amount),
                year,
                month,
            });


            setForm((current) => ({
                ...current,
                categoryId: "",
                amount: "",
            }));

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not create the budget. Check the required fields."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this budget?")) return;

        setError("");

        try {
            await api.delete(`/budgets/${id}`);
            setBudgets((current) =>
                current.filter((budget) => String(budget.id) !== String(id))
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not delete this budget. Check whether the backend supports budget deletion."
            );
        }
    }

    const expenseCategories = categories.filter(
        (category) => category.type === "EXPENSE"
    );

    const totalBudget = budgets.reduce(
        (sum, budget) => sum + budget.displayAmount,
        0
    );

    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);

    const totalRemaining = budgets.reduce(
        (sum, budget) => sum + budget.remaining,
        0
    );

    return (
        <div className="space-y-7 p-5 md:p-8">
            <header>
                <div className="flex items-center gap-3">
                    <Wallet size={27} className="text-emerald-600" />
                    <h2 className="text-2xl font-bold tracking-tight">Budgets</h2>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                    Set spending limits and keep your monthly expenses under control.
                </p>
            </header>

            {error && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    {error}
                </div>
            )}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <SummaryCard
                    label="Total budget"
                    amount={money(totalBudget)}
                    description="Combined spending limits"
                    icon={<Wallet size={20} />}
                />
                <SummaryCard
                    label="Total spent"
                    amount={money(totalSpent)}
                    description="Tracked spending"
                    icon={<TrendingUp size={20} />}
                />
                <SummaryCard
                    label="Remaining"
                    amount={money(totalRemaining)}
                    description="Available budget balance"
                    icon={<Plus size={20} />}
                />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <h3 className="mb-5 text-lg font-semibold">Create a monthly budget</h3>

                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Expense category
                        </label>
                        <select
                            required
                            value={form.categoryId}
                            onChange={(event) =>
                                setForm({ ...form, categoryId: event.target.value })
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
                        >
                            <option value="">Select category</option>
                            {expenseCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {expenseCategories.length === 0 && (
                            <p className="mt-1.5 text-xs text-amber-700">
                                Create an EXPENSE category before adding a budget.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Monthly limit (₹)
                        </label>
                        <input
                            required
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={form.amount}
                            onChange={(event) =>
                                setForm({ ...form, amount: event.target.value })
                            }
                            placeholder="e.g. 5000"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Month
                        </label>
                        <input
                            required
                            type="month"
                            value={form.month}
                            onChange={(event) =>
                                setForm({ ...form, month: event.target.value })
                            }
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div className="md:col-span-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                        >
                            <Plus size={17} />
                            {saving ? "Creating..." : "Create budget"}
                        </button>
                    </div>
                </form>
            </section>

            <section>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Your budgets</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Monitor how much of each spending limit you've used.
                    </p>
                </div>

                {loading ? (
                    <p className="rounded-xl bg-white p-8 text-center text-sm text-slate-500">
                        Loading budgets...
                    </p>
                ) : budgets.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                        <Wallet size={32} className="mx-auto text-slate-400" />
                        <p className="mt-3 font-semibold text-slate-800">
                            No budgets created yet
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Create your first budget using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                        {budgets.map((budget) => {
                            const percentage = Math.max(
                                0,
                                Math.min(budget.percentageUsed, 100)
                            );
                            const overBudget = budget.spent > budget.displayAmount;
                            const warning = budget.percentageUsed >= 80;

                            return (
                                <article
                                    key={budget.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h4 className="font-semibold text-slate-800">
                                                {budget.category}
                                            </h4>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {budget.month || form.month}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(budget.id)}
                                            aria-label={`Delete ${budget.category} budget`}
                                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>

                                    <div className="mt-5 flex items-end justify-between gap-3">
                                        <div>
                                            <p className="text-xs text-slate-500">Spent</p>
                                            <p className="mt-1 text-xl font-bold text-slate-900">
                                                {money(budget.spent)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500">Budget limit</p>
                                            <p className="mt-1 font-semibold text-slate-700">
                                                {money(budget.displayAmount)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className={`h-full rounded-full transition-all ${
                                                overBudget
                                                    ? "bg-red-500"
                                                    : warning
                                                        ? "bg-amber-500"
                                                        : "bg-emerald-500"
                                            }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>

                                    <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                    <span
                        className={
                            overBudget
                                ? "font-medium text-red-600"
                                : warning
                                    ? "font-medium text-amber-600"
                                    : "text-slate-500"
                        }
                    >
                      {budget.percentageUsed.toFixed(0)}% used
                    </span>
                                        <span
                                            className={`font-semibold ${
                                                overBudget ? "text-red-600" : "text-slate-700"
                                            }`}
                                        >
                      {overBudget
                          ? `${money(budget.spent - budget.displayAmount)} over`
                          : `${money(budget.remaining)} left`}
                    </span>
                                    </div>

                                    {overBudget && (
                                        <p className="mt-3 text-xs text-red-600">
                                            You've exceeded this budget. Consider reducing spending
                                            in this category.
                                        </p>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}

function SummaryCard({ label, amount, description, icon }) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
          {icon}
        </span>
            </div>
            <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                {amount}
            </p>
            <p className="mt-1 text-xs text-slate-500">{description}</p>
        </article>
    );
}
