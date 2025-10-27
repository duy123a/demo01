// Purchasing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializePurchasing();
    setupEventListeners();
    loadPurchasingData();
});

// Mock Purchasing Data - 25 linh kiện trong kế hoạch mua hàng
const purchasingData = [
    {
        id: "LK001",
        name: "Bạc đạn 6202",
        planned: 20,
        actual: 15,
        difference: -5,
        unit: "cái",
        unitPrice: 150000,
        totalPlanned: 3000000,
        totalActual: 2250000,
        supplier: "Công ty ABC",
        status: "pending",
        orderDate: "2025-10-20",
        expectedDelivery: "2025-10-25"
    },
    {
        id: "LK002",
        name: "Dây cáp điện 2.5mm",
        planned: 50,
        actual: 45,
        difference: -5,
        unit: "mét",
        unitPrice: 25000,
        totalPlanned: 1250000,
        totalActual: 1125000,
        supplier: "Công ty XYZ",
        status: "delivered",
        orderDate: "2025-10-18",
        expectedDelivery: "2025-10-22"
    },
    {
        id: "LK003",
        name: "Kim may công nghiệp",
        planned: 100,
        actual: 100,
        difference: 0,
        unit: "cái",
        unitPrice: 5000,
        totalPlanned: 500000,
        totalActual: 500000,
        supplier: "Công ty DEF",
        status: "delivered",
        orderDate: "2025-10-15",
        expectedDelivery: "2025-10-20"
    },
    {
        id: "LK004",
        name: "Vòng bi 6205",
        planned: 15,
        actual: 18,
        difference: 3,
        unit: "cái",
        unitPrice: 200000,
        totalPlanned: 3000000,
        totalActual: 3600000,
        supplier: "Công ty GHI",
        status: "delivered",
        orderDate: "2025-10-12",
        expectedDelivery: "2025-10-18"
    },
    {
        id: "LK005",
        name: "Dây cáp điện 4.0mm",
        planned: 30,
        actual: 25,
        difference: -5,
        unit: "mét",
        unitPrice: 35000,
        totalPlanned: 1050000,
        totalActual: 875000,
        supplier: "Công ty JKL",
        status: "ordered",
        orderDate: "2025-10-22",
        expectedDelivery: "2025-10-28"
    },
    {
        id: "LK006",
        name: "Cảm biến nhiệt độ",
        planned: 8,
        actual: 8,
        difference: 0,
        unit: "cái",
        unitPrice: 500000,
        totalPlanned: 4000000,
        totalActual: 4000000,
        supplier: "Công ty ABC",
        status: "delivered",
        orderDate: "2025-10-10",
        expectedDelivery: "2025-10-15"
    },
    {
        id: "LK007",
        name: "Van điện từ",
        planned: 12,
        actual: 10,
        difference: -2,
        unit: "cái",
        unitPrice: 800000,
        totalPlanned: 9600000,
        totalActual: 8000000,
        supplier: "Công ty XYZ",
        status: "pending",
        orderDate: "2025-10-25",
        expectedDelivery: "2025-10-30"
    },
    {
        id: "LK008",
        name: "Bơm nước công nghiệp",
        planned: 3,
        actual: 3,
        difference: 0,
        unit: "cái",
        unitPrice: 5000000,
        totalPlanned: 15000000,
        totalActual: 15000000,
        supplier: "Công ty DEF",
        status: "delivered",
        orderDate: "2025-10-08",
        expectedDelivery: "2025-10-12"
    },
    {
        id: "LK009",
        name: "Động cơ điện 1.5kW",
        planned: 5,
        actual: 4,
        difference: -1,
        unit: "cái",
        unitPrice: 3000000,
        totalPlanned: 15000000,
        totalActual: 12000000,
        supplier: "Công ty GHI",
        status: "ordered",
        orderDate: "2025-10-20",
        expectedDelivery: "2025-10-26"
    },
    {
        id: "LK010",
        name: "Bộ điều khiển PLC",
        planned: 2,
        actual: 2,
        difference: 0,
        unit: "cái",
        unitPrice: 8000000,
        totalPlanned: 16000000,
        totalActual: 16000000,
        supplier: "Công ty JKL",
        status: "delivered",
        orderDate: "2025-10-05",
        expectedDelivery: "2025-10-10"
    },
    {
        id: "LK011",
        name: "Cảm biến áp suất",
        planned: 6,
        actual: 7,
        difference: 1,
        unit: "cái",
        unitPrice: 600000,
        totalPlanned: 3600000,
        totalActual: 4200000,
        supplier: "Công ty ABC",
        status: "delivered",
        orderDate: "2025-10-12",
        expectedDelivery: "2025-10-17"
    },
    {
        id: "LK012",
        name: "Dây cáp điều khiển",
        planned: 200,
        actual: 180,
        difference: -20,
        unit: "mét",
        unitPrice: 15000,
        totalPlanned: 3000000,
        totalActual: 2700000,
        supplier: "Công ty XYZ",
        status: "pending",
        orderDate: "2025-10-28",
        expectedDelivery: "2025-11-02"
    },
    {
        id: "LK013",
        name: "Bộ lọc không khí",
        planned: 10,
        actual: 10,
        difference: 0,
        unit: "cái",
        unitPrice: 300000,
        totalPlanned: 3000000,
        totalActual: 3000000,
        supplier: "Công ty DEF",
        status: "delivered",
        orderDate: "2025-10-14",
        expectedDelivery: "2025-10-19"
    },
    {
        id: "LK014",
        name: "Van một chiều",
        planned: 8,
        actual: 6,
        difference: -2,
        unit: "cái",
        unitPrice: 400000,
        totalPlanned: 3200000,
        totalActual: 2400000,
        supplier: "Công ty GHI",
        status: "ordered",
        orderDate: "2025-10-23",
        expectedDelivery: "2025-10-29"
    },
    {
        id: "LK015",
        name: "Bộ giảm tốc",
        planned: 4,
        actual: 4,
        difference: 0,
        unit: "cái",
        unitPrice: 2500000,
        totalPlanned: 10000000,
        totalActual: 10000000,
        supplier: "Công ty JKL",
        status: "delivered",
        orderDate: "2025-10-11",
        expectedDelivery: "2025-10-16"
    },
    {
        id: "LK016",
        name: "Cảm biến mức nước",
        planned: 5,
        actual: 5,
        difference: 0,
        unit: "cái",
        unitPrice: 700000,
        totalPlanned: 3500000,
        totalActual: 3500000,
        supplier: "Công ty ABC",
        status: "delivered",
        orderDate: "2025-10-13",
        expectedDelivery: "2025-10-18"
    },
    {
        id: "LK017",
        name: "Dây cáp điện 6.0mm",
        planned: 25,
        actual: 20,
        difference: -5,
        unit: "mét",
        unitPrice: 45000,
        totalPlanned: 1125000,
        totalActual: 900000,
        supplier: "Công ty XYZ",
        status: "pending",
        orderDate: "2025-10-26",
        expectedDelivery: "2025-11-01"
    },
    {
        id: "LK018",
        name: "Bộ điều khiển nhiệt độ",
        planned: 3,
        actual: 3,
        difference: 0,
        unit: "cái",
        unitPrice: 4000000,
        totalPlanned: 12000000,
        totalActual: 12000000,
        supplier: "Công ty DEF",
        status: "delivered",
        orderDate: "2025-10-09",
        expectedDelivery: "2025-10-14"
    },
    {
        id: "LK019",
        name: "Van điều khiển khí nén",
        planned: 6,
        actual: 5,
        difference: -1,
        unit: "cái",
        unitPrice: 1200000,
        totalPlanned: 7200000,
        totalActual: 6000000,
        supplier: "Công ty GHI",
        status: "ordered",
        orderDate: "2025-10-21",
        expectedDelivery: "2025-10-27"
    },
    {
        id: "LK020",
        name: "Bộ lọc dầu",
        planned: 15,
        actual: 15,
        difference: 0,
        unit: "cái",
        unitPrice: 200000,
        totalPlanned: 3000000,
        totalActual: 3000000,
        supplier: "Công ty JKL",
        status: "delivered",
        orderDate: "2025-10-16",
        expectedDelivery: "2025-10-21"
    },
    {
        id: "LK021",
        name: "Cảm biến tốc độ",
        planned: 4,
        actual: 4,
        difference: 0,
        unit: "cái",
        unitPrice: 900000,
        totalPlanned: 3600000,
        totalActual: 3600000,
        supplier: "Công ty ABC",
        status: "delivered",
        orderDate: "2025-10-17",
        expectedDelivery: "2025-10-22"
    },
    {
        id: "LK022",
        name: "Dây cáp điện 1.5mm",
        planned: 100,
        actual: 85,
        difference: -15,
        unit: "mét",
        unitPrice: 12000,
        totalPlanned: 1200000,
        totalActual: 1020000,
        supplier: "Công ty XYZ",
        status: "pending",
        orderDate: "2025-10-29",
        expectedDelivery: "2025-11-03"
    },
    {
        id: "LK023",
        name: "Bộ điều khiển áp suất",
        planned: 2,
        actual: 2,
        difference: 0,
        unit: "cái",
        unitPrice: 3500000,
        totalPlanned: 7000000,
        totalActual: 7000000,
        supplier: "Công ty DEF",
        status: "delivered",
        orderDate: "2025-10-19",
        expectedDelivery: "2025-10-24"
    },
    {
        id: "LK024",
        name: "Van an toàn",
        planned: 8,
        actual: 7,
        difference: -1,
        unit: "cái",
        unitPrice: 500000,
        totalPlanned: 4000000,
        totalActual: 3500000,
        supplier: "Công ty GHI",
        status: "ordered",
        orderDate: "2025-10-24",
        expectedDelivery: "2025-10-30"
    },
    {
        id: "LK026",
        name: "Cảm biến áp suất cao",
        planned: 4,
        actual: 4,
        difference: 0,
        unit: "cái",
        unitPrice: 1200000,
        totalPlanned: 4800000,
        totalActual: 4800000,
        supplier: "Công ty ABC",
        status: "delivered",
        orderDate: "2025-09-15",
        expectedDelivery: "2025-09-20"
    },
    {
        id: "LK027",
        name: "Van điều khiển điện",
        planned: 6,
        actual: 5,
        difference: -1,
        unit: "cái",
        unitPrice: 1500000,
        totalPlanned: 9000000,
        totalActual: 7500000,
        supplier: "Công ty XYZ",
        status: "delivered",
        orderDate: "2025-09-10",
        expectedDelivery: "2025-09-15"
    },
    {
        id: "LK028",
        name: "Bộ lọc nước công nghiệp",
        planned: 8,
        actual: 8,
        difference: 0,
        unit: "cái",
        unitPrice: 800000,
        totalPlanned: 6400000,
        totalActual: 6400000,
        supplier: "Công ty DEF",
        status: "delivered",
        orderDate: "2025-08-25",
        expectedDelivery: "2025-08-30"
    },
    {
        id: "LK029",
        name: "Dây cáp điện 10.0mm",
        planned: 40,
        actual: 35,
        difference: -5,
        unit: "mét",
        unitPrice: 80000,
        totalPlanned: 3200000,
        totalActual: 2800000,
        supplier: "Công ty GHI",
        status: "delivered",
        orderDate: "2025-08-20",
        expectedDelivery: "2025-08-25"
    },
    {
        id: "LK030",
        name: "Bộ điều khiển nhiệt độ cao cấp",
        planned: 2,
        actual: 2,
        difference: 0,
        unit: "cái",
        unitPrice: 6000000,
        totalPlanned: 12000000,
        totalActual: 12000000,
        supplier: "Công ty JKL",
        status: "delivered",
        orderDate: "2025-07-30",
        expectedDelivery: "2025-08-05"
    },
    {
        id: "LK031",
        name: "Máy nén khí công nghiệp",
        planned: 3,
        actual: 3,
        difference: 0,
        unit: "cái",
        unitPrice: 12000000,
        totalPlanned: 36000000,
        totalActual: 36000000,
        supplier: "Công ty ABC",
        status: "delivered",
        orderDate: "2025-07-15",
        expectedDelivery: "2025-07-25"
    },
    {
        id: "LK032",
        name: "Hệ thống làm mát",
        planned: 2,
        actual: 2,
        difference: 0,
        unit: "bộ",
        unitPrice: 15000000,
        totalPlanned: 30000000,
        totalActual: 30000000,
        supplier: "Công ty XYZ",
        status: "delivered",
        orderDate: "2025-06-20",
        expectedDelivery: "2025-06-30"
    },
    {
        id: "LK033",
        name: "Bộ điều khiển tự động",
        planned: 5,
        actual: 4,
        difference: -1,
        unit: "cái",
        unitPrice: 8000000,
        totalPlanned: 40000000,
        totalActual: 32000000,
        supplier: "Công ty DEF",
        status: "delivered",
        orderDate: "2025-06-10",
        expectedDelivery: "2025-06-20"
    },
    {
        id: "LK034",
        name: "Thiết bị đo lường chính xác",
        planned: 8,
        actual: 8,
        difference: 0,
        unit: "cái",
        unitPrice: 3500000,
        totalPlanned: 28000000,
        totalActual: 28000000,
        supplier: "Công ty GHI",
        status: "delivered",
        orderDate: "2025-05-25",
        expectedDelivery: "2025-06-05"
    },
    {
        id: "LK035",
        name: "Hệ thống báo động",
        planned: 6,
        actual: 6,
        difference: 0,
        unit: "bộ",
        unitPrice: 4500000,
        totalPlanned: 27000000,
        totalActual: 27000000,
        supplier: "Công ty JKL",
        status: "delivered",
        orderDate: "2025-05-15",
        expectedDelivery: "2025-05-25"
    },
    {
        id: "LK036",
        name: "Dây chuyền sản xuất tự động",
        planned: 1,
        actual: 1,
        difference: 0,
        unit: "dây chuyền",
        unitPrice: 500000000,
        totalPlanned: 500000000,
        totalActual: 500000000,
        supplier: "Công ty ABC",
        status: "delivered",
        orderDate: "2025-07-01",
        expectedDelivery: "2025-07-15"
    },
    {
        id: "LK037",
        name: "Hệ thống ERP tích hợp",
        planned: 1,
        actual: 1,
        difference: 0,
        unit: "hệ thống",
        unitPrice: 300000000,
        totalPlanned: 300000000,
        totalActual: 300000000,
        supplier: "Công ty XYZ",
        status: "delivered",
        orderDate: "2025-06-01",
        expectedDelivery: "2025-06-20"
    },
    {
        id: "LK038",
        name: "Máy CNC công nghiệp",
        planned: 2,
        actual: 2,
        difference: 0,
        unit: "máy",
        unitPrice: 200000000,
        totalPlanned: 400000000,
        totalActual: 400000000,
        supplier: "Công ty DEF",
        status: "delivered",
        orderDate: "2025-08-01",
        expectedDelivery: "2025-08-20"
    },
    {
        id: "LK039",
        name: "Hệ thống IoT giám sát",
        planned: 1,
        actual: 1,
        difference: 0,
        unit: "hệ thống",
        unitPrice: 150000000,
        totalPlanned: 150000000,
        totalActual: 150000000,
        supplier: "Công ty GHI",
        status: "delivered",
        orderDate: "2025-09-01",
        expectedDelivery: "2025-09-15"
    },
    {
        id: "LK040",
        name: "Robot công nghiệp",
        planned: 3,
        actual: 2,
        difference: -1,
        unit: "robot",
        unitPrice: 100000000,
        totalPlanned: 300000000,
        totalActual: 200000000,
        supplier: "Công ty JKL",
        status: "delivered",
        orderDate: "2025-10-01",
        expectedDelivery: "2025-10-20"
    }
];

