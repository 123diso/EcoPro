import { useState } from "react";
import { supabase } from "../supabaseClient";
import type { AuthFormData } from "../types/types";

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (formData: AuthFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Agregar un pequeño delay para evitar rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            username: formData.username,
          },
        },
      });

      if (error) {
        let errorMessage = error.message;
        if (error.message.includes("429")) {
          errorMessage =
            "Demasiadas solicitudes. Por favor, espera un momento e inténtalo de nuevo.";
        }
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true, data };
    } catch (err) {
      let errorMessage = "Error desconocido";
      if (err instanceof Error) {
        if (err.message.includes("429")) {
          errorMessage =
            "Demasiadas solicitudes. Por favor, espera un momento e inténtalo de nuevo.";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (formData: Pick<AuthFormData, 'email' | 'password'>) => {
    try {
      setLoading(true);
      setError(null);

      // Agregar un pequeño delay para evitar rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        let errorMessage = error.message;
        if (error.message.includes("429")) {
          errorMessage =
            "Demasiadas solicitudes. Por favor, espera un momento e inténtalo de nuevo.";
        }
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true, data };
    } catch (err) {
      let errorMessage = "Error desconocido";
      if (err instanceof Error) {
        if (err.message.includes("429")) {
          errorMessage =
            "Demasiadas solicitudes. Por favor, espera un momento e inténtalo de nuevo.";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    loading,
    error,
    clearError: () => setError(null),
  };
};