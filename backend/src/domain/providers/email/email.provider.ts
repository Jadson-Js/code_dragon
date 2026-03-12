import type { IEMAIL_TEMPLATES } from "@/shared/environments";

export interface ISendEmailProps {
  to: string;
  subject: string;
  template: IEMAIL_TEMPLATES;
  variables: Record<string, string>;
}

export interface IEmailProvider {
  send(props: ISendEmailProps): Promise<void>;
}
