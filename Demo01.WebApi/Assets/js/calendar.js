// Calendar JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    setupEventListeners();
    loadCalendarData();
});

// Mock Calendar Data - Dựa trên thiết bị thực tế từ hệ thống
const maintenanceSchedule = [
    // Tháng 9/2025 - Các thiết bị cần bảo trì định kỳ
    {
        id: 1,
        equipment: "A01",
        name: "Máy cắt vải dù tự động",
        date: "2025-09-05",
        type: "Định kỳ",
        technician: "Nguyễn Văn A",
        status: "pending"
    },
    {
        id: 2,
        equipment: "B03",
        name: "Máy may dù lượn chuyên dụng 3",
        date: "2025-09-12",
        type: "Cơ khí",
        technician: "Trần Thị B",
        status: "scheduled"
    },
    {
        id: 3,
        equipment: "C02",
        name: "Máy kiểm tra dây cáp",
        date: "2025-09-18",
        type: "Điện",
        technician: "Lê Văn C",
        status: "completed"
    },
    {
        id: 4,
        equipment: "A02",
        name: "Máy cắt laser CNC vải dù",
        date: "2025-09-22",
        type: "Định kỳ",
        technician: "Phạm Văn D",
        status: "pending"
    },
    {
        id: 5,
        equipment: "B01",
        name: "Máy may dù lượn chuyên dụng 1",
        date: "2025-09-28",
        type: "Cơ khí",
        technician: "Hoàng Thị E",
        status: "scheduled"
    },
    
    // Tháng 10/2025 - Tiếp tục các thiết bị khác
    {
        id: 6,
        equipment: "C01",
        name: "Máy kiểm tra độ bền vải dù",
        date: "2025-10-02",
        type: "Điện",
        technician: "Vũ Văn F",
        status: "pending"
    },
    {
        id: 7,
        equipment: "A03",
        name: "Máy cắt thủy lực",
        date: "2025-10-08",
        type: "Định kỳ",
        technician: "Đặng Thị G",
        status: "completed"
    },
    {
        id: 8,
        equipment: "B02",
        name: "Máy may dù lượn chuyên dụng 2",
        date: "2025-10-15",
        type: "Cơ khí",
        technician: "Bùi Văn H",
        status: "scheduled"
    },
    {
        id: 9,
        equipment: "C03",
        name: "Máy kiểm tra khóa móc",
        date: "2025-10-22",
        type: "Điện",
        technician: "Ngô Thị I",
        status: "pending"
    },
    {
        id: 10,
        equipment: "A04",
        name: "Máy cắt plasma",
        date: "2025-10-25",
        type: "Định kỳ",
        technician: "Lý Văn J",
        status: "completed"
    },
    
    // Tháng 11/2025 - Các thiết bị hệ thống
    {
        id: 11,
        equipment: "D01",
        name: "Máy ép nhiệt",
        date: "2025-11-05",
        type: "Cơ khí",
        technician: "Trần Văn K",
        status: "pending"
    },
    {
        id: 12,
        equipment: "E01",
        name: "Máy đóng gói tự động",
        date: "2025-11-12",
        type: "Cơ khí",
        technician: "Nguyễn Thị L",
        status: "scheduled"
    },
    {
        id: 13,
        equipment: "F01",
        name: "Máy nén khí",
        date: "2025-11-18",
        type: "Cơ khí",
        technician: "Lê Văn M",
        status: "pending"
    },
    {
        id: 14,
        equipment: "F02",
        name: "Máy bơm nước",
        date: "2025-11-25",
        type: "Điện",
        technician: "Phạm Thị N",
        status: "scheduled"
    },
    
    // Tháng 12/2025 - Bảo trì cuối năm
    {
        id: 15,
        equipment: "A05",
        name: "Máy cắt tự động CNC",
        date: "2025-12-02",
        type: "Định kỳ",
        technician: "Hoàng Văn O",
        status: "pending"
    },
    {
        id: 16,
        equipment: "B04",
        name: "Máy may công nghiệp",
        date: "2025-12-09",
        type: "Cơ khí",
        technician: "Đặng Thị P",
        status: "scheduled"
    },
    {
        id: 17,
        equipment: "C04",
        name: "Máy kiểm tra độ co rút",
        date: "2025-12-16",
        type: "Điện",
        technician: "Bùi Văn Q",
        status: "pending"
    },
    {
        id: 18,
        equipment: "D02",
        name: "Máy ép khuôn tự động",
        date: "2025-12-23",
        type: "Điện",
        technician: "Ngô Thị R",
        status: "scheduled"
    },
    
    // Tháng 1/2026 - Bảo trì đầu năm
    {
        id: 19,
        equipment: "E02",
        name: "Máy dán nhãn",
        date: "2026-01-06",
        type: "Điện",
        technician: "Lý Văn S",
        status: "pending"
    },
    {
        id: 20,
        equipment: "F03",
        name: "Máy điều hòa trung tâm",
        date: "2026-01-13",
        type: "Định kỳ",
        technician: "Trần Văn T",
        status: "scheduled"
    },
    {
        id: 21,
        equipment: "F04",
        name: "Máy phát điện dự phòng",
        date: "2026-01-20",
        type: "Cơ khí",
        technician: "Nguyễn Thị U",
        status: "pending"
    },
    {
        id: 22,
        equipment: "E03",
        name: "Máy đóng thùng",
        date: "2026-01-27",
        type: "Định kỳ",
        technician: "Lê Văn V",
        status: "scheduled"
    },
    
    // Tháng 2/2026 - Bảo trì định kỳ
    {
        id: 23,
        equipment: "C05",
        name: "Máy kiểm tra màu sắc",
        date: "2026-02-03",
        type: "Điện",
        technician: "Phạm Thị W",
        status: "pending"
    },
    {
        id: 24,
        equipment: "D03",
        name: "Máy ép thủy lực",
        date: "2026-02-10",
        type: "Định kỳ",
        technician: "Hoàng Văn X",
        status: "scheduled"
    },
    {
        id: 25,
        equipment: "B05",
        name: "Máy may tự động",
        date: "2026-02-17",
        type: "Cơ khí",
        technician: "Đặng Thị Y",
        status: "pending"
    },
    {
        id: 26,
        equipment: "B06",
        name: "Máy may cao tốc",
        date: "2026-02-24",
        type: "Cơ khí",
        technician: "Bùi Văn Z",
        status: "scheduled"
    }
];