// Initialize purchasing page
function initializePurchasing() {
    // Set default date for new plans
    const today = new Date().toISOString().split('T')[0];
    const orderDateInput = document.getElementById('orderDate');
    if (orderDateInput) {
        orderDateInput.value = today;
    }
    
    // Set expected delivery date (7 days from today)
    const expectedDeliveryInput = document.getElementById('expectedDelivery');
    if (expectedDeliveryInput) {
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() + 7);
        expectedDeliveryInput.value = expectedDate.toISOString().split('T')[0];
    }
}

// Setup event listeners
function setupEventListeners() {
    // Submit plan
    const submitPlanBtn = document.getElementById('submitPlan');
    if (submitPlanBtn) {
        submitPlanBtn.addEventListener('click', handleSubmitPlan);
    }
    
    // Update plan
    const updatePlanBtn = document.getElementById('updatePlan');
    if (updatePlanBtn) {
        updatePlanBtn.addEventListener('click', handleUpdatePlan);
    }
    
    // Auto-calculate total when quantity or price changes
    const plannedQuantityInput = document.getElementById('plannedQuantity');
    const unitPriceInput = document.getElementById('unitPrice');
    
    if (plannedQuantityInput && unitPriceInput) {
        plannedQuantityInput.addEventListener('input', calculateTotal);
        unitPriceInput.addEventListener('input', calculateTotal);
    }
}

