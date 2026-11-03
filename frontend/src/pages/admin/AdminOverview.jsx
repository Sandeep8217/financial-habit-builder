
import { useEffect, useState } from "react";
import api from "../../api/api";

import {
    Users,
    UserCheck,
    ArrowLeftRight,
    MessageSquare,
    RefreshCw,
} from "lucide-react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function AdminOverview() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalTransactions: 0,
        pendingFeedback: 0,
    });

    const [trend, setTrend] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [recentUsers, setRecentUsers] = useState([]);

    const fetchStats = async () => {
        try {
            setError("");
            setLoading(true);

            const [statsResponse, trendResponse, usersResponse] =
                await Promise.all([
                    api.get("/admin/dashboard"),
                    api.get("/admin/registration-trend"),
                    api.get("/admin/users", {
                        params: {
                            page: 0,
                            size: 5,
                            sort: "createdAt,desc",
                        },
                    }),
                ]);

            setStats(statsResponse.data);
            setTrend(trendResponse.data);
            setRecentUsers(usersResponse.data.content);

            setStats(statsResponse.data);
            setTrend(trendResponse.data);
        } catch (err) {
            console.error("Failed to load admin overview:", err);
            setError("Unable to load dashboard data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const cards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            subtitle: "Registered accounts",
            icon: Users,
            color: "bg-blue-100 text-blue-600",
        },
        {
            title: "Active Users",
            value: stats.activeUsers,
            subtitle: "Enabled accounts",
            icon: UserCheck,
            color: "bg-emerald-100 text-emerald-600",
        },
        {
            title: "Total Transactions",
            value: stats.totalTransactions,
            subtitle: "Platform transactions",
            icon: ArrowLeftRight,
            color: "bg-purple-100 text-purple-600",
        },
        {
            title: "Pending Feedback",
            value: stats.pendingFeedback,
            subtitle: "Awaiting admin review",
            icon: MessageSquare,
            color: "bg-amber-100 text-amber-600",
        },
    ];

    const chartData = {
        labels: trend.map((item) => item.month),
        datasets: [
            {
                label: "New Registrations",
                data: trend.map((item) => item.users),
                borderColor: "#6366f1",
                backgroundColor: "rgba(99, 102, 241, 0.12)",
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: "index",
                intersect: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };

    return (
        <div className="space-y-8">

            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Admin Overview
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Monitor your WealthWise platform.
                    </p>
                </div>

                <button
                    onClick={fetchStats}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {card.title}
                                    </p>

                                    <h2 className="mt-3 text-3xl font-bold text-slate-800">
                                        {loading
                                            ? "..."
                                            : Number(card.value).toLocaleString("en-IN")}
                                    </h2>

                                    <p className="mt-2 text-xs text-slate-400">
                                        {card.subtitle}
                                    </p>
                                </div>

                                <div className={`rounded-xl p-3 ${card.color}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* User Registration Trend */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-800">
                        User Registration Trend
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Monthly new user registrations over the last six months.
                    </p>
                </div>

                <div className="h-80">
                    {loading ? (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                            Loading registration data...
                        </div>
                    ) : trend.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                            No registration data available.
                        </div>
                    ) : (
                        <Line data={chartData} options={chartOptions} />
                    )}
                </div>
            </div>

            {/* Recent Registrations */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-800">
                        Recent Registrations
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Latest users who joined WealthWise.
                    </p>
                </div>

                {loading ? (
                    <p className="text-sm text-slate-400">
                        Loading users...
                    </p>
                ) : recentUsers.length === 0 ? (
                    <p className="text-sm text-slate-400">
                        No registered users found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                            <tr className="border-b border-slate-100 text-slate-500">
                                <th className="pb-3 font-medium">User</th>
                                <th className="pb-3 font-medium">Role</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium">Joined</th>
                            </tr>
                            </thead>

                            <tbody>
                            {recentUsers.map((user) => (
                                <tr key={user.id} className="border-b border-slate-50">
                                    <td className="py-4">
                                        <p className="font-medium text-slate-800">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {user.email}
                                        </p>
                                    </td>

                                    <td className="py-4">
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                                    {user.role}
                                </span>
                                    </td>

                                    <td className="py-4">
                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                    user.enabled
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-red-50 text-red-600"
                                }`}>
                                    {user.enabled ? "Active" : "Disabled"}
                                </span>
                                    </td>

                                    <td className="py-4 text-slate-500">
                                        {new Date(user.createdAt).toLocaleDateString("en-IN")}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}
