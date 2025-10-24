// Traceability System JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeTraceability();
    setupEventListeners();
});

class TraceabilitySystem {
    constructor() {
        this.searchType = 'paraglider';
        this.searchValue = '';
        this.searchResult = null;
        this.activeTab = 'overview';
        
        // Mock data for dropdown
        this.mockData = {
            paraglider: [
                { code: 'PG-2025-0089-001', name: 'NIVIUK HOOK 6 - Size M', status: 'Hoàn thành' },
                { code: 'PG-2025-0091-002', name: 'NIVIUK PEAK 5 - Size L', status: 'Đang sản xuất' },
                { code: 'PG-2025-0095-003', name: 'NIVIUK IKUMA 2 - Size S', status: 'Hoàn thành' },
                { code: 'PG-2025-0101-004', name: 'NIVIUK HOOK 6 - Size XL', status: 'Chờ nguyên liệu' }
            ],
            harness: [
                { code: 'HN-2025-0067-015', name: 'NIVIUK DRIFTER - Size L', status: 'Hoàn thành' },
                { code: 'HN-2025-0072-016', name: 'NIVIUK DRIFTER - Size M', status: 'Đang sản xuất' },
                { code: 'HN-2025-0078-017', name: 'NIVIUK DRIFTER - Size XL', status: 'Hoàn thành' },
                { code: 'HN-2025-0085-018', name: 'NIVIUK DRIFTER - Size S', status: 'Chờ nguyên liệu' }
            ],
            material: [
                { code: 'PO-2025-156', name: 'Vải Top chính - POR-27D-BL', status: 'Còn hàng' },
                { code: 'LOT-T-891', name: 'Vải Top - Batch BATCH-2025-0145', status: 'Còn hàng' },
                { code: 'PO-2025-157', name: 'Vải Bottom - POR-32D-BL', status: 'Sắp hết' },
                { code: 'LOT-B-892', name: 'Vải Bottom - Batch BATCH-2025-0146', status: 'Còn hàng' }
            ]
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateSearchPlaceholder();
        this.setupDropdown();
    }

    bindEvents() {
        // Product type dropdown
        const productTypeSelect = document.getElementById('productTypeSelect');
        if (productTypeSelect) {
            productTypeSelect.addEventListener('change', (e) => {
                this.setSearchType(e.target.value);
            });
        }

        // QR Scan button
        const qrScanBtn = document.getElementById('qrScanBtn');
        if (qrScanBtn) {
            qrScanBtn.addEventListener('click', () => {
                this.simulateQRScan();
            });
        }

        // Search button
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }

        // Search input enter key
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        // Tab navigation
        document.querySelectorAll('#resultsTabs button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveTab(e.target.dataset.bsTarget);
            });
        });
    }

    setupDropdown() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            // Create dropdown container
            const dropdownContainer = document.createElement('div');
            dropdownContainer.className = 'position-relative';
            dropdownContainer.id = 'searchDropdown';
            
            const dropdown = document.createElement('div');
            dropdown.className = 'dropdown-menu w-100';
            dropdown.id = 'searchDropdownMenu';
            dropdown.style.display = 'none';
            
            dropdownContainer.appendChild(dropdown);
            searchInput.parentNode.appendChild(dropdownContainer);
            
            // Add input event listener
            searchInput.addEventListener('input', (e) => {
                this.filterDropdown(e.target.value);
            });
            
            // Hide dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.style.display = 'none';
                }
            });
        }
    }

    simulateQRScan() {
        console.log('QR scan simulated');
        const searchInput = document.getElementById('searchInput');
        const mockCodes = this.mockData[this.searchType];
        
        if (mockCodes && mockCodes.length > 0) {
            const randomCode = mockCodes[Math.floor(Math.random() * mockCodes.length)];
            console.log('QR scan result:', randomCode.code);
            searchInput.value = randomCode.code;
            
            // Show QR scan animation
            const qrBtn = document.getElementById('qrScanBtn');
            qrBtn.innerHTML = '<i class="bi bi-check-circle text-success"></i>';
            qrBtn.classList.add('btn-success');
            qrBtn.classList.remove('btn-outline-secondary');
            
            setTimeout(() => {
                qrBtn.innerHTML = '<i class="bi bi-qr-code-scan"></i>';
                qrBtn.classList.remove('btn-success');
                qrBtn.classList.add('btn-outline-secondary');
            }, 2000);
        }
    }

    filterDropdown(value) {
        const dropdown = document.getElementById('searchDropdownMenu');
        const searchInput = document.getElementById('searchInput');
        
        if (!dropdown || !searchInput) return;
        
        if (value.length < 2) {
            dropdown.style.display = 'none';
            return;
        }
        
        const mockCodes = this.mockData[this.searchType];
        if (!mockCodes) return;
        
        const filtered = mockCodes.filter(item => 
            item.code.toLowerCase().includes(value.toLowerCase()) ||
            item.name.toLowerCase().includes(value.toLowerCase())
        );
        
        if (filtered.length > 0) {
            dropdown.innerHTML = filtered.map(item => `
                <div class="dropdown-item cursor-pointer" onclick="traceabilitySystem.selectItem('${item.code}')">
                    <div class="fw-semibold text-slate-800">${item.code}</div>
                    <div class="small text-slate-600">${item.name}</div>
                    <span class="badge bg-success">${item.status}</span>
                </div>
            `).join('');
            
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    }

    selectItem(code) {
        const searchInput = document.getElementById('searchInput');
        const dropdown = document.getElementById('searchDropdownMenu');
        
        if (searchInput) {
            searchInput.value = code;
        }
        
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    setSearchType(type) {
        this.searchType = type;
        this.updateSearchPlaceholder();
    }

    updateSearchPlaceholder() {
        const input = document.getElementById('searchInput');
        const placeholders = {
            'paraglider': 'Nhập mã dù lượn (VD: PG-2025-0089-001) hoặc quét QR code',
            'harness': 'Nhập mã ghế bay (VD: HN-2025-0067-015) hoặc quét QR code',
            'material': 'Nhập mã nguyên liệu (VD: PO-2025-156 hoặc LOT-T-891) hoặc quét QR code'
        };
        if (input) {
            input.placeholder = placeholders[this.searchType];
        }
    }

    performSearch() {
        console.log('performSearch called');
        this.searchValue = document.getElementById('searchInput').value.trim();
        console.log('Search value:', this.searchValue);
        
        if (!this.searchValue) {
            console.log('No search value provided');
            return;
        }

        // Show loading state
        const searchBtn = document.getElementById('searchBtn');
        const originalText = searchBtn.innerHTML;
        searchBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang tìm kiếm...';
        searchBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            console.log('Performing mock search...');
            this.searchResult = this.mockSearch();
            console.log('Search result:', this.searchResult);
            this.displayResults();
            
            // Restore button
            searchBtn.innerHTML = originalText;
            searchBtn.disabled = false;
        }, 1500);
    }

    mockSearch() {
        console.log('mockSearch called with:', this.searchValue);
        
        if (this.searchType === 'paraglider') {
            return {
                type: 'Dù lượn',
                serial: this.searchValue,
                orderInfo: {
                    orderCode: 'ORD-2025-0089',
                    orderDate: '20/05/2025',
                    customer: 'Customer ABC - France',
                    quantity: 2,
                    model: 'NIVIUK HOOK 6',
                    size: 'M (85-105kg)',
                    color: 'Blue/White',
                    priority: 'High',
                    shipDate: '30/07/2025',
                    actualShipDate: '30/07/2025',
                    status: 'Completed'
                },
                productionTimeline: [
                    { stage: 'Bung đơn hàng', planned: '23/06/2025', actual: '23/06/2025', status: 'completed', delay: 0 },
                    { stage: 'Trải vải', planned: '29/06/2025', actual: '29/06/2025', status: 'completed', delay: 0 },
                    { stage: 'Cắt vải', planned: '06/07/2025', actual: '07/07/2025', status: 'completed', delay: 1 },
                    { stage: 'Ghép vải đuôi', planned: '10/07/2025', actual: '10/07/2025', status: 'completed', delay: 0 },
                    { stage: 'Ghép vải bottom', planned: '12/07/2025', actual: '12/07/2025', status: 'completed', delay: 0 },
                    { stage: 'Ghép vải top', planned: '15/07/2025', actual: '15/07/2025', status: 'completed', delay: 0 },
                    { stage: 'May đuôi', planned: '18/07/2025', actual: '18/07/2025', status: 'completed', delay: 0 },
                    { stage: 'May bottom', planned: '20/07/2025', actual: '20/07/2025', status: 'completed', delay: 0 },
                    { stage: 'May top', planned: '22/07/2025', actual: '22/07/2025', status: 'completed', delay: 0 },
                    { stage: 'QC cuối', planned: '25/07/2025', actual: '25/07/2025', status: 'completed', delay: 0 },
                    { stage: 'Đóng gói', planned: '28/07/2025', actual: '28/07/2025', status: 'completed', delay: 0 }
                ],
                cuttingInfo: {
                    startDate: '06/07/2025 08:30',
                    endDate: '07/07/2025 16:45',
                    operator: 'Nguyễn Văn Cường',
                    cuttingBed: 'Bed-01',
                    fabricUsed: '185.5m',
                    fabricWaste: '5.2m (2.8%)',
                    cuttingSpeed: '32.5 LF/ngày',
                    notes: 'Cắt chậm 1 ngày do thiếu vải Pocket'
                },
                fabricCompensation: [
                    { date: '10/07/2025', reason: 'Lỗi ghép vải Bottom - vải bị rách', quantity: 2, requestBy: 'Bộ phận may dù - Line 2', approvedBy: 'Quản lý sản xuất', status: 'Hoàn thành' },
                    { date: '18/07/2025', reason: 'Lỗi may Top - đường chỉ không đạt chuẩn', quantity: 1, requestBy: 'QC Top', approvedBy: 'Quản lý sản xuất', status: 'Hoàn thành' }
                ],
                qcReports: [
                    { 
                        stage: 'IQC - Kiểm vải đầu vào', 
                        date: '08/06/2025', 
                        inspector: 'Lê Thị Hương', 
                        status: 'Đạt', 
                        defects: 0,
                        notes: 'Vải đạt chuẩn chất lượng, không có lỗi'
                    },
                    { 
                        stage: 'QC Ghép vải', 
                        date: '10/07/2025', 
                        inspector: 'Nguyễn Văn A', 
                        status: 'Đạt', 
                        defects: 2,
                        notes: 'Phát hiện 2 lỗi rách vải Bottom - đã yêu cầu cắt bù', 
                        sewer: 'Trần Thị B',
                        defectDetails: 'Vải bị rách do kéo quá mạnh khi ghép'
                    },
                    { 
                        stage: 'QC May đuôi', 
                        date: '18/07/2025', 
                        inspector: 'Lê Văn C', 
                        status: 'Đạt', 
                        defects: 0,
                        notes: 'May đuôi đạt tiêu chuẩn, đường chỉ đều đặn', 
                        sewer: 'Phạm Thị D',
                        sewingTime: '2.5 giờ'
                    },
                    { 
                        stage: 'QC May bottom', 
                        date: '20/07/2025', 
                        inspector: 'Hoàng Văn E', 
                        status: 'Đạt', 
                        defects: 0,
                        notes: 'May bottom đạt yêu cầu, độ căng vải tốt', 
                        sewer: 'Nguyễn Thị F',
                        sewingTime: '3.2 giờ'
                    },
                    { 
                        stage: 'QC May top', 
                        date: '22/07/2025', 
                        inspector: 'Đỗ Văn G', 
                        status: 'Đạt', 
                        defects: 1,
                        notes: 'Phát hiện 1 lỗi đường chỉ - đã yêu cầu cắt bù vải', 
                        sewer: 'Vũ Thị H',
                        sewingTime: '3.8 giờ',
                        defectDetails: 'Đường chỉ zigzag không đều'
                    },
                    { 
                        stage: 'QC Cuối', 
                        date: '25/07/2025', 
                        inspector: 'Trương Văn I', 
                        status: 'Đạt', 
                        defects: 0,
                        notes: 'Kiểm tra cuối - Bơm dù đạt áp suất 4.5 bar, giữ được 24h',
                        testPressure: '4.5 bar',
                        holdTime: '24 giờ'
                    }
                ],
                materials: [
                    { 
                        fabric: 'Vải Ripstop Nylon 40D', 
                        batch: 'BATCH-2025-0143', 
                        lot: 'LOT-RS-889', 
                        supplier: 'Dominico Textiles - Italy',
                        code: 'DOM-RS40D-BL',
                        quantity: '12.5m',
                        unit: 'm',
                        receiveDate: '08/06/2025',
                        qcDate: '08/06/2025',
                        qcStatus: 'Pass',
                        warehouse: 'Kho A-Zone 3',
                        expiryDate: '08/12/2025'
                    },
                    { 
                        fabric: 'Vải Ripstop Nylon 40D', 
                        batch: 'BATCH-2025-0144', 
                        lot: 'LOT-RS-890', 
                        supplier: 'Dominico Textiles - Italy',
                        code: 'DOM-RS40D-WH',
                        quantity: '25.8m',
                        unit: 'm',
                        receiveDate: '09/06/2025',
                        qcDate: '09/06/2025',
                        qcStatus: 'Pass',
                        warehouse: 'Kho A-Zone 3',
                        expiryDate: '09/12/2025'
                    },
                    { 
                        fabric: 'Vải Ripstop Polyester 32D', 
                        batch: 'BATCH-2025-0145', 
                        lot: 'LOT-RP-891', 
                        supplier: 'Porcher Sport - France',
                        code: 'POR-RP32D-BL',
                        quantity: '85.4m',
                        unit: 'm',
                        receiveDate: '10/06/2025',
                        qcDate: '10/06/2025',
                        qcStatus: 'Pass',
                        warehouse: 'Kho A-Zone 2',
                        expiryDate: '10/12/2025'
                    },
                    { 
                        fabric: 'Vải Ripstop Polyester 27D', 
                        batch: 'BATCH-2025-0146', 
                        lot: 'LOT-RP-892', 
                        supplier: 'Porcher Sport - France',
                        code: 'POR-RP27D-BL',
                        quantity: '62.8m',
                        unit: 'm',
                        receiveDate: '10/06/2025',
                        qcDate: '10/06/2025',
                        qcStatus: 'Pass',
                        warehouse: 'Kho A-Zone 2',
                        expiryDate: '10/12/2025'
                    }
                ],
                accessories: [
                    { name: 'Chỉ may chính', code: 'THR-120-BL', supplier: 'Coats', batch: 'CT-2025-445', quantity: '8 ống', qcStatus: 'Pass' },
                    { name: 'Dây riser', code: 'RSR-8MM-BK', supplier: 'Edelrid', batch: 'ED-2025-789', quantity: '145m', qcStatus: 'Pass' },
                    { name: 'Khóa gài', code: 'BKL-25MM', supplier: 'Cobra', batch: 'CB-2025-223', quantity: '32 bộ', qcStatus: 'Pass' },
                    { name: 'Dây đai webbing', code: 'WEB-40MM', supplier: 'Cousin', batch: 'CO-2025-556', quantity: '28m', qcStatus: 'Pass' }
                ],
                equipmentUsed: [
                    { name: 'Máy trải vải tự động', code: 'SPR-01', status: 'Normal', lastMaintenance: '15/06/2025', nextMaintenance: '15/07/2025' },
                    { name: 'Máy cắt CNC', code: 'CUT-02', status: 'Normal', lastMaintenance: '01/07/2025', nextMaintenance: '01/08/2025' },
                    { name: 'Máy may công nghiệp', code: 'SEW-15', status: 'Normal', lastMaintenance: '10/07/2025', nextMaintenance: '10/08/2025' },
                    { name: 'Máy bơm kiểm tra', code: 'PMP-03', status: 'Normal', lastMaintenance: '20/07/2025', nextMaintenance: '20/08/2025' }
                ],
                qualityMetrics: {
                    totalDefects: 3,
                    defectRate: '1.67%',
                    reworkCount: 3,
                    finalYield: '100%',
                    avgSewingTime: '3.17 giờ/công đoạn',
                    onTimeDelivery: 'Đúng hạn'
                },
                packagingInfo: {
                    packingDate: '28/07/2025',
                    packer: 'Đội đóng gói 1',
                    boxNumber: 'BOX-089-001',
                    weight: '5.8 kg',
                    dimensions: '45x35x15 cm',
                    includeItems: 'Dù, túi đựng, sách hướng dẫn, thẻ bảo hành',
                    shippingLabel: 'FRA-2025-089'
                }
            };
        } else if (this.searchType === 'harness') {
            return {
                type: 'Ghế bay',
                serial: this.searchValue,
                orderInfo: {
                    orderCode: 'ORD-2025-0067',
                    orderDate: '15/04/2025',
                    customer: 'Customer XYZ - Germany',
                    quantity: 1,
                    model: 'NIVIUK DRIFTER',
                    size: 'L',
                    color: 'Black/Red',
                    priority: 'Normal',
                    shipDate: '30/07/2025',
                    actualShipDate: '30/07/2025',
                    status: 'Completed'
                },
                productionTimeline: [
                    { stage: 'Bung order', planned: '26/05/2025', actual: '26/05/2025', status: 'completed', delay: 0 },
                    { stage: 'Trải vải', planned: '08/06/2025', actual: '08/06/2025', status: 'completed', delay: 0 },
                    { stage: 'Cắt vải', planned: '15/06/2025', actual: '15/06/2025', status: 'completed', delay: 0 },
                    { stage: 'Hoàn thành sản phẩm', planned: '23/07/2025', actual: '23/07/2025', status: 'completed', delay: 0 },
                    { stage: 'QC - Đóng gói', planned: '28/07/2025', actual: '28/07/2025', status: 'completed', delay: 0 }
                ],
                measurements: {
                    weight: '4.2 kg',
                    dimensions: '45x38x15 cm',
                    seatWidth: '42 cm',
                    backHeight: '48 cm',
                    strapLength: '165 cm',
                    straps: 'Đạt độ bền kéo 2200N',
                    buckles: 'Hoạt động tốt - test 500 lần',
                    foamThickness: '3.5 cm'
                },
                qcReport: {
                    date: '23/07/2025',
                    inspector: 'QC Team Leader - Phạm Văn Tuấn',
                    status: 'Pass',
                    testResults: [
                        { test: 'Độ bền dây đai', result: 'Pass', value: '2250N', standard: '≥2200N' },
                        { test: 'Test khóa gài', result: 'Pass', value: '500 lần', standard: '≥500 lần' },
                        { test: 'Độ dày foam', result: 'Pass', value: '3.5cm', standard: '3-4cm' },
                        { test: 'Đường may', result: 'Pass', value: 'Đều, không lỗi', standard: 'Không lỗi' },
                        { test: 'Trọng lượng', result: 'Pass', value: '4.2kg', standard: '4.0-4.5kg' }
                    ],
                    notes: 'Tất cả thông số đạt yêu cầu, sản phẩm đạt chất lượng xuất khẩu'
                },
                materials: [
                    { 
                        fabric: 'Vải Cordura 500D', 
                        batch: 'BATCH-2025-0201', 
                        lot: 'LOT-CD-445', 
                        supplier: 'Cordura Textiles - USA',
                        code: 'COR-500D-BK',
                        quantity: '2.8m',
                        unit: 'm',
                        receiveDate: '15/05/2025',
                        qcDate: '15/05/2025',
                        qcStatus: 'Pass',
                        warehouse: 'Kho B-Zone 1'
                    },
                    { 
                        fabric: 'Foam EVA 35mm', 
                        batch: 'BATCH-2025-0202', 
                        lot: 'LOT-EVA-446', 
                        supplier: 'Foam Solutions - Korea',
                        code: 'FS-EVA35-BK',
                        quantity: '0.45m²',
                        unit: 'm²',
                        receiveDate: '18/05/2025',
                        qcDate: '18/05/2025',
                        qcStatus: 'Pass',
                        warehouse: 'Kho B-Zone 2'
                    }
                ],
                accessories: [
                    { name: 'Dây đai chính', code: 'WEB-50MM-BK', supplier: 'Cousin', batch: 'CO-2025-678', quantity: '3.5m', qcStatus: 'Pass' },
                    { name: 'Khóa gài nhôm', code: 'BKL-AUTO-50', supplier: 'Austrialpin', batch: 'AU-2025-334', quantity: '8 bộ', qcStatus: 'Pass' },
                    { name: 'Khóa điều chỉnh', code: 'ADJ-40MM', supplier: 'Cobra', batch: 'CB-2025-445', quantity: '12 cái', qcStatus: 'Pass' },
                    { name: 'Chỉ may Cordura', code: 'THR-150-BK', supplier: 'Coats', batch: 'CT-2025-889', quantity: '4 ống', qcStatus: 'Pass' }
                ],
                qualityMetrics: {
                    totalDefects: 0,
                    defectRate: '0%',
                    reworkCount: 0,
                    finalYield: '100%',
                    avgSewingTime: '6.5 giờ',
                    onTimeDelivery: 'Đúng hạn'
                }
            };
        } else if (this.searchType === 'material') {
            return {
                type: 'Nguyên vật liệu',
                poNumber: this.searchValue.split('-')[0] || 'PO-2025-156',
                lot: this.searchValue.split('-')[1] || 'LOT-RP-891',
                material: 'Vải Ripstop Polyester 27D',
                materialCode: 'POR-RP27D-BL',
                supplier: 'Porcher Sport - France',
                supplierContact: 'contact@porcher-sport.com',
                batch: 'BATCH-2025-0145',
                receiveInfo: {
                    receiveDate: '10/06/2025',
                    quantity: '500m',
                    unit: 'm',
                    price: '€25/m',
                    totalValue: '€12,500',
                    invoiceNo: 'INV-POR-2025-445',
                    warehouse: 'Kho A-Zone 2',
                    shelf: 'A2-R3-S5'
                },
                iqcReport: {
                    date: '10/06/2025',
                    inspector: 'IQC Team - Nguyễn Văn Hùng',
                    status: 'Pass',
                    inspectionTime: '3.5 giờ',
                    tests: [
                        { test: 'Độ bền kéo (Warp)', result: 'Pass', value: '165N', standard: '≥150N', method: 'EN ISO 13934-1' },
                        { test: 'Độ bền kéo (Weft)', result: 'Pass', value: '158N', standard: '≥150N', method: 'EN ISO 13934-1' },
                        { test: 'Độ chống thấm', result: 'Pass', value: '3200mm', standard: '≥3000mm', method: 'EN ISO 811' },
                        { test: 'Độ thấm khí', result: 'Pass', value: '0.5 L/m²/s', standard: '≤1.0 L/m²/s', method: 'EN ISO 9237' },
                        { test: 'Màu sắc', result: 'Pass', value: 'Pantone 2935C', standard: 'Pantone 2935C ±ΔE<2', method: 'Visual + Spectro' },
                        { test: 'Độ dày', result: 'Pass', value: '0.42mm', standard: '0.4-0.5mm', method: 'EN ISO 5084' },
                        { test: 'Trọng lượng', result: 'Pass', value: '42g/m²', standard: '40-45g/m²', method: 'EN 12127' },
                        { test: 'Độ bền xé', result: 'Pass', value: '45N', standard: '≥40N', method: 'EN ISO 13937-2' }
                    ],
                    sampleRetained: 'Yes - 2m',
                    certificate: 'COA-POR-2025-445.pdf',
                    notes: 'Vải đạt toàn bộ tiêu chuẩn, chất lượng tốt, màu sắc đúng yêu cầu'
                },
                usageHistory: [
                    { 
                        date: '23/06/2025', 
                        order: 'ORD-2025-0089', 
                        quantity: '62.8m', 
                        purpose: 'Vải Top - Dù NIVIUK HOOK 6',
                        usedBy: 'Bộ phận cắt',
                        remaining: '437.2m'
                    },
                    { 
                        date: '25/06/2025', 
                        order: 'ORD-2025-0091', 
                        quantity: '58.5m', 
                        purpose: 'Vải Top - Dù NIVIUK PEAK 5',
                        usedBy: 'Bộ phận cắt',
                        remaining: '378.7m'
                    },
                    { 
                        date: '02/07/2025', 
                        order: 'ORD-2025-0095', 
                        quantity: '65.2m', 
                        purpose: 'Vải Top - Dù NIVIUK IKUMA 2',
                        usedBy: 'Bộ phận cắt',
                        remaining: '313.5m'
                    }
                ],
                usedInOrders: ['ORD-2025-0089', 'ORD-2025-0091', 'ORD-2025-0095'],
                inventoryStatus: {
                    total: '500m',
                    used: '186.5m',
                    remaining: '313.5m',
                    reserved: '120m',
                    available: '193.5m',
                    expiryDate: '10/12/2025',
                    status: 'In Stock'
                },
                documents: [
                    { name: 'Certificate of Analysis', file: 'COA-POR-2025-445.pdf', date: '10/06/2025' },
                    { name: 'Test Report', file: 'TR-IQC-2025-445.pdf', date: '10/06/2025' },
                    { name: 'Material Safety Data Sheet', file: 'MSDS-POR-27D.pdf', date: '01/05/2025' },
                    { name: 'Invoice', file: 'INV-POR-2025-445.pdf', date: '08/06/2025' }
                ]
            };
        }
        
        return null;
    }

    displayResults() {
        console.log('displayResults called');
        // Hide no results, show results section
        const noResults = document.getElementById('noResults');
        const resultsSection = document.getElementById('resultsSection');
        
        if (noResults) noResults.classList.add('d-none');
        if (resultsSection) resultsSection.classList.remove('d-none');
        
        // Show/hide tabs based on search type
        const tabsNav = document.getElementById('tabsNav');
        const cuttingTab = document.getElementById('cuttingTab');
        
        if (this.searchType === 'paraglider') {
            if (tabsNav) tabsNav.classList.remove('d-none');
            if (cuttingTab) cuttingTab.classList.remove('d-none');
        } else if (this.searchType === 'harness') {
            if (tabsNav) tabsNav.classList.remove('d-none');
            if (cuttingTab) cuttingTab.classList.add('d-none');
        } else {
            if (tabsNav) tabsNav.classList.add('d-none');
        }

        // Reset to overview tab
        this.setActiveTab('#overview');
        
        // Render all tabs
        this.renderOverview();
        this.renderTimeline();
        this.renderQC();
        this.renderMaterials();
        this.renderCutting();
        this.renderMetrics();
    }

    setActiveTab(tabId) {
        this.activeTab = tabId.replace('#', '');
        
        // Update tab buttons
        const tabButtons = document.querySelectorAll('#resultsTabs button');
        if (tabButtons.length > 0) {
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            const activeTabBtn = document.querySelector(`[data-bs-target="${tabId}"]`);
            if (activeTabBtn) {
                activeTabBtn.classList.add('active');
            }
        }
        
        // Update tab panes
        const tabPanes = document.querySelectorAll('.tab-pane');
        if (tabPanes.length > 0) {
            tabPanes.forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            const activePane = document.querySelector(tabId);
            if (activePane) {
                activePane.classList.add('show', 'active');
            }
        }
    }

    renderOverview() {
        const content = document.getElementById('overviewContent');
        if (!content) return;
        
        if (this.searchType === 'paraglider') {
            content.innerHTML = this.renderParagliderOverview();
        } else if (this.searchType === 'harness') {
            content.innerHTML = this.renderHarnessOverview();
        } else if (this.searchType === 'material') {
            content.innerHTML = this.renderMaterialOverview();
        }
    }

    renderParagliderOverview() {
        const order = this.searchResult.orderInfo;
        const packaging = this.searchResult.packagingInfo;
        
        return `
            <div class="card shadow-sm mb-4 border-0">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2 class="h4 fw-bold text-dark mb-0">Thông tin đơn hàng & sản phẩm</h2>
                        <span class="status-badge status-pass">
                            <i class="bi bi-check-circle me-1"></i>
                            ${order.status}
                        </span>
                    </div>
                    <div class="row g-4">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Serial Number</div>
                                <div class="fw-semibold text-dark">${this.searchResult.serial}</div>
                            </div>
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Mã đơn hàng</div>
                                <div class="fw-semibold text-dark">${order.orderCode}</div>
                            </div>
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Ngày đặt hàng</div>
                                <div class="fw-semibold text-dark">${order.orderDate}</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Khách hàng</div>
                                <div class="fw-semibold text-dark">${order.customer}</div>
                            </div>
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Model</div>
                                <div class="fw-semibold text-dark">${order.model}</div>
                            </div>
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Size / Màu</div>
                                <div class="fw-semibold text-dark">${order.size} / ${order.color}</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Độ khó đơn hàng</div>
                                <div class="fw-semibold text-dark">${order.quantity} LF</div>
                            </div>
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Độ ưu tiên</div>
                                <span class="status-badge status-warning">${order.priority}</span>
                            </div>
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Ngày xuất hàng</div>
                                <div class="fw-semibold text-dark">${order.shipDate}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card shadow-sm border-0">
                <div class="card-body p-4">
                    <h2 class="h4 fw-bold text-dark mb-4">Thông tin đóng gói & vận chuyển</h2>
                    <div class="row g-3 mb-4">
                        <div class="col-md-3">
                            <div class="info-card blue">
                                <div class="small text-muted mb-1">Ngày đóng gói</div>
                                <div class="fw-semibold text-dark">${packaging.packingDate}</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="info-card blue">
                                <div class="small text-muted mb-1">Số thùng</div>
                                <div class="fw-semibold text-dark">${packaging.boxNumber}</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="info-card blue">
                                <div class="small text-muted mb-1">Trọng lượng</div>
                                <div class="fw-semibold text-dark">${packaging.weight}</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="info-card blue">
                                <div class="small text-muted mb-1">Kích thước</div>
                                <div class="fw-semibold text-dark">${packaging.dimensions}</div>
                            </div>
                        </div>
                    </div>
                    <div class="info-card mb-3">
                        <div class="small text-muted mb-1">Bao gồm</div>
                        <div class="text-dark">${packaging.includeItems}</div>
                    </div>
                    <div class="info-card green">
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-truck text-success"></i>
                            <div>
                                <div class="small text-muted">Mã vận đơn</div>
                                <div class="fw-semibold text-dark">${packaging.shippingLabel}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderHarnessOverview() {
        const order = this.searchResult.orderInfo;
        const measurements = this.searchResult.measurements;
        
        return `
            <div class="card shadow-sm mb-4 border-0">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2 class="h4 fw-bold text-dark mb-0">Thông tin đơn hàng & sản phẩm</h2>
                        <span class="status-badge status-pass">
                            <i class="bi bi-check-circle me-1"></i>
                            ${order.status}
                        </span>
                    </div>
                    <div class="row g-4">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Serial Number</div>
                                <div class="fw-semibold text-dark">${this.searchResult.serial}</div>
                            </div>
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Mã đơn hàng</div>
                                <div class="fw-semibold text-dark">${order.orderCode}</div>
                            </div>
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Ngày đặt hàng</div>
                                <div class="fw-semibold text-dark">${order.orderDate}</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Khách hàng</div>
                                <div class="fw-semibold text-dark">${order.customer}</div>
                            </div>
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Model</div>
                                <div class="fw-semibold text-dark">${order.model}</div>
                            </div>
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Size / Màu</div>
                                <div class="fw-semibold text-dark">${order.size} / ${order.color}</div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Số lượng đơn hàng</div>
                                <div class="fw-semibold text-dark">${order.quantity} cái</div>
                            </div>
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Độ ưu tiên</div>
                                <span class="status-badge" style="background-color: #cfe2ff; color: #0c4a6e;">${order.priority}</span>
                            </div>
                            <div class="mb-3">
                                <div class="small text-muted mb-1">Ngày xuất hàng</div>
                                <div class="fw-semibold text-dark">${order.shipDate}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card shadow-sm border-0">
                <div class="card-body p-4">
                    <h2 class="h4 fw-bold text-dark mb-4">Thông số đo sản phẩm</h2>
                    <div class="row g-3">
                        <div class="col-md-3">
                            <div class="info-card blue">
                                <div class="small text-muted mb-1">Trọng lượng</div>
                                <div class="fw-semibold text-dark h5">${measurements.weight}</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="info-card blue">
                                <div class="small text-muted mb-1">Kích thước tổng thể</div>
                                <div class="fw-semibold text-dark h5">${measurements.dimensions}</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="info-card blue">
                                <div class="small text-muted mb-1">Chiều rộng ghế</div>
                                <div class="fw-semibold text-dark">${measurements.seatWidth}</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="info-card blue">
                                <div class="small text-muted mb-1">Chiều cao lưng</div>
                                <div class="fw-semibold text-dark">${measurements.backHeight}</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="info-card blue">
                                <div class="small text-muted mb-1">Chiều dài dây đai</div>
                                <div class="fw-semibold text-dark">${measurements.strapLength}</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="info-card blue">
                                <div class="small text-muted mb-1">Độ dày foam</div>
                                <div class="fw-semibold text-dark">${measurements.foamThickness}</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="info-card green">
                                <div class="small text-muted mb-1">Độ bền dây đai</div>
                                <div class="fw-semibold text-success">${measurements.straps}</div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="info-card green">
                                <div class="small text-muted mb-1">Khóa gài</div>
                                <div class="fw-semibold text-success">${measurements.buckles}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderMaterialOverview() {
        const receiveInfo = this.searchResult.receiveInfo;
        
        return `
            <div class="card shadow-sm mb-4 border-0">
                <div class="card-body p-4">
                    <h2 class="h4 fw-bold text-dark mb-4">Thông tin nguyên vật liệu</h2>
                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="info-card blue mb-3">
                                <div class="small text-muted mb-1">Số PO</div>
                                <div class="fw-semibold text-dark text-monospace">${this.searchResult.poNumber}</div>
                            </div>
                            <div class="info-card blue mb-3">
                                <div class="small text-muted mb-1">Số lô / Batch</div>
                                <div class="fw-semibold text-dark text-monospace">${this.searchResult.lot}</div>
                                <div class="fw-medium text-muted text-monospace small mt-1">${this.searchResult.batch}</div>
                            </div>
                            <div class="info-card blue mb-3">
                                <div class="small text-muted mb-1">Loại vật liệu</div>
                                <div class="fw-semibold text-dark">${this.searchResult.material}</div>
                            </div>
                            <div class="info-card blue">
                                <div class="small text-muted mb-1">Mã vật liệu</div>
                                <div class="fw-semibold text-dark text-monospace">${this.searchResult.materialCode}</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card green mb-3">
                                <div class="small text-muted mb-1">Nhà cung cấp</div>
                                <div class="fw-semibold text-dark">${this.searchResult.supplier}</div>
                                <div class="small text-muted mt-1">${this.searchResult.supplierContact}</div>
                            </div>
                            <div class="info-card blue mb-3">
                                <div class="small text-muted mb-1">Ngày nhận hàng</div>
                                <div class="fw-semibold text-dark">${receiveInfo.receiveDate}</div>
                            </div>
                            <div class="info-card blue mb-3">
                                <div class="small text-muted mb-1">Vị trí kho</div>
                                <div class="fw-semibold text-dark">${receiveInfo.warehouse}</div>
                                <div class="small text-muted mt-1">Kệ: ${receiveInfo.shelf}</div>
                            </div>
                            <div class="info-card purple">
                                <div class="small text-muted mb-1">Giá trị đơn hàng</div>
                                <div class="fw-bold text-purple-900 h4">${receiveInfo.totalValue}</div>
                                <div class="small text-muted mt-1">${receiveInfo.quantity} × ${receiveInfo.price}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderTimeline() {
        const content = document.getElementById('timelineContent');
        if (!content || !this.searchResult || !this.searchResult.productionTimeline) return;
        
        const timeline = this.searchResult.productionTimeline;
        
        content.innerHTML = `
            <div class="card shadow-sm border-0">
                <div class="card-body p-4">
                    <h2 class="h4 fw-bold text-slate-800 mb-4">Tiến độ sản xuất ${this.searchResult.type.toLowerCase()}</h2>
                    <div class="timeline">
                        ${timeline.map((stage, idx) => `
                            <div class="timeline-item">
                                <div class="timeline-icon ${stage.status === 'completed' ? 'completed' : 'pending'}">
                                    <i class="bi ${stage.status === 'completed' ? 'bi-check-circle' : 'bi-clock'}"></i>
                                </div>
                                <div class="timeline-content">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <div class="fw-semibold text-slate-800">${stage.stage}</div>
                                        ${stage.delay !== 0 ? `
                                            <span class="status-badge ${stage.delay > 0 ? 'status-warning' : 'status-pass'}">
                                                ${stage.delay > 0 ? '+' : ''}${stage.delay} ngày
                                            </span>
                                        ` : ''}
                                    </div>
                                    <div class="row g-3 small">
                                        <div class="col-md-12">
                                            <span class="text-slate-600">Thực tế: </span>
                                            <span class="fw-medium text-slate-800">${stage.actual}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderQC() {
        const content = document.getElementById('qcContent');
        if (!content || !this.searchResult) return;
        
        if (this.searchType === 'paraglider') {
            const qcReports = this.searchResult.qcReports;
            if (!qcReports) return;
            
            content.innerHTML = `
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h2 class="h4 fw-bold text-slate-800 mb-4">Lịch sử kiểm tra chất lượng dù lượn</h2>
                        <div class="qc-reports">
                            ${qcReports.map((report, idx) => `
                                <div class="qc-report-card ${report.defects > 0 ? 'warning' : ''}">
                                    <div class="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <div class="fw-semibold text-slate-800 h5">${report.stage}</div>
                                            <div class="small text-slate-600 mt-1">
                                                <i class="bi bi-calendar me-1"></i>
                                                ${report.date} - QC: ${report.inspector}
                                            </div>
                                        </div>
                                        <span class="status-badge ${report.status === 'Đạt' ? 'status-pass' : 'status-fail'}">
                                            ${report.status}
                                        </span>
                                    </div>
                                    
                                    <div class="row g-3 mb-3">
                                        ${report.sewer ? `
                                            <div class="col-md-6">
                                                <div class="d-flex align-items-center gap-2 small">
                                                    <i class="bi bi-person text-slate-500"></i>
                                                    <span class="text-slate-600">Người may:</span>
                                                    <span class="fw-medium text-slate-800">${report.sewer}</span>
                                                </div>
                                            </div>
                                        ` : ''}
                                        ${report.sewingTime ? `
                                            <div class="col-md-6">
                                                <div class="d-flex align-items-center gap-2 small">
                                                    <i class="bi bi-clock text-slate-500"></i>
                                                    <span class="text-slate-600">Thời gian may:</span>
                                                    <span class="fw-medium text-slate-800">${report.sewingTime}</span>
                                                </div>
                                            </div>
                                        ` : ''}
                                        ${report.testPressure ? `
                                            <div class="col-md-6">
                                                <div class="d-flex align-items-center gap-2 small">
                                                    <i class="bi bi-gear text-slate-500"></i>
                                                    <span class="text-slate-600">Áp suất test:</span>
                                                    <span class="fw-medium text-slate-800">${report.testPressure}</span>
                                                </div>
                                            </div>
                                        ` : ''}
                                        ${report.holdTime ? `
                                            <div class="col-md-6">
                                                <div class="d-flex align-items-center gap-2 small">
                                                    <i class="bi bi-clock text-slate-500"></i>
                                                    <span class="text-slate-600">Thời gian giữ:</span>
                                                    <span class="fw-medium text-slate-800">${report.holdTime}</span>
                                                </div>
                                            </div>
                                        ` : ''}
                                    </div>

                                    <div class="d-flex align-items-start gap-2 p-3 bg-white rounded border">
                                        <div class="d-flex align-items-center gap-2 flex-shrink-0">
                                            <i class="bi ${report.defects > 0 ? 'bi-exclamation-triangle text-warning' : 'bi-check-circle text-success'}"></i>
                                            <span class="small fw-medium text-slate-700">
                                                Lỗi: ${report.defects}
                                            </span>
                                        </div>
                                        <div class="flex-grow-1">
                                            <div class="small text-slate-800">${report.notes}</div>
                                            ${report.defectDetails ? `
                                                <div class="small text-warning mt-1 fst-italic">Chi tiết: ${report.defectDetails}</div>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else if (this.searchType === 'harness') {
            const qcReport = this.searchResult.qcReport;
            if (!qcReport) return;
            
            content.innerHTML = `
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h2 class="h4 fw-bold text-slate-800 mb-4">Báo cáo kiểm tra chất lượng ghế bay</h2>
                        <div class="info-card green mb-4">
                            <div class="d-flex align-items-start gap-3">
                                <i class="bi bi-check-circle text-success fs-3 flex-shrink-0 mt-1"></i>
                                <div class="flex-grow-1">
                                    <div class="fw-bold text-slate-800 h5 mb-2">
                                        Kiểm tra hoàn thành - ${qcReport.status}
                                    </div>
                                    <div class="small text-slate-600">
                                        <div>Ngày kiểm tra: ${qcReport.date}</div>
                                        <div>Người kiểm tra: ${qcReport.inspector}</div>
                                        <div class="mt-3 text-slate-700">${qcReport.notes}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 class="fw-bold text-slate-800 mb-3">Kết quả kiểm tra chi tiết</h3>
                        <div class="qc-tests">
                            ${qcReport.testResults.map((test, idx) => `
                                <div class="d-flex align-items-center justify-content-between p-3 bg-slate-50 rounded border mb-2">
                                    <div class="flex-grow-1">
                                        <div class="fw-semibold text-slate-800 mb-1">${test.test}</div>
                                        <div class="small text-slate-600">
                                            Giá trị đo: <span class="fw-medium text-slate-800">${test.value}</span>
                                        </div>
                                        <div class="small text-slate-600">
                                            Tiêu chuẩn: <span class="fw-medium text-slate-700">${test.standard}</span>
                                        </div>
                                    </div>
                                    <span class="status-badge ${test.result === 'Pass' ? 'status-pass' : 'status-fail'}">
                                        ${test.result}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else if (this.searchType === 'material') {
            const iqcReport = this.searchResult.iqcReport;
            if (!iqcReport) return;
            
            content.innerHTML = `
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h2 class="h4 fw-bold text-slate-800 mb-4">Báo cáo kiểm tra chất lượng đầu vào (IQC)</h2>
                        <div class="info-card green mb-4">
                            <div class="d-flex align-items-start gap-3">
                                <i class="bi bi-check-circle text-success fs-3 flex-shrink-0 mt-1"></i>
                                <div class="flex-grow-1">
                                    <div class="fw-bold text-slate-800 h5 mb-2">
                                        Kiểm tra hoàn thành - ${iqcReport.status}
                                    </div>
                                    <div class="small text-slate-600">
                                        <div>Ngày kiểm tra: ${iqcReport.date}</div>
                                        <div>Người kiểm tra: ${iqcReport.inspector}</div>
                                        <div>Thời gian kiểm tra: ${iqcReport.inspectionTime}</div>
                                        <div class="mt-3 text-slate-700">${iqcReport.notes}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 class="fw-bold text-slate-800 mb-3">Kết quả kiểm tra chi tiết</h3>
                        <div class="qc-tests">
                            ${iqcReport.tests.map((test, idx) => `
                                <div class="d-flex align-items-center justify-content-between p-3 bg-slate-50 rounded border mb-2">
                                    <div class="flex-grow-1">
                                        <div class="fw-semibold text-slate-800 mb-1">${test.test}</div>
                                        <div class="small text-slate-600">
                                            Giá trị đo: <span class="fw-medium text-slate-800">${test.value}</span>
                                        </div>
                                        <div class="small text-slate-600">
                                            Tiêu chuẩn: <span class="fw-medium text-slate-700">${test.standard}</span>
                                        </div>
                                        <div class="small text-slate-600">
                                            Phương pháp: <span class="fw-medium text-slate-700">${test.method}</span>
                                        </div>
                                    </div>
                                    <span class="status-badge ${test.result === 'Pass' ? 'status-pass' : 'status-fail'}">
                                        ${test.result}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="mt-4">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <div class="info-card blue">
                                        <div class="small text-muted mb-1">Mẫu giữ lại</div>
                                        <div class="fw-semibold text-dark">${iqcReport.sampleRetained}</div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="info-card green">
                                        <div class="small text-muted mb-1">Chứng chỉ</div>
                                        <div class="fw-semibold text-dark">${iqcReport.certificate}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    renderMaterials() {
        const content = document.getElementById('materialsContent');
        if (!content || !this.searchResult) return;
        
        if (this.searchType === 'material') {
            const inventoryStatus = this.searchResult.inventoryStatus;
            const usageHistory = this.searchResult.usageHistory;
            const documents = this.searchResult.documents;
            
            content.innerHTML = `
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h2 class="h4 fw-bold text-slate-800 mb-4">Tình trạng tồn kho</h2>
                        <div class="row g-3 mb-4">
                            <div class="col-md-3">
                                <div class="info-card blue">
                                    <div class="small text-muted mb-1">Tổng số lượng</div>
                                    <div class="fw-semibold text-dark h5">${inventoryStatus.total}</div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="info-card orange">
                                    <div class="small text-muted mb-1">Đã sử dụng</div>
                                    <div class="fw-semibold text-dark h5">${inventoryStatus.used}</div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="info-card green">
                                    <div class="small text-muted mb-1">Còn lại</div>
                                    <div class="fw-semibold text-dark h5">${inventoryStatus.remaining}</div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="info-card purple">
                                    <div class="small text-muted mb-1">Có thể sử dụng</div>
                                    <div class="fw-semibold text-dark h5">${inventoryStatus.available}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <div class="info-card yellow">
                                    <div class="small text-muted mb-1">Đã đặt trước</div>
                                    <div class="fw-semibold text-dark">${inventoryStatus.reserved}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-card indigo">
                                    <div class="small text-muted mb-1">Hạn sử dụng</div>
                                    <div class="fw-semibold text-dark">${inventoryStatus.expiryDate}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="info-card ${inventoryStatus.status === 'In Stock' ? 'green' : 'red'}">
                            <div class="small text-muted mb-1">Trạng thái</div>
                            <div class="fw-semibold text-dark">${inventoryStatus.status}</div>
                        </div>
                    </div>
                </div>

                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h2 class="h4 fw-bold text-slate-800 mb-4">Lịch sử sử dụng</h2>
                        <div class="table-responsive">
                            <table class="table table-custom">
                                <thead>
                                    <tr>
                                        <th>Ngày sử dụng</th>
                                        <th>Đơn hàng</th>
                                        <th>Số lượng</th>
                                        <th>Mục đích</th>
                                        <th>Người sử dụng</th>
                                        <th>Còn lại</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${usageHistory.map(usage => `
                                        <tr>
                                            <td>${usage.date}</td>
                                            <td class="text-monospace">${usage.order}</td>
                                            <td>${usage.quantity}</td>
                                            <td>${usage.purpose}</td>
                                            <td>${usage.usedBy}</td>
                                            <td>${usage.remaining}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h2 class="h4 fw-bold text-slate-800 mb-4">Tài liệu liên quan</h2>
                        <div class="row g-3">
                            ${documents.map(doc => `
                                <div class="col-md-6">
                                    <div class="document-card">
                                        <div class="d-flex align-items-center gap-3">
                                            <i class="bi bi-file-earmark-pdf text-danger fs-4"></i>
                                            <div class="flex-grow-1">
                                                <div class="fw-semibold text-slate-800">${doc.name}</div>
                                                <div class="small text-slate-600">${doc.file}</div>
                                                <div class="small text-slate-500">${doc.date}</div>
                                            </div>
                                            <button class="btn btn-outline-primary btn-sm">
                                                <i class="bi bi-download me-1"></i>Tải về
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else {
            // For paraglider and harness
            const result = this.searchResult;
            
            content.innerHTML = `
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h2 class="h4 fw-bold text-slate-800 mb-4">Nguyên vật liệu sử dụng</h2>
                        <div class="row g-3">
                            ${result.materials.map(material => `
                                <div class="col-md-6">
                                    <div class="material-card">
                                        <div class="d-flex justify-content-between align-items-start mb-2">
                                            <h6 class="fw-semibold mb-0">${material.fabric}</h6>
                                            <span class="badge bg-primary">${material.quantity}</span>
                                        </div>
                                        <p class="text-muted mb-1">
                                            <strong>Mã:</strong> ${material.code}
                                        </p>
                                        <p class="text-muted mb-1">
                                            <strong>Batch:</strong> ${material.batch}
                                        </p>
                                        <p class="text-muted mb-1">
                                            <strong>Lot:</strong> ${material.lot}
                                        </p>
                                        <p class="text-muted mb-1">
                                            <strong>Nhà cung cấp:</strong> ${material.supplier}
                                        </p>
                                        <p class="text-muted mb-1">
                                            <strong>Ngày nhận:</strong> ${material.receiveDate}
                                        </p>
                                        <p class="text-muted mb-1">
                                            <strong>Ngày QC:</strong> ${material.qcDate}
                                        </p>
                                        <p class="text-muted mb-1">
                                            <strong>Trạng thái QC:</strong> 
                                            <span class="status-badge ${material.qcStatus === 'Pass' ? 'status-pass' : 'status-fail'}">
                                                ${material.qcStatus}
                                            </span>
                                        </p>
                                        <p class="text-muted mb-1">
                                            <strong>Kho:</strong> ${material.warehouse}
                                        </p>
                                        ${material.expiryDate ? `<p class="text-muted mb-0"><strong>Hạn sử dụng:</strong> ${material.expiryDate}</p>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        ${result.accessories ? `
                        <div class="mt-4">
                            <h6 class="fw-semibold mb-3">
                                <i class="bi bi-tools text-info me-2"></i>
                                Phụ kiện
                            </h6>
                            <div class="row g-3">
                                ${result.accessories.map(accessory => `
                                    <div class="col-md-6">
                                        <div class="material-card">
                                            <div class="d-flex justify-content-between align-items-start mb-2">
                                                <h6 class="fw-semibold mb-0">${accessory.name}</h6>
                                                <span class="badge bg-success">${accessory.quantity}</span>
                                            </div>
                                            <p class="text-muted mb-1">
                                                <strong>Mã:</strong> ${accessory.code}
                                            </p>
                                            <p class="text-muted mb-1">
                                                <strong>Nhà cung cấp:</strong> ${accessory.supplier}
                                            </p>
                                            <p class="text-muted mb-1">
                                                <strong>Batch:</strong> ${accessory.batch}
                                            </p>
                                            <p class="text-muted mb-0">
                                                <strong>QC:</strong> 
                                                <span class="status-badge ${accessory.qcStatus === 'Pass' ? 'status-pass' : 'status-fail'}">
                                                    ${accessory.qcStatus}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    }

    renderCutting() {
        const content = document.getElementById('cuttingContent');
        if (!content || !this.searchResult) return;
        
        if (this.searchType === 'paraglider') {
            const cuttingInfo = this.searchResult.cuttingInfo;
            const fabricCompensation = this.searchResult.fabricCompensation;
            
            if (!cuttingInfo) {
                content.innerHTML = '<div class="card"><div class="card-body text-center text-muted">Không có thông tin cắt cho loại sản phẩm này</div></div>';
                return;
            }
            
            content.innerHTML = `
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <h2 class="h4 fw-bold text-slate-800 mb-4">Thông tin cắt vải</h2>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="info-card blue">
                                    <div class="small text-muted mb-1">Thời gian bắt đầu</div>
                                    <div class="fw-semibold text-dark">${cuttingInfo.startDate}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-card green">
                                    <div class="small text-muted mb-1">Thời gian kết thúc</div>
                                    <div class="fw-semibold text-dark">${cuttingInfo.endDate}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-card orange">
                                    <div class="small text-muted mb-1">Người vận hành</div>
                                    <div class="fw-semibold text-dark">${cuttingInfo.operator}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-card purple">
                                    <div class="small text-muted mb-1">Giường cắt</div>
                                    <div class="fw-semibold text-dark">${cuttingInfo.cuttingBed}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-card indigo">
                                    <div class="small text-muted mb-1">Vải sử dụng</div>
                                    <div class="fw-semibold text-dark">${cuttingInfo.fabricUsed}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-card teal">
                                    <div class="small text-muted mb-1">Vải hao phí</div>
                                    <div class="fw-semibold text-dark">${cuttingInfo.fabricWaste}</div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="info-card red">
                                    <div class="small text-muted mb-1">Ghi chú</div>
                                    <div class="fw-semibold text-dark">${cuttingInfo.notes}</div>
                                </div>
                            </div>
                        </div>
                        
                        ${fabricCompensation && fabricCompensation.length > 0 ? `
                        <div class="mt-4">
                            <h3 class="fw-bold text-slate-800 mb-3">
                                <i class="bi bi-exclamation-triangle text-warning me-2"></i>
                                Bù vải
                            </h3>
                            <div class="row g-3">
                                ${fabricCompensation.map(comp => `
                                    <div class="col-md-6">
                                        <div class="compensation-card">
                                            <div class="d-flex justify-content-between align-items-start mb-2">
                                                <h6 class="fw-semibold mb-0">${comp.date}</h6>
                                                <span class="badge bg-warning">${comp.quantity} m</span>
                                            </div>
                                            <p class="text-muted mb-1">
                                                <strong>Lý do:</strong> ${comp.reason}
                                            </p>
                                            <p class="text-muted mb-1">
                                                <strong>Yêu cầu bởi:</strong> ${comp.requestBy}
                                            </p>
                                            <p class="text-muted mb-1">
                                                <strong>Phê duyệt bởi:</strong> ${comp.approvedBy}
                                            </p>
                                            <p class="text-muted mb-0">
                                                <strong>Trạng thái:</strong> ${comp.status}
                                            </p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        } else {
            content.innerHTML = '<div class="card"><div class="card-body text-center text-muted">Thông tin cắt chỉ áp dụng cho dù lượn</div></div>';
        }
    }

    renderMetrics() {
        const content = document.getElementById('metricsContent');
        if (!content || !this.searchResult) return;
        
        const result = this.searchResult;
        
        content.innerHTML = `
            <div class="card shadow-sm border-0">
                <div class="card-body p-4">
                    <h2 class="h4 fw-bold text-slate-800 mb-4">Chỉ số chất lượng</h2>
                    <div class="row g-3">
                        <div class="col-md-6 col-lg-3">
                            <div class="metric-card blue">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-exclamation-triangle icon-2xl me-3"></i>
                                    <div>
                                        <h6 class="fw-semibold mb-1">Tổng số lỗi</h6>
                                        <h4 class="mb-0">${result.qualityMetrics.totalDefects}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="metric-card orange">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-arrow-repeat icon-2xl me-3"></i>
                                    <div>
                                        <h6 class="fw-semibold mb-1">Số lần làm lại</h6>
                                        <h4 class="mb-0">${result.qualityMetrics.reworkCount}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="metric-card indigo">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-clock icon-2xl me-3"></i>
                                    <div>
                                        <h6 class="fw-semibold mb-1">Thời gian may TB</h6>
                                        <h4 class="mb-0">${result.qualityMetrics.avgSewingTime}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3">
                            <div class="metric-card teal">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-truck icon-2xl me-3"></i>
                                    <div>
                                        <h6 class="fw-semibold mb-1">Giao hàng</h6>
                                        <h4 class="mb-0">${result.qualityMetrics.onTimeDelivery}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    ${result.equipmentUsed ? `
                    <div class="mt-4">
                        <h3 class="fw-bold text-slate-800 mb-3">
                            <i class="bi bi-gear text-secondary me-2"></i>
                            Thiết bị sử dụng
                        </h3>
                        <div class="row g-3">
                            ${result.equipmentUsed.map(equipment => `
                                <div class="col-md-6">
                                    <div class="equipment-card">
                                        <div class="d-flex justify-content-between align-items-start mb-2">
                                            <h6 class="fw-semibold mb-0">${equipment.name}</h6>
                                            <span class="badge bg-success">${equipment.status}</span>
                                        </div>
                                        <p class="text-muted mb-0">
                                            <strong>Mã:</strong> ${equipment.code}
                                        </p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    ${result.packagingInfo ? `
                    <div class="mt-4">
                        <h3 class="fw-bold text-slate-800 mb-3">
                            <i class="bi bi-box text-warning me-2"></i>
                            Thông tin đóng gói
                        </h3>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="info-card blue">
                                    <div class="small text-muted mb-1">Ngày đóng gói</div>
                                    <div class="fw-semibold text-dark">${result.packagingInfo.packingDate}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-card green">
                                    <div class="small text-muted mb-1">Người đóng gói</div>
                                    <div class="fw-semibold text-dark">${result.packagingInfo.packer}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-card orange">
                                    <div class="small text-muted mb-1">Số hộp</div>
                                    <div class="fw-semibold text-dark">${result.packagingInfo.boxNumber}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-card purple">
                                    <div class="small text-muted mb-1">Trọng lượng</div>
                                    <div class="fw-semibold text-dark">${result.packagingInfo.weight}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-card indigo">
                                    <div class="small text-muted mb-1">Kích thước</div>
                                    <div class="fw-semibold text-dark">${result.packagingInfo.dimensions}</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="info-card teal">
                                    <div class="small text-muted mb-1">Nhãn vận chuyển</div>
                                    <div class="fw-semibold text-dark">${result.packagingInfo.shippingLabel}</div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="info-card yellow">
                                    <div class="small text-muted mb-1">Nội dung bao gồm</div>
                                    <div class="fw-semibold text-dark">${result.packagingInfo.includeItems}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    setActiveTab(tabId) {
        this.activeTab = tabId.replace('#', '');
    }
}

// Initialize traceability system
let traceabilitySystem;

function initializeTraceability() {
    console.log('Initializing traceability system...');
    traceabilitySystem = new TraceabilitySystem();
    console.log('Traceability system initialized:', traceabilitySystem);
}

function setupEventListeners() {
    console.log('Setting up additional event listeners...');
    // Additional event listeners can be added here if needed
}
