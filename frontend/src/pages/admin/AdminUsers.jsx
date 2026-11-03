
import { useEffect, useState } from "react";
import api from "../../api/api";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Users,
    RefreshCw,
    ShieldCheck,
    Shield,
    UserCheck,
    UserX,
} from "lucide-react";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/users", {
                params: {
                    search: search.trim() || undefined,
                    role: role || undefined,
                    page,
                    size: 10,
                    sort: "createdAt,desc",
                },
            });

            setUsers(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Unable to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, role, page]);

    const handleRoleChange = async (user) => {
        const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

        if (!window.confirm(
            `Are you sure you want to change ${user.name}'s role to ${newRole}?`
        )) return;

        try {
            setActionLoading(user.id);

            await api.patch(
                `/admin/users/${user.id}/role`,
                null,
                { params: { role: newRole } }
            );

            await fetchUsers();
            alert(`User role updated to ${newRole}.`);
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to update user role."
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleStatusChange = async (user) => {
        const newStatus = !user.enabled;

        if (!window.confirm(
            `Are you sure you want to ${newStatus ? "enable" : "disable"} ${user.name}'s account?`
        )) return;

        try {
            setActionLoading(user.id);

            await api.patch(
                `/admin/users/${user.id}/status`,
                null,
                { params: { enabled: newStatus } }
            );

            await fetchUsers();
            alert(`User account ${newStatus ? "enabled" : "disabled"}.`);
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to update account status."
            );
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        User Management
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        View and manage registered WealthWise users.
                    </p>
                </div>

                <button
                    onClick={fetchUsers}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                        placeholder="Search by name or email..."
                        className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
                    />
                </div>

                <select
                    value={role}
                    onChange={(e) => {
                        setRole(e.target.value);
                        setPage(0);
                    }}
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
                >
                    <option value="">All Roles</option>
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                </select>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center gap-2">
                        <Users size={18} className="text-slate-500" />
                        <h2 className="font-semibold text-slate-800">
                            Registered Users
                        </h2>
                    </div>

                    <span className="text-sm text-slate-500">
                        {totalElements} users
                    </span>
                </div>

                {error && (
                    <div className="p-6 text-center text-sm text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="p-10 text-center text-slate-500">
                        Loading users...
                    </div>
                ) : !error && users.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                        No users found.
                    </div>
                ) : !error ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">User</th>
                                    <th className="px-5 py-4">Role</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Joined</th>
                                    <th className="px-5 py-4">Actions</th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50">
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-slate-800">
                                                {user.name}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {user.email}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    user.role === "ADMIN"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}>
                                                    {user.role}
                                                </span>
                                        </td>

                                        <td className="px-5 py-4">
                                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    user.enabled
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}>
                                                    {user.enabled ? "Active" : "Disabled"}
                                                </span>
                                        </td>

                                        <td className="px-5 py-4 text-slate-500">
                                            {formatDate(user.createdAt)}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => handleRoleChange(user)}
                                                    disabled={actionLoading === user.id}
                                                    title="Change role"
                                                    className="flex items-center gap-1 rounded-lg border border-purple-200 px-3 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50"
                                                >
                                                    {user.role === "ADMIN" ? (
                                                        <Shield size={15} />
                                                    ) : (
                                                        <ShieldCheck size={15} />
                                                    )}
                                                    {user.role === "ADMIN" ? "Make User" : "Make Admin"}
                                                </button>

                                                <button
                                                    onClick={() => handleStatusChange(user)}
                                                    disabled={actionLoading === user.id}
                                                    title={user.enabled ? "Disable account" : "Enable account"}
                                                    className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium disabled:opacity-50 ${
                                                        user.enabled
                                                            ? "border-red-200 text-red-600 hover:bg-red-50"
                                                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                                    }`}
                                                >
                                                    {user.enabled ? (
                                                        <UserX size={15} />
                                                    ) : (
                                                        <UserCheck size={15} />
                                                    )}
                                                    {user.enabled ? "Disable" : "Enable"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
                            <p className="text-sm text-slate-500">
                                Page {page + 1} of {Math.max(totalPages, 1)}
                            </p>

                            <div className="flex gap-2">
                                <button
                                    disabled={page === 0 || loading}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <button
                                    disabled={page + 1 >= totalPages || loading}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}
