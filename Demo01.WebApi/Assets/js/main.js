import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/main.css';

import * as bootstrap from 'bootstrap';
import $ from 'jquery';

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
