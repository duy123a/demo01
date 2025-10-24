// Dashboard JavaScript - Non-module version
// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load dashboard data
    loadDashboardData();
});

// Mock Dashboard Data
const dashboardData = {
    stats: {
        active: 42,
        maintenance: 5,
        overdue: 3,
        thisWeek: 12
    },
    overdueEquipment: [
        {
            id: 'A01',
            name: 'Máy cắt vải dù tự động',
            department: 'Cắt vải dù',
            daysOverdue: 2,
            status: 'overdue'
        },
        {
            id: 'C02',
            name: 'Máy kiểm tra dây cáp',
            department: 'Kiểm tra chất lượng',
            daysOverdue: 1,
            status: 'overdue'
        },
        {
            id: 'C03',
            name: 'Máy kiểm tra khóa móc',
            department: 'Kiểm tra chất lượng',
            daysOverdue: 3,
            status: 'overdue'
        }
    ],
    todaySchedule: [
        {
            equipment: 'Máy cắt vải dù A01',
            type: 'Định kỳ',
            time: '08:00 - 10:00',
            responsible: 'Nguyễn Văn A',
            status: 'pending'
        },
        {
            equipment: 'Máy may dù B03',
            type: 'Cơ khí',
            time: '10:30 - 12:00',
            responsible: 'Trần Thị B',
            status: 'in_progress'
        },
        {
            equipment: 'Máy kiểm tra C02',
            type: 'Điện',
            time: '14:00 - 16:00',
            responsible: 'Lê Văn C',
            status: 'pending'
        }
    ],
    alerts: [
        {
            type: 'danger',
            title: 'Thiết bị quá hạn bảo trì',
            message: '3 thiết bị đã quá hạn bảo trì định kỳ'
        },
        {
            type: 'warning',
            title: 'Linh kiện sắp hết',
            message: 'Bạc đạn 6202 chỉ còn 5 cái'
        },
        {
            type: 'info',
            title: 'Bảo trì tuần tới',
            message: '5 thiết bị cần bảo trì tuần tới'
        }
    ]
};

function initializeDashboard() {
    // Set current date
    const currentDate = new Date();
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = currentDate.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Initialize charts
    initializeCharts();
}

function setupEventListeners() {
    // QR Scanner
    const qrScanBtn = document.getElementById('qrScanBtn');
    const qrModal = document.getElementById('qrScanModal');
    const qrSubmit = document.getElementById('qrSubmit');
    
    if (qrScanBtn && qrModal) {
        qrScanBtn.addEventListener('click', () => {
            const modal = new bootstrap.Modal(qrModal);
            modal.show();
        });
    }
    
    if (qrSubmit) {
        qrSubmit.addEventListener('click', () => {
            const qrInput = document.getElementById('qrInput');
            if (qrInput && qrInput.value.trim()) {
                // Redirect to equipment page with search
                window.location.href = `/Devices?search=${qrInput.value.trim()}`;
            }
        });
    }
}

function loadDashboardData() {
    // Load overdue equipment
    loadOverdueEquipment();
    
    // Load today's schedule
    loadTodaySchedule();
    
    // Load alerts
    loadAlerts();
}

function loadOverdueEquipment() {
    const overdueList = document.getElementById('overdueEquipmentList');
    if (!overdueList) return;
    
    overdueList.innerHTML = dashboardData.overdueEquipment.map(equipment => `
        <div class="equipment-item">
            <div class="equipment-info">
                <h6>${equipment.name} (${equipment.id})</h6>
                <p>${equipment.department} • Quá hạn ${equipment.daysOverdue} ngày</p>
            </div>
            <div class="equipment-status ${equipment.status}">
                Quá hạn
            </div>
        </div>
    `).join('');
}

function loadTodaySchedule() {
    const scheduleTable = document.getElementById('todayScheduleTable');
    if (!scheduleTable) return;
    
    scheduleTable.innerHTML = dashboardData.todaySchedule.map(schedule => `
        <tr>
            <td>${schedule.equipment}</td>
            <td>${schedule.type}</td>
            <td>${schedule.time}</td>
            <td>${schedule.responsible}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(schedule.status)}">
                    ${getStatusText(schedule.status)}
                </span>
            </td>
        </tr>
    `).join('');
}

function loadAlerts() {
    const alertList = document.getElementById('alertList');
    if (!alertList) return;
    
    alertList.innerHTML = dashboardData.alerts.map(alert => `
        <div class="alert-item alert-${alert.type}">
            <h6>${alert.title}</h6>
            <p>${alert.message}</p>
        </div>
    `).join('');
}

function initializeCharts() {
    // Maintenance Type Chart
    const maintenanceTypeCtx = document.getElementById('maintenanceTypeChart');
    if (maintenanceTypeCtx) {
        new Chart(maintenanceTypeCtx, {
            type: 'doughnut',
            data: {
                labels: ['Định kỳ', 'Cơ khí', 'Điện', 'Khác'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                        '#0066ff',
                        '#00c853',
                        '#ff9800',
                        '#00bcd4'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
    
    // Maintenance Trend Chart
    const maintenanceTrendCtx = document.getElementById('maintenanceTrendChart');
    if (maintenanceTrendCtx) {
        new Chart(maintenanceTrendCtx, {
            type: 'line',
            data: {
                labels: ['Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10'],
                datasets: [{
                    label: 'Số lượng bảo trì',
                    data: [12, 15, 18, 14, 16, 20],
                    borderColor: '#0066ff',
                    backgroundColor: 'rgba(0, 102, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#e9ecef'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'pending':
            return 'bg-warning';
        case 'in_progress':
            return 'bg-info';
        case 'completed':
            return 'bg-success';
        case 'cancelled':
            return 'bg-secondary';
        default:
            return 'bg-secondary';
    }
}

function getStatusText(status) {
    // Get localized text from data attributes
    const statusTexts = {
        'pending': document.querySelector('[data-status-pending]')?.textContent || 'Chờ thực hiện',
        'in_progress': document.querySelector('[data-status-in-progress]')?.textContent || 'Đang thực hiện',
        'completed': document.querySelector('[data-status-completed]')?.textContent || 'Hoàn thành',
        'cancelled': document.querySelector('[data-status-cancelled]')?.textContent || 'Đã hủy'
    };
    
    return statusTexts[status] || 'Không xác định';
}

// Utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('vi-VN');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}
