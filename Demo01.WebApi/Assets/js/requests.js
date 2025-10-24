// Requests JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize requests page
    initializeRequests();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load requests data with delay to ensure it loads last
    setTimeout(() => {
        loadRequestsData();
    }, 500);
});

// Mock Requests Data - 45 yêu cầu bảo trì với đầy đủ trạng thái và lịch sử
const fullRequestsData = [
    {
        id: "YC001",
        equipment: "Máy cắt vải dù A01",
        equipmentId: "A01",
        requester: "Nguyễn Văn A",
        createdAt: "2025-10-20T08:30:00",
        department: "Cắt vải dù",
        impact: "serious",
        description: "Máy cắt không hoạt động, có tiếng động lạ và không cắt được vải",
        image: null,
        status: "pending",
        assignedTo: null,
        deadline: null,
        notes: "",
        history: [
            {
                timestamp: "2025-10-20T08:30:00",
                action: "created",
                user: "Nguyễn Văn A",
                description: "Tạo yêu cầu bảo trì",
                details: "Máy cắt không hoạt động, có tiếng động lạ và không cắt được vải"
            }
        ]
    },
    {
        id: "YC002",
        equipment: "Máy may dù lượn B03",
        equipmentId: "B03",
        requester: "Trần Thị B",
        createdAt: "2025-10-19T14:15:00",
        department: "May dù",
        impact: "medium",
        description: "Kim may bị gãy liên tục, cần kiểm tra và thay thế",
        image: null,
        status: "approved",
        assignedTo: "Lê Văn C",
        deadline: "2025-10-25",
        notes: "Đã phê duyệt và phân công cho kỹ thuật viên",
        history: [
            {
                timestamp: "2025-10-19T14:15:00",
                action: "created",
                user: "Trần Thị B",
                description: "Tạo yêu cầu bảo trì",
                details: "Kim may bị gãy liên tục, cần kiểm tra và thay thế"
            },
            {
                timestamp: "2025-10-19T16:30:00",
                action: "approved",
                user: "Phạm Văn D",
                description: "Phê duyệt yêu cầu",
                details: "Đã phê duyệt và phân công cho Lê Văn C"
            }
        ]
    },
    {
        id: "YC003",
        equipment: "Máy kiểm tra dây cáp C02",
        equipmentId: "C02",
        requester: "Hoàng Thị E",
        createdAt: "2025-10-18T09:45:00",
        department: "Kiểm tra chất lượng",
        impact: "critical",
        description: "Máy kiểm tra không hoạt động, ảnh hưởng đến chất lượng sản phẩm",
        image: null,
        status: "in_progress",
        assignedTo: "Nguyễn Văn A",
        deadline: "2025-10-22",
        notes: "Đang sửa chữa, dự kiến hoàn thành trong 2 ngày",
        history: [
            {
                timestamp: "2025-10-18T09:45:00",
                action: "created",
                user: "Hoàng Thị E",
                description: "Tạo yêu cầu bảo trì",
                details: "Máy kiểm tra không hoạt động, ảnh hưởng đến chất lượng sản phẩm"
            },
            {
                timestamp: "2025-10-18T10:15:00",
                action: "approved",
                user: "Phạm Văn D",
                description: "Phê duyệt yêu cầu",
                details: "Phê duyệt khẩn cấp do ảnh hưởng nghiêm trọng"
            },
            {
                timestamp: "2025-10-18T10:30:00",
                action: "assigned",
                user: "Phạm Văn D",
                description: "Phân công",
                details: "Phân công cho Nguyễn Văn A xử lý ngay"
            },
            {
                timestamp: "2025-10-18T14:00:00",
                action: "in_progress",
                user: "Nguyễn Văn A",
                description: "Bắt đầu sửa chữa",
                details: "Đang kiểm tra và sửa chữa máy kiểm tra"
            }
        ]
    },
    {
        id: "YC004",
        equipment: "Máy đóng gói D01",
        equipmentId: "D01",
        requester: "Lê Văn C",
        createdAt: "2025-10-17T11:20:00",
        department: "Đóng gói",
        impact: "low",
        description: "Băng tải đóng gói chạy chậm, cần bảo trì định kỳ",
        image: null,
        status: "completed",
        assignedTo: "Trần Thị B",
        deadline: "2025-10-20",
        notes: "Đã hoàn thành, máy hoạt động bình thường",
        history: [
            {
                timestamp: "2025-10-17T11:20:00",
                action: "created",
                user: "Lê Văn C",
                description: "Tạo yêu cầu bảo trì",
                details: "Băng tải đóng gói chạy chậm, cần bảo trì định kỳ"
            },
            {
                timestamp: "2025-10-17T14:00:00",
                action: "approved",
                user: "Phạm Văn D",
                description: "Phê duyệt yêu cầu",
                details: "Phê duyệt bảo trì định kỳ"
            },
            {
                timestamp: "2025-10-17T14:15:00",
                action: "assigned",
                user: "Phạm Văn D",
                description: "Phân công",
                details: "Phân công cho Trần Thị B"
            },
            {
                timestamp: "2025-10-18T08:00:00",
                action: "in_progress",
                user: "Trần Thị B",
                description: "Bắt đầu bảo trì",
                details: "Bắt đầu bảo trì băng tải đóng gói"
            },
            {
                timestamp: "2025-10-18T16:30:00",
                action: "completed",
                user: "Trần Thị B",
                description: "Hoàn thành",
                details: "Đã hoàn thành bảo trì, máy hoạt động bình thường"
            }
        ]
    },
    {
        id: "YC005",
        equipment: "Máy ép nhiệt E03",
        equipmentId: "E03",
        requester: "Phạm Văn D",
        createdAt: "2025-10-16T13:10:00",
        department: "Ép nhiệt",
        impact: "serious",
        description: "Máy ép nhiệt không đạt nhiệt độ yêu cầu, sản phẩm bị lỗi",
        image: null,
        status: "rejected",
        assignedTo: null,
        deadline: null,
        notes: "Từ chối do không đủ kinh phí sửa chữa",
        history: [
            {
                timestamp: "2025-10-16T13:10:00",
                action: "created",
                user: "Phạm Văn D",
                description: "Tạo yêu cầu bảo trì",
                details: "Máy ép nhiệt không đạt nhiệt độ yêu cầu, sản phẩm bị lỗi"
            },
            {
                timestamp: "2025-10-16T15:30:00",
                action: "rejected",
                user: "Nguyễn Văn A",
                description: "Từ chối yêu cầu",
                details: "Từ chối do không đủ kinh phí sửa chữa"
            }
        ]
    },
    {
        id: "YC006",
        equipment: "Máy cắt laser F02",
        equipmentId: "F02",
        requester: "Trần Thị B",
        createdAt: "2025-10-15T10:30:00",
        department: "Cắt laser",
        impact: "medium",
        description: "Tia laser yếu, cần hiệu chuẩn lại",
        image: null,
        status: "assigned",
        assignedTo: "Hoàng Thị E",
        deadline: "2025-10-28",
        notes: "Đã phân công, chờ thực hiện",
        history: [
            {
                timestamp: "2025-10-15T10:30:00",
                action: "created",
                user: "Trần Thị B",
                description: "Tạo yêu cầu bảo trì",
                details: "Tia laser yếu, cần hiệu chuẩn lại"
            },
            {
                timestamp: "2025-10-15T14:00:00",
                action: "approved",
                user: "Phạm Văn D",
                description: "Phê duyệt yêu cầu",
                details: "Phê duyệt hiệu chuẩn máy laser"
            },
            {
                timestamp: "2025-10-15T14:15:00",
                action: "assigned",
                user: "Phạm Văn D",
                description: "Phân công",
                details: "Phân công cho Hoàng Thị E"
            }
        ]
    },
    {
        id: "YC007",
        equipment: "Máy đo độ dày G01",
        equipmentId: "G01",
        requester: "Lê Văn C",
        createdAt: "2025-10-14T15:45:00",
        department: "Kiểm tra chất lượng",
        impact: "low",
        description: "Máy đo độ dày cần hiệu chuẩn định kỳ",
        image: null,
        status: "pending",
        assignedTo: null,
        deadline: null,
        notes: "",
        history: [
            {
                timestamp: "2025-10-14T15:45:00",
                action: "created",
                user: "Lê Văn C",
                description: "Tạo yêu cầu bảo trì",
                details: "Máy đo độ dày cần hiệu chuẩn định kỳ"
            }
        ]
    },
    {
        id: "YC008",
        equipment: "Máy kiểm tra màu sắc H03",
        equipmentId: "H03",
        requester: "Hoàng Thị E",
        createdAt: "2025-10-13T09:20:00",
        department: "Kiểm tra chất lượng",
        impact: "serious",
        description: "Máy kiểm tra màu sắc không chính xác, cần sửa chữa",
        image: null,
        status: "in_progress",
        assignedTo: "Nguyễn Văn A",
        deadline: "2025-10-25",
        notes: "Đang chờ phụ tùng từ nhà cung cấp",
        history: [
            {
                timestamp: "2025-10-13T09:20:00",
                action: "created",
                user: "Hoàng Thị E",
                description: "Tạo yêu cầu bảo trì",
                details: "Máy kiểm tra màu sắc không chính xác, cần sửa chữa"
            },
            {
                timestamp: "2025-10-13T11:00:00",
                action: "approved",
                user: "Phạm Văn D",
                description: "Phê duyệt yêu cầu",
                details: "Phê duyệt sửa chữa máy kiểm tra màu sắc"
            },
            {
                timestamp: "2025-10-13T11:15:00",
                action: "assigned",
                user: "Phạm Văn D",
                description: "Phân công",
                details: "Phân công cho Nguyễn Văn A"
            },
            {
                timestamp: "2025-10-13T14:00:00",
                action: "in_progress",
                user: "Nguyễn Văn A",
                description: "Bắt đầu sửa chữa",
                details: "Đang chờ phụ tùng từ nhà cung cấp"
            }
        ]
    },
    {
        id: "YC009",
        equipment: "Máy cắt vải dù A02",
        equipmentId: "A02",
        requester: "Nguyễn Văn A",
        createdAt: "2025-10-12T08:15:00",
        department: "Cắt vải dù",
        impact: "medium",
        description: "Dao cắt bị mòn, cần thay thế",
        image: null,
        status: "completed",
        assignedTo: "Trần Thị B",
        deadline: "2025-10-15",
        notes: "Đã thay dao cắt mới, máy hoạt động tốt",
        history: [
            {
                timestamp: "2025-10-12T08:15:00",
                action: "created",
                user: "Nguyễn Văn A",
                description: "Tạo yêu cầu bảo trì",
                details: "Dao cắt bị mòn, cần thay thế"
            },
            {
                timestamp: "2025-10-12T10:00:00",
                action: "approved",
                user: "Phạm Văn D",
                description: "Phê duyệt yêu cầu",
                details: "Phê duyệt thay dao cắt"
            },
            {
                timestamp: "2025-10-12T10:15:00",
                action: "assigned",
                user: "Phạm Văn D",
                description: "Phân công",
                details: "Phân công cho Trần Thị B"
            },
            {
                timestamp: "2025-10-12T14:00:00",
                action: "in_progress",
                user: "Trần Thị B",
                description: "Bắt đầu thay dao cắt",
                details: "Bắt đầu thay dao cắt mới"
            },
            {
                timestamp: "2025-10-12T16:30:00",
                action: "completed",
                user: "Trần Thị B",
                description: "Hoàn thành",
                details: "Đã thay dao cắt mới, máy hoạt động tốt"
            }
        ]
    },
    {
        id: "YC010",
        equipment: "Máy may dù lượn B04",
        equipmentId: "B04",
        requester: "Trần Thị B",
        createdAt: "2025-10-11T16:30:00",
        department: "May dù",
        impact: "critical",
        description: "Máy may dừng hoạt động hoàn toàn, ảnh hưởng nghiêm trọng đến sản xuất",
        image: null,
        status: "in_progress",
        assignedTo: "Lê Văn C",
        deadline: "2025-10-18",
        notes: "Đang sửa chữa khẩn cấp, dự kiến hoàn thành trong 3 ngày",
        history: [
            {
                timestamp: "2025-10-11T16:30:00",
                action: "created",
                user: "Trần Thị B",
                description: "Tạo yêu cầu bảo trì",
                details: "Máy may dừng hoạt động hoàn toàn, ảnh hưởng nghiêm trọng đến sản xuất"
            },
            {
                timestamp: "2025-10-11T17:00:00",
                action: "approved",
                user: "Phạm Văn D",
                description: "Phê duyệt yêu cầu",
                details: "Phê duyệt khẩn cấp do ảnh hưởng nghiêm trọng"
            },
            {
                timestamp: "2025-10-11T17:15:00",
                action: "assigned",
                user: "Phạm Văn D",
                description: "Phân công",
                details: "Phân công cho Lê Văn C xử lý ngay"
            },
            {
                timestamp: "2025-10-12T08:00:00",
                action: "in_progress",
                user: "Lê Văn C",
                description: "Bắt đầu sửa chữa",
                details: "Đang sửa chữa khẩn cấp, dự kiến hoàn thành trong 3 ngày"
            }
        ]
    }
];

