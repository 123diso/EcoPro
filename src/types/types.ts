// Tipos para componentes de UI
export interface ButtonProps {
  to?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export interface InputProps {
  type: "email" | "password" | "text" | "url";
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  icon?: string;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

export interface SuggestedCardProps {
  name: string;
  image: string;
  onClick?: () => void;
  className?: string;
  showName?: boolean;
}

// Tipos para datos de la aplicación
export interface Product {
  id: string;
  title: string;
  category: string;
  condition: string;
  location: string;
  image?: string;
  description?: string;
  created_at: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
}

// Producto básico para componentes que no necesitan todos los campos
export interface BasicProduct {
  id: string;
  title: string;
  category: string;
  condition: string;
  location: string;
  image?: string;
  description?: string;
}

export interface DandiPoint {
  id: number;
  name: string;
  distance: string;
  newPosts: number;
  activeUsers: number;
  type: "nearby" | "regular";
  logo: string;
  pin: string;
  lat: number;
  lng: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface SuggestedItem {
  id: number;
  name: string;
  image: string;
  title?: string;
}

export interface TradeItem {
  id: number;
  name: string;
  image: string;
  title?: string;
  available?: string;
}

export interface NavIcon {
  id: number;
  src: string;
  alt: string;
}

export interface CardItem {
  id: number;
  name: string;
  image: string;
}

// Tipos para formularios
export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  condition: string;
  image: string;
  location: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
  username?: string;
}

// Tipos para notificaciones
export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'saved' | 'trade_proposal' | 'trade_update';
  title: string;
  message: string;
  related_product_id?: string;
  related_trade_id?: string;
  from_user_id?: string;
  from_user_name?: string;
  is_read: boolean;
  created_at: string;
}

// Tipos para usuario
export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar?: string;
  rating?: number;
  tradeCount?: number;
  location?: string;
}

// Tipos para contexto de guardados
export interface SavedProduct {
  id: string;
  title: string;
  image?: string;
  category?: string;
  condition?: string;
  location?: string;
  user_id?: string;
}

// Tipos para SaveButton
export interface SaveButtonProps {
  id: string;
  title: string;
  category: string;
  condition: string;
  location: string;
  image?: string;
}

// Tipos para trueques
export interface Trade {
  id: string;
  product_offer_id: string;
  product_receive_id: string;
  offering_user_id: string;
  receiving_user_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  offer_product?: Product;
  receive_product?: Product;
  offering_user?: any;
  receiving_user?: any;
}

// Tipos para productos de usuario
export interface UserProduct {
  id: string;
  title: string;
  category: string;
  condition: string;
  description: string;
  location: string;
  image?: string;
  created_at: string;
  user_id: string;
}

// Tipos para el contexto de productos
export interface AllProductsContextType {
  allProducts: Product[];
  loading: boolean;
  fetchAllProducts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
}

// Tipos para TradeCard
export interface TradeProduct {
  id: string;
  title: string;
  image?: string;
  category: string;
  condition: string;
  description?: string;
}

export interface TradeCardProps {
  tradeId: string;
  offerProduct: TradeProduct;
  receiveProduct: TradeProduct;
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  isIncoming: boolean;
  createdAt: string;
}