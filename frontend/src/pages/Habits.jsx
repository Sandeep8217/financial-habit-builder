
import { useEffect, useState } from "react";
import {
    Heart,
    Plus,
    Trash2,
    Flame,
    Zap,
    CalendarCheck,
    CheckCircle2,
    History,
} from "lucide-react";
import api from "../api/api";

export default function Habits() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [completingId, setCompletingId] = useState(null);
    const [error, setError] = useState("");
    const [historyByHabit, setHistoryByHabit] = useState({});
    const [historyOpenId, setHistoryOpenId] = useState(null);
    const [historyLoadingId, setHistoryLoadingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const today = new Date().toLocaleDateString("en-CA");

    async function loadHabits() {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/habits");
            setHabits(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not load habits. Check that your backend is running."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadHabits();
    }, []);

    async function handleCreate(event) {
        event.preventDefault();
        setError("");
        setSaving(true);

        try {
            const response = await api.post("/habits", {
                name: form.name.trim(),
                description: form.description.trim(),
                active: true,
            });

            setHabits((current) => [response.data, ...current]);
            setForm({ name: "", description: "" });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not create the habit. Check the form fields."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleComplete(habit) {
        setError("");
        setCompletingId(habit.id);

        try {
            const response = await api.post(`/habits/${habit.id}/complete`);

            setHabits((current) =>
                current.map((item) =>
                    item.id === habit.id ? response.data : item
                )
            );

            // Refresh history if it is already open for this habit.
            if (historyOpenId === habit.id) {
                await loadHistory(habit.id);
            }
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Could not complete this habit.";

            setError(message);
        } finally {
            setCompletingId(null);
        }
    }

    async function loadHistory(habitId) {
        setHistoryLoadingId(habitId);

        try {
            const response = await api.get(`/habits/${habitId}/history`);
            setHistoryByHabit((current) => ({
                ...current,
                [habitId]: response.data,
            }));
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not load completion history."
            );
        } finally {
            setHistoryLoadingId(null);
        }
    }

    async function toggleHistory(habitId) {
        if (historyOpenId === habitId) {
            setHistoryOpenId(null);
            return;
        }

        setHistoryOpenId(habitId);

        if (!historyByHabit[habitId]) {
            await loadHistory(habitId);
        }
    }

    async function handleDelete(habitId) {
        if (!window.confirm("Are you sure you want to delete this habit?")) {
            return;
        }

        setError("");

        try {
            await api.delete(`/habits/${habitId}`);

            setHabits((current) =>
                current.filter((habit) => habit.id !== habitId)
            );

            setHistoryOpenId((current) =>
                current === habitId ? null : current
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not delete this habit."
            );
        }
    }

    const activeHabits = habits.filter((habit) => habit.active);
    const completedToday = activeHabits.filter(
        (habit) => habit.lastCompletedDate === today
    ).length;

    const totalXp = habits.reduce(
        (sum, habit) => sum + Number(habit.totalXp ?? 0),
        0
    );

    const longestCurrentStreak = habits.reduce(
        (longest, habit) =>
            Math.max(longest, Number(habit.currentStreak ?? 0)),
        0
    );

    return (
        <div className="space-y-7 p-5 md:p-8">
            <header>
                <div className="flex items-center gap-3">
                    <Heart size={27} className="text-emerald-600" />
                    <h2 className="text-2xl font-bold tracking-tight">
                        Financial Habits
                    </h2>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                    Small daily actions create stronger financial habits.
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

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    label="Active habits"
                    value={activeHabits.length}
                    icon={<CalendarCheck size={20} />}
                />
                <SummaryCard
                    label="Completed today"
                    value={`${completedToday} / ${activeHabits.length}`}
                    icon={<CheckCircle2 size={20} />}
                />
                <SummaryCard
                    label="Total XP"
                    value={totalXp}
                    icon={<Zap size={20} />}
                />
                <SummaryCard
                    label="Best current streak"
                    value={`${longestCurrentStreak} day${longestCurrentStreak === 1 ? "" : "s"}`}
                    icon={<Flame size={20} />}
                />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                    <Plus size={20} className="text-emerald-600" />
                    Create a financial habit
                </h3>

                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Habit name
                        </label>
                        <input
                            required
                            maxLength={100}
                            value={form.name}
                            onChange={(event) =>
                                setForm({ ...form, name: event.target.value })
                            }
                            placeholder="e.g. Track daily expenses"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Description (optional)
                        </label>
                        <textarea
                            maxLength={250}
                            rows={3}
                            value={form.description}
                            onChange={(event) =>
                                setForm({ ...form, description: event.target.value })
                            }
                            placeholder="e.g. Record every purchase before going to bed."
                            className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Plus size={17} />
                        {saving ? "Creating..." : "Create habit"}
                    </button>
                </form>
            </section>

            <section>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Your daily habits</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Complete each active habit once a day to earn 10 XP.
                    </p>
                </div>

                {loading ? (
                    <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">
                        Loading habits...
                    </div>
                ) : habits.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                        <Heart size={34} className="mx-auto text-slate-400" />
                        <p className="mt-3 font-semibold text-slate-800">
                            No habits yet
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Create your first habit to begin building consistency.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {habits.map((habit) => {
                            const completed = habit.lastCompletedDate === today;
                            const streak = Number(habit.currentStreak ?? 0);
                            const xp = Number(habit.totalXp ?? 0);
                            const history = historyByHabit[habit.id] ?? [];

                            return (
                                <article
                                    key={habit.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                        <div className="flex gap-3">
                                            <div
                                                className={`rounded-xl p-3 ${
                                                    completed
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                            >
                                                {completed ? (
                                                    <CheckCircle2 size={23} />
                                                ) : (
                                                    <Heart size={23} />
                                                )}
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-slate-900">
                                                    {habit.name}
                                                </h4>
                                                {habit.description && (
                                                    <p className="mt-1 max-w-xl text-sm text-slate-500">
                                                        {habit.description}
                                                    </p>
                                                )}

                                                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Flame
                                size={15}
                                className="text-orange-500"
                            />
                              {streak}-day streak
                          </span>
                                                    <span className="inline-flex items-center gap-1">
                            <Zap
                                size={15}
                                className="text-amber-500"
                            />
                                                        {xp} XP earned
                          </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                            <button
                                                type="button"
                                                onClick={() => toggleHistory(habit.id)}
                                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                            >
                                                <History size={16} />
                                                History
                                            </button>

                                            {habit.active && (
                                                <button
                                                    type="button"
                                                    disabled={completed || completingId === habit.id}
                                                    onClick={() => handleComplete(habit)}
                                                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                                        completed
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                                                    }`}
                                                >
                                                    <CheckCircle2 size={17} />
                                                    {completed
                                                        ? "Completed today"
                                                        : completingId === habit.id
                                                            ? "Completing..."
                                                            : "Complete today"}
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(habit.id)}
                                                aria-label={`Delete ${habit.name}`}
                                                className="rounded-xl p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </div>

                                    {historyOpenId === habit.id && (
                                        <div className="mt-5 border-t border-slate-100 pt-4">
                                            <h5 className="mb-3 text-sm font-semibold text-slate-800">
                                                Completion history
                                            </h5>

                                            {historyLoadingId === habit.id ? (
                                                <p className="text-sm text-slate-500">
                                                    Loading history...
                                                </p>
                                            ) : history.length === 0 ? (
                                                <p className="text-sm text-slate-500">
                                                    No completions recorded yet.
                                                </p>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {history.map((item) => (
                                                        <span
                                                            key={item.id}
                                                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700"
                                                        >
                              <CheckCircle2 size={14} />
                                                            {item.completionDate}
                            </span>
                                                    ))}
                                                </div>
                                            )}
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

function SummaryCard({ label, value, icon }) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
          {icon}
        </span>
            </div>
            <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                {value}
            </p>
        </article>
    );
}