// Initialize requests page
function initializeRequests() {
    // Set default date for new requests
    const today = new Date().toISOString().split('T')[0];
    const requestDateInput = document.getElementById('requestDate');
    if (requestDateInput) {
        requestDateInput.value = today;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Create request button
    const createRequestBtn = document.getElementById('createRequestBtn');
    if (createRequestBtn) {
        createRequestBtn.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('createRequestModal'));
            modal.show();
        });
    }
    
    // Submit request
    const submitRequestBtn = document.getElementById('submitRequest');
    if (submitRequestBtn) {
        submitRequestBtn.addEventListener('click', handleSubmitRequest);
    }
    
    // Update request
    const updateRequestBtn = document.getElementById('updateRequest');
    if (updateRequestBtn) {
        updateRequestBtn.addEventListener('click', handleUpdateRequest);
    }
}

// Load requests data
function loadRequestsData() {
    renderRequestsTable(fullRequestsData);
}

// Render requests table
function renderRequestsTable(requests) {
    const tbody = document.getElementById('requestsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    requests.forEach(request => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><strong>${request.id}</strong></td>
            <td>${request.equipment}</td>
            <td>${request.requester}</td>
            <td>${formatDateTime(request.createdAt)}</td>
            <td>${request.assignedTo || 'Chưa phân công'}</td>
            <td>
                <span class="impact-badge impact-${request.impact}">
                    ${getImpactText(request.impact)}
                </span>
            </td>
            <td>
                <span class="status-badge status-${request.status}">
                    ${getStatusText(request.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewRequest('${request.id}')" title="Xem chi tiết">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="editRequest('${request.id}')" title="Chỉnh sửa">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteRequest('${request.id}')" title="Xóa">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Handle submit request
function handleSubmitRequest() {
    const form = document.getElementById('createRequestForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const formData = {
        equipment: document.getElementById('requestEquipment').value,
        requester: document.getElementById('requestRequester').value,
        department: document.getElementById('requestDepartment').value,
        impact: document.getElementById('requestImpact').value,
        description: document.getElementById('requestDescription').value,
        image: document.getElementById('requestImage').files[0]
    };
    
    // Generate new request ID
    const newId = `YC${String(fullRequestsData.length + 1).padStart(3, '0')}`;
    
    // Create new request
    const newRequest = {
        id: newId,
        equipment: formData.equipment,
        equipmentId: formData.equipment.split(' ').pop(),
        requester: formData.requester,
        createdAt: new Date().toISOString(),
        department: formData.department,
        impact: formData.impact,
        description: formData.description,
        image: formData.image,
        status: 'pending',
        assignedTo: null,
        deadline: null,
        notes: '',
        history: [
            {
                timestamp: new Date().toISOString(),
                action: 'created',
                user: formData.requester,
                description: 'Tạo yêu cầu bảo trì',
                details: formData.description
            }
        ]
    };
    
    // Add to requests data
    fullRequestsData.push(newRequest);
    
    // Refresh table
    renderRequestsTable(fullRequestsData);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('createRequestModal'));
    modal.hide();
    
    // Reset form
    form.reset();
    
    // Show success message
    alert(`Đã tạo yêu cầu bảo trì ${newId} thành công!`);
}

// Handle update request
function handleUpdateRequest() {
    const form = document.getElementById('editRequestForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const requestId = document.getElementById('editRequestId').value;
    const requestIndex = fullRequestsData.findIndex(request => request.id === requestId);
    
    if (requestIndex === -1) {
        alert('Không tìm thấy yêu cầu bảo trì để cập nhật');
        return;
    }
    
    // Get form data
    const formData = {
        equipment: document.getElementById('editRequestEquipment').value,
        requester: document.getElementById('editRequestRequester').value,
        department: document.getElementById('editRequestDepartment').value,
        impact: document.getElementById('editRequestImpact').value,
        description: document.getElementById('editRequestDescription').value,
        assignedTo: document.getElementById('editRequestAssignedTo').value,
        deadline: document.getElementById('editRequestDeadline').value,
        status: document.getElementById('editRequestStatus').value,
        notes: document.getElementById('editRequestNotes').value
    };
    
    // Update request data
    fullRequestsData[requestIndex] = {
        ...fullRequestsData[requestIndex],
        equipment: formData.equipment,
        equipmentId: formData.equipment.split(' ').pop(),
        requester: formData.requester,
        department: formData.department,
        impact: formData.impact,
        description: formData.description,
        assignedTo: formData.assignedTo || null,
        deadline: formData.deadline || null,
        status: formData.status,
        notes: formData.notes
    };
    
    // Add history entry
    fullRequestsData[requestIndex].history.push({
        timestamp: new Date().toISOString(),
        action: 'updated',
        user: 'System',
        description: 'Cập nhật yêu cầu bảo trì',
        details: `Cập nhật thông tin yêu cầu ${requestId}`
    });
    
    // Refresh table
    renderRequestsTable(fullRequestsData);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editRequestModal'));
    modal.hide();
    
    // Show success message
    alert(`Đã cập nhật yêu cầu bảo trì ${requestId} thành công!`);
}

// View request details
window.viewRequest = function(requestId) {
    const request = fullRequestsData.find(r => r.id === requestId);
    if (!request) return;
    
    const modalBody = document.getElementById('requestDetailModalBody');
    
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="request-info-section">
                    <h6><i class="bi bi-info-circle"></i> Thông tin yêu cầu</h6>
                    <p><strong>Mã yêu cầu:</strong> ${request.id}</p>
                    <p><strong>Thiết bị:</strong> ${request.equipment}</p>
                    <p><strong>Người yêu cầu:</strong> ${request.requester}</p>
                    <p><strong>Phòng ban:</strong> ${request.department}</p>
                    <p><strong>Ngày tạo:</strong> ${formatDateTime(request.createdAt)}</p>
                    <p><strong>Hạn chót:</strong> ${request.deadline ? formatDate(request.deadline) : 'Chưa xác định'}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="request-info-section">
                    <h6><i class="bi bi-gear"></i> Thông tin xử lý</h6>
                    <p><strong>Mức độ ảnh hưởng:</strong> 
                        <span class="impact-badge impact-${request.impact}">
                            ${getImpactText(request.impact)}
                        </span>
                    </p>
                    <p><strong>Trạng thái:</strong> 
                        <span class="status-badge status-${request.status}">
                            ${getStatusText(request.status)}
                        </span>
                    </p>
                    <p><strong>Người phụ trách:</strong> ${request.assignedTo || 'Chưa phân công'}</p>
                    <p><strong>Ghi chú:</strong> ${request.notes || 'Không có'}</p>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="request-info-section">
                    <h6><i class="bi bi-file-text"></i> Mô tả vấn đề</h6>
                    <p>${request.description}</p>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="request-info-section">
                    <h6><i class="bi bi-clock-history"></i> Lịch sử xử lý</h6>
                    <div class="timeline">
                        ${request.history.map(entry => `
                            <div class="timeline-item">
                                <div class="timeline-marker bg-${getActionColor(entry.action)}"></div>
                                <div class="timeline-content">
                                    <div class="timeline-header">
                                        <strong>${entry.description}</strong>
                                        <small>${formatDateTime(entry.timestamp)}</small>
                                    </div>
                                    <div class="timeline-body">
                                        <p><strong>Người thực hiện:</strong> ${entry.user}</p>
                                        <p>${entry.details}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('requestDetailModal'));
    modal.show();
};

// Edit request
window.editRequest = function(requestId) {
    const request = fullRequestsData.find(r => r.id === requestId);
    if (!request) return;
    
    // Populate edit form
    document.getElementById('editRequestId').value = request.id;
    document.getElementById('editRequestEquipment').value = request.equipment;
    document.getElementById('editRequestRequester').value = request.requester;
    document.getElementById('editRequestDepartment').value = request.department;
    document.getElementById('editRequestImpact').value = request.impact;
    document.getElementById('editRequestDescription').value = request.description;
    document.getElementById('editRequestAssignedTo').value = request.assignedTo || '';
    document.getElementById('editRequestDeadline').value = request.deadline || '';
    document.getElementById('editRequestStatus').value = request.status;
    document.getElementById('editRequestNotes').value = request.notes || '';
    
    const modal = new bootstrap.Modal(document.getElementById('editRequestModal'));
    modal.show();
};

// Delete request
window.deleteRequest = function(requestId) {
    if (confirm('Bạn có chắc chắn muốn xóa yêu cầu bảo trì này?')) {
        const index = fullRequestsData.findIndex(request => request.id === requestId);
        if (index > -1) {
            fullRequestsData.splice(index, 1);
            renderRequestsTable(fullRequestsData);
            alert(`Đã xóa yêu cầu bảo trì ${requestId} thành công!`);
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
        case 'approved':
            return 'Đã phê duyệt';
        case 'assigned':
            return 'Đã phân công';
        case 'in_progress':
            return 'Đang thực hiện';
        case 'completed':
            return 'Hoàn thành';
        case 'rejected':
            return 'Từ chối';
        default:
            return 'Không xác định';
    }
}

// Get impact text
function getImpactText(impact) {
    // Get localized text from data attributes
    const impactElement = document.querySelector(`[data-impact-${impact}]`);
    if (impactElement) {
        return impactElement.textContent;
    }
    
    // Fallback to hardcoded text
    switch (impact) {
        case 'low':
            return 'Thấp';
        case 'medium':
            return 'Trung bình';
        case 'serious':
            return 'Nghiêm trọng';
        case 'critical':
            return 'Khẩn cấp';
        default:
            return 'Không xác định';
    }
}

// Get action color
function getActionColor(action) {
    switch (action) {
        case 'created':
            return 'primary';
        case 'approved':
            return 'success';
        case 'assigned':
            return 'info';
        case 'in_progress':
            return 'warning';
        case 'completed':
            return 'success';
        case 'rejected':
            return 'danger';
        case 'updated':
            return 'info';
        default:
            return 'secondary';
    }
}

// Format date time
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}
