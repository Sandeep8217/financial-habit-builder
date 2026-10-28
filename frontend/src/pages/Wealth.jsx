
import { useEffect, useState } from "react";
import {
    TrendingUp,
    Wallet,
    CreditCard,
    Plus,
    Trash2,
    Landmark,
    PiggyBank,
} from "lucide-react";
import api from "../api/api";

const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount ?? 0));

export default function Wealth() {
    const [assets, setAssets] = useState([]);
    const [liabilities, setLiabilities] = useState([]);
    const [summary, setSummary] = useState({
        totalAssets: 0,
        totalLiabilities: 0,
        netWorth: 0,
    });

    const [loading, setLoading] = useState(true);
    const [savingAsset, setSavingAsset] = useState(false);
    const [savingLiability, setSavingLiability] = useState(false);
    const [error, setError] = useState("");

    const [assetForm, setAssetForm] = useState({
        name: "",
        currentValue: "",
    });

    const [liabilityForm, setLiabilityForm] = useState({
        name: "",
        outstandingAmount: "",
    });

    async function loadWealth() {
        setLoading(true);
        setError("");

        try {
            const [assetResponse, liabilityResponse, summaryResponse] =
                await Promise.all([
                    api.get("/wealth/assets"),
                    api.get("/wealth/liabilities"),
                    api.get("/wealth/summary"),
                ]);

            setAssets(assetResponse.data);
            setLiabilities(liabilityResponse.data);
            setSummary(summaryResponse.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not load wealth data. Check that your backend is running."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadWealth();
    }, []);

    async function handleAddAsset(event) {
        event.preventDefault();
        setError("");
        setSavingAsset(true);

        try {
            await api.post("/wealth/assets", {
                name: assetForm.name.trim(),
                currentValue: Number(assetForm.currentValue),
            });

            setAssetForm({ name: "", currentValue: "" });
            await loadWealth();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not add the asset. Check the entered values."
            );
        } finally {
            setSavingAsset(false);
        }
    }

    async function handleAddLiability(event) {
        event.preventDefault();
        setError("");
        setSavingLiability(true);

        try {
            await api.post("/wealth/liabilities", {
                name: liabilityForm.name.trim(),
                outstandingAmount: Number(liabilityForm.outstandingAmount),
            });

            setLiabilityForm({ name: "", outstandingAmount: "" });
            await loadWealth();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not add the liability. Check the entered values."
            );
        } finally {
            setSavingLiability(false);
        }
    }

    async function handleDeleteAsset(id) {
        if (!window.confirm("Delete this asset?")) return;

        setError("");

        try {
            await api.delete(`/wealth/assets/${id}`);
            setAssets((current) => current.filter((asset) => asset.id !== id));

            const response = await api.get("/wealth/summary");
            setSummary(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not delete this asset."
            );
            await loadWealth();
        }
    }

    async function handleDeleteLiability(id) {
        if (!window.confirm("Delete this liability?")) return;

        setError("");

        try {
            await api.delete(`/wealth/liabilities/${id}`);
            setLiabilities((current) =>
                current.filter((liability) => liability.id !== id)
            );

            const response = await api.get("/wealth/summary");
            setSummary(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message || "Could not delete this liability."
            );
            await loadWealth();
        }
    }

    return (
        <div className="space-y-7 p-5 md:p-8">
            <header>
                <div className="flex items-center gap-3">
                    <TrendingUp size={27} className="text-emerald-600" />
                    <h2 className="text-2xl font-bold tracking-tight">
                        Wealth Tracker
                    </h2>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                    Track what you own, what you owe, and how your net worth changes.
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
                    label="Total assets"
                    amount={money(summary.totalAssets)}
                    description="Value of what you own"
                    icon={<PiggyBank size={21} />}
                    color="emerald"
                />
                <SummaryCard
                    label="Total liabilities"
                    amount={money(summary.totalLiabilities)}
                    description="Outstanding amounts you owe"
                    icon={<CreditCard size={21} />}
                    color="rose"
                />
                <SummaryCard
                    label="Net worth"
                    amount={money(summary.netWorth)}
                    description="Assets minus liabilities"
                    icon={<Wallet size={21} />}
                    color="blue"
                />
            </section>

            {loading && (
                <p className="text-sm text-slate-500">Refreshing wealth data...</p>
            )}

            <section className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                        <Landmark size={20} className="text-emerald-600" />
                        Add an asset
                    </h3>

                    <form onSubmit={handleAddAsset} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Asset name
                            </label>
                            <input
                                required
                                maxLength={100}
                                value={assetForm.name}
                                onChange={(event) =>
                                    setAssetForm({
                                        ...assetForm,
                                        name: event.target.value,
                                    })
                                }
                                placeholder="e.g. Savings account"
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Current value (₹)
                            </label>
                            <input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                value={assetForm.currentValue}
                                onChange={(event) =>
                                    setAssetForm({
                                        ...assetForm,
                                        currentValue: event.target.value,
                                    })
                                }
                                placeholder="e.g. 50000"
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={savingAsset}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                        >
                            <Plus size={17} />
                            {savingAsset ? "Adding..." : "Add asset"}
                        </button>
                    </form>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                        <CreditCard size={20} className="text-rose-600" />
                        Add a liability
                    </h3>

                    <form onSubmit={handleAddLiability} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Liability name
                            </label>
                            <input
                                required
                                maxLength={100}
                                value={liabilityForm.name}
                                onChange={(event) =>
                                    setLiabilityForm({
                                        ...liabilityForm,
                                        name: event.target.value,
                                    })
                                }
                                placeholder="e.g. Education loan"
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-rose-400"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                Outstanding amount (₹)
                            </label>
                            <input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                value={liabilityForm.outstandingAmount}
                                onChange={(event) =>
                                    setLiabilityForm({
                                        ...liabilityForm,
                                        outstandingAmount: event.target.value,
                                    })
                                }
                                placeholder="e.g. 250000"
                                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-rose-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={savingLiability}
                            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
                        >
                            <Plus size={17} />
                            {savingLiability ? "Adding..." : "Add liability"}
                        </button>
                    </form>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <RecordList
                    title="Your assets"
                    subtitle={`${assets.length} record${assets.length === 1 ? "" : "s"}`}
                    emptyMessage="No assets recorded yet."
                    items={assets}
                    nameKey="name"
                    amountKey="currentValue"
                    onDelete={handleDeleteAsset}
                    amountColor="text-emerald-600"
                />

                <RecordList
                    title="Your liabilities"
                    subtitle={`${liabilities.length} record${liabilities.length === 1 ? "" : "s"}`}
                    emptyMessage="No liabilities recorded yet."
                    items={liabilities}
                    nameKey="name"
                    amountKey="outstandingAmount"
                    onDelete={handleDeleteLiability}
                    amountColor="text-rose-600"
                />
            </section>
        </div>
    );
}

