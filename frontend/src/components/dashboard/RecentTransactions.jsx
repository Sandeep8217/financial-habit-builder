
export default function RecentTransactions({ transactions, money }) {
    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100/70">
            <div className="flex items-center justify-between border-b border-slate-100 p-5 md:px-6">
                <div>
                    <h3 className="font-bold">Recent transactions</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Your latest money activity
                    </p>
                </div>

                <button className="text-sm font-semibold text-emerald-700">
                    View all
                </button>
            </div>

            <div className="divide-y divide-slate-100">
                {transactions.length > 0 ? (
                    transactions.slice(0, 5).map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between gap-4 px-5 py-4 md:px-6"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-800">
                                    {transaction.description}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {transaction.category?.name ?? transaction.type}
                                    {" · "}
                                    {transaction.transactionDate}
                                </p>
                            </div>

                            <p
                                className={`shrink-0 text-sm font-semibold ${
                                    transaction.type === "INCOME"
                                        ? "text-emerald-600"
                                        : "text-slate-800"
                                }`}
                            >
                                {transaction.type === "INCOME" ? "+" : "-"}
                                {money(Number(transaction.amount))}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="px-6 py-8 text-center text-sm text-slate-500">
                        No transactions yet. Add your first transaction to get started.
                    </p>
                )}
            </div>
        </article>
    );
}
