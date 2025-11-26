import React, { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./useAuthContext";

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

interface UserProductsContextType {
  userProducts: UserProduct[];
  loading: boolean;
  addProduct: (product: Omit<UserProduct, 'id' | 'created_at' | 'user_id' | 'updated_at'>) => Promise<void>;
  fetchUserProducts: () => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

const UserProductsContext = createContext<UserProductsContextType | undefined>(undefined);

export const UserProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProducts, setUserProducts] = useState<UserProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchUserProducts = useCallback(async () => {
    if (!user) {
      setUserProducts([]);
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user products:', error);
        throw error;
      }
      
      setUserProducts(data || []);
    } catch (error) {
      console.error('Error in fetchUserProducts:', error);
      setUserProducts([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addProduct = useCallback(async (productData: Omit<UserProduct, 'id' | 'created_at' | 'user_id' | 'updated_at'>) => {
    if (!user) throw new Error('User must be logged in');

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_posts')
        .insert([
          {
            ...productData,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error);
        throw error;
      }

      // Agregar el nuevo producto al estado local
      if (data) {
        setUserProducts(prev => [data, ...prev]);
      }

      return data;
    } catch (error) {
      console.error('Error in addProduct:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteProduct = useCallback(async (productId: string) => {
    if (!user) throw new Error('User must be logged in');

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_posts')
        .delete()
        .eq('id', productId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remover el producto del estado local
      setUserProducts(prev => prev.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return (
    <UserProductsContext.Provider value={{
      userProducts,
      loading,
      addProduct,
      fetchUserProducts,
      deleteProduct
    }}>
      {children}
    </UserProductsContext.Provider>
  );
};

export const useUserProducts = () => {
  const context = useContext(UserProductsContext);
  if (context === undefined) {
    throw new Error('useUserProducts must be used within a UserProductsProvider');
  }
  return context;
};