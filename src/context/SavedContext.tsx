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
  id: number | string;
  title: string;
  image?: string;
  category?: string;
  condition?: string;
  location?: string;
};

type SavedState = { products: Record<string, SavedProduct> };

type SavedContextType = {
  saved: SavedState;
  isProductSaved: (id: number | string) => boolean;
  toggleProduct: (item: SavedProduct) => Promise<void>;
  loading: boolean;
};

const SavedContext = createContext<SavedContextType | undefined>(undefined);
const STORAGE_KEY = "dandi:saved";

export const SavedProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState<SavedState>({ products: {} });
  const [loading, setLoading] = useState(false);

  // Cargar guardados desde Supabase cuando hay usuario
  const loadSaved = useCallback(async () => {
    if (!user) {
      setSaved({ products: {} });
      return;
    }

    setLoading(true);
    try {
      console.log("Cargando saved_posts para usuario:", user.id);
      
      const { data: savedRows, error: savedErr } = await supabase
        .from("saved_posts")
        .select("post_id")
        .eq("user_id", user.id);

      if (savedErr) {
        console.error("[saved_posts select error]:", savedErr);
        // Si la tabla no existe, retornar vacío
        if (savedErr.code === '42P01') { // tabla no existe
          console.warn("La tabla saved_posts no existe aún");
          setSaved({ products: {} });
          return;
        }
        throw savedErr;
      }

      console.log("Saved rows encontrados:", savedRows);

      const postIds = (savedRows ?? []).map((r) => r.post_id);
      if (postIds.length === 0) {
        setSaved({ products: {} });
        return;
      }

      // Obtener información de los posts guardados
      const { data: posts, error: postsErr } = await supabase
        .from("user_posts")
        .select("id, title, category, condition, location, image")
        .in("id", postIds);

      if (postsErr) {
        console.error("[user_posts select error]:", postsErr);
        return;
      }

      const products = Object.fromEntries(
        (posts ?? []).map((row) => [
          String(row.id),
          {
            id: row.id,
            title: row.title,
            image: row.image ?? undefined,
            category: row.category,
            condition: row.condition,
            location: row.location,
          } as SavedProduct,
        ])
      );
      
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

  // Persistencia local como fallback
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      /* noop */
    }
  }, [saved]);

  const isProductSaved = useCallback(
    (id: number | string) => Boolean(saved.products[String(id)]),
    [saved]
  );

  const toggleProduct = useCallback(
    async (item: SavedProduct) => {
      if (!user) {
        console.warn("Usuario no autenticado, no se puede guardar");
        return;
      }

      const key = String(item.id);
      const currentlySaved = Boolean(saved.products[key]);

      setLoading(true);
      try {
        if (currentlySaved) {
          // Eliminar de guardados
          console.log("Eliminando de guardados:", key);
          const { error } = await supabase
            .from("saved_posts")
            .delete()
            .eq("user_id", user.id)
            .eq("post_id", key);

          if (error) {
            console.error("Error al eliminar de guardados:", error);
            return;
          }

          setSaved((prev) => {
            const next: SavedState = { products: { ...prev.products } };
            delete next.products[key];
            return next;
          });
          console.log("Producto eliminado de guardados");

        } else {
          // Agregar a guardados
          console.log("Agregando a guardados:", key);
          const insertPayload = {
            user_id: user.id,
            post_id: key,
            saved_at: new Date().toISOString(),
          };

          const { error } = await supabase
            .from("saved_posts")
            .insert([insertPayload]);

          if (error) {
            console.error("Error al guardar producto:", error);
            // Si hay error de constraint único, puede que ya exista
            if (error.code === '23505') {
              console.log("El producto ya estaba guardado");
            }
            return;
          }

          setSaved((prev) => {
            const next: SavedState = { products: { ...prev.products } };
            next.products[key] = item;
            return next;
          });
          console.log("Producto guardado exitosamente");
        }
      } catch (error) {
        console.error("Error en toggleProduct:", error);
      } finally {
        setLoading(false);
      }
    },
    [saved, user]
  );

  const value = useMemo(
    () => ({ 
      saved, 
      isProductSaved, 
      toggleProduct,
      loading 
    }),
    [saved, isProductSaved, toggleProduct, loading]
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