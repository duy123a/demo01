namespace Demo01.Shared.Data
{
    public class GoogleCalendarEvent
    {
        public string Summary { get; set; } = string.Empty;
        public GoogleCalendarDate Start { get; set; } = new();
    }
}
