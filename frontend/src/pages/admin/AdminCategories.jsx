
import { useEffect, useState } from "react";
import api from "../../api/api";
import {
    Plus,
    Trash2,
    RefreshCw,
    Tag,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [type, setType] = useState("EXPENSE");
    const [filter, setFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/categories");
            setCategories(response.data || []);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            setError("Unable to load categories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Please enter a category name.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await api.post("/categories", {
                name: name.trim(),
                type,
            });

            setName("");
            setSuccess("Category created successfully.");
            await fetchCategories();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create category."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (category) => {
        if (!window.confirm(
            `Are you sure you want to delete "${category.name}"?`
        )) return;

        try {
            setError("");
            setSuccess("");

            await api.delete(`/categories/${category.id}`);

            setSuccess("Category deleted successfully.");
            await fetchCategories();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete category. It may be associated with existing transactions."
            );
        }
    };

    const filteredCategories = categories.filter((category) =>
        filter === "ALL" || category.type === filter
    );

    const incomeCount = categories.filter(
        (category) => category.type === "INCOME"
    ).length;

    const expenseCount = categories.filter(
        (category) => category.type === "EXPENSE"
    ).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Category Management
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage income and expense categories.
                    </p>
                </div>

                <button
                    onClick={fetchCategories}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
                    <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                        <TrendingUp size={23} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">
                            Income Categories
                        </p>
                        <p className="text-2xl font-bold text-slate-800">
                            {incomeCount}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
                    <div className="rounded-xl bg-red-100 p-3 text-red-600">
                        <TrendingDown size={23} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">
                            Expense Categories
                        </p>
                        <p className="text-2xl font-bold text-slate-800">
                            {expenseCount}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="mb-5 font-semibold text-slate-800">
                    Add New Category
                </h2>

                <form
                    onSubmit={handleCreate}
                    className="flex flex-col gap-3 sm:flex-row"
                >
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter category name"
                        maxLength={50}
                        required
                        className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    />

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    >
                        <option value="EXPENSE">Expense</option>
                        <option value="INCOME">Income</option>
                    </select>

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                    >
                        <Plus size={17} />
                        {saving ? "Adding..." : "Add Category"}
                    </button>
                </form>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center gap-2">
                        <Tag size={18} className="text-slate-500" />
                        <h2 className="font-semibold text-slate-800">
                            All Categories
                        </h2>
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    >
                        <option value="ALL">All Categories</option>
                        <option value="INCOME">Income</option>
                        <option value="EXPENSE">Expense</option>
                    </select>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-slate-500">
                        Loading categories...
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                        No categories found.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredCategories.map((category) => (
                            <div
                                key={category.id}
                                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50"
                            >
                                <div>
                                    <p className="font-medium text-slate-800">
                                        {category.name}
                                    </p>

                                    <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                        category.type === "INCOME"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-red-100 text-red-700"
                                    }`}>
                                        {category.type}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleDelete(category)}
                                    title="Delete category"
                                    className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 size={17} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