function SummaryCard({ label, amount, description, icon, color }) {
    const colorClasses = {
        emerald: "bg-emerald-50 text-emerald-600",
        rose: "bg-rose-50 text-rose-600",
        blue: "bg-blue-50 text-blue-600",
    };

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className={`rounded-xl p-2 ${colorClasses[color]}`}>
          {icon}
        </span>
            </div>
            <p className="mt-4 break-words text-2xl font-bold tracking-tight text-slate-900">
                {amount}
            </p>
            <p className="mt-1 text-xs text-slate-500">{description}</p>
        </article>
    );
}

function RecordList({
                        title,
                        subtitle,
                        emptyMessage,
                        items,
                        nameKey,
                        amountKey,
                        onDelete,
                        amountColor,
                    }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
            </div>

            {items.length === 0 ? (
                <p className="p-8 text-center text-sm text-slate-500">
                    {emptyMessage}
                </p>
            ) : (
                <div className="divide-y divide-slate-100">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between gap-3 p-5"
                        >
                            <div className="min-w-0">
                                <p className="break-words font-medium text-slate-800">
                                    {item[nameKey]}
                                </p>
                                <p className={`mt-1 text-sm font-semibold ${amountColor}`}>
                                    {money(item[amountKey])}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => onDelete(item.id)}
                                aria-label={`Delete ${item[nameKey]}`}
                                className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                            >
                                <Trash2 size={17} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
