document.addEventListener("DOMContentLoaded", () => {
    const loadCSV = async (filePath) => {
        const response = await fetch(filePath);
        const text = await response.text();
        return text.split("\n").slice(1).map(row => row.split(","));
    };

    const createChart = (ctx, type, labels, datasets, title) => {
        return new Chart(ctx, {
            type,
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: true, text: title, font: { size: 16 } },
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: context => `$${context.raw.toLocaleString()}`
                        }
                    }
                },
                scales: type === 'bar' ? {
                    y: { beginAtZero: true, ticks: { callback: value => `$${value.toLocaleString()}` } }
                } : {}
            }
        });
    };

    const renderCharts = async () => {
        const revenueData = await loadCSV("revenue_data.csv");
        const expenditureData = await loadCSV("expenditures_cleaned.csv");

        const revenueLabels = revenueData.map(row => row[0]);
        const revenueValues = revenueData.map(row => parseFloat(row[1]));
        const expenditureLabels = expenditureData.map(row => row[0]);
        const expenditureValues = expenditureData.map(row => parseFloat(row[1]));

        createChart(document.getElementById("revenueBarChart"), "bar", revenueLabels, [{ label: "Revenue", data: revenueValues, backgroundColor: "#34d399" }], "Revenue Overview");
        createChart(document.getElementById("revenuePieChart"), "pie", revenueLabels, [{ label: "Revenue", data: revenueValues, backgroundColor: ["#2a7d2e", "#1e5b24", "#ffd700"] }], "Revenue Distribution");
        createChart(document.getElementById("expenditureChart"), "bar", expenditureLabels, [{ label: "Expenditures", data: expenditureValues, backgroundColor: "#ef4444" }], "Expenditure Overview");
    };

    renderCharts();
});
