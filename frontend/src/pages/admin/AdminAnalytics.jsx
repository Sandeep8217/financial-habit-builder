
import { useEffect, useState } from "react";
import api from "../../api/api";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
    Activity,
    CheckCircle2,
    Target,
    TrendingUp,
    RefreshCw,
} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminAnalytics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/analytics");
            setStats(response.data);
        } catch (err) {
            console.error("Failed to load analytics:", err);
            setError("Unable to load analytics. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const cards = stats
        ? [
            {
                title: "Total Habits",
                value: stats.totalHabits,
                icon: Activity,
                color: "bg-blue-100 text-blue-600",
            },
            {
                title: "Active Habits",
                value: stats.activeHabits,
                icon: CheckCircle2,
                color: "bg-emerald-100 text-emerald-600",
            },
            {
                title: "Savings Goals",
                value: stats.totalSavingsGoals,
                icon: Target,
                color: "bg-purple-100 text-purple-600",
            },
            {
                title: "Completed Goals",
                value: stats.completedSavingsGoals,
                icon: TrendingUp,
                color: "bg-amber-100 text-amber-600",
            },
        ]
        : [];

    const habitChart = stats
        ? {
            labels: ["Active", "Inactive"],
            datasets: [
                {
                    data: [stats.activeHabits, stats.inactiveHabits],
                    backgroundColor: ["#10b981", "#cbd5e1"],
                    borderWidth: 0,
                },
            ],
        }
        : null;

    const goalChart = stats
        ? {
            labels: ["Completed", "Pending"],
            datasets: [
                {
                    data: [
                        stats.completedSavingsGoals,
                        Math.max(
                            0,
                            stats.totalSavingsGoals -
                            stats.completedSavingsGoals
                        ),
                    ],
                    backgroundColor: ["#8b5cf6", "#e2e8f0"],
                    borderWidth: 0,
                },
            ],
        }
        : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
            },
        },
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Analytics & Reports
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Platform-wide financial habit and savings insights.
                    </p>
                </div>

                <button
                    onClick={fetchAnalytics}
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

            {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                    Loading analytics...
                </div>
            ) : stats && (
                <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {cards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <div
                                    key={card.title}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">
                                                {card.title}
                                            </p>
                                            <h2 className="mt-3 text-3xl font-bold text-slate-800">
                                                {card.value.toLocaleString("en-IN")}
                                            </h2>
                                        </div>

                                        <div className={`rounded-xl p-3 ${card.color}`}>
                                            <Icon size={24} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5">
                            <h2 className="text-lg font-semibold text-slate-800">
                                Savings Goal Completion Rate
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Percentage of goals that reached their target amount.
                            </p>
                        </div>

                        <p className="text-4xl font-bold text-emerald-600">
                            {Number(stats.savingsGoalCompletionRate).toFixed(2)}%
                        </p>

                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-emerald-500 transition-all"
                                style={{
                                    width: `${Math.min(
                                        100,
                                        Math.max(0, stats.savingsGoalCompletionRate)
                                    )}%`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 font-semibold text-slate-800">
                                Habit Activity
                            </h2>

                            <div className="h-72">
                                <Doughnut
                                    data={habitChart}
                                    options={chartOptions}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 font-semibold text-slate-800">
                                Savings Goal Progress
                            </h2>

                            <div className="h-72">
                                <Doughnut
                                    data={goalChart}
                                    options={chartOptions}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
