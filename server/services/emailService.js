// services/emailService.js
import nodemailer from "nodemailer";
import config from "../config/env.js";

// ... (getAuthCredentials and transporter setup remain the same)
const getAuthCredentials = () => {
  const user = config.emailUser;
  const pass = config.emailPass;

  if (!user || !pass) {
    throw new Error(
      "🚫 EMAIL_USER and EMAIL_PASS environment variables must be set."
    );
  }
  return { user, pass };
};

const auth = getAuthCredentials();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: auth.user,
    pass: auth.pass,
  },
});

// --- Enhanced Email Templates ---

/**
 * Common styles and layout for all templates.
 * Using inline styles and tables for max compatibility.
 */
const BASE_STYLE = `
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
`;

const emailTemplates = {
  GUIDE_CREDENTIALS: ({ name, email, tempPassword }) => ({
    subject: "Welcome Aboard! Your Guide Account Credentials",
    html: `
      <div style="${BASE_STYLE} padding: 20px; background-color: #f4f4f4;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #ddd; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                
                <tr>
                  <td align="center" style="padding: 20px; background-color: #007bff; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px;">Welcome to the Team! 🌟</h1>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #007bff; margin-top: 0;">Hello ${name},</h2>
                    <p style="font-size: 16px;">
                      Your **Guide Account** has been successfully created. We're excited to have you!
                      Below are your initial login details.
                    </p>
                    
                    <table width="100%" border="0" cellspacing="0" cellpadding="10" style="margin-top: 25px; margin-bottom: 25px; border: 1px solid #eee; background-color: #f9f9f9; border-radius: 6px;">
                      <tr>
                        <td width="30%" style="font-weight: bold; color: #555;">Email:</td>
                        <td width="70%" style="color: #333;">${email}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; color: #555;">Temporary Password:</td>
                        <td style="color: #c90000; font-weight: bold;">${tempPassword}</td>
                      </tr>
                    </table>

                    <p style="font-size: 16px;">
                      **Security Notice:** For your protection, please **log in immediately** and change your password.
                    </p>
                    
                    <p style="text-align: center; margin-top: 30px;">
                      <a href="[Your Login URL]" target="_blank" style="display: inline-block; padding: 12px 25px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Go to Login Page
                      </a>
                    </p>

                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
                    &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
    text: `Welcome ${name}! Your guide account has been created.\nEmail: ${email}\nTemporary Password: ${tempPassword}\n\nSecurity Notice: Please log in at [Your Login URL] and change your password immediately.`,
  }),

  GUIDE_APPROVED: ({ name }) => ({
    subject: "Your Guide Account Has Been Approved ✅",
    html: `
      <div style="${BASE_STYLE} padding: 20px; background-color: #f4f4f4;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #ddd; background-color: #ffffff; border-radius: 8px;">
                
                <tr>
                  <td align="center" style="padding: 20px; background-color: #28a745; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px;">You're Approved! 🎉</h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #28a745; margin-top: 0;">Hello ${name},</h2>
                    <p style="font-size: 16px;">
                      Great news! Your guide account has been **approved**. You can now log in and start using your account.
                    </p>

                    <p style="text-align: center; margin-top: 30px;">
                      <a href="[Your Login URL]" target="_blank" style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Go to Login
                      </a>
                    </p>

                    <p style="font-size: 14px; color: #555;">
                      If you have trouble logging in, please contact support.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
                    &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
    text: `Hello ${name},\n\nYour guide account has been approved! You can now log in and start using it.\n\nLogin here: [Your Login URL]`,
  }),

  GUIDE_REJECTED: ({ name, reason }) => ({
    subject: "Your Guide Registration Was Not Approved ❌",
    html: `
      <div style="${BASE_STYLE} padding: 20px; background-color: #f4f4f4;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #ddd; background-color: #ffffff; border-radius: 8px;">
                
                <tr>
                  <td align="center" style="padding: 20px; background-color: #dc3545; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px;">Registration Update</h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #dc3545; margin-top: 0;">Hello ${name},</h2>
                    <p style="font-size: 16px;">
                      Unfortunately, your guide registration request was **not approved**.
                    </p>

                    ${
                      reason
                        ? `<p style="font-size: 16px;"><strong>Reason:</strong> ${reason}</p>`
                        : ""
                    }

                    <p style="font-size: 14px; color: #555;">
                      If you believe this was a mistake or wish to reapply, please contact support.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
                    &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
    text: `Hello ${name},\n\nUnfortunately, your guide registration was not approved.${
      reason ? `\nReason: ${reason}` : ""
    }\n\nPlease contact support if you wish to reapply.`,
  }),

  PASSWORD_RESET: ({ name, resetLink }) => ({
    subject: "Action Required: Reset Your Password",
    html: `
      <div style="${BASE_STYLE} padding: 20px; background-color: #f4f4f4;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #ddd; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                
                <tr>
                  <td align="center" style="padding: 20px 40px; background-color: #ffc107; color: #333;">
                    <h1 style="margin: 0; font-size: 24px;">Password Reset Request</h1>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="color: #007bff; margin-top: 0;">Hello ${name},</h2>
                    <p style="font-size: 16px;">
                      We received a request to reset the password for your account. 
                      Click the secure button below to complete the process.
                    </p>
                    
                    <p style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
                      <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Reset My Password
                      </a>
                    </p>

                    <p style="font-size: 16px;">
                      This link is valid for a limited time. If you have trouble with the button, you can also copy and paste the following link into your browser:
                    </p>
                    <p style="word-break: break-all; font-size: 14px; color: #555;">
                        ${resetLink}
                    </p>

                    <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #777;">
                      **Security Note:** If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
                    For support, please contact us.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>
     `,
    text: `Hello ${name}, reset your password using this link: ${resetLink}\n\nIf you did not request this, please ignore this email.`,
  }),
};

// ... (sendEmail function remains the same)
export const sendEmail = async ({ to, type, data }) => {
  if (!emailTemplates[type]) {
    throw new Error(`Unknown email template: ${type}`);
  }

  const { subject, text, html } = emailTemplates[type](data);

  const mailOptions = {
    from: auth.user,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email (${type}) sent to: ${to}`);
  } catch (err) {
    console.error(`❌ Error sending ${type} email to ${to}:`, err.message);
    throw new Error("Email service failed, try again later.");
  }
};
