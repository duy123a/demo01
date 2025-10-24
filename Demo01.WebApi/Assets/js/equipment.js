// Equipment JavaScript - Non-module version
document.addEventListener('DOMContentLoaded', function() {
    // Initialize equipment page
    initializeEquipment();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load equipment data
    loadEquipmentData();
});

// Mock Equipment Data - 25 thiết bị
const equipmentData = [
  {
    id: "A01",
    name: "Máy cắt vải dù tự động",
    department: "Cắt vải dù",
    lastMaintenance: "2025-07-15",
    lastType: "Định kỳ",
    nextMaintenance: new Date().toISOString().split("T")[0],
    status: "overdue",
    maintenanceInterval: 90,
    criticality: "high",
    location: "Xưởng A - Khu vực 1",
    manufacturer: "TechCut Industries",
    model: "TC-2000",
    serialNumber: "TC2000-001",
    warrantyExpiry: "2026-12-31",
    operatingHours: 8760,
    lastInspection: "2025-09-15",
    nextInspection: "2025-12-15",
  },
  {
    id: "A02",
    name: "Máy cắt laser CNC vải dù",
    department: "Cắt vải dù",
    lastMaintenance: "2025-08-20",
    lastType: "Cơ khí",
    nextMaintenance: "2025-11-20",
    status: "active",
    maintenanceInterval: 120,
    criticality: "critical",
    location: "Xưởng A - Khu vực 2",
    manufacturer: "LaserPro Systems",
    model: "LP-CNC-500",
    serialNumber: "LP500-002",
    warrantyExpiry: "2027-06-30",
    operatingHours: 12450,
    lastInspection: "2025-08-20",
    nextInspection: "2025-11-20",
  },
  {
    id: "A03",
    name: "Máy cắt thủy lực",
    department: "Cắt vải dù",
    lastMaintenance: "2025-09-05",
    lastType: "Điện",
    nextMaintenance: "2025-12-05",
    status: "active",
    maintenanceInterval: 90,
    criticality: "medium",
    location: "Xưởng A - Khu vực 3",
    manufacturer: "HydroCut Ltd",
    model: "HC-300",
    serialNumber: "HC300-001",
    warrantyExpiry: "2026-09-05",
    operatingHours: 9800,
    lastInspection: "2025-09-05",
    nextInspection: "2025-12-05",
  },
  {
    id: "A04",
    name: "Máy cắt plasma",
    department: "Cắt vải dù",
    lastMaintenance: "2025-08-15",
    lastType: "Định kỳ",
    nextMaintenance: "2025-11-15",
    status: "active",
    maintenanceInterval: 90,
    criticality: "high",
    location: "Xưởng A - Khu vực 4",
    manufacturer: "PlasmaTech",
    model: "PT-400",
    serialNumber: "PT400-001",
    warrantyExpiry: "2026-08-15",
    operatingHours: 11200,
    lastInspection: "2025-08-15",
    nextInspection: "2025-11-15",
  },
  {
    id: "A05",
    name: "Máy cắt tự động CNC",
    department: "Cắt vải dù",
    lastMaintenance: "2025-07-30",
    lastType: "Cơ khí",
    nextMaintenance: "2025-10-30",
    status: "maintenance",
    maintenanceInterval: 90,
    criticality: "critical",
    location: "Xưởng A - Khu vực 5",
    manufacturer: "AutoCut Systems",
    model: "AC-500",
    serialNumber: "AC500-001",
    warrantyExpiry: "2026-07-30",
    operatingHours: 15600,
    lastInspection: "2025-07-30",
    nextInspection: "2025-10-30",
  },
  {
    id: "B01",
    name: "Máy may dù lượn chuyên dụng 1",
    department: "May dù",
    lastMaintenance: "2025-09-10",
    lastType: "Điện",
    nextMaintenance: "2025-12-10",
    status: "active",
    maintenanceInterval: 60,
    criticality: "high",
    location: "Xưởng B - Dây chuyền 1",
    manufacturer: "SewMaster Corp",
    model: "SM-PG-100",
    serialNumber: "SM100-001",
    warrantyExpiry: "2026-03-15",
    operatingHours: 15600,
    lastInspection: "2025-09-10",
    nextInspection: "2025-12-10",
  },
  {
    id: "B02",
    name: "Máy may dù lượn chuyên dụng 2",
    department: "May dù",
    lastMaintenance: "2025-09-15",
    lastType: "Định kỳ",
    nextMaintenance: "2025-12-15",
    status: "active",
    maintenanceInterval: 60,
    criticality: "high",
    location: "Xưởng B - Dây chuyền 2",
    manufacturer: "SewMaster Corp",
    model: "SM-PG-100",
    serialNumber: "SM100-002",
    warrantyExpiry: "2026-03-20",
    operatingHours: 15200,
    lastInspection: "2025-09-15",
    nextInspection: "2025-12-15",
  },
  {
    id: "B03",
    name: "Máy may dù lượn chuyên dụng 3",
    department: "May dù",
    lastMaintenance: "2025-07-22",
    lastType: "Cơ khí",
    nextMaintenance: new Date().toISOString().split("T")[0],
    status: "warning",
    maintenanceInterval: 60,
    criticality: "high",
    location: "Xưởng B - Dây chuyền 3",
    manufacturer: "SewMaster Corp",
    model: "SM-PG-100",
    serialNumber: "SM100-003",
    warrantyExpiry: "2026-03-25",
    operatingHours: 14800,
    lastInspection: "2025-07-22",
    nextInspection: "2025-10-22",
  },
  {
    id: "B04",
    name: "Máy may công nghiệp",
    department: "May dù",
    lastMaintenance: "2025-08-25",
    lastType: "Điện",
    nextMaintenance: "2025-11-25",
    status: "active",
    maintenanceInterval: 60,
    criticality: "medium",
    location: "Xưởng B - Dây chuyền 4",
    manufacturer: "Industrial Sew",
    model: "IS-200",
    serialNumber: "IS200-001",
    warrantyExpiry: "2026-08-25",
    operatingHours: 13200,
    lastInspection: "2025-08-25",
    nextInspection: "2025-11-25",
  },
  {
    id: "B05",
    name: "Máy may tự động",
    department: "May dù",
    lastMaintenance: "2025-09-01",
    lastType: "Định kỳ",
    nextMaintenance: "2025-12-01",
    status: "active",
    maintenanceInterval: 60,
    criticality: "high",
    location: "Xưởng B - Dây chuyền 5",
    manufacturer: "AutoSew Inc",
    model: "AS-300",
    serialNumber: "AS300-001",
    warrantyExpiry: "2026-09-01",
    operatingHours: 14400,
    lastInspection: "2025-09-01",
    nextInspection: "2025-12-01",
  },
  {
    id: "B06",
    name: "Máy may cao tốc",
    department: "May dù",
    lastMaintenance: "2025-08-10",
    lastType: "Cơ khí",
    nextMaintenance: "2025-11-10",
    status: "maintenance",
    maintenanceInterval: 60,
    criticality: "critical",
    location: "Xưởng B - Dây chuyền 6",
    manufacturer: "SpeedSew Ltd",
    model: "SS-400",
    serialNumber: "SS400-001",
    warrantyExpiry: "2026-08-10",
    operatingHours: 16800,
    lastInspection: "2025-08-10",
    nextInspection: "2025-11-10",
  },
  {
    id: "C01",
    name: "Máy kiểm tra độ bền vải dù",
    department: "Kiểm tra chất lượng",
    lastMaintenance: "2025-08-05",
    lastType: "Điện",
    nextMaintenance: "2025-11-05",
    status: "active",
    maintenanceInterval: 90,
    criticality: "medium",
    location: "Phòng QC - Khu vực A",
    manufacturer: "QualityTest Inc",
    model: "QT-Fabric-300",
    serialNumber: "QT300-001",
    warrantyExpiry: "2026-08-05",
    operatingHours: 11200,
    lastInspection: "2025-08-05",
    nextInspection: "2025-11-05",
  },
  {
    id: "C02",
    name: "Máy kiểm tra dây cáp",
    department: "Kiểm tra chất lượng",
    lastMaintenance: "2025-07-10",
    lastType: "Định kỳ",
    nextMaintenance: new Date().toISOString().split("T")[0],
    status: "overdue",
    maintenanceInterval: 60,
    criticality: "high",
    location: "Phòng QC - Khu vực B",
    manufacturer: "CableTest Pro",
    model: "CT-500",
    serialNumber: "CT500-001",
    warrantyExpiry: "2026-07-10",
    operatingHours: 9800,
    lastInspection: "2025-07-10",
    nextInspection: "2025-10-10",
  },
  {
    id: "C03",
    name: "Máy kiểm tra khóa móc",
    department: "Kiểm tra chất lượng",
    lastMaintenance: "2025-06-25",
    lastType: "Cơ khí",
    nextMaintenance: new Date().toISOString().split("T")[0],
    status: "overdue",
    maintenanceInterval: 45,
    criticality: "critical",
    location: "Phòng QC - Khu vực C",
    manufacturer: "HookTest Systems",
    model: "HT-200",
    serialNumber: "HT200-001",
    warrantyExpiry: "2026-06-25",
    operatingHours: 15600,
    lastInspection: "2025-06-25",
    nextInspection: "2025-09-25",
  },
  {
    id: "C04",
    name: "Máy kiểm tra độ co rút",
    department: "Kiểm tra chất lượng",
    lastMaintenance: "2025-08-30",
    lastType: "Điện",
    nextMaintenance: "2025-11-30",
    status: "active",
    maintenanceInterval: 90,
    criticality: "medium",
    location: "Phòng QC - Khu vực D",
    manufacturer: "ShrinkTest Corp",
    model: "ST-150",
    serialNumber: "ST150-001",
    warrantyExpiry: "2026-08-30",
    operatingHours: 10400,
    lastInspection: "2025-08-30",
    nextInspection: "2025-11-30",
  },
  {
    id: "C05",
    name: "Máy kiểm tra màu sắc",
    department: "Kiểm tra chất lượng",
    lastMaintenance: "2025-09-05",
    lastType: "Định kỳ",
    nextMaintenance: "2025-12-05",
    status: "active",
    maintenanceInterval: 60,
    criticality: "high",
    location: "Phòng QC - Khu vực E",
    manufacturer: "ColorCheck Ltd",
    model: "CC-250",
    serialNumber: "CC250-001",
    warrantyExpiry: "2026-09-05",
    operatingHours: 12000,
    lastInspection: "2025-09-05",
    nextInspection: "2025-12-05",
  },
  {
    id: "D01",
    name: "Máy ép nhiệt",
    department: "Ép khuôn",
    lastMaintenance: "2025-08-15",
    lastType: "Cơ khí",
    nextMaintenance: "2025-11-15",
    status: "active",
    maintenanceInterval: 90,
    criticality: "high",
    location: "Xưởng D - Dây chuyền 1",
    manufacturer: "HeatPress Inc",
    model: "HP-300",
    serialNumber: "HP300-001",
    warrantyExpiry: "2026-08-15",
    operatingHours: 13600,
    lastInspection: "2025-08-15",
    nextInspection: "2025-11-15",
  },
  {
    id: "D02",
    name: "Máy ép khuôn tự động",
    department: "Ép khuôn",
    lastMaintenance: "2025-07-20",
    lastType: "Điện",
    nextMaintenance: "2025-10-20",
    status: "maintenance",
    maintenanceInterval: 90,
    criticality: "critical",
    location: "Xưởng D - Dây chuyền 2",
    manufacturer: "AutoPress Systems",
    model: "AP-400",
    serialNumber: "AP400-001",
    warrantyExpiry: "2026-07-20",
    operatingHours: 16000,
    lastInspection: "2025-07-20",
    nextInspection: "2025-10-20",
  },
  {
    id: "D03",
    name: "Máy ép thủy lực",
    department: "Ép khuôn",
    lastMaintenance: "2025-09-01",
    lastType: "Định kỳ",
    nextMaintenance: "2025-12-01",
    status: "active",
    maintenanceInterval: 90,
    criticality: "medium",
    location: "Xưởng D - Dây chuyền 3",
    manufacturer: "HydroPress Ltd",
    model: "HPL-200",
    serialNumber: "HPL200-001",
    warrantyExpiry: "2026-09-01",
    operatingHours: 12800,
    lastInspection: "2025-09-01",
    nextInspection: "2025-12-01",
  },
  {
    id: "E01",
    name: "Máy đóng gói tự động",
    department: "Đóng gói",
    lastMaintenance: "2025-08-25",
    lastType: "Cơ khí",
    nextMaintenance: "2025-11-25",
    status: "active",
    maintenanceInterval: 60,
    criticality: "high",
    location: "Xưởng E - Dây chuyền 1",
    manufacturer: "PackMaster Corp",
    model: "PM-500",
    serialNumber: "PM500-001",
    warrantyExpiry: "2026-08-25",
    operatingHours: 14000,
    lastInspection: "2025-08-25",
    nextInspection: "2025-11-25",
  },
  {
    id: "E02",
    name: "Máy dán nhãn",
    department: "Đóng gói",
    lastMaintenance: "2025-09-10",
    lastType: "Điện",
    nextMaintenance: "2025-12-10",
    status: "active",
    maintenanceInterval: 60,
    criticality: "medium",
    location: "Xưởng E - Dây chuyền 2",
    manufacturer: "LabelTech Inc",
    model: "LT-150",
    serialNumber: "LT150-001",
    warrantyExpiry: "2026-09-10",
    operatingHours: 11600,
    lastInspection: "2025-09-10",
    nextInspection: "2025-12-10",
  },
  {
    id: "E03",
    name: "Máy đóng thùng",
    department: "Đóng gói",
    lastMaintenance: "2025-08-05",
    lastType: "Định kỳ",
    nextMaintenance: "2025-11-05",
    status: "active",
    maintenanceInterval: 60,
    criticality: "high",
    location: "Xưởng E - Dây chuyền 3",
    manufacturer: "BoxSeal Ltd",
    model: "BS-300",
    serialNumber: "BS300-001",
    warrantyExpiry: "2026-08-05",
    operatingHours: 13200,
    lastInspection: "2025-08-05",
    nextInspection: "2025-11-05",
  },
  {
    id: "F01",
    name: "Máy nén khí",
    department: "Hệ thống khí nén",
    lastMaintenance: "2025-07-15",
    lastType: "Cơ khí",
    nextMaintenance: "2025-10-15",
    status: "warning",
    maintenanceInterval: 90,
    criticality: "critical",
    location: "Phòng máy nén",
    manufacturer: "AirCompress Inc",
    model: "AC-1000",
    serialNumber: "AC1000-001",
    warrantyExpiry: "2026-07-15",
    operatingHours: 18000,
    lastInspection: "2025-07-15",
    nextInspection: "2025-10-15",
  },
  {
    id: "F02",
    name: "Máy bơm nước",
    department: "Hệ thống nước",
    lastMaintenance: "2025-08-20",
    lastType: "Điện",
    nextMaintenance: "2025-11-20",
    status: "active",
    maintenanceInterval: 90,
    criticality: "high",
    location: "Phòng máy bơm",
    manufacturer: "WaterPump Corp",
    model: "WP-500",
    serialNumber: "WP500-001",
    warrantyExpiry: "2026-08-20",
    operatingHours: 15200,
    lastInspection: "2025-08-20",
    nextInspection: "2025-11-20",
  },
  {
    id: "F03",
    name: "Máy điều hòa trung tâm",
    department: "Hệ thống HVAC",
    lastMaintenance: "2025-09-01",
    lastType: "Định kỳ",
    nextMaintenance: "2025-12-01",
    status: "active",
    maintenanceInterval: 120,
    criticality: "medium",
    location: "Phòng máy HVAC",
    manufacturer: "ClimateControl Ltd",
    model: "CC-2000",
    serialNumber: "CC2000-001",
    warrantyExpiry: "2026-09-01",
    operatingHours: 20000,
    lastInspection: "2025-09-01",
    nextInspection: "2025-12-01",
  },
  {
    id: "F04",
    name: "Máy phát điện dự phòng",
    department: "Hệ thống điện",
    lastMaintenance: "2025-08-10",
    lastType: "Cơ khí",
    nextMaintenance: "2025-11-10",
    status: "active",
    maintenanceInterval: 90,
    criticality: "critical",
    location: "Phòng máy phát",
    manufacturer: "PowerGen Inc",
    model: "PG-800",
    serialNumber: "PG800-001",
    warrantyExpiry: "2026-08-10",
    operatingHours: 2400,
    lastInspection: "2025-08-10",
    nextInspection: "2025-11-10",
  }
];

