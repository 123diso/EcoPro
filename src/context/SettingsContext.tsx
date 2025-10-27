import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./useAuthContext";

export interface UserSettings {
  notifications: boolean;
  location: string;
  language: string;
}

interface SettingsContextType {
  settings: UserSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
}

const defaultSettings: UserSettings = {
  notifications: true,
  location: "",
  language: "es"
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadUserSettings = useCallback(async () => {
    if (!user) {
      setSettings(defaultSettings);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
      }

      if (data) {
        setSettings({
          notifications: data.notifications ?? defaultSettings.notifications,
          location: data.location ?? defaultSettings.location,
          language: data.language ?? defaultSettings.language,
        });
      } else {
        // Crear configuración por defecto si no existe
        const { error: insertError } = await supabase
          .from('user_settings')
          .insert([
            {
              user_id: user.id,
              notifications: defaultSettings.notifications,
              location: defaultSettings.location,
              language: defaultSettings.language,
              created_at: new Date().toISOString(),
            }
          ]);

        if (insertError) {
          console.error('Error creating default settings:', insertError);
        }
        
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error in loadUserSettings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          notifications: updatedSettings.notifications,
          location: updatedSettings.location,
          language: updatedSettings.language,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      console.log('Settings updated successfully');

    } catch (error) {
      console.error('Error updating settings:', error);
      // Revertir cambios en caso de error
      setSettings(settings);
    }
  }, [user, settings]);

  useEffect(() => {
    loadUserSettings();
  }, [loadUserSettings]);

  // Recargar configuraciones cuando cambie el usuario
  useEffect(() => {
    if (user) {
      loadUserSettings();
    } else {
      setSettings(defaultSettings);
      setLoading(false);
    }
  }, [user, loadUserSettings]);

  return (
    <SettingsContext.Provider value={{
      settings,
      loading,
      updateSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};