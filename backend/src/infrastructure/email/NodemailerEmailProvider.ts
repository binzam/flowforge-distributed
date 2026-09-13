import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { config } from "../../config/env.js";
import type { EmailProvider, SendEmailInput } from "./EmailProvider.js";

export class NodemailerEmailProvider implements EmailProvider {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.password,
      },
    });
  }

  async send(input: SendEmailInput): Promise<void> {
    await this.transporter.sendMail({
      from: config.smtp.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
  }
}
