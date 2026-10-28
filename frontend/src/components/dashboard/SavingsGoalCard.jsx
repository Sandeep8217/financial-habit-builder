
import { Target, Plus } from "lucide-react";

export default function SavingsGoalCard({ goal, money }) {
    if (!goal) {
        return (
            <article className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-6 text-white shadow-sm">
                <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
            Savings goal
          </span>
                    <Target size={22} />
                </div>

                <h3 className="mt-6 text-xl font-bold">No savings goals yet</h3>
                <p className="mt-2 text-sm text-emerald-50">
                    Create a goal to start tracking your savings progress.
                </p>
            </article>
        );
    }

    const currentAmount = Number(goal.currentAmount ?? 0);
    const targetAmount = Number(goal.targetAmount ?? 0);

    const percentage =
        targetAmount > 0
            ? Math.min(Math.round((currentAmount / targetAmount) * 100), 100)
            : 0;

    return (
        <article className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-6 text-white shadow-sm">
            <div className="flex items-center justify-between">
        <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
          Savings goal
        </span>
                <Target size={22} />
            </div>

            <h3 className="mt-6 text-xl font-bold">{goal.name}</h3>
            <p className="mt-1 text-sm text-emerald-50">
                Build towards your financial future.
            </p>

            <div className="mt-7 flex items-end justify-between">
                <div>
                    <p className="text-3xl font-bold">{money(currentAmount)}</p>
                    <p className="mt-1 text-sm text-emerald-50">
                        of {money(targetAmount)} saved
                    </p>
                </div>
                <p className="text-lg font-bold">{percentage}%</p>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
                <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <button
                type="button"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
            >
                <Plus size={17} />
                Add contribution
            </button>
        </article>
    );
}
