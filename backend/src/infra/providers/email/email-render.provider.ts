import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { IEMAIL_TEMPLATES } from "@/shared/environments";
import type { IEmailRenderProvider } from "@/domain/providers/email/email-render.provider";

export const emailRenderProvider: IEmailRenderProvider = (
  template: IEMAIL_TEMPLATES,
  vars: Record<string, string>,
): string => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templatePath = path.join(__dirname, "templates", `${template}.html`);

  let html = fs.readFileSync(templatePath, "utf-8");

  for (const key in vars) {
    const value = vars[key];

    if (value === undefined) continue;

    html = html.replaceAll(`{${key}}`, value);
  }

  return html;
};
