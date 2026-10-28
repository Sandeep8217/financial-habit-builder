
import {
    Wallet,
    ArrowDownRight,
    ArrowUpRight,
    TrendingUp,
} from "lucide-react";

export default function SummaryCards({
                                         totalBalance,
                                         monthlyIncome,
                                         monthlyExpenses,
                                         monthlySavings,
                                         money,
                                     }) {
    const cards = [
        {
            label: "Total balance",
            value: money(totalBalance),
            change: "Across your accounts",
            icon: Wallet,
            iconStyle: "bg-blue-50 text-blue-600",
        },
        {
            label: "Monthly income",
            value: money(monthlyIncome),
            change: "Income this month",
            icon: ArrowDownRight,
            iconStyle: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Monthly expenses",
            value: money(monthlyExpenses),
            change: "Spending this month",
            icon: ArrowUpRight,
            iconStyle: "bg-rose-50 text-rose-600",
        },
        {
            label: "Monthly savings",
            value: money(monthlySavings),
            change: "Income minus expenses",
            icon: TrendingUp,
            iconStyle: "bg-violet-50 text-violet-600",
        },
    ];

    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(({ label, value, change, icon: Icon, iconStyle }) => (
                <article
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/70"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">{label}</p>

                        <div className={`rounded-xl p-2.5 ${iconStyle}`}>
                            <Icon size={19} />
                        </div>
                    </div>

                    <p className="mt-4 text-2xl font-bold tracking-tight">
                        {value}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">{change}</p>
                </article>
            ))}
        </section>
    );
}
