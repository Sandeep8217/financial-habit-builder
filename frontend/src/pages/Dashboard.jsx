
import SummaryCards from "../components/dashboard/SummaryCards";
import CashFlowChart from "../components/dashboard/CashFlowChart";
import BudgetOverview from "../components/dashboard/BudgetOverview";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import SavingsGoalCard from "../components/dashboard/SavingsGoalCard";

export default function Dashboard({
                                      totalBalance,
                                      monthlyIncome,
                                      monthlyExpenses,
                                      monthlySavings,
                                      liveBudgets,
                                      liveTransactions,
                                      liveGoals,
                                      money,
                                      monthlyData,
                                      onAddContribution,
                                  }) {
    return (
        <div className="space-y-7 p-5 md:p-8">
            <SummaryCards
                totalBalance={totalBalance}
                monthlyIncome={monthlyIncome}
                monthlyExpenses={monthlyExpenses}
                monthlySavings={monthlySavings}
                money={money}
            />

            <section className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
                <CashFlowChart
                    money={money}
                    monthlyData={monthlyData}
                />
                <BudgetOverview budgets={liveBudgets} money={money} />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <RecentTransactions
                    transactions={liveTransactions}
                    money={money}
                />
                <SavingsGoalCard
                    goal={liveGoals[0]}
                    money={money}
                    onAddContribution={onAddContribution}
                />
            </section>
        </div>
    );
}
