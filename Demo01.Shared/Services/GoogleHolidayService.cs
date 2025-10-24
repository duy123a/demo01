using Demo01.Shared.Data.Dto;
using Demo01.Shared.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Demo01.Shared.Services
{
    public class GoogleHolidayService : IGoogleHolidayService
    {
        private readonly IHttpClientService _httpClient;
        private readonly ILogger<GoogleHolidayService> _logger;
        private readonly IConfiguration _config;

        private const string CalendarId = "en.vietnamese%23holiday@group.v.calendar.google.com";

        public GoogleHolidayService(
            IHttpClientService httpClient,
            ILogger<GoogleHolidayService> logger,
            IConfiguration config)
        {
            _httpClient = httpClient;
            _logger = logger;
            _config = config;
        }

        public async Task<GoogleCalendarResponse?> GetVietnamHolidaysAsync(int year)
        {
            var apiKey = _config["GoogleSettings:ApiKey"];
            var timeMin = new DateTime(year, 1, 1).ToString("yyyy-MM-ddTHH:mm:ssZ");
            var timeMax = new DateTime(year, 12, 31).ToString("yyyy-MM-ddTHH:mm:ssZ");

            var url = $"https://www.googleapis.com/calendar/v3/calendars/{CalendarId}/events" +
                      $"?key={apiKey}&timeMin={timeMin}&timeMax={timeMax}&maxResults=100&singleEvents=true&orderBy=startTime";

            try
            {
                var json = await _httpClient.GetAsync<GoogleCalendarResponse>(url);
                return json;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching holidays from Google Calendar.");
                return null;
            }
        }
    }
}
