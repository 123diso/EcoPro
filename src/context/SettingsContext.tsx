import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./useAuthContext";

export interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  location: string;
  language: string;
}

interface SettingsContextType {
  settings: UserSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
}

const defaultSettings: UserSettings = {
  notifications: false,
  darkMode: false,
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
          darkMode: data.dark_mode ?? defaultSettings.darkMode,
          location: data.location ?? defaultSettings.location,
          language: data.language ?? defaultSettings.language,
        });
      } else {
        await supabase
          .from('user_settings')
          .insert([
            {
              user_id: user.id,
              notifications: defaultSettings.notifications,
              dark_mode: defaultSettings.darkMode,
              location: defaultSettings.location,
              language: defaultSettings.language,
            }
          ]);
        
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
          dark_mode: updatedSettings.darkMode,
          location: updatedSettings.location,
          language: updatedSettings.language,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      if (newSettings.darkMode !== undefined) {
        applyDarkMode(newSettings.darkMode);
      }

    } catch (error) {
      console.error('Error updating settings:', error);
      setSettings(settings);
    }
  }, [user, settings]);

  const applyDarkMode = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  useEffect(() => {
    loadUserSettings();
  }, [loadUserSettings]);

  useEffect(() => {
    if (!loading) {
      applyDarkMode(settings.darkMode);
    }
  }, [settings.darkMode, loading]);

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