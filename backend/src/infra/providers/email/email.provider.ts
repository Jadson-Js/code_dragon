import { Resend } from "resend";
import { env } from "@/shared/env";
import { BadRequestError } from "@/shared/app.error";
import { injectable } from "tsyringe";
import type { IEmailProvider } from "@/domain/providers/email/email.provider";
import type { IEMAIL_TEMPLATES } from "@/shared/environments";
import { emailRenderProvider } from "./email-render.provider";
const resend = new Resend(env.resendApiKey);

@injectable()
export class EmailProvider implements IEmailProvider {
  async send(
    to: string,
    subject: string,
    template: IEMAIL_TEMPLATES,
    variables: Record<string, string>,
  ) {
    const { data, error } = await resend.emails.send({
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
