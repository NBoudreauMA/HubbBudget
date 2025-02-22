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
                    duration: 1200,
                    easing: "easeOutQuart"
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
            "Revenue Overview", ["#2E7D32", "#A5D6A7", "#66BB6A"]
        );

        createChart(
            document.getElementById("revenuePieChart"), "pie",
            revenueData.map(row => row[0]), revenueData.map(row => parseFloat(row[1])),
            "Revenue Distribution", ["#1B5E20", "#4CAF50", "#C8E6C9"]
        );

        createChart(
            document.getElementById("expenditureChart"), "bar",
            expenditureData.map(row => row[0]), expenditureData.map(row => parseFloat(row[1])),
            "Expenditure Overview", ["#8E24AA", "#CE93D8", "#7B1FA2"]
        );
    };

    renderCharts();

    // Toggle functionality with smooth animation and proper open/close states
    document.querySelectorAll(".toggle-box").forEach(button => {
        button.addEventListener("click", function () {
            const content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.opacity = "0";
                setTimeout(() => { content.style.display = "none"; }, 300);
            } else {
                content.style.display = "block";
                setTimeout(() => { content.style.opacity = "1"; }, 10);
            }
        });
    });

    document.querySelectorAll(".sub-toggle-box").forEach(button => {
        button.addEventListener("click", function () {
            const content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.opacity = "0";
                setTimeout(() => { content.style.display = "none"; }, 300);
            } else {
                content.style.display = "block";
                setTimeout(() => { content.style.opacity = "1"; }, 10);
            }
        });
    });
});
