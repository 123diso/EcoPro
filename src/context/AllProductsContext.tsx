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
      // Consulta simplificada y más robusta
      const { data: postsData, error: postsError } = await supabase
        .from('user_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error fetching all products:', postsError);
        setAllProducts([]);
        return;
      }

      // Para obtener información del usuario si es necesario
      const productsWithUserInfo = postsData?.map(post => ({
        ...post,
        user_email: 'usuario@dandi.com', // Placeholder temporal
        user_name: 'Usuario Dandi' // Placeholder temporal
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

  // Suscripción en tiempo real a cambios en user_posts
  useEffect(() => {
    const subscription = supabase
      .channel('public:user_posts')
      .on(
        'postgres_changes',
        {
          event: '*', // Escuchar INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'user_posts'
        },
        (payload) => {
          console.log('Cambio detectado en user_posts:', payload);
          
          // Refrescar los productos cuando haya cambios
          fetchAllProducts();
        }
      )
      .subscribe();

    // Limpiar suscripción al desmontar
    return () => {
      subscription.unsubscribe();
    };
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