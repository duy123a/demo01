using Demo01.Shared.Utilities;
using Microsoft.AspNetCore.SignalR;

namespace Demo01.Shared.Services
{
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()

        {
            var user = Context.User;

            if (user?.IsInRole("Staff") == true)
                await Groups.AddToGroupAsync(Context.ConnectionId, NotificationGroups.Staff);
            else if (user?.IsInRole("Admin") == true)
                await Groups.AddToGroupAsync(Context.ConnectionId, NotificationGroups.Admin);
            else if (user?.IsInRole("Agency") == true)
                await Groups.AddToGroupAsync(Context.ConnectionId, NotificationGroups.Agency);
            else
                await Groups.AddToGroupAsync(Context.ConnectionId, NotificationGroups.User);

            await base.OnConnectedAsync();
        }
    }
}
