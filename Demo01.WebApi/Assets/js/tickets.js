// Tickets JavaScript - Phiếu bảo trì với logic đầy đủ
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tickets page
    initializeTickets();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load tickets data
    loadTicketsData();
});

// Mock Tickets Data - Phiếu bảo trì với logic đầy đủ
const ticketsData = [
    {
        id: "TK001",
        equipment: "Máy cắt vải dù A01",
        equipmentId: "A01",
        createdAt: "2025-10-20",
        responsible: "Nguyễn Văn A",
        type: "internal",
        assignee: "Trần Thị B",
        vendor: null,
        description: "Bảo trì định kỳ máy cắt vải dù theo lịch",
        dueDate: "2025-10-25",
        priority: "medium",
        status: "pending",
        notes: "",
        // Thông tin chi phí và linh kiện
        cost: {
            totalCost: 500000, // Tổng chi phí
            currency: "VND"
        },
        parts: [
            {
                id: "LK001",
                name: "Bạc đạn 6205",
                quantity: 2,
                supplier: "Kho nội bộ"
            },
            {
                id: "LK002", 
                name: "Dầu bôi trơn Mobil",
                quantity: 1,
                supplier: "Kho nội bộ"
            }
        ],
        invoice: {
            number: null, // Số hóa đơn (không áp dụng cho nội bộ)
            date: null, // Ngày hóa đơn
            amount: null // Số tiền hóa đơn
        }
    },
    {
        id: "TK002",
        equipment: "Máy may dù lượn B03",
        equipmentId: "B03",
        createdAt: "2025-10-19",
        responsible: "Lê Văn C",
        type: "external",
        assignee: null,
        vendor: "Công ty ABC",
        description: "Sửa chữa hệ thống điện máy may",
        dueDate: "2025-10-28",
        priority: "high",
        status: "in_progress",
        notes: "Đang chờ phụ tùng từ nhà cung cấp",
        cost: {
            totalCost: 2500000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK003",
                name: "Cảm biến nhiệt độ",
                quantity: 1,
                supplier: "Công ty ABC"
            }
        ],
        invoice: {
            number: "INV-2025-001",
            date: "2025-10-19",
            amount: 2500000
        }
    },
    {
        id: "TK003",
        equipment: "Máy kiểm tra dây cáp C02",
        equipmentId: "C02",
        createdAt: "2025-10-18",
        responsible: "Phạm Văn D",
        type: "internal",
        assignee: "Hoàng Thị E",
        vendor: null,
        description: "Thay thế dây cáp bị hỏng",
        dueDate: "2025-10-22",
        priority: "urgent",
        status: "completed",
        notes: "Đã hoàn thành đúng hạn",
        cost: {
            totalCost: 800000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK004",
                name: "Dây cáp điện 2.5mm",
                quantity: 50,
                supplier: "Kho nội bộ"
            }
        ],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    },
    {
        id: "TK004",
        equipment: "Máy đo độ bền D01",
        equipmentId: "D01",
        createdAt: "2025-10-17",
        responsible: "Nguyễn Văn A",
        type: "external",
        assignee: null,
        vendor: "Công ty XYZ",
        description: "Hiệu chuẩn máy đo độ bền",
        dueDate: "2025-10-30",
        priority: "low",
        status: "scheduled",
        notes: "Đã lên lịch với nhà cung cấp",
        cost: {
            totalCost: 1500000,
            currency: "VND"
        },
        parts: [],
        invoice: {
            number: "INV-2025-002",
            date: "2025-10-17",
            amount: 1500000
        }
    },
    {
        id: "TK005",
        equipment: "Máy cắt laser E05",
        equipmentId: "E05",
        createdAt: "2025-10-16",
        responsible: "Trần Thị B",
        type: "internal",
        assignee: "Lê Văn C",
        vendor: null,
        description: "Bảo trì định kỳ hệ thống laser",
        dueDate: "2025-10-26",
        priority: "medium",
        status: "pending",
        notes: "",
        cost: {
            totalCost: 1200000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK005",
                name: "Bộ lọc không khí",
                quantity: 2,
                supplier: "Kho nội bộ"
            }
        ],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    },
    {
        id: "TK006",
        equipment: "Máy ép nhiệt F02",
        equipmentId: "F02",
        createdAt: "2025-10-15",
        responsible: "Hoàng Thị E",
        type: "external",
        assignee: null,
        vendor: "Công ty DEF",
        description: "Sửa chữa hệ thống ép nhiệt",
        dueDate: "2025-10-29",
        priority: "high",
        status: "in_progress",
        notes: "Đang chờ phụ tùng từ nhà cung cấp",
        cost: {
            totalCost: 3000000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK006",
                name: "Bộ điều khiển nhiệt độ",
                quantity: 1,
                supplier: "Công ty DEF"
            }
        ],
        invoice: {
            number: "INV-2025-003",
            date: "2025-10-15",
            amount: 3000000
        }
    },
    {
        id: "TK007",
        equipment: "Máy đóng gói G03",
        equipmentId: "G03",
        createdAt: "2025-10-14",
        responsible: "Lê Văn C",
        type: "internal",
        assignee: "Phạm Văn D",
        vendor: null,
        description: "Thay thế băng tải bị hỏng",
        dueDate: "2025-10-24",
        priority: "medium",
        status: "completed",
        notes: "Hoàn thành trước hạn",
        cost: {
            totalCost: 600000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK007",
                name: "Băng tải cao su",
                quantity: 1,
                supplier: "Kho nội bộ"
            }
        ],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    },
    {
        id: "TK008",
        equipment: "Máy kiểm tra chất lượng H01",
        equipmentId: "H01",
        createdAt: "2025-10-13",
        responsible: "Phạm Văn D",
        type: "external",
        assignee: null,
        vendor: "Công ty ABC",
        description: "Hiệu chuẩn máy kiểm tra chất lượng",
        dueDate: "2025-10-31",
        priority: "low",
        status: "scheduled",
        notes: "Đã lên lịch với nhà cung cấp",
        cost: {
            totalCost: 2000000,
            currency: "VND"
        },
        parts: [],
        invoice: {
            number: "INV-2025-004",
            date: "2025-10-13",
            amount: 2000000
        }
    },
    {
        id: "TK009",
        equipment: "Máy cắt vải dù A02",
        equipmentId: "A02",
        createdAt: "2025-10-12",
        responsible: "Nguyễn Văn A",
        type: "internal",
        assignee: "Trần Thị B",
        vendor: null,
        description: "Bảo trì định kỳ máy cắt vải dù",
        dueDate: "2025-10-27",
        priority: "medium",
        status: "pending",
        notes: "",
        cost: {
            totalCost: 400000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK008",
                name: "Dao cắt",
                quantity: 1,
                supplier: "Kho nội bộ"
            }
        ],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    },
    {
        id: "TK010",
        equipment: "Máy may dù lượn B04",
        equipmentId: "B04",
        createdAt: "2025-10-11",
        responsible: "Trần Thị B",
        type: "external",
        assignee: null,
        vendor: "Công ty XYZ",
        description: "Sửa chữa hệ thống điều khiển",
        dueDate: "2025-11-01",
        priority: "high",
        status: "in_progress",
        notes: "Đang chờ phụ tùng từ nhà cung cấp",
        cost: {
            totalCost: 1800000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK009",
                name: "Bộ điều khiển PLC",
                quantity: 1,
                supplier: "Công ty XYZ"
            }
        ],
        invoice: {
            number: "INV-2025-005",
            date: "2025-10-11",
            amount: 1800000
        }
    },
    {
        id: "TK011",
        equipment: "Máy kiểm tra dây cáp C03",
        equipmentId: "C03",
        createdAt: "2025-10-10",
        responsible: "Hoàng Thị E",
        type: "internal",
        assignee: "Lê Văn C",
        vendor: null,
        description: "Thay thế cảm biến bị hỏng",
        dueDate: "2025-10-23",
        priority: "urgent",
        status: "completed",
        notes: "Đã hoàn thành đúng hạn",
        cost: {
            totalCost: 700000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK010",
                name: "Cảm biến áp suất",
                quantity: 1,
                supplier: "Kho nội bộ"
            }
        ],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    },
    {
        id: "TK012",
        equipment: "Máy đo độ bền D02",
        equipmentId: "D02",
        createdAt: "2025-10-09",
        responsible: "Lê Văn C",
        type: "external",
        assignee: null,
        vendor: "Công ty DEF",
        description: "Hiệu chuẩn máy đo độ bền",
        dueDate: "2025-11-02",
        priority: "low",
        status: "scheduled",
        notes: "Đã lên lịch với nhà cung cấp",
        cost: {
            totalCost: 1600000,
            currency: "VND"
        },
        parts: [],
        invoice: {
            number: "INV-2025-006",
            date: "2025-10-09",
            amount: 1600000
        }
    },
    {
        id: "TK013",
        equipment: "Máy cắt laser E06",
        equipmentId: "E06",
        createdAt: "2025-10-08",
        responsible: "Phạm Văn D",
        type: "internal",
        assignee: "Hoàng Thị E",
        vendor: null,
        description: "Bảo trì định kỳ hệ thống laser",
        dueDate: "2025-10-28",
        priority: "medium",
        status: "pending",
        notes: "",
        cost: {
            totalCost: 1100000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK011",
                name: "Bộ lọc không khí",
                quantity: 2,
                supplier: "Kho nội bộ"
            }
        ],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    },
    {
        id: "TK014",
        equipment: "Máy ép nhiệt F03",
        equipmentId: "F03",
        createdAt: "2025-10-07",
        responsible: "Nguyễn Văn A",
        type: "external",
        assignee: null,
        vendor: "Công ty ABC",
        description: "Sửa chữa hệ thống ép nhiệt",
        dueDate: "2025-11-03",
        priority: "high",
        status: "in_progress",
        notes: "Đang chờ phụ tùng từ nhà cung cấp",
        cost: {
            totalCost: 2800000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK012",
                name: "Bộ điều khiển nhiệt độ",
                quantity: 1,
                supplier: "Công ty ABC"
            }
        ],
        invoice: {
            number: "INV-2025-007",
            date: "2025-10-07",
            amount: 2800000
        }
    },
    {
        id: "TK015",
        equipment: "Máy đóng gói G04",
        equipmentId: "G04",
        createdAt: "2025-10-06",
        responsible: "Trần Thị B",
        type: "internal",
        assignee: "Phạm Văn D",
        vendor: null,
        description: "Thay thế băng tải bị hỏng",
        dueDate: "2025-10-26",
        priority: "medium",
        status: "completed",
        notes: "Hoàn thành trước hạn",
        cost: {
            totalCost: 550000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK013",
                name: "Băng tải cao su",
                quantity: 1,
                supplier: "Kho nội bộ"
            }
        ],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    },
    {
        id: "TK016",
        equipment: "Máy kiểm tra chất lượng H02",
        equipmentId: "H02",
        createdAt: "2025-10-05",
        responsible: "Hoàng Thị E",
        type: "external",
        assignee: null,
        vendor: "Công ty XYZ",
        description: "Hiệu chuẩn máy kiểm tra chất lượng",
        dueDate: "2025-11-04",
        priority: "low",
        status: "scheduled",
        notes: "Đã lên lịch với nhà cung cấp",
        cost: {
            totalCost: 1900000,
            currency: "VND"
        },
        parts: [],
        invoice: {
            number: "INV-2025-008",
            date: "2025-10-05",
            amount: 1900000
        }
    },
    {
        id: "TK017",
        equipment: "Máy cắt vải dù A03",
        equipmentId: "A03",
        createdAt: "2025-10-04",
        responsible: "Lê Văn C",
        type: "internal",
        assignee: "Trần Thị B",
        vendor: null,
        description: "Bảo trì định kỳ máy cắt vải dù",
        dueDate: "2025-10-29",
        priority: "medium",
        status: "pending",
        notes: "",
        cost: {
            totalCost: 450000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK014",
                name: "Dao cắt",
                quantity: 1,
                supplier: "Kho nội bộ"
            }
        ],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    },
    {
        id: "TK018",
        equipment: "Máy may dù lượn B05",
        equipmentId: "B05",
        createdAt: "2025-10-03",
        responsible: "Phạm Văn D",
        type: "external",
        assignee: null,
        vendor: "Công ty DEF",
        description: "Sửa chữa hệ thống điều khiển",
        dueDate: "2025-11-05",
        priority: "high",
        status: "in_progress",
        notes: "Đang chờ phụ tùng từ nhà cung cấp",
        cost: {
            totalCost: 2200000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK015",
                name: "Bộ điều khiển PLC",
                quantity: 1,
                supplier: "Công ty DEF"
            }
        ],
        invoice: {
            number: "INV-2025-009",
            date: "2025-10-03",
            amount: 2200000
        }
    },
    {
        id: "TK019",
        equipment: "Máy kiểm tra dây cáp C04",
        equipmentId: "C04",
        createdAt: "2025-10-02",
        responsible: "Nguyễn Văn A",
        type: "internal",
        assignee: "Hoàng Thị E",
        vendor: null,
        description: "Thay thế cảm biến bị hỏng",
        dueDate: "2025-10-25",
        priority: "urgent",
        status: "completed",
        notes: "Đã hoàn thành đúng hạn",
        cost: {
            totalCost: 650000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK016",
                name: "Cảm biến áp suất",
                quantity: 1,
                supplier: "Kho nội bộ"
            }
        ],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    },
    {
        id: "TK020",
        equipment: "Máy đo độ bền D03",
        equipmentId: "D03",
        createdAt: "2025-10-01",
        responsible: "Trần Thị B",
        type: "external",
        assignee: null,
        vendor: "Công ty ABC",
        description: "Hiệu chuẩn máy đo độ bền",
        dueDate: "2025-11-06",
        priority: "low",
        status: "scheduled",
        notes: "Đã lên lịch với nhà cung cấp",
        cost: {
            totalCost: 1700000,
            currency: "VND"
        },
        parts: [],
        invoice: {
            number: "INV-2025-010",
            date: "2025-10-01",
            amount: 1700000
        }
    },
    {
        id: "TK021",
        equipment: "Máy cắt laser E07",
        equipmentId: "E07",
        createdAt: "2025-09-30",
        responsible: "Hoàng Thị E",
        type: "internal",
        assignee: "Lê Văn C",
        vendor: null,
        description: "Bảo trì định kỳ hệ thống laser",
        dueDate: "2025-10-30",
        priority: "medium",
        status: "pending",
        notes: "",
        cost: {
            totalCost: 1300000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK017",
                name: "Bộ lọc không khí",
                quantity: 2,
                supplier: "Kho nội bộ"
            }
        ],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    },
    {
        id: "TK022",
        equipment: "Máy ép nhiệt F04",
        equipmentId: "F04",
        createdAt: "2025-09-29",
        responsible: "Lê Văn C",
        type: "external",
        assignee: null,
        vendor: "Công ty XYZ",
        description: "Sửa chữa hệ thống ép nhiệt",
        dueDate: "2025-11-07",
        priority: "high",
        status: "in_progress",
        notes: "Đang chờ phụ tùng từ nhà cung cấp",
        cost: {
            totalCost: 3200000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK018",
                name: "Bộ điều khiển nhiệt độ",
                quantity: 1,
                supplier: "Công ty XYZ"
            }
        ],
        invoice: {
            number: "INV-2025-011",
            date: "2025-09-29",
            amount: 3200000
        }
    },
    {
        id: "TK023",
        equipment: "Máy đóng gói G05",
        equipmentId: "G05",
        createdAt: "2025-09-28",
        responsible: "Phạm Văn D",
        type: "internal",
        assignee: "Trần Thị B",
        vendor: null,
        description: "Thay thế băng tải bị hỏng",
        dueDate: "2025-10-28",
        priority: "medium",
        status: "completed",
        notes: "Hoàn thành trước hạn",
        cost: {
            totalCost: 580000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK019",
                name: "Băng tải cao su",
                quantity: 1,
                supplier: "Kho nội bộ"
            }
        ],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    },
    {
        id: "TK024",
        equipment: "Máy kiểm tra chất lượng H03",
        equipmentId: "H03",
        createdAt: "2025-09-27",
        responsible: "Nguyễn Văn A",
        type: "external",
        assignee: null,
        vendor: "Công ty DEF",
        description: "Hiệu chuẩn máy kiểm tra chất lượng",
        dueDate: "2025-11-08",
        priority: "low",
        status: "scheduled",
        notes: "Đã lên lịch với nhà cung cấp",
        cost: {
            totalCost: 2100000,
            currency: "VND"
        },
        parts: [],
        invoice: {
            number: "INV-2025-012",
            date: "2025-09-27",
            amount: 2100000
        }
    },
    {
        id: "TK025",
        equipment: "Máy cắt vải dù A04",
        equipmentId: "A04",
        createdAt: "2025-09-26",
        responsible: "Trần Thị B",
        type: "internal",
        assignee: "Hoàng Thị E",
        vendor: null,
        description: "Bảo trì định kỳ máy cắt vải dù",
        dueDate: "2025-10-31",
        priority: "medium",
        status: "pending",
        notes: "",
        cost: {
            totalCost: 420000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK020",
                name: "Dao cắt",
                quantity: 1,
                supplier: "Kho nội bộ"
            }
        ],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    },
    {
        id: "TK026",
        equipment: "Máy ép nhiệt F06",
        equipmentId: "F06",
        createdAt: "2025-09-25",
        responsible: "Trần Thị B",
        type: "internal",
        assignee: "Lê Văn C",
        vendor: null,
        description: "Bảo trì định kỳ hệ thống ép nhiệt",
        dueDate: "2025-10-05",
        priority: "high",
        status: "cancelled",
        notes: "Hủy do thiết bị ngừng hoạt động tạm thời",
        cost: {
            totalCost: 0,
            currency: "VND"
        },
        parts: [],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    },
    {
        id: "TK027",
        equipment: "Máy kiểm tra chất lượng H06",
        equipmentId: "H06",
        createdAt: "2025-09-20",
        responsible: "Hoàng Thị E",
        type: "internal",
        assignee: "Phạm Văn D",
        vendor: null,
        description: "Thay thế cảm biến bị hỏng",
        dueDate: "2025-09-28",
        priority: "urgent",
        status: "overdue",
        notes: "Quá hạn do thiếu linh kiện thay thế",
        cost: {
            totalCost: 850000,
            currency: "VND"
        },
        parts: [
            {
                id: "LK021",
                name: "Cảm biến nhiệt độ",
                quantity: 1,
                supplier: "Kho nội bộ"
            }
        ],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    },
    {
        id: "TK028",
        equipment: "Máy cắt vải dù A07",
        equipmentId: "A07",
        createdAt: "2025-09-15",
        responsible: "Lê Văn C",
        type: "external",
        assignee: null,
        vendor: "Công ty GHI",
        description: "Sửa chữa hệ thống điều khiển",
        dueDate: "2025-09-25",
        priority: "high",
        status: "overdue",
        notes: "Quá hạn do nhà cung cấp chậm trễ",
        cost: {
            totalCost: 3500000,
            currency: "VND"
        },
        parts: [],
        invoice: {
            number: "INV-2025-013",
            date: "2025-09-15",
            amount: 3500000
        }
    },
    {
        id: "TK029",
        equipment: "Máy may dù lượn B07",
        equipmentId: "B07",
        createdAt: "2025-09-10",
        responsible: "Phạm Văn D",
        type: "internal",
        assignee: "Trần Thị B",
        vendor: null,
        description: "Bảo trì định kỳ máy may dù lượn",
        dueDate: "2025-09-20",
        priority: "medium",
        status: "cancelled",
        notes: "Hủy do thiết bị được thay thế bằng máy mới",
        cost: {
            totalCost: 0,
            currency: "VND"
        },
        parts: [],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    },
    {
        id: "TK030",
        equipment: "Máy đóng gói G08",
        equipmentId: "G08",
        createdAt: "2025-09-05",
        responsible: "Nguyễn Văn A",
        type: "external",
        assignee: null,
        vendor: "Công ty JKL",
        description: "Hiệu chuẩn máy đóng gói tự động",
        dueDate: "2025-10-18",
        priority: "low",
        status: "scheduled",
        notes: "Đã lên lịch với nhà cung cấp vào ngày 18/10",
        cost: {
            totalCost: 1500000,
            currency: "VND"
        },
        parts: [],
        invoice: {
            number: "INV-2025-014",
            date: "2025-09-05",
            amount: 1500000
        }
    }
];

