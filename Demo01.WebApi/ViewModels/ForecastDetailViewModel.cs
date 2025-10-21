namespace Demo01.WebApi.ViewModels
{
    public class ForecastDetailViewModel
    {
        public Guid? SelectedForecastId { get; set; }
        public Guid? SelectedWeekId { get; set; }
        public decimal SelectedWeekTotalLf { get; set; }

        public List<ForecastDropdownItem> Forecasts { get; set; } = new();
        public List<ForecastWeekDropdownItem> Weeks { get; set; } = new();

        public List<ForecastItemViewModel> Items { get; set; } = new();
    }

    public class ForecastDropdownItem
    {
        public Guid ForecastId { get; set; }
        public string DisplayName { get; set; } = string.Empty; // e.g. "Dec 2024"
    }

    public class ForecastWeekDropdownItem
    {
        public Guid ForecastWeekId { get; set; }
        public string DisplayName { get; set; } = string.Empty; // e.g. "Week 49 (02/12 - 08/12)"
    }

    public class ForecastItemViewModel
    {
        public int No { get; set; }
        public string SerieNumber { get; set; } = string.Empty;
        public string ModelName { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public string Colour { get; set; } = string.Empty;
        public string SapOrder { get; set; } = string.Empty;
        public decimal Lf { get; set; }
        public DateTimeOffset? EstimatedStartDate { get; set; }
    }
}