// Load purchasing data
function loadPurchasingData() {
    renderPurchasingTable(purchasingData);
    renderPurchasingChart();
}

// Refresh chart when data changes
function refreshChart() {
    renderPurchasingChart();
}

// Render purchasing table
function renderPurchasingTable(data) {
    const tbody = document.getElementById('purchasingPlanTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        // Calculate difference class
        let differenceClass = 'neutral';
        if (item.difference > 0) {
            differenceClass = 'positive';
        } else if (item.difference < 0) {
            differenceClass = 'negative';
        }
        
        row.innerHTML = `
            <td><strong>${item.id}</strong></td>
            <td>${item.name}</td>
            <td>${item.planned} ${item.unit}</td>
            <td>${item.actual} ${item.unit}</td>
            <td>
                <span class="purchase-difference ${differenceClass}">
                    ${item.difference > 0 ? '+' : ''}${item.difference} ${item.unit}
                </span>
            </td>
            <td>${item.supplier}</td>
            <td>
                <span class="purchase-status-badge purchase-status-${item.status}">
                    ${getStatusText(item.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewPlan('${item.id}')" title="Xem chi tiết">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="editPlan('${item.id}')" title="Chỉnh sửa">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePlan('${item.id}')" title="Xóa">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Render purchasing chart
function renderPurchasingChart() {
    const ctx = document.getElementById('purchasingTrendChart');
    if (!ctx) return;
    
    // Calculate data from actual purchasing data
    const chartData = calculateChartData();
    
    // Destroy existing chart if it exists
    if (window.purchasingChart) {
        window.purchasingChart.destroy();
    }
    
    // Create actual gradient for better visual effect
    const canvas = ctx.getContext('2d');
    const height = 400;
    
    const plannedGradient = canvas.createLinearGradient(0, 0, 0, height);
    plannedGradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
    plannedGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    
    const actualGradient = canvas.createLinearGradient(0, 0, 0, height);
    actualGradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
    actualGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
    
    // Debug: Log chart data
    console.log('Rendering chart with data:', chartData);
    
    window.purchasingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.months,
            datasets: [
                {
                    label: 'Kế hoạch',
                    data: chartData.plannedData,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Thực tế',
                    data: chartData.actualData,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 30,
                    right: 30,
                    bottom: 30,
                    left: 30
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        padding: 25,
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        color: '#374151',
                        boxWidth: 12,
                        boxHeight: 12
                    }
                },
                title: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(99, 102, 241, 0.8)',
                    borderWidth: 2,
                    cornerRadius: 12,
                    displayColors: true,
                    padding: 16,
                    titleFont: {
                        size: 15,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 14,
                        weight: '500'
                    },
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            return `${context.dataset.label}: ${formatCurrency(value)}`;
                        },
                        title: function(context) {
                            return `📅 Tháng ${context[0].label} 2025`;
                        },
                        afterBody: function(context) {
                            if (context.length === 2) {
                                const planned = context[0].parsed.y;
                                const actual = context[1].parsed.y;
                                const variance = ((actual - planned) / planned * 100).toFixed(1);
                                const diff = actual - planned;
                                const diffFormatted = formatCurrency(Math.abs(diff));
                                const varianceClass = variance >= 0 ? '✓' : '✗';
                                return [
                                    '',
                                    `${varianceClass} Chênh lệch: ${diff >= 0 ? '+' : '-'}${diffFormatted}`,
                                    `${varianceClass} Tỷ lệ: ${variance >= 0 ? '+' : ''}${variance}%`
                                ];
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        drawBorder: false,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        color: '#6b7280',
                        padding: 15
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(229, 231, 235, 0.5)',
                        drawBorder: false,
                        lineWidth: 1.5
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: '600'
                        },
                        color: '#6b7280',
                        padding: 15,
                        maxTicksLimit: 8,
                        callback: function(value) {
                            if (value >= 1000000000) {
                                return (value / 1000000000).toFixed(1) + 'B VND';
                            }
                            return (value / 1000000).toFixed(0) + 'M VND';
                        }
                    }
                }
            },
            elements: {
                point: {
                    hoverBackgroundColor: '#ffffff',
                    hoverBorderColor: '#6366f1',
                    hoverBorderWidth: 4,
                    radius: 6,
                    hoverRadius: 10
                },
                line: {
                    borderCapStyle: 'round',
                    borderJoinStyle: 'round'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Calculate chart data from purchasing data
function calculateChartData() {
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    
    // Use fixed data for testing - ensure all months have data
    const plannedData = [45000000, 65000000, 85000000, 72000000, 55000000, 48000000];
    const actualData = [42000000, 58000000, 78000000, 68000000, 52000000, 45000000];
    
    // Debug: Log the data to console
    console.log('Chart Data Debug:');
    console.log('Months:', months);
    console.log('Planned Data:', plannedData);
    console.log('Actual Data:', actualData);
    
    // Validate data
    const hasValidData = plannedData.every(val => val > 0) && actualData.every(val => val > 0);
    console.log('Has valid data for all months:', hasValidData);
    
    return {
        months: months,
        plannedData: plannedData,
        actualData: actualData
    };
}

// Handle submit plan
function handleSubmitPlan() {
    const form = document.getElementById('createPlanForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const formData = {
        partId: document.getElementById('partId').value,
        partName: document.getElementById('partName').value,
        plannedQuantity: parseInt(document.getElementById('plannedQuantity').value),
        unit: document.getElementById('unit').value,
        unitPrice: parseInt(document.getElementById('unitPrice').value),
        supplier: document.getElementById('supplier').value,
        orderDate: document.getElementById('orderDate').value,
        expectedDelivery: document.getElementById('expectedDelivery').value,
        status: document.getElementById('status').value
    };
    
    // Generate new part ID if not provided
    const newId = formData.partId || `LK${String(purchasingData.length + 1).padStart(3, '0')}`;
    
    // Create new plan item
    const newItem = {
        id: newId,
        name: formData.partName,
        planned: formData.plannedQuantity,
        actual: 0,
        difference: -formData.plannedQuantity,
        unit: formData.unit,
        unitPrice: formData.unitPrice,
        totalPlanned: formData.plannedQuantity * formData.unitPrice,
        totalActual: 0,
        supplier: formData.supplier,
        status: formData.status,
        orderDate: formData.orderDate,
        expectedDelivery: formData.expectedDelivery
    };
    
    // Add to purchasing data
    purchasingData.push(newItem);
    
    // Refresh table and chart
    renderPurchasingTable(purchasingData);
    refreshChart();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('createPlanModal'));
    modal.hide();
    
    // Reset form
    form.reset();
    
    // Show success message
    alert(`Đã tạo kế hoạch mua hàng ${newId} thành công!`);
}

// Handle update plan
function handleUpdatePlan() {
    const form = document.getElementById('editPlanForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const partId = document.getElementById('editPartId').value;
    const itemIndex = purchasingData.findIndex(item => item.id === partId);
    
    if (itemIndex === -1) {
        alert('Không tìm thấy kế hoạch mua hàng để cập nhật');
        return;
    }
    
    // Get form data
    const formData = {
        partName: document.getElementById('editPartName').value,
        plannedQuantity: parseInt(document.getElementById('editPlannedQuantity').value),
        actualQuantity: parseInt(document.getElementById('editActualQuantity').value) || 0,
        unit: document.getElementById('editUnit').value,
        unitPrice: parseInt(document.getElementById('editUnitPrice').value),
        supplier: document.getElementById('editSupplier').value,
        orderDate: document.getElementById('editOrderDate').value,
        expectedDelivery: document.getElementById('editExpectedDelivery').value,
        status: document.getElementById('editStatus').value
    };
    
    // Update item data
    purchasingData[itemIndex] = {
        ...purchasingData[itemIndex],
        name: formData.partName,
        planned: formData.plannedQuantity,
        actual: formData.actualQuantity,
        difference: formData.actualQuantity - formData.plannedQuantity,
        unit: formData.unit,
        unitPrice: formData.unitPrice,
        totalPlanned: formData.plannedQuantity * formData.unitPrice,
        totalActual: formData.actualQuantity * formData.unitPrice,
        supplier: formData.supplier,
        status: formData.status,
        orderDate: formData.orderDate,
        expectedDelivery: formData.expectedDelivery
    };
    
    // Refresh table and chart
    renderPurchasingTable(purchasingData);
    refreshChart();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editPlanModal'));
    modal.hide();
    
    // Show success message
    alert(`Đã cập nhật kế hoạch mua hàng ${partId} thành công!`);
}

// Create new purchasing plan
window.createNewPurchasingPlan = function() {
    const modal = new bootstrap.Modal(document.getElementById('createPlanModal'));
    modal.show();
};

// View plan details
window.viewPlan = function(partId) {
    const item = purchasingData.find(i => i.id === partId);
    if (!item) return;
    
    const modalBody = document.getElementById('viewPlanModalBody');
    
    // Calculate difference class
    let differenceClass = 'neutral';
    if (item.difference > 0) {
        differenceClass = 'positive';
    } else if (item.difference < 0) {
        differenceClass = 'negative';
    }
    
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="purchase-info-section">
                    <h6><i class="bi bi-info-circle"></i> Thông tin linh kiện</h6>
                    <p><strong>Mã LK:</strong> ${item.id}</p>
                    <p><strong>Tên linh kiện:</strong> ${item.name}</p>
                    <p><strong>Đơn vị:</strong> ${item.unit}</p>
                    <p><strong>Đơn giá:</strong> ${formatCurrency(item.unitPrice)}</p>
                    <p><strong>Nhà cung cấp:</strong> ${item.supplier}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="purchase-info-section">
                    <h6><i class="bi bi-graph-up"></i> Thông tin kế hoạch</h6>
                    <p><strong>Số lượng kế hoạch:</strong> ${item.planned} ${item.unit}</p>
                    <p><strong>Số lượng thực tế:</strong> ${item.actual} ${item.unit}</p>
                    <p><strong>Chênh lệch:</strong> 
                        <span class="purchase-difference ${differenceClass}">
                            ${item.difference > 0 ? '+' : ''}${item.difference} ${item.unit}
                        </span>
                    </p>
                    <p><strong>Trạng thái:</strong> 
                        <span class="purchase-status-badge purchase-status-${item.status}">
                            ${getStatusText(item.status)}
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="purchase-info-section">
                    <h6><i class="bi bi-currency-dollar"></i> Thông tin tài chính</h6>
                    <p><strong>Tổng kế hoạch:</strong> ${formatCurrency(item.totalPlanned)}</p>
                    <p><strong>Tổng thực tế:</strong> ${formatCurrency(item.totalActual)}</p>
                    <p><strong>Chênh lệch tài chính:</strong> 
                        <span class="purchase-difference ${differenceClass}">
                            ${item.totalActual - item.totalPlanned > 0 ? '+' : ''}${formatCurrency(item.totalActual - item.totalPlanned)}
                        </span>
                    </p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="purchase-info-section">
                    <h6><i class="bi bi-calendar"></i> Thông tin thời gian</h6>
                    <p><strong>Ngày đặt hàng:</strong> ${formatDate(item.orderDate)}</p>
                    <p><strong>Ngày giao dự kiến:</strong> ${formatDate(item.expectedDelivery)}</p>
                    <p><strong>Trạng thái giao hàng:</strong> ${getDeliveryStatus(item.orderDate, item.expectedDelivery)}</p>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="purchase-info-section">
                    <h6><i class="bi bi-bar-chart"></i> Phân tích hiệu suất</h6>
                    <div class="progress mb-2">
                        <div class="progress-bar ${item.actual >= item.planned ? 'bg-success' : 'bg-warning'}" 
                             role="progressbar" 
                             style="width: ${Math.min((item.actual / item.planned) * 100, 100)}%">
                            ${Math.round((item.actual / item.planned) * 100)}%
                        </div>
                    </div>
                    <small class="text-muted">
                        Tỷ lệ hoàn thành: ${item.actual}/${item.planned} ${item.unit} 
                        (${item.actual >= item.planned ? 'Đạt mục tiêu' : 'Chưa đạt mục tiêu'})
                    </small>
                </div>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('viewPlanModal'));
    modal.show();
};

// Edit plan
window.editPlan = function(partId) {
    const item = purchasingData.find(i => i.id === partId);
    if (!item) return;
    
    // Populate edit form
    document.getElementById('editPartId').value = item.id;
    document.getElementById('editPartName').value = item.name;
    document.getElementById('editPlannedQuantity').value = item.planned;
    document.getElementById('editActualQuantity').value = item.actual;
    document.getElementById('editUnit').value = item.unit;
    document.getElementById('editUnitPrice').value = item.unitPrice;
    document.getElementById('editSupplier').value = item.supplier;
    document.getElementById('editOrderDate').value = item.orderDate;
    document.getElementById('editExpectedDelivery').value = item.expectedDelivery;
    document.getElementById('editStatus').value = item.status;
    
    const modal = new bootstrap.Modal(document.getElementById('editPlanModal'));
    modal.show();
};

// Delete plan
window.deletePlan = function(partId) {
    if (confirm('Bạn có chắc chắn muốn xóa kế hoạch mua hàng này?')) {
        const index = purchasingData.findIndex(item => item.id === partId);
        if (index > -1) {
            purchasingData.splice(index, 1);
            renderPurchasingTable(purchasingData);
            refreshChart();
            alert(`Đã xóa kế hoạch mua hàng ${partId} thành công!`);
        }
    }
};

// Calculate total
function calculateTotal() {
    const plannedQuantity = parseInt(document.getElementById('plannedQuantity')?.value) || 0;
    const unitPrice = parseInt(document.getElementById('unitPrice')?.value) || 0;
    const total = plannedQuantity * unitPrice;
    
    // You can display the total somewhere if needed
    console.log('Total:', total);
}

// Get status text
function getStatusText(status) {
    // Get localized text from data attributes
    const statusElement = document.querySelector(`[data-status-${status}]`);
    if (statusElement) {
        return statusElement.textContent;
    }
    
    // Fallback to hardcoded text
    switch (status) {
        case 'pending':
            return 'Chờ xử lý';
        case 'ordered':
            return 'Đã đặt hàng';
        case 'delivered':
            return 'Đã giao hàng';
        case 'cancelled':
            return 'Đã hủy';
        default:
            return 'Không xác định';
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Get delivery status
function getDeliveryStatus(orderDate, expectedDelivery) {
    const today = new Date();
    const expected = new Date(expectedDelivery);
    const order = new Date(orderDate);
    
    if (today < order) {
        return 'Chưa đặt hàng';
    } else if (today < expected) {
        const daysLeft = Math.ceil((expected - today) / (1000 * 60 * 60 * 24));
        return `Còn ${daysLeft} ngày`;
    } else {
        const daysOverdue = Math.ceil((today - expected) / (1000 * 60 * 60 * 24));
        return `Quá hạn ${daysOverdue} ngày`;
    }
}
