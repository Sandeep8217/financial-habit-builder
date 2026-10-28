
import { useEffect, useState } from "react";
import {
    Target,
    Plus,
    Trash2,
    CalendarDays,
    PiggyBank,
    TrendingUp,
} from "lucide-react";
import api from "../api/api";

const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount ?? 0));

export default function SavingsGoals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [contributionAmounts, setContributionAmounts] = useState({});
    const [contributingId, setContributingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        targetAmount: "",
        targetDate: "",
    });

    async function loadGoals() {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/goals");
            setGoals(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not load savings goals. Check that your backend is running."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadGoals();
    }, []);

    async function handleCreateGoal(event) {
        event.preventDefault();
        setError("");
        setSaving(true);

        try {
            await api.post("/goals", {
                name: form.name.trim(),
                targetAmount: Number(form.targetAmount),
                currentAmount: 0,
                targetDate: form.targetDate || null,
            });

            setForm({
                name: "",
                targetAmount: "",
                targetDate: "",
            });

            await loadGoals();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not create the savings goal. Check the form fields."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleContribution(event, goalId) {
        event.preventDefault();
        setError("");

        const amount = Number(contributionAmounts[goalId]);

        if (!Number.isFinite(amount) || amount <= 0) {
            setError("Enter a contribution greater than zero.");
            return;
        }

        setContributingId(goalId);

        try {
            const response = await api.post(
                `/goals/${goalId}/contributions`,
                { amount }
            );

            setGoals((current) =>
                current.map((goal) =>
                    goal.id === goalId ? response.data : goal
                )
            );

            setContributionAmounts((current) => ({
                ...current,
                [goalId]: "",
            }));
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Could not add the contribution."
            );
        } finally {
            setContributingId(null);
        }
    }

    async function handleDelete(goalId) {
        if (!window.confirm("Are you sure you want to delete this savings goal?")) {
            return;
        }

        setError("");

        try {
            await api.delete(`/goals/${goalId}`);
            setGoals((current) =>
                current.filter((goal) => goal.id !== goalId)
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not delete this savings goal."
            );
        }
    }

    const totalTarget = goals.reduce(
        (sum, goal) => sum + Number(goal.targetAmount ?? 0),
        0
    );

    const totalSaved = goals.reduce(
        (sum, goal) => sum + Number(goal.currentAmount ?? 0),
        0
    );

    const totalRemaining = goals.reduce(
        (sum, goal) =>
            sum +
            Math.max(
                0,
                Number(goal.targetAmount ?? 0) -
                Number(goal.currentAmount ?? 0)
            ),
        0
    );

    const completedGoals = goals.filter(
        (goal) =>
            Number(goal.currentAmount ?? 0) >=
            Number(goal.targetAmount ?? 0)
    ).length;

    return (
        <div className="space-y-7 p-5 md:p-8">
            <header>
                <div className="flex items-center gap-3">
                    <Target size={27} className="text-emerald-600" />
                    <h2 className="text-2xl font-bold tracking-tight">
                        Savings Goals
                    </h2>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                    Turn your financial plans into achievable milestones.
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
                    label="Total target"
                    amount={money(totalTarget)}
                    description={`${goals.length} savings goal${goals.length === 1 ? "" : "s"}`}
                    icon={<Target size={20} />}
                />
                <SummaryCard
                    label="Total saved"
                    amount={money(totalSaved)}
                    description={`${completedGoals} goal${completedGoals === 1 ? "" : "s"} completed`}
                    icon={<PiggyBank size={20} />}
                />
                <SummaryCard
                    label="Still to save"
                    amount={money(totalRemaining)}
                    description="Remaining across all goals"
                    icon={<TrendingUp size={20} />}
                />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                    <Plus size={20} className="text-emerald-600" />
                    Create a savings goal
                </h3>

                <form
                    onSubmit={handleCreateGoal}
                    className="grid gap-4 md:grid-cols-3"
                >
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Goal name
                        </label>
                        <input
                            required
                            maxLength={100}
                            value={form.name}
                            onChange={(event) =>
                                setForm({ ...form, name: event.target.value })
                            }
                            placeholder="e.g. Emergency fund"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Target amount (₹)
                        </label>
                        <input
                            required
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={form.targetAmount}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    targetAmount: event.target.value,
                                })
                            }
                            placeholder="e.g. 100000"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Target date (optional)
                        </label>
                        <input
                            type="date"
                            value={form.targetDate}
                            onChange={(event) =>
                                setForm({ ...form, targetDate: event.target.value })
                            }
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div className="md:col-span-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Plus size={17} />
                            {saving ? "Creating..." : "Create goal"}
                        </button>
                    </div>
                </form>
            </section>

            <section>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Your savings goals</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Track your progress and add contributions as you save.
                    </p>
                </div>

                {loading ? (
                    <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">
                        Loading savings goals...
                    </div>
                ) : goals.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                        <PiggyBank
                            size={34}
                            className="mx-auto text-slate-400"
                        />
                        <p className="mt-3 font-semibold text-slate-800">
                            Start your savings journey
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Create your first goal using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {goals.map((goal) => {
                            const target = Number(goal.targetAmount ?? 0);
                            const saved = Number(goal.currentAmount ?? 0);
                            const percentage =
                                target > 0 ? (saved / target) * 100 : 0;
                            const progress = Math.max(
                                0,
                                Math.min(percentage, 100)
                            );
                            const completed = saved >= target;

                            return (
                                <article
                                    key={goal.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                                                {completed ? (
                                                    <TrendingUp size={22} />
                                                ) : (
                                                    <Target size={22} />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800">
                                                    {goal.name}
                                                </h4>
                                                {goal.targetDate && (
                                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                                        <CalendarDays size={14} />
                                                        Target: {goal.targetDate}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(goal.id)}
                                            aria-label={`Delete ${goal.name}`}
                                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>

                                    <div className="mt-6 flex items-end justify-between gap-3">
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Amount saved
                                            </p>
                                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                                {money(saved)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500">
                                                Target
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-700">
                                                {money(target)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className={`h-full rounded-full transition-all ${
                                                completed
                                                    ? "bg-emerald-600"
                                                    : "bg-emerald-400"
                                            }`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>

                                    <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-emerald-700">
                      {percentage.toFixed(1)}% completed
                    </span>
                                        <span className="text-slate-500">
                      {completed
                          ? "Goal achieved!"
                          : `${money(target - saved)} to go`}
                    </span>
                                    </div>

                                    {!completed && (
                                        <form
                                            onSubmit={(event) =>
                                                handleContribution(event, goal.id)
                                            }
                                            className="mt-5 flex gap-2"
                                        >
                                            <input
                                                aria-label={`Contribution amount for ${goal.name}`}
                                                required
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={contributionAmounts[goal.id] ?? ""}
                                                onChange={(event) =>
                                                    setContributionAmounts((current) => ({
                                                        ...current,
                                                        [goal.id]: event.target.value,
                                                    }))
                                                }
                                                placeholder="Contribution (₹)"
                                                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                                            />
                                            <button
                                                type="submit"
                                                disabled={contributingId === goal.id}
                                                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
                                            >
                                                {contributingId === goal.id
                                                    ? "Adding..."
                                                    : "Contribute"}
                                            </button>
                                        </form>
                                    )}

                                    {completed && (
                                        <div className="mt-5 rounded-xl bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700">
                                            Congratulations! You've reached this savings goal.
                                        </div>
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
