using Demo01.Infrastructure.Enums;

namespace Demo01.WebApi.ViewModels.ForecastProgressViewModel
{
    public class ForecastProgressViewModel
    {
        public Guid SelectedForecastId { get; set; }
        public Guid SelectedWeekId { get; set; }

        public List<ForecastDropdownItem> Forecasts { get; set; } = new();
        public List<ForecastWeekDropdownItem> Weeks { get; set; } = new();

        public List<ForecastProgressItemViewModel> Items { get; set; } = new();
    }

    public class ForecastDropdownItem
    {
        public Guid ForecastId { get; set; }
        public string DisplayName { get; set; } = string.Empty;
    }

    public class ForecastWeekDropdownItem
    {
        public Guid ForecastWeekId { get; set; }
        public string DisplayName { get; set; } = string.Empty;
    }

    public class ForecastProgressItemViewModel
    {
        public string SerieNumber { get; set; } = string.Empty;
        public string ModelName { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
        public string Colour { get; set; } = string.Empty;

        // Sau này có thể thêm trạng thái từng công đoạn
        public ProgressViewModel CuttingReceivedFabric { get; set; } = new();
        public ProgressViewModel SpreadFabric { get; set; } = new();
        public ProgressViewModel CutFabric { get; set; } = new();

        public ProgressViewModel ParachuteReceivedFabric { get; set; } = new();
        public ProgressViewModel JoinFabric { get; set; } = new();
        public ProgressViewModel SewTail { get; set; } = new();

        public ProgressViewModel SewBottom { get; set; } = new();
        public ProgressViewModel SewTop { get; set; } = new();

        public ProgressViewModel QcFinal { get; set; } = new();
        public ProgressViewModel Packing { get; set; } = new();
    }

    public class ProgressViewModel
    {
        public ProgressStatus Status { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
