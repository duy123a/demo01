using Microsoft.AspNetCore.Mvc;
using Demo01.Shared.Resources;
using Microsoft.Extensions.Localization;

namespace Demo01.WebApi.Controllers
{
    public class IQCController : Controller
    {
        private readonly IStringLocalizer<SharedResources> _localizer;

        public IQCController(IStringLocalizer<SharedResources> localizer)
        {
            _localizer = localizer;
        }

        // GET: IQC
        public IActionResult Index()
        {
            ViewData["Title"] = "IQC - Kiểm soát chất lượng vải đầu vào";
            ViewData["Page"] = "iqc";
            return View();
        }

        // GET: IQC/Dashboard
        public IActionResult Dashboard()
        {
            ViewData["Title"] = "IQC Dashboard - Kiểm soát chất lượng vải đầu vào";
            ViewData["Page"] = "iqc-dashboard";
            return View();
        }

        // GET: IQC/QCDashboard
        public IActionResult QCDashboard()
        {
            ViewData["Title"] = "Inuit QC Dashboard - Tổng quan chất lượng";
            ViewData["Page"] = "qc-dashboard";
            return View();
        }

        // POST: IQC/SaveInspection
        [HttpPost]
        public IActionResult SaveInspection([FromBody] object inspectionData)
        {
            // Mock save - trong thực tế sẽ lưu vào database
            return Json(new { Success = true, Message = "Đã lưu phiếu kiểm thành công!" });
        }

        // POST: IQC/SubmitForApproval
        [HttpPost]
        public IActionResult SubmitForApproval([FromBody] object inspectionData)
        {
            // Mock submit - trong thực tế sẽ gửi để duyệt
            return Json(new { Success = true, Message = "Đã gửi duyệt thành công!" });
        }

        // GET: IQC/ExportReport/{id}
        [HttpGet]
        public IActionResult ExportReport(string id)
        {
            // Mock export - trong thực tế sẽ tạo file báo cáo
            return Json(new { Success = true, Message = "Đã xuất báo cáo thành công!", FileName = $"IQC_Report_{id}.pdf" });
        }
    }
}
