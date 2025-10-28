import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/main.css';

import * as bootstrap from 'bootstrap';
import $ from 'jquery';
import QrScanner from "qr-scanner";

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

// Handle logout confirmation
document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('confirmLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            window.location.href = '/Account/Logout';
        });
    }
});

// QR Code Scanning Logic
document.addEventListener("DOMContentLoaded", () => {
    let qrScanner;
    let isStarting = false;

    const qrModalEl = document.getElementById("qrScanModal");
    const qrModal = new bootstrap.Modal(qrModalEl);
    const qrReader = document.getElementById("qr-reader");
    const qrVideo = document.getElementById("qr-video");
    const qrResult = document.getElementById("qr-result");
    const qrLoading = document.getElementById("qr-loading");

    if (!qrReader || !qrVideo) {
        console.error("Missing video element for QR scanner");
        return;
    }

    async function stopAndReleaseCamera() {
        try {
            if (qrScanner) {
                await qrScanner.stop();
                qrScanner.destroy();
                qrScanner = null;
            }
            if (qrVideo.srcObject) {
                qrVideo.srcObject.getTracks().forEach(t => t.stop());
                qrVideo.srcObject = null;
            }
        } catch (err) {
            console.warn("Failed to stop camera:", err);
        }
    }

    async function startScanner() {
        if (isStarting) return;
        isStarting = true;
        qrLoading.classList.remove("d-none");

        await stopAndReleaseCamera();

        try {
            // Safari delay to ensure DOM is stable
            await new Promise(r => setTimeout(r, 200));

            qrScanner = new QrScanner(
                qrVideo, // ✅ pass the real <video> element
                result => {
                    qrResult.textContent = "✅ " + result.data;
                    qrModal.hide();
                    stopAndReleaseCamera();

                    try {
                        // try to build full URL (supports relative URLs)
                        const parsed = new URL(result.data, location.href);

                        // allow only http/https
                        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
                            showErrorToast("Refused to redirect: unsupported URL protocol.");
                            return;
                        }

                        // allow only same origin (protocol + host + port)
                        if (parsed.origin === location.origin) {
                            // safe to redirect to same-origin URL
                            window.location.href = parsed.href;
                        } else {
                            // not same origin — don't redirect automatically
                            showErrorToast("Refused to redirect to external domain.");
                            // optional: show a safe link user can click if you want:
                            // qrResult.innerHTML = `Detected external URL: <a href="${escapeHtml(parsed.href)}" target="_blank" rel="noopener noreferrer">${parsed.href}</a>`;
                        }
                    } catch (err) {
                        // not a valid url (could be plain text) — treat as text
                        console.log("Decoded QR is not a valid URL:", result.data);
                        showSuccessToast("QR Result: " + result.data);
                    }
                },
                {
                    preferredCamera: "environment",
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                }
            );

            await qrScanner.start();

            // Ensure Safari can autoplay inline video
            qrVideo.setAttribute("playsinline", true);
            qrVideo.muted = true;
            await qrVideo.play().catch(() => { });

        } catch (err) {
            console.error("❌ Failed to start camera:", err);
            showErrorToast("Failed to start camera: " + err.message);
        } finally {
            qrLoading.classList.add("d-none");
            isStarting = false;
        }
    }

    document.getElementById("btnQrScan")?.addEventListener("click", () => {
        qrResult.textContent = "";
        qrModal.show();
    });

    qrModalEl.addEventListener("shown.bs.modal", startScanner);
    qrModalEl.addEventListener("hidden.bs.modal", stopAndReleaseCamera);
});

