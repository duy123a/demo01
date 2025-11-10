import * as bootstrap from 'bootstrap';
import * as signalR from "@microsoft/signalr";

document.addEventListener("noticeReady", function () {
    const badge = document.getElementById("notificationBadge");
    const list = document.getElementById("notificationList");
    const showMoreBtn = document.getElementById("showMoreBtn");
    const showMoreLi = document.getElementById("showMoreLi");
    const dropdownToggle = document.getElementById("notificationToggle");

    if (!badge || !list || !showMoreBtn || !showMoreLi || !dropdownToggle) return;

    let notificationSkip = 0;
    const notificationTake = 10;

    async function loadUnreadCount() {
        try {
            const res = await fetch("/api/notification/unread-count");
            if (!res.ok) return;

            const count = await res.json();
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove("d-none");
            } else {
                badge.classList.add("d-none");
            }
        } catch (e) {
            console.error("Failed to load unread count:", e);
        }
    }

    async function loadNotifications(skip = 0, take = 10, replace = false) {
        try {
            const res = await fetch(`/api/notification/list?skip=${skip}&take=${take}`);
            if (!res.ok) return;

            const data = await res.json();

            if (replace) {
                list.innerHTML = `<li class="dropdown-header fw-semibold">${t("Notifications")}</li>`;
                notificationSkip = 0; // reset skip
            }

            if (data.length === 0 && replace) {
                list.innerHTML += `<li><div class="text-center text-muted small p-2">${t("NoNotifications")}</div></li>`;
                showMoreLi.classList.add("d-none");
                return;
            }

            // append notifications
            const fragment = document.createDocumentFragment();
            data.forEach(n => {
                const li = document.createElement("li");
                const readClass = n.isRead ? "notification-read" : "notification-unread";
                const created = n.createdAt ? new Date(n.createdAt).toLocaleString() : "";

                li.innerHTML = `
                  <a href="${n.url || '#'}"
                     class="dropdown-item small d-flex flex-column notification-item ${readClass}"
                     data-id="${n.id}" data-url="${n.url || ''}">
                      <div class="text-muted small fst-italic text-end">${created}</div>
                      <div>${t(n.titleKey, n.titleParams)}</div>
                      <div class="text-muted">${t(n.messageKey, n.messageParams)}</div>
                  </a>
                `;
                fragment.appendChild(li);
            });

            // append show more li
            if (!replace) {
                list.insertBefore(fragment, showMoreLi);
            }
            else {
                fragment.appendChild(showMoreLi);
                list.appendChild(fragment);
            }

            // add click handlers
            list.querySelectorAll("a[data-id]").forEach(a => {
                a.addEventListener("click", async e => {
                    e.preventDefault();
                    const id = a.dataset.id;
                    const url = a.dataset.url;

                    try {
                        await fetch(`/api/notification/mark-as-read/${id}`, { method: "POST" });
                        a.classList.remove("fw-bold", "bg-danger-subtle", "notification-unread");
                        a.classList.add("bg-light", "notification-read");
                        await loadUnreadCount();
                    } catch (err) {
                        console.error("Failed to mark read", err);
                    }

                    if (!url) {
                        const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownToggle);
                        dropdown.show();
                    }
                    else {
                        window.location.href = url;
                    }
                });
            });

            notificationSkip += data.length;

            // Show/hide show more
            if (data.length < take) {
                showMoreLi.classList.add("d-none");
            } else {
                showMoreLi.classList.remove("d-none");
            }

            // keep dropdown open
            if (!replace) {
                const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownToggle);
                dropdown.show();
            }

        } catch (e) {
            console.error("Failed to load notifications:", e);
        }
    }

    // SignalR connection
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/notificationHub")
        .withAutomaticReconnect()
        .build();

    // refresh UI when getting new notification
    connection.on("NewNotification", function (notificationDto) {
        if (window.isAuthenticated) {
            loadUnreadCount();
            loadNotifications(0, notificationTake, true);
        }
    });

    connection.start()
        .then(() => console.log("SignalR connected"))
        .catch(err => console.error("SignalR error", err));

    // click Show More
    showMoreBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent dropdown auto-close
        loadNotifications(notificationSkip, notificationTake, false);
    });

    if (window.isAuthenticated) {
        loadUnreadCount();
        loadNotifications(0, notificationTake, true);
    }
});