// Navegación
export type PageId = "home" | "mapa" | "categorias";
export type NavItem = { id: PageId; label: string; href: string };

// Sugeridos
export type SuggestedItem = {
  id?: number | string;
  name?: string;
  title?: string; // <-- agregado para compatibilidad con algunos JSON
  image: string;
};

// Botón reusable
export type ButtonVariant = "primary" | "secondary" | "ghost";

export type ButtonAsLinkProps = {
  to: string;
  className?: string;
  children?: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export type ButtonAsButtonProps = {
  to?: undefined;
  className?: string;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps;

// Ítems que pintan una card
export type CardItem = {
  id: number | string;
  name: string;
  image: string;
  subtitle?: string;
};

// Navbar
export type NavIcon = {
  id: number | string;
  src: string;
  alt: string;
};

export type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
};

// Página de Mapa
export type DandiPoint = {
  id: number;
  name: string;
  distance: string;
  newPosts: number;
  activeUsers: number;
  type: "nearby" | "regular";
  logo: string;
  pin?: string;
  lat: number;
  lng: number;
};

// Categorías
export type Category = {
  id: number;
  name: string;
  image: string;
};

// CardItem
export type CardData = Pick<CardItem, "name" | "image">;
export type CardUIProps = {
  onClick?: () => void;
  className?: string;
  showName?: boolean;
};
export type SuggestedCardProps = CardData & CardUIProps;

// Trueques
export type TradeItem = {
  id?: number | string;
  title?: string;
  image: string;
  available?: number | string;
};

// ...lo que ya tienes arriba

export type Product = {
  id: number;
  title: string;
  category: string;
  condition: string; // p.ej. "Nuevo"
  location: string; // p.ej. "Valle de Lilí"
  image?: string; // imagen principal
  images?: string[]; // galería opcional
  description?: string;
  sellerName?: string;
  sellerRating?: string;
  sellerStats?: string;
};

// ...resto de tipos
