using Demo01.Infrastructure.Entities;
using Demo01.Shared.Resources;
using Demo01.Shared.Services;
using Demo01.Shared.Utilities;
using Demo01.WebApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Localization;

namespace Demo01.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly IAppNotificationService _notificationService;
        private readonly UserManager<AppUser> _userManager;
        private readonly IStringLocalizer<SharedResources> _localizer;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IConfiguration _config;

        public NotificationController(
            IAppNotificationService notificationService,
            UserManager<AppUser> userManager,
            IStringLocalizer<SharedResources> localizer,
            IHubContext<NotificationHub> hubContext,
            IConfiguration config)
        {
            _notificationService = notificationService;
            _userManager = userManager;
            _localizer = localizer;
            _hubContext = hubContext;
            _config = config;
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetList(int skip = 0, int take = 10)
        {
            var userId = GetUserId();
            var notifications = await _notificationService.GetAsync(userId, skip, take);
            return Ok(notifications);
        }

        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var userId = GetUserId();
            var count = await _notificationService.GetUnreadCountAsync(userId);
            return Ok(count);
        }

        [HttpPost("mark-as-read/{id}")]
        public async Task<IActionResult> MarkAsRead(Guid id)
        {
            var userId = GetUserId();
            await _notificationService.MarkAsReadAsync(id, userId);
            return NoContent();
        }

        private string GetUserId()
        {
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentException("User not found.");
            }
            return userId;
        }

        [HttpGet("translations")]
        [AllowAnonymous]
        public IActionResult GetTranslations([FromQuery] string? culture = null)
        {
            var requestCulture = culture ??
                Thread.CurrentThread.CurrentCulture.Name
                ?? SupportedCultures.English;

            var translations = _localizer.GetAllStrings().ToDictionary(x => x.Name, x => x.Value);

            return Ok(new
            {
                Culture = requestCulture,
                Translations = translations
            });
        }

        private bool IsValidApiCall(HttpRequest req)
        {
            var header = req.Headers["X-Notification-Key"].FirstOrDefault();
            return header != null && header == _config["Notification:ApiKey"];
        }

        [HttpPost("trigger")]
        [AllowAnonymous]
        public async Task<IActionResult> Trigger([FromBody] TriggerRequest req)
        {
            if (!IsValidApiCall(Request)) return Unauthorized();

            var notif = await _notificationService.FindAsync(req.NotificationId);
            if (notif == null) return NotFound();

            // build DTO to send to client
            var dto = new
            {
                id = notif.Id,
                userId = notif.UserId,
                titleKey = notif.TitleKey,
                titleParams = notif.TitleParams,
                messagekey = notif.MessageKey,
                messageParams = notif.MessageParams,
                url = notif.Url,
                createdAt = notif.CreatedAt
            };

            // send to specific user
            if (!string.IsNullOrEmpty(notif.UserId))
            {
                await _hubContext.Clients.User(notif.UserId)
                    .SendAsync(NotificationGroups.NewNotification, dto);
            }
            else
            {
                throw new ArgumentException("User not found.");
            }

            return Ok();
        }

        [HttpPost("trigger-all-admin")]
        [AllowAnonymous]
        public async Task<IActionResult> TriggerAllAdmin([FromBody] TriggerRequest req)
        {
            if (!IsValidApiCall(Request)) return Unauthorized();

            var notif = await _notificationService.FindAsync(req.NotificationId);
            if (notif == null) return NotFound();

            var dto = new
            {
                id = notif.Id,
                titleKey = notif.TitleKey,
                titleParams = notif.TitleParams,
                messageKey = notif.MessageKey,
                messageParams = notif.MessageParams,
                url = notif.Url,
                createdAt = notif.CreatedAt
            };

            await _hubContext.Clients.Group(NotificationGroups.Admin).SendAsync(NotificationGroups.NewNotification, dto);

            return Ok();
        }

        public class TriggerRequest { public Guid NotificationId { get; set; } }
    }
}
