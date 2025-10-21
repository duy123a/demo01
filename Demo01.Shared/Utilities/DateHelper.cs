namespace Demo01.Shared.Utilities
{
    public static class DateHelper
    {
        public static DateOnly SubtractWorkingDays(DateOnly startDate, int days, IEnumerable<DateOnly> holidays)
        {
            var date = startDate;
            int count = 0;
            while (count < days)
            {
                date = date.AddDays(-1);
                if (date.DayOfWeek == DayOfWeek.Sunday || holidays.Contains(date))
                    continue;
                count++;
            }
            return date;
        }

        public static List<DateOnly> GetWorkingDaysRange(DateOnly startDate, int workingDays, IEnumerable<DateOnly> holidays)
        {
            var days = new List<DateOnly>();
            var date = startDate;
            while (days.Count < workingDays)
            {
                if (date.DayOfWeek != DayOfWeek.Sunday && !holidays.Contains(date))
                    days.Add(date);
                date = date.AddDays(1);
            }
            return days;
        }
    }
}
