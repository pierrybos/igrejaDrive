// tipos e valores padrão para InstitutionProfile
export type InstitutionProfileType = {
  churchName: string;
  churchLogoUrl: string;
  churchPhone: string;
  churchAddress: string;
};

export const DEFAULT_INSTITUTION_PROFILE: InstitutionProfileType = {
  churchName: "",
  churchLogoUrl: "",
  churchPhone: "",
  churchAddress: "",
};
