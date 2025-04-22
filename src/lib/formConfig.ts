import type { PrismaFormConfig } from "@prisma/client";

// 1) Type reusável no front‑end e na API
export type FormConfigType = Omit<
  PrismaFormConfig,
  "id" | "institutionId" | "updatedAt"
> & {
  formHeaderText?: string | null;
};

// 2) Defaults compartilhados
export const DEFAULT_FORM_CONFIG: FormConfigType = {
  showMemberField: true,
  memberFieldLabel: "É membro dessa denominação?",
  showImageConsentField: true,
  imageConsentLabel: "Concedeu uso de imagem?",
  formHeaderText: "Preencha nosso formulário para que possamos melhor lhe receber",
  showOtherField: false,
  otherFieldLabel: "Outro campo?",
  autoConsentForMembers: false,
};
