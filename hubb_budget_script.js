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
                    duration: 1000,
                    easing: "easeOutCubic"
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
            "Revenue Overview", ["#4CAF50", "#81C784", "#388E3C"]
        );

        createChart(
            document.getElementById("revenuePieChart"), "pie",
            revenueData.map(row => row[0]), revenueData.map(row => parseFloat(row[1])),
            "Revenue Distribution", ["#2E7D32", "#66BB6A", "#A5D6A7"]
        );

        createChart(
            document.getElementById("expenditureChart"), "bar",
            expenditureData.map(row => row[0]), expenditureData.map(row => parseFloat(row[1])),
            "Expenditure Overview", ["#D32F2F", "#E57373", "#B71C1C"]
        );
    };

    renderCharts();

    // Toggle functionality for opening and closing individual sections
    document.querySelectorAll(".toggle-box").forEach(button => {
        button.addEventListener("click", function () {
            document.querySelectorAll(".toggle-content").forEach(content => {
                if (content !== this.nextElementSibling) {
                    content.style.maxHeight = null;
                    content.style.padding = "0";
                }
            });
            
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.style.padding = "0";
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.padding = "1rem";
            }
        });
    });
});
