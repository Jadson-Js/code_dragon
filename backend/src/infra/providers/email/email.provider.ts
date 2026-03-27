import { Resend } from "resend";
import { env } from "@/shared/env";
import { BadRequestError } from "@/shared/app.error";
import { injectable } from "tsyringe";
import type {
  IEmailProvider,
  ISendEmailProps,
} from "@/domain/providers/email/email.provider";
import { emailRenderProvider } from "./email-render.provider";
const resend = new Resend(env.resendApiKey);

@injectable()
export class EmailProvider implements IEmailProvider {
  async send({ to, subject, template, variables }: ISendEmailProps) {
    const { data: _data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: emailRenderProvider(template, variables),
    });

    if (error) {
      throw new BadRequestError(error.message);
    }
  }
}
