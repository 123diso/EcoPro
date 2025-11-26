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
  id: number | string;  // Acepta ambos tipos
  title: string;
  category: string;
  condition: string;
  location: string;
  image?: string;
  price?: string;
  user?: string;
  description?: string;
  sellerName?: string;
  sellerRating?: string;
  sellerStats?: string;
  images?: string[];
  available?: string;
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
  title: string;
  message: string;
  type: "trade" | "message" | "system" | "alert";
  isRead: boolean;
  createdAt: string;
  fromUser?: string;
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
  id: number | string;
  title: string;
  image?: string;
  category?: string;
  condition?: string;
  location?: string;
}

// Tipos para SaveButton
export interface SaveButtonProps {
  id: number | string;
  title: string;
  category: string;
  condition: string;
  location: string;
  image?: string;
}

interface Trade {
  id: string;
  product_offer_id: string;
  product_receive_id: string;
  offering_user_id: string;
  receiving_user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}
