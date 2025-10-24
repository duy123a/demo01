using Demo01.Shared.Data.Dto;

namespace Demo01.Shared.Services.Interfaces
{
    public interface IGoogleHolidayService
    {
        Task<GoogleCalendarResponse?> GetVietnamHolidaysAsync(int year);
    }
}
