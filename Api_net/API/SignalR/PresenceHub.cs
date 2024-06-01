using API.Extensions;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;

        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }
        public override async Task OnConnectedAsync()
        {
            var username = Context.User.GetUsername();
            if(username != null)
            {
                await _tracker.UserConnected(username, Context.ConnectionId);
            }

            var currentUsers = await _tracker.GetOnlineUsers();

            await Clients.All.SendAsync("GetOnlineUsers", currentUsers);
        }


        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var username = Context.User.GetUsername();
            if (username != null)
            {
                await _tracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);
            }
               
            var currentUsers = await _tracker.GetOnlineUsers();
            await Clients.All.SendAsync("GetOnlineUsers", currentUsers);

            await base.OnDisconnectedAsync(exception);
        }
    }
}
