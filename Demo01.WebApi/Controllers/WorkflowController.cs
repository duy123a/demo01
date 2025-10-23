using Microsoft.AspNetCore.Mvc;

namespace Demo01.WebApi.Controllers
{
    public class WorkflowController : Controller
    {
        public IActionResult Index() => View();

        [HttpGet]
        public IActionResult GetStatus()
        {
            var result = new Dictionary<string, StepStatus>
            {
                ["SewBottom"] = new StepStatus
                {
                    Status = "late",
                    Message = "Current behind the target LF"
                },
                ["QcTop"] = new StepStatus
                {
                    Status = "error",
                    Message = "QC scan tools are broken"
                }
            };

            return Json(result);
        }
    }

    public class StepStatus
    {
        public string Status { get; set; } = "";
        public string? Message { get; set; }
    }
}