// Initialize tickets page
function initializeTickets() {
    // Set default date for new tickets
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('ticketDate').value = today;
    
    // Set default due date (7 days from today)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    document.getElementById('ticketDueDate').value = dueDate.toISOString().split('T')[0];
}

// Setup event listeners
function setupEventListeners() {
    // Create ticket button
    document.getElementById('createTicketBtn').addEventListener('click', function() {
        const modal = new bootstrap.Modal(document.getElementById('createTicketModal'));
        modal.show();
    });
    
    // Submit ticket
    document.getElementById('submitTicket').addEventListener('click', handleSubmitTicket);
    
    // Update ticket
    document.getElementById('updateTicket').addEventListener('click', handleUpdateTicket);
    
    // Maintenance type change
    document.getElementById('ticketType').addEventListener('change', function() {
        const type = this.value;
        const internalSection = document.getElementById('internalAssigneeSection');
        const externalSection = document.getElementById('externalVendorSection');
        
        if (type === 'internal') {
            internalSection.style.display = 'block';
            externalSection.style.display = 'none';
        } else if (type === 'external') {
            internalSection.style.display = 'none';
            externalSection.style.display = 'block';
        } else {
            internalSection.style.display = 'none';
            externalSection.style.display = 'none';
        }
    });
    
    // Edit maintenance type change
    document.getElementById('editTicketType').addEventListener('change', function() {
        const type = this.value;
        const internalSection = document.getElementById('editInternalAssigneeSection');
        const externalSection = document.getElementById('editExternalVendorSection');
        
        if (type === 'internal') {
            internalSection.style.display = 'block';
            externalSection.style.display = 'none';
        } else if (type === 'external') {
            internalSection.style.display = 'none';
            externalSection.style.display = 'block';
        } else {
            internalSection.style.display = 'none';
            externalSection.style.display = 'none';
        }
    });
}

