namespace Demo01.WebApi.ViewModels
{
    public class ForecastPlanningResultViewModel
    {
        public Guid? SelectedForecastId { get; set; }
        public Guid? SelectedWeekId { get; set; }

        public List<ForecastDropdownItem> Forecasts { get; set; } = new();
        public List<ForecastWeekDropdownItem> Weeks { get; set; } = new();

        public List<DateTimeOffset> DatesInWeek { get; set; } = new();
        public List<DepartmentRow> DepartmentRows { get; set; } = new();

        public class DepartmentRow
        {
            public string DepartmentName { get; set; } = "";
            public Dictionary<DateTimeOffset, decimal> DailyLf { get; set; } = new();
        }
    }
}
