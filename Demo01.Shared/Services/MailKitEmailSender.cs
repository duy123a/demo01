using Demo01.Shared.Configurations;
using Demo01.Shared.Services.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Demo01.Shared.Services
{
    public class MailKitEmailSender : IEmailSender
    {
        private readonly SmtpSettings _smtp;
        private readonly ILogger<MailKitEmailSender> _logger;

        public MailKitEmailSender(IOptions<SmtpSettings> smtpOptions, ILogger<MailKitEmailSender> logger)
        {
            _smtp = smtpOptions.Value;
            _logger = logger;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_smtp.FromName, _smtp.FromEmail));
                message.To.Add(new MailboxAddress("", email));
                message.Subject = subject;

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = htmlMessage
                };
                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();

                // Configure connection options
                var secureSocketOptions = _smtp.EnableSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None;

                // Connect to SMTP server
                await client.ConnectAsync(_smtp.Host, _smtp.Port, secureSocketOptions);

                // Authenticate if credentials are provided
                if (!string.IsNullOrEmpty(_smtp.UserName) && !string.IsNullOrEmpty(_smtp.Password))
                {
                    await client.AuthenticateAsync(_smtp.UserName, _smtp.Password);
                }

                // Send the message
                await client.SendAsync(message);

                // Disconnect
                await client.DisconnectAsync(true);

                _logger.LogInformation("Email sent successfully to {Email} with subject: {Subject}", email, subject);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {Email} with subject: {Subject}", email, subject);
                throw new InvalidOperationException($"Email sending failed: {ex.Message}", ex);
            }
        }
    }
}
