export type RegisterFormState = {
  nom: string;
  telephone: string;
  email: string;
  password: string;
  confirmation: string;
  nomCommerce: string;
  activite: string;
  ninea: string;
  rccm: string;
  telephonePro: string;
  emailPro: string;
  adresse: string;
  villeRegion: string;
  devise: string;
};

export const INITIAL_REGISTER_STATE: RegisterFormState = {
  nom: "",
  telephone: "",
  email: "",
  password: "",
  confirmation: "",
  nomCommerce: "",
  activite: "",
  ninea: "",
  rccm: "",
  telephonePro: "",
  emailPro: "",
  adresse: "",
  villeRegion: "",
  devise: "FCFA",
};
