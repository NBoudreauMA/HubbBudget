document.addEventListener("DOMContentLoaded", () => {
    const loadCSV = async (filePath) => {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Failed to load ${filePath}`);
            return (await response.text()).split("\n").slice(1).map(row => row.split(","));
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const createChart = (ctx, type, labels, data, title, colors) => {
        return new Chart(ctx, {
            type,
            data: { labels, datasets: [{ label: title, data, backgroundColor: colors }] },
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
        const [revenueData, expenditureData] = await Promise.all([
            loadCSV("revenue_data.csv"),
            loadCSV("expenditures_cleaned.csv")
        ]);

        if (!revenueData.length || !expenditureData.length) return;

        createChart(
            document.getElementById("revenueBarChart"), "bar",
            revenueData.map(row => row[0]), revenueData.map(row => parseFloat(row[1])),
            "Revenue Overview", "#34d399"
        );

        createChart(
            document.getElementById("revenuePieChart"), "pie",
            revenueData.map(row => row[0]), revenueData.map(row => parseFloat(row[1])),
            "Revenue Distribution", ["#2a7d2e", "#1e5b24", "#ffd700"]
        );

        createChart(
            document.getElementById("expenditureChart"), "bar",
            expenditureData.map(row => row[0]), expenditureData.map(row => parseFloat(row[1])),
            "Expenditure Overview", "#ef4444"
        );
    };

    renderCharts();

    // Toggle functionality
    document.querySelectorAll(".toggle-box").forEach(button => {
        button.addEventListener("click", function () {
            const content = this.nextElementSibling;
            content.style.display = content.style.display === "block" ? "none" : "block";
        });
    });

    document.querySelectorAll(".sub-toggle-box").forEach(button => {
        button.addEventListener("click", function () {
            const content = this.nextElementSibling;
            content.style.display = content.style.display === "block" ? "none" : "block";
        });
    });
});

