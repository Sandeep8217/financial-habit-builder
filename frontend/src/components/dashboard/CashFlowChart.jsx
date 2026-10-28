
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

export default function CashFlowChart({ money , monthlyData }) {

    const chartData = {
        labels: monthlyData.map((item) => item.month),
        datasets: [
            {
                label: "Income",
                data: monthlyData.map((item) => Number(item.income)),
                backgroundColor: "#10b981",
                borderRadius: 5,
                barThickness: 14,
            },
            {
                label: "Expenses",
                data: monthlyData.map((item) => Number(item.expenses)),
                backgroundColor: "#cbd5e1",
                borderRadius: 5,
                barThickness: 14,
            },
        ],
    };


    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 20,
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) =>
                        `${context.dataset.label}: ${money(context.raw)}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: "#f1f5f9" },
                ticks: {
                    callback: (value) => `₹${value / 1000}k`,
                },
                border: { display: false },
            },
            x: {
                grid: { display: false },
                border: { display: false },
            },
        },
    };

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/70 md:p-6">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h3 className="font-bold">Income vs expenses</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Your monthly cash flow
                    </p>
                </div>

                <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
          Last 6 months
        </span>
            </div>

            <div className="h-72">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </article>
    );
}
