using Microsoft.AspNetCore.Mvc;
using QRCoder;

namespace Demo01.WebApi.Controllers
{
    public class QrGenerateController : Controller
    {
        public IActionResult Index()
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var text = $"{baseUrl}/DataTemp";

            using var qrGenerator = new QRCodeGenerator();
            using var qrCodeData = qrGenerator.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q);
            using var qrCode = new PngByteQRCode(qrCodeData);
            var qrBytes = qrCode.GetGraphic(20);
            var base64 = Convert.ToBase64String(qrBytes);

            ViewBag.QrBase64 = $"data:image/png;base64,{base64}";
            return View();
        }
    }
}
