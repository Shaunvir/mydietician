# SMTP.js Email Setup Guide for My-Dietitian

## Overview
This guide will help you set up automatic HTML email sending from `my.dietitian.ca@gmail.com` using SMTP.js when users submit the assessment form.

## What's Been Implemented

1. **SMTP.js Integration**: Added the SMTP.js library to send emails directly from the browser
2. **HTML Email Template**: Created a professional HTML email template with:
   - Branded header with My-Dietitian logo
   - Formatted user information
   - Benefits and insurance details
   - Health goals section
   - Next steps information
   - Professional footer

3. **Configuration System**: Set up a flexible configuration that supports multiple SMTP providers

## Setup Instructions

### Step 1: Choose an SMTP Service Provider

Since Gmail's SMTP has restrictions for browser-based sending, you'll need to use a dedicated SMTP service. Here are the recommended options:

#### Option A: ElasticEmail (Recommended)
- **Why**: Free tier available, reliable, good for small businesses
- **Free Tier**: 100 emails/day
- **Setup**: 
  1. Sign up at https://elasticemail.com/
  2. Verify your email address
  3. Add and verify your domain `my-dietitian.ca`
  4. Get your API key from the dashboard

#### Option B: SMTP2GO
- **Why**: Simple setup, good deliverability
- **Free Tier**: 1,000 emails/month
- **Setup**:
  1. Sign up at https://www.smtp2go.com/
  2. Verify your account
  3. Get SMTP credentials from dashboard

#### Option C: SendGrid
- **Why**: Enterprise-grade, excellent deliverability
- **Free Tier**: 100 emails/day
- **Setup**:
  1. Sign up at https://sendgrid.com/
  2. Create an API key
  3. Verify sender identity

### Step 2: Configure Email Settings

1. Open `js/email-config.js`
2. Update the password/API key for your chosen service:

```javascript
// For ElasticEmail
const SMTP_CONFIG = {
    Host: "smtp.elasticemail.com",
    Username: "my.dietitian.ca@gmail.com",
    Password: "YOUR_ELASTIC_EMAIL_API_KEY", // Replace with actual API key
    Port: 2525
};
```

### Step 3: Domain Verification

Most SMTP services require you to verify your sending domain:

1. Add your domain `my-dietitian.ca` to your SMTP service
2. Add the required DNS records (SPF, DKIM) to your domain
3. Verify the domain in your SMTP service dashboard

### Step 4: Test the Setup

1. Open your website
2. Fill out and submit the assessment form
3. Check that:
   - The form submits successfully
   - The user receives the HTML email
   - Check spam folder if email doesn't appear in inbox

### Step 5: Monitor Email Delivery

- Check your SMTP service dashboard for delivery statistics
- Monitor bounce rates and spam reports
- Adjust email content if needed to improve deliverability

## Email Template Features

The HTML email includes:

- **Professional Design**: Branded with My-Dietitian colors and styling
- **Complete Information**: All form data formatted clearly
- **Next Steps**: Clear information about what happens next
- **Contact Information**: Easy way for users to reach out

## Security Considerations

1. **API Keys**: Keep your SMTP API keys secure
2. **Rate Limiting**: Monitor usage to stay within service limits
3. **Spam Prevention**: Follow email best practices to avoid spam filters

## Troubleshooting

### Email Not Sending
1. Check browser console for errors
2. Verify SMTP credentials are correct
3. Ensure domain is verified with SMTP service
4. Check SMTP service dashboard for error logs

### Emails Going to Spam
1. Verify domain authentication (SPF, DKIM)
2. Check email content for spam triggers
3. Start with small volumes to build reputation
4. Monitor feedback loops

### High Bounce Rate
1. Implement email validation on the form
2. Use double opt-in if needed
3. Regularly clean email lists

## Cost Considerations

- **ElasticEmail**: Free for 100 emails/day, then $0.10 per 1,000 emails
- **SMTP2GO**: Free for 1,000 emails/month, then starts at $10/month
- **SendGrid**: Free for 100 emails/day, then starts at $14.95/month

## Next Steps

1. Choose and set up your SMTP service
2. Update the configuration file with your credentials
3. Verify your domain
4. Test the email functionality
5. Monitor delivery and adjust as needed

## Support

If you need help with setup, most SMTP services offer:
- Documentation and setup guides
- Email support
- Live chat support
- Knowledge bases

The implementation is now ready - you just need to configure the SMTP service credentials!
