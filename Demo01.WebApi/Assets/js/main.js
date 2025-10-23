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
});

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
