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
    const qrModal = new bootstrap.Modal(document.getElementById('qrScanModal'));
    const qrReader = document.getElementById("qr-reader");
    const qrResult = document.getElementById("qr-result");

    document.getElementById("btnQrScan")?.addEventListener("click", function () {
        qrResult.textContent = "";
        qrReader.innerHTML = "";
        var error = false;

        html5QrCode = new Html5Qrcode("qr-reader");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
                console.log("QR content:", decodedText);

                // Cập nhật giao diện
                qrResult.textContent = "✅ Quét thành công: " + decodedText;

                // Dừng quét để tránh quét lặp lại
                html5QrCode.stop().then(() => {
                    // Kiểm tra xem nội dung có phải là URL không
                    if (/^(https?:\/\/[^\s]+)/i.test(decodedText)) {
                        // Là URL → chuyển hướng
                        window.location.href = decodedText;
                    } else {
                        // Không phải URL → hiển thị nội dung
                        showSuccessToast("Kết quả QR: " + decodedText);
                    }
                }).catch(err => {
                    console.error("❌ Không thể dừng quét:", err);
                });
            },
            (errorMessage) => {
                // scanning... (bỏ qua lỗi tạm thời)
            }
           
        ).catch(err => {
            error = true;
            showErrorToast("❌ Không thể bật camera");
            
        });
        if (!error){
            qrModal.show();
        }
    });

    document.getElementById('qrScanModal').addEventListener('hidden.bs.modal', async () => {
        if (html5QrCode) await html5QrCode.stop();
    });
});
