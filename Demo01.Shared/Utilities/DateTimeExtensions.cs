namespace Demo01.Shared.Utilities
{
    public static class DateTimeExtensions
    {
        /// <summary>
        /// Converts a UTC <see cref="DateTimeOffset"/> to Vietnam local time (UTC+7)
        /// and returns it as a formatted string.
        /// </summary>
        /// <param name="utcDate">The UTC date to convert.</param>
        /// <param name="format">The output format (default: "yyyy-MM-dd HH:mm").</param>
        /// <returns>The formatted local time string, or an empty string if null.</returns>
        public static string ToLocalTimeString(this DateTimeOffset utcDate, string format = "yyyy-MM-dd HH:mm")
        {
            var localTime = utcDate.ToOffset(TimeSpan.FromHours(7)); // Vietnam (UTC+7)
            return localTime.ToString(format);
        }

        /// <summary>
        /// Converts a local (Vietnam, UTC+7) <see cref="DateTime"/> or <see cref="DateTimeOffset"/>
        /// value from frontend input back to UTC (UTC+0).
        /// </summary>
        /// <param name="localDate">The local date/time to convert.</param>
        /// <returns>A <see cref="DateTimeOffset"/> in UTC.</returns>
        public static DateTimeOffset ToUtcFromLocal(this DateTime localDate)
        {
            // Assume localDate is in Vietnam timezone (UTC+7)
            var localOffset = new DateTimeOffset(localDate, TimeSpan.FromHours(7));
            return localOffset.ToOffset(TimeSpan.Zero); // Convert to UTC
        }

        /// <summary>
        /// Converts a local (Vietnam, UTC+7) <see cref="DateTimeOffset"/> from frontend input
        /// back to UTC (UTC+0).
        /// </summary>
        /// <param name="localDate">The local offset date/time to convert.</param>
        /// <returns>A <see cref="DateTimeOffset"/> in UTC.</returns>
        public static DateTimeOffset ToUtcFromLocal(this DateTimeOffset localDate)
        {
            return localDate.ToOffset(TimeSpan.Zero);
        }
    }
}
