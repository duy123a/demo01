using Microsoft.AspNetCore.Mvc;
using QRCoder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Demo01.WebApi.Controllers
{
    public class QrGenerateController : Controller
    {
        public IActionResult Index()
        {
            var text = "http://localhost:5000/DataTemp";

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
