
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const gmailUser = this.configService.get<string>("GMAIL_USER");
    const gmailPassword =
      this.configService.get<string>("GMAIL_APP_PASSWORD");

    if (!gmailUser || !gmailPassword) {
      throw new Error(
        "GMAIL_USER and GMAIL_APP_PASSWORD must be configured in .env",
      );
    }

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPassword.replace(/\s/g, ""),
      },
    });
  }

  async sendVerificationCode(
    recipient: string,
    username: string,
    code: string,
  ): Promise<void> {
    const gmailUser = this.configService.get<string>("GMAIL_USER");

    try {
      await this.transporter.sendMail({
        from: `"Gracia Education Hub" <${gmailUser}>`,
        to: recipient,
        subject: "Your Gracia Education Hub verification code",
        text: [
          `Hello ${username},`,
          "",
          "Thank you for registering with Gracia Education Hub.",
          `Your email verification code is: ${code}`,
          "",
          "This code expires in 30 minutes.",
          "If you did not create this account, you can ignore this email.",
        ].join("\n"),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; line-height: 1.6; color: #222;">
            <h2 style="color: #166534;">Verify your email address</h2>
            <p>Hello ${this.escapeHtml(username)},</p>
            <p>Thank you for registering with Gracia Education Hub.</p>
            <p>Enter this verification code on the verification page:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; background: #f3f4f6; text-align: center; border-radius: 8px;">
              ${code}
            </div>
            <p>This code expires in 30 minutes.</p>
            <p>If you did not create this account, you can ignore this email.</p>
            <p>Regards,<br/>Gracia Education Hub</p>
          </div>
        `,
      });

      this.logger.log(`Verification email sent to ${recipient}`);
    } catch (error) {
      this.logger.error(
        "Failed to send verification code email.",
        error instanceof Error ? error.stack : String(error),
      );

      throw new InternalServerErrorException(
        "Unable to send the verification email. Please try again later.",
      );
    }
  }

  private escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (character) => {
      const entities: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[character];
    });
  }
}