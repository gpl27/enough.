/*!
 * charter.js
 * Contains the chart declarations
 * and functions to create the Usage
 * Report chart using chart.js
 */

const chartConfig = {
    type: 'line',
    data: {
        datasets: [{
            label: "YT Usage",
            borderColor: '#ff0000',
            backgroundColor: '#ff0000',
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 15
        }]
    },
    options: {
        scales: {
            y: {
                ticks: {
                    callback: function(value, index, ticks) {
                        return value + ' mins';
                    }
                },
                beginAtZero: true,
                suggestedMax: 20
            }
        }
    }
};

async function chartUsage() {
    const usageData = await getUsageData();
    const formattedData = parseUsageData(usageData, 7);
    const canvasNode = document.getElementById("reportUsage");
    const usageChart = new Chart(canvasNode, chartConfig);
    usageChart.data.datasets[0].data = formattedData;
    usageChart.update();

    document.querySelectorAll('.radio-btn').forEach(radio => {
        radio.addEventListener('change', handleChange);
    })
}

async function handleChange(e) {
    let timeSpan = e.target.value;
    const usageChart = Chart.getChart('reportUsage');
    usageData = await getUsageData();
    usageChart.data.datasets[0].data = parseUsageData(usageData, timeSpan);
    usageChart.update();
}

function parseUsageData(usageData, span) {
    if (span > usageData.length) {
        let startDate = (usageData[0]) ? new Date(Object.keys(usageData[0])[0]) : new Date();
        startDate.setDate(startDate.getDate() - 1);
        return genDates(span - usageData.length, null, startDate).concat(usageData).map(format);
    } else if (span < usageData.length) {
        return usageData.slice(-span)
                        .map(format);
    } else {
        return usageData.map(format);
    }
}
function format(entry) {
    let arr = Object.entries(entry)[0];
    let obj = {};
    obj.x = arr[0];
    obj.y = (arr[1] === null) ? null : Math.round(arr[1] / 60);
    return obj;
}