// Netlify serverless function — send email via Brevo (Sendinblue) API
// Environment variables needed:
//   BREVO_API_KEY — your Brevo API key
//   FROM_EMAIL    — verified sender email
//   FROM_NAME     — sender display name

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { to, toName, subject, htmlContent } = body;
  if (!to || !subject || !htmlContent) {
    return { statusCode: 400, body: "Missing required fields: to, subject, htmlContent" };
  }

  const payload = {
    sender: {
      email: process.env.FROM_EMAIL || "noreply@berlinthefallenone.netlify.app",
      name: process.env.FROM_NAME || "Berlin — The Fallen One"
    },
    to: [{ email: to, name: toName || to }],
    subject,
    htmlContent
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY || ""
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: result })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, messageId: result.messageId })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
