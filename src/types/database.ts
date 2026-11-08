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

type CommercantRow = {
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
  actif: boolean;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: Role;
          nom: string;
          telephone: string | null;
          avatar_url: string | null;
          notif_nouveau_commercant: boolean;
          notif_commercant_inactif: boolean;
          notif_resume_hebdo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: Role;
          nom?: string;
          telephone?: string | null;
          avatar_url?: string | null;
          notif_nouveau_commercant?: boolean;
          notif_commercant_inactif?: boolean;
          notif_resume_hebdo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      commercants: {
        Row: CommercantRow;
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
          actif?: boolean;
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
          code_vente: string;
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
          // Généré par le trigger ventes_set_code_vente si omis.
          code_vente?: string;
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
          vente_id: string | null;
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
          vente_id?: string | null;
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
          vente_id: string | null;
          depense_id: string | null;
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
          vente_id?: string | null;
          depense_id?: string | null;
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
      admin_logs: {
        Row: {
          id: string;
          admin_id: string | null;
          action: string;
          commercant_id: string | null;
          detail: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id?: string | null;
          action: string;
          commercant_id?: string | null;
          detail?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_logs"]["Insert"]>;
        Relationships: [];
      };
      // Ligne unique (id = 1) — voir migration 20261108130000_mode_maintenance.
      parametres_plateforme: {
        Row: {
          id: number;
          maintenance_active: boolean;
          maintenance_message: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: number;
          maintenance_active?: boolean;
          maintenance_message?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["parametres_plateforme"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      // Calcule chiffre_affaires/solde_caisse/derniere_activite par
      // commerçant en SQL (voir migration 20260906030611), pour permettre un
      // tri + pagination entièrement côté base de données sur /admin/dashboard.
      admin_commercants_overview: {
        Row: CommercantRow & {
          chiffre_affaires: number | null;
          solde_caisse: number | null;
          derniere_activite: string | null;
        };
        Relationships: [];
      };
    };
    // Voir migration 20261108120000_admin_kpis_et_ajuster_stock.
    Functions: {
      admin_kpis: {
        Args: Record<PropertyKey, never>;
        Returns: AdminKpisSql;
      };
      ajuster_stock_quantite: {
        Args: { p_produit_id: string; p_delta: number };
        Returns: undefined;
      };
      // Voir migration 20261108140000_admin_rapports_agreges.
      admin_ca_par_mois: {
        Args: { p_nombre_mois?: number };
        Returns: { mois: string; ca: number }[];
      };
      admin_ca_par_commercant: {
        Args: { p_debut: string; p_fin: string; p_commercant_ids?: string[] };
        Returns: { commercant_id: string; ca: number; nombre_ventes: number }[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

// Résultat JSON de la fonction SQL public.admin_kpis().
export type AdminKpisSql = {
  total_commercants: number;
  commercants_actifs: number;
  ca_cumule_mois: number;
  nouveaux_inscrits_7j: number;
  inactifs_14j: number;
  inscriptions_par_jour: { date: string; count: number }[] | null;
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
export type AdminLog = Database["public"]["Tables"]["admin_logs"]["Row"];