function initializeEquipment() {
    // Check for search parameter
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
        document.getElementById('equipmentSearch').value = searchParam;
        filterEquipment();
    }
}

function setupEventListeners() {
    // Add Equipment Button
    const addEquipmentBtn = document.getElementById('addEquipmentBtn');
    if (addEquipmentBtn) {
        addEquipmentBtn.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('addEquipmentModal'));
            modal.show();
        });
    }

    // Import Equipment Button
    const importEquipmentBtn = document.getElementById('importEquipmentBtn');
    if (importEquipmentBtn) {
        importEquipmentBtn.addEventListener('click', function() {
            alert('Import functionality will be implemented');
        });
    }

    // Equipment Filter
    const equipmentFilter = document.getElementById('equipmentFilter');
    if (equipmentFilter) {
        equipmentFilter.addEventListener('change', filterEquipment);
    }

    // Equipment Search
    const equipmentSearch = document.getElementById('equipmentSearch');
    if (equipmentSearch) {
        equipmentSearch.addEventListener('input', filterEquipment);
    }

    // QR Scanner
    const qrScanBtn = document.getElementById('qrScanBtn');
    const qrModal = document.getElementById('qrModal');
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
                // Search for equipment
                document.getElementById('equipmentSearch').value = qrInput.value.trim();
                filterEquipment();
                const modal = bootstrap.Modal.getInstance(qrModal);
                modal.hide();
            }
        });
    }

    // Save Edit Equipment
    const saveEditEquipmentBtn = document.getElementById('saveEditEquipment');
    if (saveEditEquipmentBtn) {
        saveEditEquipmentBtn.addEventListener('click', saveEditEquipment);
    }
}

