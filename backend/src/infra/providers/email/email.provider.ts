import nodemailer from "nodemailer";
import { env } from "@/shared/environments";
import { BadRequestError } from "@/shared/app.error";
import { injectable } from "tsyringe";
import type { IEMAIL_TEMPLATES } from "@/shared/environments";
import { emailRenderProvider } from "./email-render.provider";

export interface ISendEmailProps {
  to: string;
  subject: string;
  template: IEMAIL_TEMPLATES;
  variables: Record<string, string>;
}

export interface IEmailProvider {
  send(props: ISendEmailProps): Promise<void>;
}

// const resend = new Resend(env.resendApiKey);

// @injectable()
// export class EmailProvider implements IEmailProvider {
//   async send({ to, subject, template, variables }: ISendEmailProps) {
//     const { data: _data, error } = await resend.emails.send({
//       from: "Acme <onboarding@resend.dev>",
//       to: [to],
//       subject: subject,
//       html: emailRenderProvider(template, variables),
//     });

//     if (error) {
//       throw new BadRequestError(error.message);
//     }
//   }
// }

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPassword,
  },
});

@injectable()
export class EmailProvider implements IEmailProvider {
  async send({ to, subject, template, variables }: ISendEmailProps) {
    try {
      await transporter.sendMail({
        from: env.smtpFrom,
        to,
        subject,
        html: emailRenderProvider(template, variables),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send email";
      throw new BadRequestError(message);
    }
  }
}
