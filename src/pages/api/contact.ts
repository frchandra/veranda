import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get("content-type") || "";
    console.log("Contact API: Received request with content-type:", contentType);

    let name, email, subject, message, turnstileToken;

    if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      const data = await request.formData();
      name = data.get("name")?.toString();
      email = data.get("email")?.toString();
      subject = data.get("subject")?.toString();
      message = data.get("message")?.toString();
      turnstileToken = data.get("cf-turnstile-response")?.toString();
    } else if (contentType.includes("application/json")) {
      const body = await request.json();
      name = body.name;
      email = body.email;
      subject = body.subject;
      message = body.message;
      turnstileToken = body.cfTurnstileResponse || body["cf-turnstile-response"];
    } else {
      return new Response(
        JSON.stringify({ message: "Unsupported Content-Type: " + contentType }),
        { status: 400 }
      );
    }

    console.log("Contact API:Parsed data:", { name, email, subject, hasMessage: !!message, hasToken: !!turnstileToken });

    // Basic server-side validation
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({
          message: "Missing required fields.",
        }),
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          message: "Invalid email address.",
        }),
        { status: 400 }
      );
    }

    // Turnstile verification (MOCK)
    if (!turnstileToken) {
       return new Response(
        JSON.stringify({
          message: "Spam check failed. Please complete the captcha.",
        }),
        { status: 400 }
      );
    }

    // Mock success delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return new Response(
      JSON.stringify({
        message: "Message received successfully.",
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Error in /api/contact:", error.message, error.stack);
    return new Response(
      JSON.stringify({
        message: "Internal server error: " + error.message,
      }),
      { status: 500 }
    );
  }
};
