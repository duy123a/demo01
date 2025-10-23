import '../css/workflow.css';
import * as bootstrap from 'bootstrap';
import $ from 'jquery';

const lines = [];

// Hàm nối 2 bước với LeaderLine
function connectStepsTop(fromId, toId) {
    const start = document.getElementById(fromId);
    const end = document.getElementById(toId);
    if (start && end) {
        const line = new LeaderLine(start, end, {
            color: '#666',
            endPlug: 'arrow3',
            size: 2,
            startSocket: 'bottom',
            endSocket: 'top',
            path: 'straight'
        });
        lines.push(line);
    }
}

function connectStepsRight(fromId, toId) {
    const start = document.getElementById(fromId);
    const end = document.getElementById(toId);
    if (start && end) {
        const line = new LeaderLine(start, end, {
            color: '#666',
            endPlug: 'arrow3',
            size: 2,
            startSocket: 'right',
            endSocket: 'left',
            path: 'straight'
        });
        lines.push(line);
    }
}

// Cập nhật trạng thái workflow
function initTooltips() {
    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    const allProcess = $(".process[title]");

    allProcess.each(function () {
        const el = this;

        const existing = bootstrap.Tooltip.getInstance(el);
        if (existing) existing.dispose();

        const tooltip = new bootstrap.Tooltip(el, {
            trigger: 'manual',
            placement: 'top'
        });

        if (isMobile) {
            // Click trên process toggle
            $(el).off('click').on('click', function (e) {
                e.stopPropagation();
                tooltip.toggle();
            });
        } else {
            // Desktop: hover
            $(el).hover(
                () => tooltip.show(),
                () => tooltip.hide()
            );
        }
    });

    if (isMobile) {
        // Click bất kỳ nơi nào ngoài process → hide tất cả
        $(document).off('click.mobileTooltip').on('click.mobileTooltip', function (e) {
            allProcess.each(function () {
                const t = bootstrap.Tooltip.getInstance(this);
                if (t && !$(e.target).closest(this).length) {
                    t.hide();
                }
            });
        });
    }
}

// Sau khi updateWorkflow xong, gọi initTooltips
function updateWorkflow() {
    $.getJSON('/Workflow/GetStatus', function (data) {
        $(".process").each(function () {
            const step = $(this).data("step");
            const info = data[step];
            if (!info) return;

            $(this).removeClass("normal warning late error")
                .addClass(info.status);

            if (info.message) {
                $(this).attr("title", info.message);
            } else {
                $(this).removeAttr("title");
            }
        });

        // Re-init tooltip để update message
        initTooltips();
    });
}

// Reposition tất cả LeaderLine
function refreshLines() {
    lines.forEach(line => line.position());
}

// Hàm init workflow
function initWorkflow() {
    // Cutting Department
    connectStepsRight("receiveFabric", "spreadFabric");
    connectStepsRight("spreadFabric", "cutFabric");
    connectStepsRight("cutFabric", "deliverFabric");
    connectStepsTop("deliverFabric", "receiveFabricSew");

    // Sewing Department
    connectStepsTop("receiveFabricSew", "joinTail");
    connectStepsTop("receiveFabricSew", "joinBottom");
    connectStepsTop("receiveFabricSew", "joinTop");
    connectStepsTop("receiveFabricSew", "sewPocket");
    connectStepsTop("joinTail", "qcJoin");
    connectStepsTop("sewPocket", "qcJoin");
    connectStepsTop("joinBottom", "qcJoin");
    connectStepsTop("joinTop", "qcJoin");
    connectStepsTop("qcJoin", "sewBottom");
    connectStepsTop("qcJoin", "sewTop");
    connectStepsTop("qcJoin", "sewTail");
    connectStepsTop("sewTail", "qcTail");
    connectStepsTop("sewBottom", "qcBottom");
    connectStepsTop("sewTop", "qcTop");
    connectStepsTop("qcTail", "qcFinal");
    connectStepsTop("qcBottom", "qcFinal");
    connectStepsTop("qcTop", "qcFinal");
    connectStepsTop("qcFinal", "packing");

    refreshLines();
    updateWorkflow();
}

// Chờ tất cả DOM + CSS + hình ảnh load xong
window.addEventListener('load', () => {
    // Đảm bảo layout đã ổn định
    requestAnimationFrame(initWorkflow);

    // Cập nhật workflow sau 1s
    setTimeout(refreshLines, 1000);
    setTimeout(refreshLines, 1000);

    // Khi scroll hoặc resize, cập nhật vị trí line
    window.addEventListener('scroll', refreshLines);
    window.addEventListener('resize', refreshLines);
});