// Load tickets data
function loadTicketsData() {
    renderTicketsTable(ticketsData);
}

// Render tickets table
function renderTicketsTable(tickets) {
    const tbody = document.getElementById('ticketsTable');
    tbody.innerHTML = '';
    
    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        
        // Determine assignee/vendor display
        let assigneeDisplay = '';
        if (ticket.type === 'internal') {
            assigneeDisplay = ticket.assignee || 'Chưa phân công';
        } else if (ticket.type === 'external') {
            assigneeDisplay = ticket.vendor || 'Chưa chọn NCC';
        }
        
        row.innerHTML = `
            <td><strong>${ticket.id}</strong></td>
            <td>${ticket.equipment}</td>
            <td>${ticket.responsible}</td>
            <td>${ticket.createdAt}</td>
            <td>
                <span class="badge ${ticket.type === 'internal' ? 'bg-primary' : 'bg-info'}">
                    ${ticket.type === 'internal' ? 'Nội bộ' : 'Bên ngoài'}
                </span>
            </td>
            <td>${assigneeDisplay}</td>
            <td>
                <span class="priority-badge priority-${ticket.priority}">
                    ${getPriorityText(ticket.priority)}
                </span>
            </td>
            <td>
                <span class="status-badge status-${ticket.status}">
                    ${getStatusText(ticket.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewTicket('${ticket.id}')" title="Xem chi tiết">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="editTicket('${ticket.id}')" title="Chỉnh sửa">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTicket('${ticket.id}')" title="Xóa">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Handle submit ticket
function handleSubmitTicket() {
    const form = document.getElementById('createTicketForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const formData = {
        equipment: document.getElementById('ticketEquipment').value,
        createdAt: document.getElementById('ticketDate').value,
        responsible: document.getElementById('ticketResponsible').value,
        type: document.getElementById('ticketType').value,
        assignee: document.getElementById('ticketAssignee').value,
        vendor: document.getElementById('ticketVendor').value,
        description: document.getElementById('ticketDescription').value,
        dueDate: document.getElementById('ticketDueDate').value,
        priority: document.getElementById('ticketPriority').value
    };
    
    // Generate new ticket ID
    const newId = `TK${String(ticketsData.length + 1).padStart(3, '0')}`;
    
    // Create new ticket
    const newTicket = {
        id: newId,
        equipment: formData.equipment,
        equipmentId: formData.equipment.split(' ').pop(),
        createdAt: formData.createdAt,
        responsible: formData.responsible,
        type: formData.type,
        assignee: formData.type === 'internal' ? formData.assignee : null,
        vendor: formData.type === 'external' ? formData.vendor : null,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        status: 'pending',
        notes: '',
        cost: {
            totalCost: 0,
            currency: 'VND'
        },
        parts: [],
        invoice: {
            number: null,
            date: null,
            amount: null
        }
    };
    
    // Add to tickets data
    ticketsData.push(newTicket);
    
    // Refresh table
    renderTicketsTable(ticketsData);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('createTicketModal'));
    modal.hide();
    
    // Reset form
    form.reset();
    initializeTickets();
    
    // Show success message
    alert(`Đã tạo phiếu bảo trì ${newId} thành công!`);
}

// Handle update ticket
function handleUpdateTicket() {
    const form = document.getElementById('editTicketForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const ticketId = document.getElementById('editTicketId').value;
    const ticketIndex = ticketsData.findIndex(ticket => ticket.id === ticketId);
    
    if (ticketIndex === -1) {
        alert('Không tìm thấy phiếu bảo trì để cập nhật');
        return;
    }
    
    // Get form data
    const formData = {
        equipment: document.getElementById('editTicketEquipment').value,
        createdAt: document.getElementById('editTicketDate').value,
        responsible: document.getElementById('editTicketResponsible').value,
        type: document.getElementById('editTicketType').value,
        assignee: document.getElementById('editTicketAssignee').value,
        vendor: document.getElementById('editTicketVendor').value,
        description: document.getElementById('editTicketDescription').value,
        dueDate: document.getElementById('editTicketDueDate').value,
        priority: document.getElementById('editTicketPriority').value,
        status: document.getElementById('editTicketStatus').value,
        notes: document.getElementById('editTicketNotes').value
    };
    
    // Update ticket data
    ticketsData[ticketIndex] = {
        ...ticketsData[ticketIndex],
        equipment: formData.equipment,
        equipmentId: formData.equipment.split(' ').pop(),
        createdAt: formData.createdAt,
        responsible: formData.responsible,
        type: formData.type,
        assignee: formData.type === 'internal' ? formData.assignee : null,
        vendor: formData.type === 'external' ? formData.vendor : null,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        status: formData.status,
        notes: formData.notes
    };
    
    // Refresh table
    renderTicketsTable(ticketsData);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editTicketModal'));
    modal.hide();
    
    // Show success message
    alert(`Đã cập nhật phiếu bảo trì ${ticketId} thành công!`);
}

// View ticket details
window.viewTicket = function(ticketId) {
    const ticket = ticketsData.find(t => t.id === ticketId);
    if (!ticket) return;
    
    const modalBody = document.getElementById('ticketDetailModalBody');
    
    // Determine assignee/vendor display
    let assigneeDisplay = '';
    if (ticket.type === 'internal') {
        assigneeDisplay = ticket.assignee || 'Chưa phân công';
    } else if (ticket.type === 'external') {
        assigneeDisplay = ticket.vendor || 'Chưa chọn NCC';
    }
    
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="ticket-info-section">
                    <h6><i class="bi bi-ticket-detailed"></i> Thông tin phiếu</h6>
                    <p><strong>Mã phiếu:</strong> ${ticket.id}</p>
                    <p><strong>Thiết bị:</strong> ${ticket.equipment}</p>
                    <p><strong>Người chịu trách nhiệm:</strong> ${ticket.responsible}</p>
                    <p><strong>Ngày lập:</strong> ${ticket.createdAt}</p>
                    <p><strong>Hạn hoàn thành:</strong> ${ticket.dueDate}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="ticket-info-section">
                    <h6><i class="bi bi-gear"></i> Thông tin bảo trì</h6>
                    <p><strong>Loại bảo trì:</strong> 
                        <span class="badge ${ticket.type === 'internal' ? 'bg-primary' : 'bg-info'}">
                            ${ticket.type === 'internal' ? 'Nội bộ' : 'Bên ngoài'}
                        </span>
                    </p>
                    <p><strong>Người thực hiện:</strong> ${assigneeDisplay}</p>
                    <p><strong>Mức độ ưu tiên:</strong> 
                        <span class="priority-badge priority-${ticket.priority}">
                            ${getPriorityText(ticket.priority)}
                        </span>
                    </p>
                    <p><strong>Trạng thái:</strong> 
                        <span class="status-badge status-${ticket.status}">
                            ${getStatusText(ticket.status)}
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="ticket-info-section">
                    <h6><i class="bi bi-file-text"></i> Mô tả công việc</h6>
                    <p>${ticket.description}</p>
                </div>
            </div>
        </div>
        ${ticket.notes ? `
        <div class="row">
            <div class="col-12">
                <div class="ticket-info-section">
                    <h6><i class="bi bi-sticky"></i> Ghi chú</h6>
                    <p>${ticket.notes}</p>
                </div>
            </div>
        </div>
        ` : ''}
        ${ticket.parts && ticket.parts.length > 0 ? `
        <div class="row">
            <div class="col-12">
                <div class="ticket-info-section">
                    <h6><i class="bi bi-box-seam"></i> Linh kiện sử dụng</h6>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Mã linh kiện</th>
                                    <th>Tên linh kiện</th>
                                    <th>Số lượng</th>
                                    <th>Nhà cung cấp</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ticket.parts.map(part => `
                                    <tr>
                                        <td>${part.id}</td>
                                        <td>${part.name}</td>
                                        <td>${part.quantity}</td>
                                        <td>${part.supplier}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        ` : ''}
        ${ticket.cost && ticket.cost.totalCost > 0 ? `
        <div class="row">
            <div class="col-12">
                <div class="ticket-info-section">
                    <h6><i class="bi bi-currency-dollar"></i> Thông tin chi phí</h6>
                    <p><strong>Tổng chi phí:</strong> ${ticket.cost.totalCost.toLocaleString('vi-VN')} ${ticket.cost.currency}</p>
                    ${ticket.invoice && ticket.invoice.number ? `
                        <p><strong>Số hóa đơn:</strong> ${ticket.invoice.number}</p>
                        <p><strong>Ngày hóa đơn:</strong> ${ticket.invoice.date}</p>
                        <p><strong>Số tiền hóa đơn:</strong> ${ticket.invoice.amount.toLocaleString('vi-VN')} ${ticket.cost.currency}</p>
                    ` : ''}
                </div>
            </div>
        </div>
        ` : ''}
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('ticketDetailModal'));
    modal.show();
};

