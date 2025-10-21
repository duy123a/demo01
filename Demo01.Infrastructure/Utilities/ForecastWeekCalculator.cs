namespace Demo01.Infrastructure.Utilities
{
    public static class ForecastWeekCalculator
    {
        // Returns the Monday of a given ISO week
        public static DateTimeOffset GetMondayOfIsoWeek(int year, int week)
        {
            DateTime jan4 = new DateTime(year, 1, 4);
            int daysOffset = DayOfWeek.Monday - jan4.DayOfWeek;
            DateTime firstMonday = jan4.AddDays(daysOffset);
            DateTime monday = firstMonday.AddDays((week - 1) * 7);
            return new DateTimeOffset(monday, TimeSpan.Zero);
        }

        // Calculates a custom planning week range:
        // StartDate = Monday of (week - 4)
        // EndDate = Monday of (week + 1)
        public static (DateTimeOffset StartDate, DateTimeOffset EndDate) CalculatePlanningWeekRange(int year, int week)
        {
            int startWeek = week - 4;
            int endWeek = week + 1;
            int startYear = year;
            int endYear = year;

            if (startWeek < 1)
            {
                startYear = year - 1;
                // assume 52 weeks in the previous year (simplified, ISO may vary)
                startWeek = 52 + startWeek;
            }

            if (endWeek > 52)
            {
                endYear = year + 1;
                endWeek = endWeek - 52;
            }

            var start = GetMondayOfIsoWeek(startYear, startWeek);
            var end = GetMondayOfIsoWeek(endYear, endWeek);
            return (start, end);
        }

        // Returns the Monday and Sunday of a specific ISO week
        public static (DateTimeOffset StartDate, DateTimeOffset EndDate) GetIsoWeekRange(int year, int week)
        {
            var start = GetMondayOfIsoWeek(year, week);
            var end = start.AddDays(6); // Sunday of the same week
            return (start, end);
        }
    }
}
