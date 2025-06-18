import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// You need to set your Resend API key in your environment variables as RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const { email, name, jobRole } = await req.json();

  if (!email || !name || !jobRole) {
    return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'AI Recruiter <noreply@yourdomain.com>',
      to: email,
      subject: `Congratulations, ${name}! You have been selected for ${jobRole}`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f9f9;border-radius:12px;">
        <h2 style="color:#2563eb;">Congratulations, ${name}!</h2>
        <p>We are excited to inform you that you have been <b>selected</b> for the <b>${jobRole}</b> position after your recent interview.</p>
        <p>Our team was impressed with your skills and potential. We will contact you soon with further details regarding your offer and next steps.</p>
        <p style="margin-top:32px;">Best regards,<br/>AI Recruiter Team</p>
      </div>`
    });
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
} 