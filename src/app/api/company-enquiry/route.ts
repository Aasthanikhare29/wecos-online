import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const documentEmails: Record<
      string,
      {
        subject: string;
        title: string;
        description: string;
        button: string;
      }
    > = {
      "Company Profile": {
        subject: "Your Company Profile is ready",
        title: "Download Company Profile",
        description:
          "Thank you for requesting the company profile. This document contains the company overview, services and capabilities.",
        button: "Download Company Profile",
      },
      Brochure: {
        subject: "Your Brochure is ready",
        title: "Download Brochure",
        description:
          "Thank you for requesting the brochure. Explore the products and services in detail.",
        button: "Download Brochure",
      },
      "Pitch Deck": {
        subject: "Your Pitch Deck is ready",
        title: "Download Pitch Deck",
        description:
          "Thank you for requesting the pitch deck. Explore the vision, business model and growth plans.",
        button: "Download Pitch Deck",
      },
      Catalogue: {
        subject: "Your Catalogue is ready",
        title: "Download Catalogue",
        description:
          "Thank you for requesting the catalogue. Browse the complete offerings.",
        button: "Download Catalogue",
      },
      "Rate Card": {
        subject: "Your Rate Card is ready",
        title: "Download Rate Card",
        description:
          "Thank you for requesting the latest pricing information.",
        button: "Download Rate Card",
      },
    };

    const selectedDoc =
      body.type === "document"
        ? documentEmails[body.documentName] ?? documentEmails["Company Profile"]
        : null;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"WeCos" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL,
      subject:
        body.type === "document"
          ? `Document Requested: ${body.documentName}`
          : "New Enquiry",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#7c3aed,#8b5cf6);padding:25px;color:white">
            <h1 style="margin:0">
              ${body.type === "document" ? "New Document Request" : "New Company Enquiry"}
            </h1>
            <p>A new request has been submitted through WeCos.</p>
          </div>

          <div style="padding:30px">
            <table style="width:100%">
              <tr>
                <td><b>Company</b></td>
                <td>${body.companyName}</td>
              </tr>
              <tr>
                <td><b>User Email</b></td>
                <td>${body.userEmail}</td>
              </tr>
              <tr>
                <td><b>Type</b></td>
                <td>${body.type}</td>
              </tr>
              <tr>
                <td><b>Document</b></td>
                <td>${body.documentName || "N/A"}</td>
              </tr>
              <tr>
                <td><b>Date</b></td>
                <td>${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
        </div>
      `,
    });

    await transporter.sendMail({
      from: `"WeCos" <${process.env.SMTP_EMAIL}>`,
      to: body.userEmail,
      subject:
        body.type === "document"
          ? selectedDoc?.subject
          : "We received your enquiry",

      html:
        body.type === "document"
          ? `
            <div style="max-width:600px;margin:0 auto;padding:40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#ffffff;">
              <div style="margin-bottom:30px">
                <img src="https://wecos.online/logo.png" width="40" alt="WeCos" />
              </div>

              <h1 style="font-size:40px;font-weight:700;color:#1f2937;margin:0 0 25px 0;">
                ${selectedDoc?.title}
              </h1>

              <p style="font-size:20px;line-height:1.7;color:#374151;margin-bottom:20px;">
                We hope you're having a wonderful day.
              </p>

              <p style="font-size:20px;line-height:1.7;color:#374151;margin-bottom:20px;">
                ${selectedDoc?.description}
              </p>

              <div style="background:#f8fafc;padding:20px;border-radius:10px;margin:30px 0;">
                <p><b>Company:</b> ${body.companyName}</p>
                <p><b>Document:</b> ${body.documentName}</p>
                <p><b>Requested:</b> ${new Date().toLocaleString()}</p>
              </div>

              <a href="${body.documentLink}" style="background:#7c3aed;color:#ffffff;padding:16px 32px;border-radius:6px;text-decoration:none;font-size:18px;font-weight:600;display:inline-block;margin-bottom:50px;">
                ${selectedDoc?.button}
              </a>

              <p style="font-size:20px;color:#374151;margin-top:20px;">
                Thanks for your interest!
              </p>

              <p style="font-size:20px;color:#374151;">Cheers,</p>

              <p style="font-size:20px;color:#374151;font-weight:600;">
                The WeCos Team
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:50px 0 30px 0;">

              <p style="text-align:center;color:#9ca3af;font-size:14px;">
                Made by WeCos Technologies Pvt Ltd
              </p>
            </div>
          `
          : `
            <div style="max-width:600px;margin:0 auto;padding:40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#ffffff;">
              <div style="margin-bottom:30px">
                <img src="https://wecos.online/logo.png" width="40" alt="WeCos" />
              </div>

              <h1 style="font-size:40px;font-weight:700;color:#1f2937;margin:0 0 25px 0;">
                Thank you for your enquiry!
              </h1>

              <p style="font-size:20px;line-height:1.7;color:#374151;margin-bottom:20px;">
                We hope you're having a wonderful day.
              </p>

              <p style="font-size:20px;line-height:1.7;color:#374151;margin-bottom:20px;">
                Thank you for showing interest in
                <strong>${body.companyName}</strong>.
                Your enquiry has been successfully submitted and our team will review it shortly.
              </p>

              <a href="https://wecos.online" style="background:#7c3aed;color:#ffffff;padding:16px 32px;border-radius:6px;text-decoration:none;font-size:18px;font-weight:600;display:inline-block;margin-bottom:50px;">
                Visit WeCos
              </a>

              <p style="font-size:20px;color:#374151;margin-top:20px;">
                Thanks for your interest!
              </p>

              <p style="font-size:20px;color:#374151;">Cheers,</p>

              <p style="font-size:20px;color:#374151;font-weight:600;">
                The WeCos Team
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:50px 0 30px 0;">

              <p style="text-align:center;color:#9ca3af;font-size:14px;">
                Made by WeCos Technologies Pvt Ltd
              </p>
            </div>
          `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}