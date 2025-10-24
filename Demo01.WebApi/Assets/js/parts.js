// Parts JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeParts();
    setupEventListeners();
    loadPartsData();
});

const partsData = [
    {
        id: "LK001",
        name: "Bạc đạn 6202",
        quantity: 15,
        unit: "cái",
        location: "Kho A-01",
        minQuantity: 10,
        status: "sufficient",
        lastUpdated: "2025-10-15",
        notes: ""
    },
    {
        id: "LK002",
        name: "Dây cáp điện 2.5mm",
        quantity: 5,
        unit: "mét",
        location: "Kho A-02",
        minQuantity: 20,
        status: "low",
        lastUpdated: "2025-10-18",
        notes: ""
    },
    {
        id: "LK003",
        name: "Kim may công nghiệp",
        quantity: 0,
        unit: "cái",
        location: "Kho B-01",
        minQuantity: 50,
        status: "out",
        lastUpdated: "2025-10-20",
        notes: ""
    },
    {
        id: "LK004",
        name: "Dầu bôi trơn",
        quantity: 8,
        unit: "lít",
        location: "Kho C-01",
        minQuantity: 5,
        status: "sufficient",
        lastUpdated: "2025-10-12"
    },
    {
        id: "LK005",
        name: "Vòng bi 6203",
        quantity: 12,
        unit: "cái",
        location: "Kho A-03",
        minQuantity: 15,
        status: "low",
        lastUpdated: "2025-10-16"
    },
    {
        id: "LK006",
        name: "Dây điện 1.5mm",
        quantity: 25,
        unit: "mét",
        location: "Kho B-02",
        minQuantity: 30,
        status: "low",
        lastUpdated: "2025-10-14"
    },
    {
        id: "LK007",
        name: "Bóng đèn LED",
        quantity: 30,
        unit: "cái",
        location: "Kho C-02",
        minQuantity: 20,
        status: "sufficient",
        lastUpdated: "2025-10-10"
    },
    {
        id: "LK008",
        name: "Công tắc điện",
        quantity: 0,
        unit: "cái",
        location: "Kho A-04",
        minQuantity: 25,
        status: "out",
        lastUpdated: "2025-10-19"
    },
    {
        id: "LK009",
        name: "Ống laser CO2",
        quantity: 2,
        unit: "cái",
        location: "Kho D-01",
        minQuantity: 3,
        status: "low",
        lastUpdated: "2025-10-17"
    },
    {
        id: "LK010",
        name: "Cảm biến lực",
        quantity: 8,
        unit: "cái",
        location: "Kho C-03",
        minQuantity: 10,
        status: "low",
        lastUpdated: "2025-10-13"
    },
    {
        id: "LK011",
        name: "Bộ lọc khí nén",
        quantity: 5,
        unit: "cái",
        location: "Kho B-03",
        minQuantity: 8,
        status: "low",
        lastUpdated: "2025-10-11"
    },
    {
        id: "LK012",
        name: "Seal thủy lực",
        quantity: 20,
        unit: "cái",
        location: "Kho A-05",
        minQuantity: 15,
        status: "sufficient",
        lastUpdated: "2025-10-09"
    },
    {
        id: "LK013",
        name: "Vòng bi bơm nước",
        quantity: 6,
        unit: "cái",
        location: "Kho C-04",
        minQuantity: 8,
        status: "low",
        lastUpdated: "2025-10-08"
    },
    {
        id: "LK014",
        name: "Mạch điều khiển",
        quantity: 3,
        unit: "cái",
        location: "Kho D-02",
        minQuantity: 5,
        status: "low",
        lastUpdated: "2025-10-07"
    },
    {
        id: "LK015",
        name: "Băng tải cao su",
        quantity: 10,
        unit: "mét",
        location: "Kho B-04",
        minQuantity: 12,
        status: "low",
        lastUpdated: "2025-10-06"
    },
    {
        id: "LK016",
        name: "Bộ lọc dầu thủy lực",
        quantity: 4,
        unit: "cái",
        location: "Kho A-06",
        minQuantity: 6,
        status: "low",
        lastUpdated: "2025-10-05"
    },
    {
        id: "LK017",
        name: "Motor servo",
        quantity: 1,
        unit: "cái",
        location: "Kho D-03",
        minQuantity: 2,
        status: "low",
        lastUpdated: "2025-10-04"
    },
    {
        id: "LK018",
        name: "Cảm biến nhiệt độ",
        quantity: 15,
        unit: "cái",
        location: "Kho C-05",
        minQuantity: 12,
        status: "sufficient",
        lastUpdated: "2025-10-03"
    },
    {
        id: "LK019",
        name: "Van điện từ",
        quantity: 8,
        unit: "cái",
        location: "Kho B-05",
        minQuantity: 10,
        status: "low",
        lastUpdated: "2025-10-02"
    },
    {
        id: "LK020",
        name: "Cáp điều khiển",
        quantity: 50,
        unit: "mét",
        location: "Kho A-07",
        minQuantity: 40,
        status: "sufficient",
        lastUpdated: "2025-10-01"
    },
    {
        id: "LK021",
        name: "Bộ nguồn 24V",
        quantity: 6,
        unit: "cái",
        location: "Kho D-04",
        minQuantity: 8,
        status: "low",
        lastUpdated: "2025-09-30"
    },
    {
        id: "LK022",
        name: "Đầu nối điện",
        quantity: 25,
        unit: "cái",
        location: "Kho C-06",
        minQuantity: 20,
        status: "sufficient",
        lastUpdated: "2025-09-29"
    },
    {
        id: "LK023",
        name: "Bộ truyền động",
        quantity: 2,
        unit: "cái",
        location: "Kho B-06",
        minQuantity: 3,
        status: "low",
        lastUpdated: "2025-09-28"
    },
    {
        id: "LK024",
        name: "Cảm biến áp suất",
        quantity: 12,
        unit: "cái",
        location: "Kho A-08",
        minQuantity: 10,
        status: "sufficient",
        lastUpdated: "2025-09-27"
    },
    {
        id: "LK025",
        name: "Bộ điều khiển PLC",
        quantity: 1,
        unit: "cái",
        location: "Kho D-05",
        minQuantity: 2,
        status: "low",
        lastUpdated: "2025-09-26"
    }
];

