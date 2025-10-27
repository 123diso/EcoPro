import { supabase } from "../supabaseClient";
import type { UserProduct } from "../context/UserProductsContext";

// Obtener todos los productos
export const getAllProducts = async (): Promise<UserProduct[]> => {
  const { data, error } = await supabase.from("user_posts").select("*");

  if (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }

  return data || [];
};

// Eliminar producto por ID
export const deleteProductById = async (productId: string): Promise<boolean> => {
  const { error } = await supabase.from("user_posts").delete().eq("id", productId);

  if (error) {
    console.error("Error al eliminar producto:", error);
    return false;
  }

  return true;
};
