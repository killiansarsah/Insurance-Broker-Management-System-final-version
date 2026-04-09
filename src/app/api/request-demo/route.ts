import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const submittedAt = new Intl.DateTimeFormat('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: 'numeric', minute: 'numeric', timeZone: 'Africa/Accra',
    }).format(new Date());

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'Brokerium <onboarding@resend.dev>',
            to: 'comp@theelira.com',
            subject: `New Demo Request from ${email}`,
            html: `
                <div style="font-family:Arial,sans-serif;background:#f3f4f6;padding:40px 20px;color:#1f2937">
                    <div style="background:#fff;border-radius:12px;max-width:480px;margin:0 auto;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
                        <div style="background:linear-gradient(135deg,#1D4ED8,#3B82F6);padding:20px 28px;color:#fff">
                            <h2 style="margin:0;font-size:20px">New Demo Request</h2>
                            <p style="margin:4px 0 0;font-size:13px;opacity:0.8">Someone wants a Brokerium demo</p>
                        </div>
                        <div style="padding:24px 28px">
                            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px">
                                <span style="color:#6b7280">Email</span>
                                <span style="font-weight:600;color:#111827">${email}</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px">
                                <span style="color:#6b7280">Submitted At</span>
                                <span style="font-weight:600;color:#111827">${submittedAt}</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px">
                                <span style="color:#6b7280">Source</span>
                                <span style="font-weight:600;color:#111827">Landing Page CTA</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;padding:10px 0;font-size:14px">
                                <span style="color:#6b7280">Status</span>
                                <span style="display:inline-block;background:#DCFCE7;color:#166534;padding:3px 10px;border-radius:100px;font-size:12px;font-weight:700">New Lead</span>
                            </div>
                        </div>
                    </div>
                </div>
            `,
        }),
    });

    if (!res.ok) {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