let currentDate = new Date();

function initializeCalendar() {
    console.log('Initializing calendar...');
    // Set current month
    currentDate = new Date();
    renderCalendar();
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');
    
    console.log('Found elements:', { prevMonth, nextMonth, todayBtn });
    
    if (prevMonth) {
        prevMonth.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextMonth) {
        nextMonth.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    if (todayBtn) {
        todayBtn.addEventListener('click', function() {
            currentDate = new Date();
            renderCalendar();
        });
    }
    
    // Add event delegation for maintenance events
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('maintenance-event')) {
            const eventId = parseInt(e.target.getAttribute('data-event-id'));
            console.log('Event clicked:', eventId);
            viewMaintenanceEvent(eventId);
        }
    });
}

function loadCalendarData() {
    console.log('Loading calendar data...');
    renderCalendar();
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    if (!calendar) {
        console.error('Calendar element not found!');
        return;
    }
    
    console.log('Rendering calendar...');
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update header
    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    
    const header = document.querySelector('.card-header h5');
    if (header) {
        header.innerHTML = `<i class="bi bi-calendar3"></i> Lịch Bảo Trì ${monthNames[month]}/${year}`;
    }
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Get previous month's last day
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    
    // Calendar header
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    
    let calendarHTML = '<div class="calendar-grid">';
    
    // Add day headers
    dayNames.forEach(day => {
        calendarHTML += `<div class="calendar-header">${day}</div>`;
    });
    
    // Add days from previous month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthDays - i;
        const prevMonthYear = month === 0 ? year - 1 : year;
        const prevMonthIndex = month === 0 ? 11 : month - 1;
        const dateString = `${prevMonthYear}-${String(prevMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        calendarHTML += `
            <div class="calendar-day other-month">
                <div class="calendar-day-number">${day}</div>
                ${getMaintenanceEvents(dateString)}
            </div>
        `;
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = isTodayDate(year, month, day);
        const dayClass = isToday ? 'calendar-day today' : 'calendar-day';
        
        calendarHTML += `
            <div class="${dayClass}">
                <div class="calendar-day-number">${day}</div>
                ${getMaintenanceEvents(dateString)}
            </div>
        `;
    }
    
    // Add days from next month to complete the grid
    const totalCells = 42; // 6 weeks * 7 days
    const currentCells = startingDayOfWeek + daysInMonth;
    const remainingCells = totalCells - currentCells;
    
    for (let day = 1; day <= remainingCells; day++) {
        const nextMonthYear = month === 11 ? year + 1 : year;
        const nextMonthIndex = month === 11 ? 0 : month + 1;
        const dateString = `${nextMonthYear}-${String(nextMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        calendarHTML += `
            <div class="calendar-day other-month">
                <div class="calendar-day-number">${day}</div>
                ${getMaintenanceEvents(dateString)}
            </div>
        `;
    }
    
    calendarHTML += '</div>';
    calendar.innerHTML = calendarHTML;
    
    console.log('Calendar rendered successfully with full grid');
}

function getMaintenanceEvents(dateString) {
    const events = maintenanceSchedule.filter(event => event.date === dateString);
    console.log(`Events for ${dateString}:`, events);
    return events.map(event => `
        <div class="maintenance-event ${event.status}" data-event-id="${event.id}">
            ${event.equipment} - ${event.type}
        </div>
    `).join('');
}

function isTodayDate(year, month, day) {
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
}

function viewMaintenanceEvent(eventId) {
    console.log('viewMaintenanceEvent called with ID:', eventId);
    const event = maintenanceSchedule.find(e => e.id === eventId);
    console.log('Found event:', event);
    if (event) {
        alert(`Chi tiết bảo trì:\nThiết bị: ${event.name} (${event.equipment})\nLoại: ${event.type}\nKỹ thuật viên: ${event.technician}`);
    } else {
        console.error('Event not found for ID:', eventId);
        alert('Không tìm thấy thông tin bảo trì');
    }
}

// Make function globally available
window.viewMaintenanceEvent = viewMaintenanceEvent;
