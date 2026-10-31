
import { useEffect, useState } from "react";
import { ArrowLeftRight, Plus, Trash2 } from "lucide-react";
import api from "../api/api";

const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount ?? 0));

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: "",
        amount: "",
        type: "EXPENSE",
        categoryId: "",
        transactionDate: new Date().toLocaleDateString("en-CA"),
        note: "",
    });

    async function loadData() {
        setLoading(true);
        setError("");

        try {
            const [transactionResponse, categoryResponse] = await Promise.all([
                api.get("/transactions"),
                api.get("/categories"),
            ]);

            setTransactions(transactionResponse.data);
            setCategories(categoryResponse.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not load transactions. Check that the backend is running."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const filteredCategories = categories.filter(
        (category) => category.type === form.type
    );

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (!form.categoryId) {
            setError("Please create and select a category for this transaction.");
            return;
        }

        setSaving(true);

        try {
            await api.post("/transactions", {
                description: form.title.trim(),
                amount: Number(form.amount),
                type: form.type,
                category: {
                    id: Number(form.categoryId),
                },
                transactionDate: form.transactionDate,
            });

            setForm((current) => ({
                ...current,
                title: "",
                amount: "",
                categoryId: "",
                note: "",
            }));

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not save the transaction. Check the form fields."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this transaction?")) return;

        setError("");

        try {
            await api.delete(`/transactions/${id}`);
            setTransactions((current) =>
                current.filter((transaction) => transaction.id !== id)
            );
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not delete this transaction."
            );
        }
    }

    return (
        <div className="space-y-6 p-5 md:p-8">
            <div>
                <div className="flex items-center gap-3">
                    <ArrowLeftRight className="text-emerald-600" size={26} />
                    <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                    Record and manage your income and expenses.
                </p>
            </div>

            {error && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    {error}
                </div>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                    <Plus size={20} className="text-emerald-600" />
                    Add transaction
                </h3>

                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Transaction title
                        </label>
                        <input
                            required
                            maxLength={100}
                            value={form.title}
                            onChange={(event) =>
                                setForm({ ...form, title: event.target.value })
                            }
                            placeholder="e.g. Monthly salary"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Amount (₹)
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
                            placeholder="e.g. 25000"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Type
                        </label>
                        <select
                            value={form.type}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    type: event.target.value,
                                    categoryId: "",
                                })
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
                        >
                            <option value="EXPENSE">Expense</option>
                            <option value="INCOME">Income</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Category
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
                            {filteredCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {filteredCategories.length === 0 && (
                            <p className="mt-1.5 text-xs text-amber-700">
                                No matching categories found. Create one in Categories first.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Date
                        </label>
                        <input
                            required
                            type="date"
                            value={form.transactionDate}
                            onChange={(event) =>
                                setForm({ ...form, transactionDate: event.target.value })
                            }
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Note (optional)
                        </label>
                        <input
                            maxLength={250}
                            value={form.note}
                            onChange={(event) =>
                                setForm({ ...form, note: event.target.value })
                            }
                            placeholder="Add a short note"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Plus size={17} />
                            {saving ? "Saving..." : "Add transaction"}
                        </button>
                    </div>
                </form>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5">
                    <h3 className="text-lg font-semibold">All transactions</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {transactions.length} transaction
                        {transactions.length === 1 ? "" : "s"} recorded
                    </p>
                </div>

                {loading ? (
                    <p className="p-8 text-center text-sm text-slate-500">
                        Loading transactions...
                    </p>
                ) : transactions.length === 0 ? (
                    <p className="p-8 text-center text-sm text-slate-500">
                        No transactions yet. Add your first transaction above.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-5 py-3">Transaction</th>
                                <th className="px-5 py-3">Category</th>
                                <th className="px-5 py-3">Date</th>
                                <th className="px-5 py-3 text-right">Amount</th>
                                <th className="px-5 py-3 text-right">Action</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-slate-50">
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-slate-800">
                                            {transaction.description}
                                        </p>
                                        {transaction.note && (
                                            <p className="mt-1 text-xs text-slate-500">
                                                {transaction.note}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-slate-600">
                                        {transaction.categoryName ||
                                            transaction.category?.name ||
                                            "—"}
                                    </td>
                                    <td className="px-5 py-4 text-slate-600">
                                        {transaction.transactionDate}
                                    </td>
                                    <td
                                        className={`px-5 py-4 text-right font-semibold ${
                                            transaction.type === "INCOME"
                                                ? "text-emerald-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {transaction.type === "INCOME" ? "+" : "-"}
                                        {money(transaction.amount)}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(transaction.id)}
                                            aria-label={`Delete ${transaction.description}`}
                                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
