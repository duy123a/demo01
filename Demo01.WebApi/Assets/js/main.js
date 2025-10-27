import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/main.css';

import * as bootstrap from 'bootstrap';
import $ from 'jquery';
window.bootstrap = bootstrap;

window.togglePasswordVisibility = function (inputId, btn) {
    const input = document.getElementById(inputId);
    if (input) {
        const icon = btn.querySelector('i');

        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove("bi-eye");
            icon.classList.add("bi-eye-slash");
        } else {
            input.type = "password";
            icon.classList.remove("bi-eye-slash");
            icon.classList.add("bi-eye");
        }
    }
};

window.showLoading = function () {
    document.getElementById("loadingOverlay")?.classList.remove("d-none");

    document.querySelectorAll("button[type=submit], input[type=submit]").forEach(btn => {
        btn.disabled = true;
    });
};

window.hideLoading = function () {
    document.getElementById("loadingOverlay")?.classList.add("d-none");

    document.querySelectorAll("button[type=submit], input[type=submit]").forEach(btn => {
        btn.disabled = false;
    });
};

window.showLogoutModal = function () {
    const modal = new bootstrap.Modal(document.getElementById('confirmLogoutModal'));
    modal.show();
}

window.debounce = (func, delay) => {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
};

// Toast utility functions
window.showToast = function (type, message) {
    const toastId = type + 'Toast';
    const messageId = type + 'ToastMessage';

    const toastElement = document.getElementById(toastId);
    const messageElement = document.getElementById(messageId);

    if (toastElement && messageElement) {
        messageElement.textContent = message;
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    }
};

window.showSuccessToast = function (message) {
    window.showToast('success', message);
};

window.showWarningToast = function (message) {
    window.showToast('warning', message);
};

window.showErrorToast = function (message) {
    window.showToast('error', message);
};

window.showSuccessToastAfterRedirect = function (message) {
    localStorage.setItem('toastMessage', message);
}

document.addEventListener('DOMContentLoaded', () => {
    const msg = localStorage.getItem('toastMessage');
    if (msg) {
        window.showSuccessToast(msg);
        localStorage.removeItem('toastMessage');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Handle logout confirmation
    const logoutBtn = document.getElementById('confirmLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            window.location.href = '/Account/Logout';
        });
    }

    // Handle menu toggles for desktop and mobile
    initMenuToggles();
});

// Menu toggle functionality
function initMenuToggles() {
    // Desktop menu toggles
    setupMenuToggle('maintenanceMenuToggle', 'maintenanceSubmenu', 'maintenanceMenuIcon');
    setupMenuToggle('iqcMenuToggle', 'iqcSubmenu', 'iqcMenuIcon');
    
    // Mobile menu toggles
    setupMenuToggle('maintenanceMenuToggleMobile', 'maintenanceSubmenuMobile', 'maintenanceMenuIconMobile');
    setupMenuToggle('iqcMenuToggleMobile', 'iqcSubmenuMobile', 'iqcMenuIconMobile');
    
    // Auto-expand submenus if any submenu item is active
    autoExpandActiveSubmenus();
}

// Function to automatically expand submenus containing active items
function autoExpandActiveSubmenus() {
    // Desktop submenus
    const desktopSubmenus = [
        { menuId: 'maintenanceSubmenu', iconId: 'maintenanceMenuIcon' },
        { menuId: 'iqcSubmenu', iconId: 'iqcMenuIcon' }
    ];
    
    // Mobile submenus
    const mobileSubmenus = [
        { menuId: 'maintenanceSubmenuMobile', iconId: 'maintenanceMenuIconMobile' },
        { menuId: 'iqcSubmenuMobile', iconId: 'iqcMenuIconMobile' }
    ];
    
    [...desktopSubmenus, ...mobileSubmenus].forEach(({ menuId, iconId }) => {
        const submenu = document.getElementById(menuId);
        const icon = document.getElementById(iconId);
        
        if (submenu && icon) {
            // Check if any link in this submenu has the 'active' class
            const hasActiveLink = submenu.querySelector('.sidebar-link.active') !== null;
            
            if (hasActiveLink) {
                submenu.classList.remove('d-none');
                icon.classList.remove('bi-chevron-down');
                icon.classList.add('bi-chevron-up');
            }
        }
    });
}

function setupMenuToggle(toggleId, submenuId, iconId) {
    const toggle = document.getElementById(toggleId);
    const submenu = document.getElementById(submenuId);
    const icon = document.getElementById(iconId);
    
    if (toggle && submenu && icon) {
        toggle.addEventListener('click', function() {
            submenu.classList.toggle('d-none');
            icon.classList.toggle('bi-chevron-down');
            icon.classList.toggle('bi-chevron-up');
        });
    }
}

// Dashboard is now loaded directly in the CSHTML file

document.addEventListener("DOMContentLoaded", () => {
    let html5QrCode;
    const qrModalEl = document.getElementById('qrScanModal');
    if (!qrModalEl) return;
    const qrModal = new bootstrap.Modal(qrModalEl);
    const qrReader = document.getElementById("qr-reader");
    const qrResult = document.getElementById("qr-result");
    if (!qrReader || !qrResult) return;

    // 🧹 Hàm dừng & giải phóng camera triệt để (fix cho iOS Safari)
    async function stopAndReleaseCamera() {
        try {
            if (html5QrCode) {
                await html5QrCode.stop();
            }
            const videoElem = qrReader.querySelector("video");
            if (videoElem && videoElem.srcObject) {
                videoElem.srcObject.getTracks().forEach(track => track.stop());
                videoElem.srcObject = null;
            }
        } catch (err) {
            console.warn("Không thể dừng camera:", err);
        } finally {
            qrReader.innerHTML = "";
        }
    }

    // 📱 Kiểm tra môi trường trước khi start
    async function checkCameraPermission() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("Thiết bị không hỗ trợ truy cập camera");
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === "videoinput");
        if (!hasCamera) throw new Error("Không tìm thấy camera");
    }

    // 📷 Hàm khởi động quét
    async function startScanner() {
        await stopAndReleaseCamera();
        html5QrCode = new Html5Qrcode("qr-reader");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        try {
            await html5QrCode.start(
                { facingMode: "environment" },
                config,
                async (decodedText) => {
                    console.log("QR content:", decodedText);
                    qrResult.textContent = "✅ " + decodedText;

                    await stopAndReleaseCamera();
                    qrModal.hide();

                    if (/^(https?:\/\/[^\s]+)/i.test(decodedText)) {
                        window.location.href = decodedText;
                    } else {
                        showSuccessToast("Kết quả QR: " + decodedText);
                    }
                },
                () => {} // Bỏ qua lỗi tạm thời
            );
        } catch (err) {
            console.error("❌ Không thể bật camera:", err);
            showErrorToast("Không thể bật camera: " + err.message);
        }
    }

    // 🟢 Click button mở modal
    document.getElementById("btnQrScan")?.addEventListener("click", async () => {
        qrResult.textContent = "";
        try {
            await checkCameraPermission();
            qrModal.show();
        } catch (err) {
            showErrorToast("⚠️ " + err.message);
        }
    });

    // 🚀 Khi modal hiển thị xong → bắt đầu quét
    qrModalEl.addEventListener("shown.bs.modal", async () => {
        await startScanner();
    });

    // 🔻 Khi modal đóng → dừng camera hoàn toàn
    qrModalEl.addEventListener("hidden.bs.modal", async () => {
        await stopAndReleaseCamera();
        html5QrCode = null;
    });
});
