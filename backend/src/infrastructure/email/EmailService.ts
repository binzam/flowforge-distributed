import type { EmailProvider, SendEmailInput } from "./EmailProvider.js";

export class EmailService {
  constructor(private readonly emailProvider: EmailProvider) {}

  async send(input: SendEmailInput): Promise<void> {
    await this.emailProvider.send(input);
  }
}
