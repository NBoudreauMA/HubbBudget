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
                animation: {
                    duration: 1500,
                    easing: "easeOutBounce"
                },
                plugins: {
                    title: { display: true, text: title, font: { size: 18, weight: "bold" } },
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
            "Revenue Overview", ["#1E88E5", "#FFC107", "#43A047"]
        );

        createChart(
            document.getElementById("revenuePieChart"), "pie",
            revenueData.map(row => row[0]), revenueData.map(row => parseFloat(row[1])),
            "Revenue Distribution", ["#673AB7", "#FF5722", "#009688"]
        );

        createChart(
            document.getElementById("expenditureChart"), "bar",
            expenditureData.map(row => row[0]), expenditureData.map(row => parseFloat(row[1])),
            "Expenditure Overview", ["#D32F2F", "#1976D2", "#388E3C"]
        );
    };

    renderCharts();

    // Toggle functionality with smooth animation
    document.querySelectorAll(".toggle-box").forEach(button => {
        button.addEventListener("click", function () {
            const content = this.nextElementSibling;
            content.style.display = content.style.display === "block" ? "none" : "block";
            content.style.transition = "all 0.5s ease-in-out";
        });
    });

    document.querySelectorAll(".sub-toggle-box").forEach(button => {
        button.addEventListener("click", function () {
            const content = this.nextElementSibling;
            content.style.display = content.style.display === "block" ? "none" : "block";
            content.style.transition = "all 0.5s ease-in-out";
        });
    });
});
