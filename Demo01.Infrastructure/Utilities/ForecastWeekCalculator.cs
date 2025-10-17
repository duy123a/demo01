namespace Demo01.Infrastructure.Utilities
{
    public static class ForecastWeekCalculator
    {
        // public helper if other parts need it
        public static DateTimeOffset GetMondayOfIsoWeek(int year, int week)
        {
            DateTime jan4 = new DateTime(year, 1, 4);
            int daysOffset = DayOfWeek.Monday - jan4.DayOfWeek;
            DateTime firstMonday = jan4.AddDays(daysOffset);
            DateTime monday = firstMonday.AddDays((week - 1) * 7);
            return new DateTimeOffset(monday, TimeSpan.Zero);
        }

        // your special logic (StartDate = Monday of week-5, EndDate = Monday of week+1)
        public static (DateTimeOffset StartDate, DateTimeOffset EndDate) CalculateWeekRange(int year, int week)
        {
            int startWeek = week - 5;
            int endWeek = week + 1;
            int startYear = year;
            int endYear = year;

            if (startWeek < 1)
            {
                startYear = year - 1;
                // assume 52 weeks in previous year for simplicity (if you use ISO weeks, you can compute week count per year)
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
    }
}