// Edit ticket
window.editTicket = function(ticketId) {
    const ticket = ticketsData.find(t => t.id === ticketId);
    if (!ticket) return;
    
    // Populate edit form
    document.getElementById('editTicketId').value = ticket.id;
    document.getElementById('editTicketEquipment').value = ticket.equipment;
    document.getElementById('editTicketDate').value = ticket.createdAt;
    document.getElementById('editTicketResponsible').value = ticket.responsible;
    document.getElementById('editTicketType').value = ticket.type;
    document.getElementById('editTicketAssignee').value = ticket.assignee || '';
    document.getElementById('editTicketVendor').value = ticket.vendor || '';
    document.getElementById('editTicketDescription').value = ticket.description;
    document.getElementById('editTicketDueDate').value = ticket.dueDate;
    document.getElementById('editTicketPriority').value = ticket.priority;
    document.getElementById('editTicketStatus').value = ticket.status;
    document.getElementById('editTicketNotes').value = ticket.notes || '';
    
    // Show/hide sections based on type
    const type = ticket.type;
    const internalSection = document.getElementById('editInternalAssigneeSection');
    const externalSection = document.getElementById('editExternalVendorSection');
    
    if (type === 'internal') {
        internalSection.style.display = 'block';
        externalSection.style.display = 'none';
    } else if (type === 'external') {
        internalSection.style.display = 'none';
        externalSection.style.display = 'block';
    } else {
        internalSection.style.display = 'none';
        externalSection.style.display = 'none';
    }
    
    const modal = new bootstrap.Modal(document.getElementById('editTicketModal'));
    modal.show();
};

// Delete ticket
window.deleteTicket = function(ticketId) {
    if (confirm('Bạn có chắc chắn muốn xóa phiếu bảo trì này?')) {
        const index = ticketsData.findIndex(ticket => ticket.id === ticketId);
        if (index > -1) {
            ticketsData.splice(index, 1);
            renderTicketsTable(ticketsData);
            alert(`Đã xóa phiếu bảo trì ${ticketId} thành công!`);
        }
    }
};

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
        case 'in_progress':
            return 'Đang thực hiện';
        case 'completed':
            return 'Hoàn thành';
        case 'cancelled':
            return 'Đã hủy';
        case 'scheduled':
            return 'Đã lên lịch';
        case 'overdue':
            return 'Quá hạn';
        default:
            return 'Không xác định';
    }
}

// Get priority text
function getPriorityText(priority) {
    switch (priority) {
        case 'low':
            return 'Thấp';
        case 'medium':
            return 'Trung bình';
        case 'high':
            return 'Cao';
        case 'urgent':
            return 'Khẩn cấp';
        default:
            return 'Không xác định';
    }
}