function initializeParts() {
    const today = new Date().toISOString().split('T')[0];
    const addPartDateInput = document.getElementById('addPartDate');
    if (addPartDateInput) {
        addPartDateInput.value = today;
    }
}

function setupEventListeners() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }
    
    const addPartBtn = document.getElementById('addPartBtn');
    if (addPartBtn) {
        addPartBtn.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('addPartModal'));
            modal.show();
        });
    }
    
    const submitPart = document.getElementById('submitPart');
    if (submitPart) {
        submitPart.addEventListener('click', handleSubmitPart);
    }
    
    const partsFilter = document.getElementById('partsFilter');
    const partsSearch = document.getElementById('partsSearch');
    
    if (partsFilter) {
        partsFilter.addEventListener('change', filterParts);
    }
    
    if (partsSearch) {
        partsSearch.addEventListener('input', filterParts);
    }
    
    const confirmAddStock = document.getElementById('confirmAddStock');
    if (confirmAddStock) {
        confirmAddStock.addEventListener('click', handleConfirmAddStock);
    }
    
    const updatePart = document.getElementById('updatePart');
    if (updatePart) {
        updatePart.addEventListener('click', handleUpdatePart);
    }
}

function loadPartsData() {
    const partsTable = document.getElementById('partsTable');
    if (!partsTable) return;
    
    renderPartsTable(partsData);
}

