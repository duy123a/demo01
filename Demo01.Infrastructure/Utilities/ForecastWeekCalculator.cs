namespace Demo01.Infrastructure.Utilities
{
    public static class ForecastWeekCalculator
    {
        /// <summary>
        /// Tính StartDate và EndDate của một tuần theo quy tắc:
        /// StartDate = Thứ 2 của (week - 5)
        /// EndDate = Thứ 2 của (week + 1)
        /// </summary>
        public static (DateTimeOffset StartDate, DateTimeOffset EndDate) CalculateWeekRange(int year, int week)
        {
            int startWeek = week - 5;
            int endWeek = week + 1;
            int startYear = year;
            int endYear = year;

            if (startWeek < 1)
            {
                startYear = year - 1;
                startWeek = 52 + startWeek; // ví dụ week=3 → startWeek=50 (năm trước)
            }

            if (endWeek > 52)
            {
                endYear = year + 1;
                endWeek = endWeek - 52;
            }

            var startDate = GetMondayOfIsoWeek(startYear, startWeek);
            var endDate = GetMondayOfIsoWeek(endYear, endWeek);

            return (startDate, endDate);
        }

        private static DateTimeOffset GetMondayOfIsoWeek(int year, int week)
        {
            DateTime jan4 = new DateTime(year, 1, 4);
            int daysOffset = DayOfWeek.Monday - jan4.DayOfWeek;

            DateTime firstMonday = jan4.AddDays(daysOffset);
            DateTime monday = firstMonday.AddDays((week - 1) * 7);

            return new DateTimeOffset(monday, TimeSpan.Zero);
        }
    }
}
