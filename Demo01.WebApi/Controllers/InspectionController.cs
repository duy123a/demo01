using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace Demo01.WebApi.Controllers
{
    // API Controller - File riêng
    [ApiController]
    [Route("api/[controller]")]
    public class InspectionController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly string _jsonFilePath;

        public InspectionController(IWebHostEnvironment env)
        {
            _env = env;
            _jsonFilePath = Path.Combine(_env.WebRootPath, "data", "inspection.json");
        }

        // GET: api/inspection
        [HttpGet]
        public async Task<IActionResult> GetData()
        {
            try
            {
                if (!System.IO.File.Exists(_jsonFilePath))
                {
                    return NotFound(new { message = "File không tồn tại" });
                }

                var jsonData = await System.IO.File.ReadAllTextAsync(_jsonFilePath);
                return Content(jsonData, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi đọc file", error = ex.Message });
            }
        }

        // POST: api/inspection/update
        [HttpPost("update")]
        public async Task<IActionResult> UpdateData([FromBody] JsonElement data)
        {
            try
            {
                var directory = Path.GetDirectoryName(_jsonFilePath);
                if (string.IsNullOrEmpty(directory)) return StatusCode(500, new { message = "Lỗi khi cập nhật file" });
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                var options = new JsonSerializerOptions
                {
                    WriteIndented = true,
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                };

                var jsonString = JsonSerializer.Serialize(data, options);
                await System.IO.File.WriteAllTextAsync(_jsonFilePath, jsonString, Encoding.UTF8);

                return Ok(new { message = "Cập nhật thành công", timestamp = DateTime.Now });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật file", error = ex.Message });
            }
        }
    }
}