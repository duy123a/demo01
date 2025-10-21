using Demo01.Infrastructure.Entities;

namespace Demo01.WebApi.ViewModels
{
    public class ForecastPlanningViewModel
    {
        // Dropdown selections
        public Guid? SelectedForecastId { get; set; }
        public Guid? SelectedWeekId { get; set; }
        public ForecastWeek SelectedWeek { get; set; } = new();
        public List<ForecastPlanningProcess> PlanningProcesses { get; set; } = new();
        public List<Process> AllProcesses { get; set; } = new();

        // Dropdown data
        public List<ForecastDropdownItem> Forecasts { get; set; } = new();
        public List<ForecastWeekDropdownItem> Weeks { get; set; } = new();

        // Departments
        public List<DepartmentDropdownItem> Departments { get; set; } = new();
        public int? SelectedDepartmentId { get; set; }

        // Readonly fields
        public decimal TargetLf { get; set; }
        public bool HasSaturday { get; set; }
        public decimal TotalHour { get; set; }
        public List<DateTimeOffset> DatesInWeek { get; set; } = new();
        public List<DateOnly> HolidayList { get; set; } = new();
    }

    public class DepartmentDropdownItem
    {
        public int DepartmentId { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
