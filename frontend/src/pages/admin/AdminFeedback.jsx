import { useEffect, useState } from "react";
import api from "../../api/api";

const statusStyles = {
    PENDING: "bg-amber-100 text-amber-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    RESOLVED: "bg-emerald-100 text-emerald-700",
};

export default function AdminFeedback() {
    const [feedback, setFeedback] = useState([]);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};
            if (statusFilter !== "ALL") {
                params.status = statusFilter;
            }

            const response = await api.get("/admin/feedback", { params });
            setFeedback(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load feedback. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, [statusFilter]);

    const updateStatus = async (id, status) => {
        try {
            setUpdatingId(id);

            await api.patch(`/admin/feedback/${id}/status`, { status });

            await fetchFeedback();
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to update feedback status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredFeedback = feedback.filter((item) =>
        typeFilter === "ALL" || item.type === typeFilter
    );

    const counts = {
        total: feedback.length,
        pending: feedback.filter((item) => item.status === "PENDING").length,
        inProgress: feedback.filter((item) => item.status === "IN_PROGRESS").length,
        resolved: feedback.filter((item) => item.status === "RESOLVED").length,
    };

    const formatDate = (date) =>
        date
            ? new Date(date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            : "—";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Feedback & Complaints
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Review and manage feedback submitted by users.
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    ["Total Feedback", counts.total],
                    ["Pending", counts.pending],
                    ["In Progress", counts.inProgress],
                    ["Resolved", counts.resolved],
                ].map(([label, value]) => (
                    <div
                        key={label}
                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                        <p className="text-sm text-gray-500">{label}</p>
                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                </select>

                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                >
                    <option value="ALL">All Types</option>
                    <option value="SUGGESTION">Suggestion</option>
                    <option value="BUG">Bug</option>
                    <option value="COMPLAINT">Complaint</option>
                    <option value="OTHER">Other</option>
                </select>
            </div>

            {/* Feedback list */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {loading ? (
                    <p className="p-8 text-center text-gray-500">
                        Loading feedback...
                    </p>
                ) : error ? (
                    <div className="p-8 text-center">
                        <p className="text-sm text-red-600">{error}</p>
                        <button
                            onClick={fetchFeedback}
                            className="mt-3 text-sm font-medium text-blue-600"
                        >
                            Try again
                        </button>
                    </div>
                ) : filteredFeedback.length === 0 ? (
                    <p className="p-8 text-center text-gray-500">
                        No feedback found.
                    </p>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredFeedback.map((item) => (
                            <div
                                key={item.id}
                                className="space-y-3 p-5"
                            >
                                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-gray-900">
                                                {item.subject}
                                            </h3>
                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                                {item.type}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {item.userName} ({item.userEmail})
                                            {" · "}
                                            {formatDate(item.createdAt)}
                                        </p>
                                    </div>

                                    <select
                                        value={item.status}
                                        disabled={updatingId === item.id}
                                        onChange={(e) =>
                                            updateStatus(item.id, e.target.value)
                                        }
                                        className={`h-fit rounded-full border-0 px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                                            statusStyles[item.status] ||
                                            "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="RESOLVED">Resolved</option>
                                    </select>
                                </div>

                                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                                    {item.description}
                                </p>

                                {item.updatedAt && (
                                    <p className="text-xs text-gray-400">
                                        Last updated: {formatDate(item.updatedAt)}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}