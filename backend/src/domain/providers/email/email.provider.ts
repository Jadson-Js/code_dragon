import type { IEMAIL_TEMPLATES } from "@/shared/environments";

export interface IEmailProvider {
  send(
    to: string,
    subject: string,
    template: IEMAIL_TEMPLATES,
    variables: Record<string, string>,
  ): Promise<void>;
}
