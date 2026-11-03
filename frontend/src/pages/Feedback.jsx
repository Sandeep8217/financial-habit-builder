
import { useEffect, useState } from "react";
import api from "../api/api";

const statusStyles = {
    PENDING: "bg-amber-100 text-amber-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    RESOLVED: "bg-emerald-100 text-emerald-700",
};

export default function Feedback() {
    const [form, setForm] = useState({
        subject: "",
        description: "",
        type: "SUGGESTION",
    });

    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchFeedback = async () => {
        try {
            const response = await api.get("/feedback/my");
            setFeedback(response.data);
        } catch (err) {
            setError("Unable to load your feedback history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            await api.post("/feedback", form);

            setForm({
                subject: "",
                description: "",
                type: "SUGGESTION",
            });

            setSuccess("Your feedback has been submitted successfully.");
            await fetchFeedback();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to submit feedback. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
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
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Feedback & Support
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Share suggestions, report bugs, or raise a complaint.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <h2 className="text-lg font-semibold text-gray-900">
                    Submit Feedback
                </h2>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Subject
                    </label>
                    <input
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        maxLength={150}
                        required
                        placeholder="Enter a short subject"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Feedback Type
                    </label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm"
                    >
                        <option value="SUGGESTION">Suggestion</option>
                        <option value="BUG">Bug Report</option>
                        <option value="COMPLAINT">Complaint</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        maxLength={2000}
                        required
                        rows={5}
                        placeholder="Describe your feedback in detail..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                    <p className="mt-1 text-right text-xs text-gray-400">
                        {form.description.length}/2000
                    </p>
                </div>

                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}

                {success && (
                    <p className="text-sm text-emerald-600">{success}</p>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {submitting ? "Submitting..." : "Submit Feedback"}
                </button>
            </form>

            <section className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        My Submissions
                    </h2>
                    <p className="text-sm text-gray-500">
                        Track the status of your feedback.
                    </p>
                </div>

                {loading ? (
                    <p className="text-sm text-gray-500">Loading history...</p>
                ) : feedback.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                        You haven't submitted any feedback yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {feedback.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-xl border border-gray-200 bg-white p-5"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h3 className="font-semibold text-gray-900">
                                        {item.subject}
                                    </h3>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            statusStyles[item.status] ||
                                            "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {item.status.replace("_", " ")}
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-gray-600">
                                    {item.description}
                                </p>

                                <p className="mt-3 text-xs text-gray-400">
                                    {item.type} · Submitted {formatDate(item.createdAt)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
