// Types générés à la main à partir des migrations SQL (supabase/migrations/).
// À régénérer avec `supabase gen types typescript` une fois le projet connecté.

type Role = "commercant" | "admin";
type ModePaiement = "especes" | "mobile_money" | "virement" | "autre";
type StatutCreance = "en_cours" | "soldee" | "en_retard";
type TypeMouvement = "entree" | "sortie";

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
        };
        Insert: {
          id: string;
          nom_commerce: string;
          adresse?: string | null;
          telephone?: string | null;
          created_at?: string;
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
          mode_paiement: ModePaiement;
          date_vente: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          commercant_id: string;
          description: string;
          quantite?: number;
          prix_unitaire: number;
          montant_total: number;
          mode_paiement?: ModePaiement;
          date_vente?: string;
          created_at?: string;
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
        };
        Insert: {
          id?: string;
          commercant_id: string;
          libelle: string;
          categorie?: string | null;
          montant: number;
          date_depense?: string;
          created_at?: string;
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
          prix_unitaire: number | null;
          seuil_alerte: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          commercant_id: string;
          nom_article: string;
          quantite?: number;
          unite?: string;
          prix_unitaire?: number | null;
          seuil_alerte?: number;
          created_at?: string;
          updated_at?: string;
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
        };
        Insert: {
          id?: string;
          commercant_id: string;
          type_mouvement: TypeMouvement;
          montant: number;
          motif?: string | null;
          date_mouvement?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["caisse"]["Insert"]>;
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