function loadEquipmentData() {
    const equipmentTable = document.getElementById('equipmentTable');
    if (!equipmentTable) return;
    
    renderEquipmentTable(equipmentData);
}

function renderEquipmentTable(equipment) {
    const equipmentTable = document.getElementById('equipmentTable');
    if (!equipmentTable) return;
    
    equipmentTable.innerHTML = equipment.map(item => `
        <tr>
            <td><strong>${item.id}</strong></td>
            <td>${item.name}</td>
            <td>${item.department}</td>
            <td>${formatDate(item.lastMaintenance)}</td>
            <td>${item.lastType}</td>
            <td>${formatDate(item.nextMaintenance)}</td>
            <td>
                <span class="status-badge status-${item.status}">
                    ${getStatusText(item.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-view" onclick="viewEquipment('${item.id}')" title="Xem chi tiết">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="editEquipment('${item.id}')" title="Chỉnh sửa">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteEquipment('${item.id}')" title="Xóa">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterEquipment() {
    const filter = document.getElementById('equipmentFilter').value;
    const search = document.getElementById('equipmentSearch').value.toLowerCase();
    
    let filteredEquipment = equipmentData;
    
    // Apply status filter
    if (filter !== 'all') {
        filteredEquipment = filteredEquipment.filter(item => {
            if (filter === 'overdue') {
                return item.status === 'overdue';
            } else if (filter === 'maintenance') {
                return item.status === 'maintenance';
            } else if (filter === 'active') {
                return item.status === 'active';
            }
            return true;
        });
    }
    
    // Apply search filter
    if (search) {
        filteredEquipment = filteredEquipment.filter(item => 
            item.id.toLowerCase().includes(search) ||
            item.name.toLowerCase().includes(search) ||
            item.department.toLowerCase().includes(search)
        );
    }
    
    renderEquipmentTable(filteredEquipment);
}

// Global functions for HTML onclick handlers
window.viewEquipment = function(equipmentId) {
    const equipment = equipmentData.find(item => item.id === equipmentId);
    if (!equipment) return;
    
    const modalBody = document.getElementById('equipmentModalBody');
    if (!modalBody) return;
    
    // Mock maintenance history
    const maintenanceHistory = [
        {
            date: "2025-07-15",
            type: "Định kỳ",
            technician: "Nguyễn Văn A",
            status: "completed",
            description: "Bảo trì định kỳ theo lịch"
        },
        {
            date: "2025-04-15",
            type: "Cơ khí",
            technician: "Trần Thị B",
            status: "completed",
            description: "Thay thế bạc đạn và bôi trơn"
        },
        {
            date: "2025-01-15",
            type: "Điện",
            technician: "Lê Văn C",
            status: "completed",
            description: "Kiểm tra hệ thống điện"
        }
    ];
    
    modalBody.innerHTML = `
        <div class="equipment-detail">
            <div class="equipment-info-section">
                <h6><i class="bi bi-info-circle"></i> Thông Tin Cơ Bản</h6>
                <div class="info-item">
                    <span class="info-label">Mã thiết bị:</span>
                    <span class="info-value">${equipment.id}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Tên thiết bị:</span>
                    <span class="info-value">${equipment.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Bộ phận:</span>
                    <span class="info-value">${equipment.department}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Vị trí:</span>
                    <span class="info-value">${equipment.location}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Trạng thái:</span>
                    <span class="info-value">
                        <span class="status-badge status-${equipment.status}">
                            ${getStatusText(equipment.status)}
                        </span>
                    </span>
                </div>
            </div>
            
            <div class="equipment-info-section">
                <h6><i class="bi bi-gear"></i> Thông Tin Kỹ Thuật</h6>
                <div class="info-item">
                    <span class="info-label">Nhà sản xuất:</span>
                    <span class="info-value">${equipment.manufacturer}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Model:</span>
                    <span class="info-value">${equipment.model}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Số seri:</span>
                    <span class="info-value">${equipment.serialNumber}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Giờ hoạt động:</span>
                    <span class="info-value">${equipment.operatingHours.toLocaleString()}h</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Bảo hành đến:</span>
                    <span class="info-value">${formatDate(equipment.warrantyExpiry)}</span>
                </div>
            </div>
            
            <div class="equipment-info-section">
                <h6><i class="bi bi-calendar-check"></i> Lịch Bảo Trì</h6>
                <div class="info-item">
                    <span class="info-label">Bảo trì gần nhất:</span>
                    <span class="info-value">${formatDate(equipment.lastMaintenance)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Loại bảo trì:</span>
                    <span class="info-value">${equipment.lastType}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Bảo trì tiếp theo:</span>
                    <span class="info-value">${formatDate(equipment.nextMaintenance)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Chu kỳ bảo trì:</span>
                    <span class="info-value">${equipment.maintenanceInterval} ngày</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Mức độ quan trọng:</span>
                    <span class="info-value">${getCriticalityText(equipment.criticality)}</span>
                </div>
            </div>
            
            <div class="equipment-info-section">
                <h6><i class="bi bi-clock-history"></i> Lịch Sử Bảo Trì</h6>
                <div class="maintenance-history">
                    ${maintenanceHistory.map(maintenance => `
                        <div class="maintenance-item">
                            <div class="maintenance-info">
                                <h6>${maintenance.type} - ${formatDate(maintenance.date)}</h6>
                                <p>${maintenance.description} • ${maintenance.technician}</p>
                            </div>
                            <div class="maintenance-status ${maintenance.status}">
                                ${getStatusText(maintenance.status)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('equipmentModal'));
    modal.show();
};

window.editEquipment = function(equipmentId) {
    const equipment = equipmentData.find(item => item.id === equipmentId);
    if (!equipment) return;
    
    // Populate edit form with equipment data
    document.getElementById('editEquipmentId').value = equipment.id;
    document.getElementById('editEquipmentName').value = equipment.name;
    document.getElementById('editEquipmentDepartment').value = equipment.department;
    document.getElementById('editEquipmentStatus').value = equipment.status;
    document.getElementById('editEquipmentLocation').value = equipment.location;
    document.getElementById('editEquipmentCriticality').value = equipment.criticality;
    document.getElementById('editEquipmentManufacturer').value = equipment.manufacturer;
    document.getElementById('editEquipmentModel').value = equipment.model;
    document.getElementById('editEquipmentSerialNumber').value = equipment.serialNumber;
    document.getElementById('editEquipmentMaintenanceInterval').value = equipment.maintenanceInterval;
    document.getElementById('editEquipmentWarrantyExpiry').value = equipment.warrantyExpiry;
    document.getElementById('editEquipmentOperatingHours').value = equipment.operatingHours;
    
    // Show edit modal
    const modal = new bootstrap.Modal(document.getElementById('editEquipmentModal'));
    modal.show();
};

window.deleteEquipment = function(equipmentId) {
    if (confirm(`Bạn có chắc chắn muốn xóa thiết bị ${equipmentId}?`)) {
        alert(`Đã xóa thiết bị ${equipmentId}`);
    }
};

function saveEditEquipment() {
    const equipmentId = document.getElementById('editEquipmentId').value;
    const equipment = equipmentData.find(item => item.id === equipmentId);
    
    if (!equipment) {
        alert('Không tìm thấy thiết bị để cập nhật');
        return;
    }
    
    // Validate form
    const form = document.getElementById('editEquipmentForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Update equipment data
    equipment.name = document.getElementById('editEquipmentName').value;
    equipment.department = document.getElementById('editEquipmentDepartment').value;
    equipment.status = document.getElementById('editEquipmentStatus').value;
    equipment.location = document.getElementById('editEquipmentLocation').value;
    equipment.criticality = document.getElementById('editEquipmentCriticality').value;
    equipment.manufacturer = document.getElementById('editEquipmentManufacturer').value;
    equipment.model = document.getElementById('editEquipmentModel').value;
    equipment.serialNumber = document.getElementById('editEquipmentSerialNumber').value;
    equipment.maintenanceInterval = parseInt(document.getElementById('editEquipmentMaintenanceInterval').value);
    equipment.warrantyExpiry = document.getElementById('editEquipmentWarrantyExpiry').value;
    equipment.operatingHours = parseInt(document.getElementById('editEquipmentOperatingHours').value);
    
    // Refresh table
    renderEquipmentTable(equipmentData);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editEquipmentModal'));
    modal.hide();
    
    // Show success message
    alert(`Đã cập nhật thành công thiết bị ${equipmentId}`);
}

function getStatusText(status) {
    // Get localized text from data attributes
    const statusTexts = {
        'active': document.querySelector('[data-status-active]')?.textContent || 'Hoạt động',
        'maintenance': document.querySelector('[data-status-maintenance]')?.textContent || 'Bảo trì',
        'overdue': document.querySelector('[data-status-overdue]')?.textContent || 'Quá hạn',
        'warning': document.querySelector('[data-status-warning]')?.textContent || 'Cảnh báo',
        'completed': 'Hoàn thành',
        'pending': 'Chờ thực hiện'
    };
    
    return statusTexts[status] || 'Không xác định';
}

function getCriticalityText(criticality) {
    switch (criticality) {
        case 'critical':
            return 'Quan trọng';
        case 'high':
            return 'Cao';
        case 'medium':
            return 'Trung bình';
        case 'low':
            return 'Thấp';
        default:
            return 'Không xác định';
    }
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}