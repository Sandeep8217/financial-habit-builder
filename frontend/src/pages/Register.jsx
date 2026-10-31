
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Wallet, Eye, EyeOff } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();
    const { register, loading } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await register(formData);
            navigate("/app", { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create your account. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10">
            <div className="w-full max-w-md">

                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="bg-emerald-500 p-2.5 rounded-xl">
                        <Wallet className="text-white" size={25} />
                    </div>

                    <h1 className="text-2xl font-bold text-white">
                        WealthWise
                    </h1>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

                    <h2 className="text-2xl font-bold text-white">
                        Create your account
                    </h2>

                    <p className="text-slate-400 mt-2 mb-7">
                        Start building better financial habits today.
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Full name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                                maxLength={100}
                                autoComplete="name"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Email address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                maxLength={254}
                                autoComplete="email"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 8 characters"
                                    required
                                    minLength={8}
                                    maxLength={72}
                                    autoComplete="new-password"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>

                            <p className="text-xs text-slate-500 mt-2">
                                Password must contain 8 to 72 characters.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-lg py-3 transition-colors"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>

                    </form>

                    <p className="text-center text-slate-400 text-sm mt-7">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-emerald-400 hover:text-emerald-300 font-semibold"
                        >
                            Sign in
                        </Link>
                    </p>

                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    Financial Habit Builder & Wealth Growth Tracker
                </p>

            </div>
        </div>
    );
}
