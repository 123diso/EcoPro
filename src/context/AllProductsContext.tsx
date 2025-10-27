import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "../supabaseClient";

export interface Product {
  id: string;
  title: string;
  category: string;
  condition: string;
  description: string;
  location: string;
  image?: string;
  created_at: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
}

interface AllProductsContextType {
  allProducts: Product[];
  loading: boolean;
  fetchAllProducts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const AllProductsContext = createContext<AllProductsContextType | undefined>(undefined);

export const AllProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Obtener todos los posts con información del usuario
      const { data: postsData, error: postsError } = await supabase
        .from('user_posts')
        .select(`
          *,
          user:user_id (
            email,
            user_metadata
          )
        `)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error fetching all products:', postsError);
        throw postsError;
      }

      // Transformar los datos para incluir información del usuario
      const productsWithUserInfo = postsData?.map(post => ({
        ...post,
        user_email: post.user?.email,
        user_name: post.user?.user_metadata?.username || post.user?.user_metadata?.full_name || 'Usuario Dandi'
      })) || [];

      setAllProducts(productsWithUserInfo);
    } catch (error) {
      console.error('Error in fetchAllProducts:', error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    await fetchAllProducts();
  }, [fetchAllProducts]);

  // Cargar productos al inicializar
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <AllProductsContext.Provider value={{
      allProducts,
      loading,
      fetchAllProducts,
      refreshProducts
    }}>
      {children}
    </AllProductsContext.Provider>
  );
};

export const useAllProducts = () => {
  const context = useContext(AllProductsContext);
  if (context === undefined) {
    throw new Error('useAllProducts must be used within an AllProductsProvider');
  }
  return context;
};