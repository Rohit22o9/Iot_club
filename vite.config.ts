import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function twilioEmailDevPlugin(): Plugin {
  return {
    name: 'twilio-email-dev-plugin',
    configureServer(server) {
      server.middlewares.use('/api/send-email', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const apiKey = process.env.TWILIO_SENDGRID_API_KEY || 
                             process.env.SENDGRID_API_KEY || 
                             process.env.VITE_TWILIO_SENDGRID_API_KEY || 
                             data.apiKey;
              const fromEmail = process.env.TWILIO_FROM_EMAIL || 
                               process.env.SENDGRID_FROM_EMAIL || 
                               process.env.VITE_TWILIO_FROM_EMAIL || 
                               data.fromEmail || 'iotclub@university.edu';
              const fromName = process.env.TWILIO_FROM_NAME || data.fromName || 'IoT Club Administration';

              if (apiKey && apiKey.startsWith('SG.')) {
                // Call SendGrid v3 API from Node.js with no CORS issues
                const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    personalizations: [{
                      to: [{ email: data.to, name: data.toName || 'Student' }],
                      subject: data.subject || 'Welcome to IoT Club - Your Login Credentials'
                    }],
                    from: { email: fromEmail, name: fromName },
                    content: [
                      { type: 'text/html', value: data.html }
                    ]
                  })
                });

                if (sgResponse.status === 202 || sgResponse.ok) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ 
                    success: true, 
                    message: `Official credentials email dispatched to ${data.to} via Twilio SendGrid!` 
                  }));
                  return;
                } else {
                  const errText = await sgResponse.text();
                  console.warn('Twilio SendGrid API response:', errText);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ 
                    success: false, 
                    message: `SendGrid API error: ${errText}` 
                  }));
                  return;
                }
              }

              // Simulated dispatch response when API key is not yet set
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                simulated: true,
                message: `Credentials generated for ${data.to}. Add TWILIO_SENDGRID_API_KEY to send live email.`
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), twilioEmailDevPlugin()],
})
