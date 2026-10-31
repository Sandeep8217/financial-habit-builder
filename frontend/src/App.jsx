
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import SavingsGoals from "./pages/SavingsGoals";
import Habits from "./pages/Habits";
import Wealth from "./pages/Wealth";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

import { useAuth } from "./context/AuthContext";

import {
    NavLink,
    Routes,
    Route,
    useNavigate,
} from "react-router-dom";

import {
    LayoutDashboard,
    ArrowLeftRight,
    Wallet,
    Target,
    Heart,
    TrendingUp,
    Bell,
    Search,
    LogOut,
} from "lucide-react";

import { useEffect, useState } from "react";
import api from "./api/api";

const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);

const navigation = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Transactions", icon: ArrowLeftRight },
    { label: "Budgets", icon: Wallet },
    { label: "Savings Goals", icon: Target },
    { label: "Habits", icon: Heart },
    { label: "Wealth", icon: TrendingUp },
];

// Main authenticated application
function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [liveSummary, setLiveSummary] = useState(null);
    const [liveTransactions, setLiveTransactions] = useState([]);
    const [liveBudgets, setLiveBudgets] = useState([]);
    const [liveGoals, setLiveGoals] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [wealthSummary, setWealthSummary] = useState(null);

    const handleDashboardContribution = async (goal) => {
        const amount = window.prompt(
            `Enter contribution amount for "${goal.name}":`
        );

        if (amount === null) return;

        const contributionAmount = Number(amount);

        if (!Number.isFinite(contributionAmount) || contributionAmount <= 0) {
            alert("Enter a contribution greater than zero.");
            return;
        }

        try {
            const response = await api.post(
                `/goals/${goal.id}/contributions`,
                { amount: contributionAmount }
            );

            setLiveGoals((current) =>
                current.map((item) =>
                    item.id === goal.id ? response.data : item
                )
            );

            alert("Contribution added successfully!");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Could not add the contribution."
            );
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [
                    summaryResponse,
                    transactionsResponse,
                    budgetsResponse,
                    goalsResponse,
                    cashFlowResponse,
                    wealthResponse,
                ] = await Promise.all([
                    api.get("/dashboard/monthly"),
                    api.get("/transactions"),
                    api.get("/budgets/summary"),
                    api.get("/goals"),
                    api.get("/dashboard/cash-flow"),
                    api.get("/wealth/summary"),
                ]);

                setLiveSummary(summaryResponse.data);
                setLiveTransactions(transactionsResponse.data);
                setLiveBudgets(budgetsResponse.data);
                setLiveGoals(goalsResponse.data);
                setMonthlyData(cashFlowResponse.data);
                setWealthSummary(wealthResponse.data);

            } catch (error) {
                console.error(
                    "Failed to load dashboard data:",
                    error
                );
            }
        };

        fetchDashboardData();
    }, []);

    const totalBalance = wealthSummary?.netWorth ?? 0;
    const monthlyIncome = Number(liveSummary?.income ?? 0);
    const monthlyExpenses = Number(liveSummary?.expenses ?? 0);

    const monthlySavings = Number(
        liveSummary?.savings ?? monthlyIncome - monthlyExpenses
    );

    const handleLogout = () => {
        logout();
        // navigate("/", { replace: true });
        window.location.replace("/");
    };

    const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">

            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white px-5 py-7 lg:flex">

                <div className="mb-10 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                        <Wallet size={22} />
                    </div>

                    <div>
                        <h1 className="text-lg font-bold tracking-tight">
                            WealthWise
                        </h1>

                        <p className="text-xs text-slate-500">
                            Your money, in balance
                        </p>
                    </div>
                </div>

                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Workspace
                </p>

                <nav className="space-y-2">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.label}
                            to={
                                item.label === "Dashboard"
                                    ? "/app"
                                    : `/app/${item.label.toLowerCase().replaceAll(" ", "-")}`
                            }
                            end={item.label === "Dashboard"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`
                            }
                        >
                            <item.icon size={19} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                        <Target size={19} />
                    </div>

                    <p className="font-semibold">
                        Small steps add up.
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-300">
                        Build better money habits, one day at a time.
                    </p>

                    <div className="mt-4 h-1.5 rounded-full bg-white/15">
                        <div className="h-1.5 w-2/3 rounded-full bg-emerald-400" />
                    </div>

                    <p className="mt-2 text-xs text-slate-300">
                        Your journey starts here
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64">

                {/* Header */}
                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur md:px-8">

                    <div>
                        <p className="text-sm text-slate-500">
                            {new Intl.DateTimeFormat("en-IN", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            }).format(new Date())}
                        </p>

                        <h2 className="mt-1 text-xl font-bold tracking-tight md:text-2xl">
                            Your financial overview
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            aria-label="Search"
                            className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 sm:block"
                        >
                            <Search size={19} />
                        </button>

                        <button
                            aria-label="Notifications"
                            className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"
                        >
                            <Bell size={19} />
                        </button>

                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-slate-800">
                                {user?.name || "User"}
                            </p>

                            <p className="text-xs text-slate-500">
                                {user?.email}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                            {userInitial}
                        </div>

                        <button
                            onClick={handleLogout}
                            aria-label="Logout"
                            title="Logout"
                            className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut size={19} />
                        </button>

                    </div>
                </header>

                {/* Application Pages */}
                <Routes>

                    <Route
                        index
                        element={
                            <Dashboard
                                totalBalance={totalBalance}
                                monthlyIncome={monthlyIncome}
                                monthlyExpenses={monthlyExpenses}
                                monthlySavings={monthlySavings}
                                liveBudgets={liveBudgets.map((budget) => ({
                                    name:
                                        typeof budget.category === "string"
                                            ? budget.category
                                            : budget.category?.name ?? "Uncategorized",
                                    spent: Number(budget.spent),
                                    limit: Number(budget.budgetAmount),
                                    color: "bg-emerald-500",
                                }))}
                                liveTransactions={liveTransactions}
                                liveGoals={liveGoals}
                                onAddContribution={handleDashboardContribution}
                                monthlyData={monthlyData}
                                money={money}
                            />
                        }
                    />

                    <Route
                        path="transactions"
                        element={<Transactions />}
                    />

                    <Route
                        path="budgets"
                        element={<Budgets />}
                    />

                    <Route
                        path="savings-goals"
                        element={<SavingsGoals />}
                    />

                    <Route
                        path="habits"
                        element={<Habits />}
                    />

                    <Route
                        path="wealth"
                        element={<Wealth />}
                    />

                </Routes>
            </main>
        </div>
    );
}

// Application routing
function App() {
    return (
        <Routes>

            {/* Public Landing Page */}
            <Route
                path="/"
                element={<LandingPage />}
            />

            {/* Public Authentication Routes */}
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* Protected Application Routes */}
            <Route element={<ProtectedRoute />}>
                <Route
                    path="/app/*"
                    element={<DashboardLayout />}
                />
            </Route>

        </Routes>
    );
}

export default App;
