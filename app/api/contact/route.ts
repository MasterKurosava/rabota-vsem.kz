import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, contact, subject, message } = body;

    // Validate required fields
    if (!name || !contact || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // TODO: Implement actual email sending using Resend, Nodemailer, or другой сервис
    // For now, just log the contact form submission (only in development)
    if (process.env.NODE_ENV === "development") {
      console.log("📧 Contact Form Submission:", {
        name,
        contact,
        subject,
        message,
        timestamp: new Date().toISOString(),
      });
    }

    // EXAMPLE: Using Resend (uncomment when configured)
    /*
    import { Resend } from 'resend';
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'RabotaVsem <noreply@yourdomain.com>',
      to: process.env.CONTACT_EMAIL || 'hello@rabotavsem.kz',
      replyTo: contact,
      subject: `Новое сообщение: ${subject}`,
      html: `
        <h2>Новое сообщение с контактной формы</h2>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Контакт:</strong> ${contact}</p>
        <p><strong>Тема:</strong> ${subject}</p>
        <p><strong>Сообщение:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
    */

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
