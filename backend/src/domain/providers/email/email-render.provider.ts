import type { IEMAIL_TEMPLATES } from "@/shared/environments";

export type IEmailRenderProvider = (
  template: IEMAIL_TEMPLATES,
  variables: Record<string, string>,
) => string;