function renderPartsTable(parts) {
    const partsTable = document.getElementById('partsTable');
    if (!partsTable) return;
    
    partsTable.innerHTML = parts.map(part => `
        <tr>
            <td><strong>${part.id}</strong></td>
            <td>${part.name}</td>
            <td>${part.quantity}</td>
            <td>${part.unit}</td>
            <td>${part.location}</td>
            <td>${part.minQuantity}</td>
            <td>
                <span class="status-badge status-${part.status}">
                    ${getStatusText(part.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-add" onclick="addStock('${part.id}')" title="Nhập thêm">
                        <i class="bi bi-plus-circle"></i>
                    </button>
                    <button class="btn-action btn-edit" onclick="editPart('${part.id}')" title="Chỉnh sửa">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deletePart('${part.id}')" title="Xóa">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function handleSubmitPart() {
    const form = document.getElementById('addPartForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const formData = {
        code: document.getElementById('partCode').value,
        name: document.getElementById('partName').value,
        quantity: parseInt(document.getElementById('partQuantity').value),
        unit: document.getElementById('partUnit').value,
        location: document.getElementById('partLocation').value,
        date: document.getElementById('addPartDate').value,
        notes: document.getElementById('partNotes').value
    };
    
    const newPart = {
        id: formData.code,
        name: formData.name,
        quantity: formData.quantity,
        unit: formData.unit,
        location: formData.location,
        minQuantity: Math.ceil(formData.quantity * 0.3),
        status: formData.quantity > Math.ceil(formData.quantity * 0.3) ? 'sufficient' : 'low',
        lastUpdated: formData.date
    };
    
    partsData.unshift(newPart);
    renderPartsTable(partsData);
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('addPartModal'));
    modal.hide();
    
    form.reset();
    initializeParts();
    
    alert(`Đã thêm linh kiện ${formData.code} thành công!`);
}

window.addStock = function(partId) {
    const part = partsData.find(p => p.id === partId);
    if (!part) return;
    
    const modalBody = document.getElementById('addStockModalBody');
    if (!modalBody) return;
    
    modalBody.innerHTML = `
        <div class="mb-3">
            <label class="form-label">Linh Kiện</label>
            <input type="text" class="form-control" value="${part.name} (${part.id})" readonly>
        </div>
        <div class="mb-3">
            <label class="form-label">Số Lượng Hiện Tại</label>
            <input type="text" class="form-control" value="${part.quantity} ${part.unit}" readonly>
        </div>
        <div class="mb-3">
            <label class="form-label">Số Lượng Nhập Thêm</label>
            <input type="number" class="form-control" id="addQuantity" min="1" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Ngày Nhập</label>
            <input type="date" class="form-control" id="addDate" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Ghi Chú</label>
            <textarea class="form-control" id="addNotes" rows="2" placeholder="Ghi chú về lô nhập..."></textarea>
        </div>
    `;
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('addDate').value = today;
    
    window.currentAddStockPartId = partId;
    
    const modal = new bootstrap.Modal(document.getElementById('addStockModal'));
    modal.show();
};

window.editPart = function(partId) {
    const part = partsData.find(p => p.id === partId);
    if (!part) return;
    
    // Populate edit form with part data
    document.getElementById('editPartCode').value = part.id;
    document.getElementById('editPartName').value = part.name;
    document.getElementById('editPartQuantity').value = part.quantity;
    document.getElementById('editPartUnit').value = part.unit;
    document.getElementById('editPartLocation').value = part.location;
    document.getElementById('editPartMinQuantity').value = part.minQuantity;
    document.getElementById('editPartLastUpdated').value = part.lastUpdated;
    document.getElementById('editPartNotes').value = part.notes || '';
    
    // Show edit modal
    const modal = new bootstrap.Modal(document.getElementById('editPartModal'));
    modal.show();
};

window.deletePart = function(partId) {
    if (confirm(`Bạn có chắc chắn muốn xóa linh kiện ${partId}?`)) {
        const partIndex = partsData.findIndex(part => part.id === partId);
        if (partIndex !== -1) {
            partsData.splice(partIndex, 1);
            renderPartsTable(partsData);
            alert(`Đã xóa linh kiện ${partId}!`);
        }
    }
};

function filterParts() {
    const filter = document.getElementById('partsFilter').value;
    const search = document.getElementById('partsSearch').value.toLowerCase();
    
    let filteredParts = partsData;
    
    if (filter !== 'all') {
        filteredParts = filteredParts.filter(part => part.status === filter);
    }
    
    if (search) {
        filteredParts = filteredParts.filter(part => 
            part.id.toLowerCase().includes(search) ||
            part.name.toLowerCase().includes(search) ||
            part.location.toLowerCase().includes(search)
        );
    }
    
    renderPartsTable(filteredParts);
}

function getStatusText(status) {
    // Get localized text from data attributes
    const statusElement = document.querySelector(`[data-status-${status}]`);
    if (statusElement) {
        return statusElement.textContent;
    }
    
    // Fallback to hardcoded text
    switch (status) {
        case 'sufficient':
            return 'Đủ dùng';
        case 'low':
            return 'Sắp hết';
        case 'out':
            return 'Hết hàng';
        default:
            return 'Không xác định';
    }
}

function handleConfirmAddStock() {
    const partId = window.currentAddStockPartId;
    const addQuantity = parseInt(document.getElementById('addQuantity').value);
    const addDate = document.getElementById('addDate').value;
    const addNotes = document.getElementById('addNotes').value;
    
    if (!addQuantity || !addDate) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    const partIndex = partsData.findIndex(part => part.id === partId);
    if (partIndex !== -1) {
        partsData[partIndex].quantity += addQuantity;
        partsData[partIndex].lastUpdated = addDate;
        
        // Update status based on new quantity
        if (partsData[partIndex].quantity <= 0) {
            partsData[partIndex].status = 'out';
        } else if (partsData[partIndex].quantity <= partsData[partIndex].minQuantity) {
            partsData[partIndex].status = 'low';
        } else {
            partsData[partIndex].status = 'sufficient';
        }
        
        renderPartsTable(partsData);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('addStockModal'));
        modal.hide();
        
        alert(`Đã nhập thêm ${addQuantity} ${partsData[partIndex].unit} cho linh kiện ${partId}!`);
    }
}

function handleUpdatePart() {
    const form = document.getElementById('editPartForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const partId = document.getElementById('editPartCode').value;
    const partIndex = partsData.findIndex(part => part.id === partId);
    
    if (partIndex === -1) {
        alert('Không tìm thấy linh kiện để cập nhật');
        return;
    }
    
    // Get form data
    const formData = {
        name: document.getElementById('editPartName').value,
        quantity: parseInt(document.getElementById('editPartQuantity').value),
        unit: document.getElementById('editPartUnit').value,
        location: document.getElementById('editPartLocation').value,
        minQuantity: parseInt(document.getElementById('editPartMinQuantity').value),
        lastUpdated: document.getElementById('editPartLastUpdated').value,
        notes: document.getElementById('editPartNotes').value
    };
    
    // Update part data
    partsData[partIndex] = {
        ...partsData[partIndex],
        name: formData.name,
        quantity: formData.quantity,
        unit: formData.unit,
        location: formData.location,
        minQuantity: formData.minQuantity,
        lastUpdated: formData.lastUpdated,
        notes: formData.notes
    };
    
    // Update status based on new quantity
    if (partsData[partIndex].quantity <= 0) {
        partsData[partIndex].status = 'out';
    } else if (partsData[partIndex].quantity <= partsData[partIndex].minQuantity) {
        partsData[partIndex].status = 'low';
    } else {
        partsData[partIndex].status = 'sufficient';
    }
    
    // Refresh table
    renderPartsTable(partsData);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editPartModal'));
    modal.hide();
    
    // Show success message
    alert(`Đã cập nhật thành công linh kiện ${partId}`);
}
