export default function BudgetOverview({budgets, money}) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/70 md:p-6">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h3 className="font-bold">Budget overview</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Monthly spending limits
                    </p>
                </div>

                <button className="text-sm font-semibold text-emerald-700">
                    View all
                </button>
            </div>


            <div className="space-y-7">
                {budgets.length > 0 ? (
                    budgets.map((budget) => {
                        const percent =
                            budget.limit > 0
                                ? Math.round((budget.spent / budget.limit) * 100)
                                : 0;

                        return (
                            <div key={budget.name}>
                                <div className="mb-2 flex justify-between gap-3 text-sm">
                                    <span className="font-medium">{budget.name}</span>
                                    <span className="text-slate-500">{percent}%</span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full ${budget.color}`}
                                        style={{width: `${Math.min(percent, 100)}%`}}
                                    />
                                </div>

                                <p className="mt-2 text-xs text-slate-500">
                                    {money(budget.spent)} spent of {money(budget.limit)}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <p className="py-6 text-center text-sm text-slate-500">
                        No budgets yet. Create a monthly budget to track your spending.
                    </p>
                )}
            </div>

        </article>
    );
}
