namespace Demo01.WebApi.ViewModels.ForecastCreateViewModel
{
    public class ForecastCreateViewModel
    {
        public Guid ForecastId { get; set; }
        public Guid WeekId { get; set; }

        public List<DropdownOption> Forecasts { get; set; } = new();
        public List<DropdownOption> Weeks { get; set; } = new();
        public List<OrderViewModel> Orders { get; set; } = new();
    }

    public class DropdownOption
    {
        public Guid Id { get; set; }
        public string DisplayName { get; set; } = string.Empty;
    }

    public class OrderViewModel
    {
        public Guid OrderId { get; set; }
        public string SapOrderNumber { get; set; } = string.Empty;
        public bool IsAssigned { get; set; }
    }
}
