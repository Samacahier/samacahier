// Types générés à la main à partir du schéma réel (information_schema +
// contraintes CHECK, vérifiées via `supabase db query --linked`).
// À régénérer avec `supabase gen types typescript` si le CLI est utilisable
// avec les droits nécessaires.

type Role = "commercant" | "admin";
type ModePaiementVente = "especes" | "mobile_money" | "virement" | "autre";
type StatutVente = "paye" | "credit" | "impaye";
type SourceDepense = "caisse" | "poche";
type TypeMouvement = "entree" | "sortie";
type TypePoche = "caisse" | "poche";
type StatutCreance = "en_cours" | "soldee" | "en_retard";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: Role;
          nom: string;
          telephone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: Role;
          nom?: string;
          telephone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      commercants: {
        Row: {
          id: string;
          nom_commerce: string;
          adresse: string | null;
          telephone: string | null;
          created_at: string;
          logo_url: string | null;
          activite: string | null;
          ninea: string | null;
          rccm: string | null;
          telephone_pro: string | null;
          email_pro: string | null;
          ville_region: string | null;
          devise: string;
          solde_initial_caisse: number;
          solde_initial_poche: number;
        };
        Insert: {
          id: string;
          nom_commerce: string;
          adresse?: string | null;
          telephone?: string | null;
          created_at?: string;
          logo_url?: string | null;
          activite?: string | null;
          ninea?: string | null;
          rccm?: string | null;
          telephone_pro?: string | null;
          email_pro?: string | null;
          ville_region?: string | null;
          devise?: string;
          solde_initial_caisse?: number;
          solde_initial_poche?: number;
        };
        Update: Partial<Database["public"]["Tables"]["commercants"]["Insert"]>;
        Relationships: [];
      };
      ventes: {
        Row: {
          id: string;
          commercant_id: string;
          description: string;
          quantite: number;
          prix_unitaire: number;
          montant_total: number;
          mode_paiement: ModePaiementVente;
          date_vente: string;
          created_at: string;
          produit_id: string | null;
          client_id: string | null;
          remise: number;
          statut: StatutVente;
          montant_encaisse: number | null;
        };
        Insert: {
          id?: string;
          commercant_id: string;
          description: string;
          quantite?: number;
          prix_unitaire: number;
          montant_total: number;
          mode_paiement?: ModePaiementVente;
          date_vente?: string;
          created_at?: string;
          produit_id?: string | null;
          client_id?: string | null;
          remise?: number;
          statut?: StatutVente;
          montant_encaisse?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["ventes"]["Insert"]>;
        Relationships: [];
      };
      depenses: {
        Row: {
          id: string;
          commercant_id: string;
          libelle: string;
          categorie: string | null;
          montant: number;
          date_depense: string;
          created_at: string;
          source: SourceDepense;
          mode_paiement: string | null;
          fournisseur_id: string | null;
        };
        Insert: {
          id?: string;
          commercant_id: string;
          libelle: string;
          categorie?: string | null;
          montant: number;
          date_depense?: string;
          created_at?: string;
          source?: SourceDepense;
          mode_paiement?: string | null;
          fournisseur_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["depenses"]["Insert"]>;
        Relationships: [];
      };
      stocks: {
        Row: {
          id: string;
          commercant_id: string;
          nom_article: string;
          quantite: number;
          unite: string;
          seuil_alerte: number;
          created_at: string;
          updated_at: string;
          categorie: string | null;
          prix_achat: number | null;
          prix_vente: number | null;
          fournisseur_id: string | null;
          code_produit: string;
        };
        Insert: {
          id?: string;
          commercant_id: string;
          nom_article: string;
          quantite?: number;
          unite?: string;
          seuil_alerte?: number;
          created_at?: string;
          updated_at?: string;
          categorie?: string | null;
          prix_achat?: number | null;
          prix_vente?: number | null;
          fournisseur_id?: string | null;
          // Généré par le trigger stocks_set_code_produit si omis.
          code_produit?: string;
        };
        Update: Partial<Database["public"]["Tables"]["stocks"]["Insert"]>;
        Relationships: [];
      };
      creances: {
        Row: {
          id: string;
          commercant_id: string;
          client_nom: string;
          client_telephone: string | null;
          montant: number;
          montant_rembourse: number;
          statut: StatutCreance;
          date_echeance: string | null;
          created_at: string;
          client_id: string | null;
        };
        Insert: {
          id?: string;
          commercant_id: string;
          client_nom: string;
          client_telephone?: string | null;
          montant: number;
          montant_rembourse?: number;
          statut?: StatutCreance;
          date_echeance?: string | null;
          created_at?: string;
          client_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["creances"]["Insert"]>;
        Relationships: [];
      };
      caisse: {
        Row: {
          id: string;
          commercant_id: string;
          type_mouvement: TypeMouvement;
          montant: number;
          motif: string | null;
          date_mouvement: string;
          created_at: string;
          type_poche: TypePoche;
        };
        Insert: {
          id?: string;
          commercant_id: string;
          type_mouvement: TypeMouvement;
          montant: number;
          motif?: string | null;
          date_mouvement?: string;
          created_at?: string;
          type_poche?: TypePoche;
        };
        Update: Partial<Database["public"]["Tables"]["caisse"]["Insert"]>;
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          commercant_id: string;
          nom: string;
          telephone: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          commercant_id: string;
          nom: string;
          telephone?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
        Relationships: [];
      };
      fournisseurs: {
        Row: {
          id: string;
          commercant_id: string;
          nom: string;
          contact: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          commercant_id: string;
          nom: string;
          contact?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["fournisseurs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Commercant = Database["public"]["Tables"]["commercants"]["Row"];
export type Vente = Database["public"]["Tables"]["ventes"]["Row"];
export type Depense = Database["public"]["Tables"]["depenses"]["Row"];
export type Stock = Database["public"]["Tables"]["stocks"]["Row"];
export type Creance = Database["public"]["Tables"]["creances"]["Row"];
export type Caisse = Database["public"]["Tables"]["caisse"]["Row"];
export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type Fournisseur = Database["public"]["Tables"]["fournisseurs"]["Row"];
