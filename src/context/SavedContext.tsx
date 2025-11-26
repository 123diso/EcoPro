import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./useAuthContext";

export type SavedProduct = {
  id: string;
  title: string;
  image?: string;
  category?: string;
  condition?: string;
  location?: string;
  user_id?: string;
};

type SavedState = { products: Record<string, SavedProduct> };

type SavedContextType = {
  saved: SavedState;
  isProductSaved: (id: string) => boolean;
  toggleProduct: (item: Omit<SavedProduct, 'user_id'>) => Promise<void>;
  loading: boolean;
  savedProducts: SavedProduct[];
};

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export const SavedProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState<SavedState>({ products: {} });
  const [loading, setLoading] = useState(false);

  // Cargar guardados desde Supabase
  const loadSaved = useCallback(async () => {
    if (!user) {
      setSaved({ products: {} });
      return;
    }

    setLoading(true);
    try {
      console.log("Cargando saved_posts para usuario:", user.id);

      // Obtener posts guardados con información completa del producto
      const { data: savedData, error } = await supabase
        .from("saved_posts")
        .select(`
          post_id,
          user_posts (
            id,
            title,
            category,
            condition,
            location,
            image,
            user_id
          )
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error cargando saved_posts:", error);
        setSaved({ products: {} });
        return;
      }

      console.log("Saved data encontrado:", savedData);

      const products: Record<string, SavedProduct> = {};
      
      savedData?.forEach(item => {
        if (item.user_posts && Array.isArray(item.user_posts)) {
          const post = item.user_posts[0];
          if (post) {
            products[post.id] = {
              id: post.id,
              title: post.title,
              image: post.image || undefined,
              category: post.category,
              condition: post.condition,
              location: post.location,
              user_id: post.user_id
            };
          }
        } else if (item.user_posts && typeof item.user_posts === 'object') {
          const post = item.user_posts as any;
          products[post.id] = {
            id: post.id,
            title: post.title,
            image: post.image || undefined,
            category: post.category,
            condition: post.condition,
            location: post.location,
            user_id: post.user_id
          };
        }
      });

      setSaved({ products });
      console.log("Productos guardados cargados:", products);

    } catch (error) {
      console.error("Error en loadSaved:", error);
      setSaved({ products: {} });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  const isProductSaved = useCallback(
    (id: string) => Boolean(saved.products[id]),
    [saved]
  );

  const toggleProduct = useCallback(
    async (item: Omit<SavedProduct, 'user_id'>) => {
      if (!user) {
        console.warn("Usuario no autenticado, no se puede guardar");
        return;
      }

      const productId = String(item.id);
      const currentlySaved = Boolean(saved.products[productId]);

      setLoading(true);
      try {
        if (currentlySaved) {
          // Eliminar de guardados
          console.log("Eliminando de guardados:", productId);
          const { error } = await supabase
            .from("saved_posts")
            .delete()
            .eq("user_id", user.id)
            .eq("post_id", productId);

          if (error) {
            console.error("Error al eliminar de guardados:", error);
            return;
          }

          setSaved((prev) => {
            const next: SavedState = { products: { ...prev.products } };
            delete next.products[productId];
            return next;
          });
          console.log("Producto eliminado de guardados");

        } else {
          // Agregar a guardados
          console.log("Agregando a guardados:", productId);
          
          // Verificar que el producto existe antes de guardarlo
          const { data: productExists, error: checkError } = await supabase
            .from("user_posts")
            .select("id")
            .eq("id", productId)
            .single();

          if (checkError || !productExists) {
            console.error("El producto no existe o no se pudo verificar");
            return;
          }

          const { error } = await supabase
            .from("saved_posts")
            .insert([{
              user_id: user.id,
              post_id: productId,
            }]);

          if (error) {
            console.error("Error al guardar producto:", error);
            if (error.code === '23505') {
              console.log("El producto ya estaba guardado");
            }
            return;
          }

          setSaved((prev) => {
            const next: SavedState = { products: { ...prev.products } };
            next.products[productId] = { ...item, user_id: user.id };
            return next;
          });
          console.log("Producto guardado exitosamente");

          // Crear notificación para el dueño del producto
          try {
            const { data: productData, error: productError } = await supabase
              .from('user_posts')
              .select('user_id, title')
              .eq('id', productId)
              .single();

            if (!productError && productData && productData.user_id !== user.id) {
              await supabase
                .from('notifications')
                .insert([{
                  user_id: productData.user_id,
                  type: 'saved',
                  title: '¡Alguien guardó tu publicación!',
                  message: `A ${user.user_metadata?.username || 'alguien'} le gustó tu producto "${productData.title}"`,
                  related_product_id: productId,
                  from_user_id: user.id
                }]);
            }
          } catch (notifError) {
            console.error('Error en notificación de guardado:', notifError);
          }
        }
      } catch (error) {
        console.error("Error en toggleProduct:", error);
      } finally {
        setLoading(false);
      }
    },
    [saved, user]
  );

  const savedProducts = useMemo(() => 
    Object.values(saved.products), 
    [saved.products]
  );

  const value = useMemo(
    () => ({ 
      saved, 
      isProductSaved, 
      toggleProduct,
      loading,
      savedProducts
    }),
    [saved, isProductSaved, toggleProduct, loading, savedProducts]
  );
  
  return (
    <SavedContext.Provider value={value}>{children}</SavedContext.Provider>
  );
};

export const useSaved = (): SavedContextType => {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within <SavedProvider>");
  return ctx;
};