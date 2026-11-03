
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    ChartNoAxesCombined,
    Tags,
    MessageSquare,
    LogOut,
    ShieldCheck,
    Wallet,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const navigation = [
    {
        label: "Overview",
        path: "/admin",
        icon: LayoutDashboard,
        end: true,
    },
    {
        label: "User Management",
        path: "/admin/users",
        icon: Users,
    },
    {
        label: "Analytics & Reports",
        path: "/admin/analytics",
        icon: ChartNoAxesCombined,
    },
    {
        label: "Categories",
        path: "/admin/categories",
        icon: Tags,
    },
    {
        label: "Feedback",
        path: "/admin/feedback",
        icon: MessageSquare,
    },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        window.location.replace("/");
    };

    const userInitial =
        user?.name?.charAt(0)?.toUpperCase() || "A";

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
                            Administration
                        </p>
                    </div>
                </div>

                <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-3">
                    <ShieldCheck
                        size={19}
                        className="text-emerald-600"
                    />
                    <span className="text-sm font-semibold text-emerald-700">
                        Admin Workspace
                    </span>
                </div>

                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Management
                </p>

                <nav className="space-y-2">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            end={item.end}
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
                    <ShieldCheck
                        size={22}
                        className="mb-3 text-emerald-400"
                    />

                    <p className="font-semibold">
                        Manage WealthWise
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-300">
                        Monitor users, platform activity and financial wellness.
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64">

                {/* Header */}
                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur md:px-8">

                    <div>
                        <p className="text-sm text-slate-500">
                            WealthWise Administration
                        </p>

                        <h2 className="mt-1 text-xl font-bold tracking-tight md:text-2xl">
                            Admin Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">

                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-slate-800">
                                {user?.name || "Administrator"}
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

                {/* Admin Pages */}
                <div className="p-5 md:p-8">
                    <Outlet />
                </div>

            </main>
        </div>
    );
}
