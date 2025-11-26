import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./useAuthContext";
import { useNotifications } from "./NotificationsContext";
import type { Trade } from "../types/types";

interface TradesContextType {
  trades: Trade[];
  loading: boolean;
  createTrade: (offerProductId: string, receiveProductId: string, receivingUserId: string) => Promise<void>;
  updateTradeStatus: (tradeId: string, status: Trade['status']) => Promise<void>;
  fetchTrades: () => Promise<void>;
  getTradeById: (tradeId: string) => Trade | undefined;
}

const TradesContext = createContext<TradesContextType | undefined>(undefined);

export const TradesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { createNotification } = useNotifications();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrades = useCallback(async () => {
    if (!user) {
      setTrades([]);
      return;
    }

    setLoading(true);
    try {
      // Try with joins first, fallback to simple query if it fails
      let { data, error } = await supabase
        .from('trades')
        .select(`
          *,
          offer_product:product_offer_id(*),
          receive_product:product_receive_id(*),
          offering_user:offering_user_id(user_metadata, email),
          receiving_user:receiving_user_id(user_metadata, email)
        `)
        .or(`offering_user_id.eq.${user.id},receiving_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback to simple query without joins
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('trades')
          .select('*')
          .or(`offering_user_id.eq.${user.id},receiving_user_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (fallbackError) {
          console.error('Error fetching trades:', fallbackError);
          setTrades([]);
          return;
        }

        data = fallbackData;
      }

      setTrades(data || []);
    } catch (error) {
      console.error('Error fetching trades:', error);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createTrade = useCallback(async (offerProductId: string, receiveProductId: string, receivingUserId: string) => {
    if (!user) throw new Error('User must be logged in');

    try {
      // Primero obtener información del producto que se quiere recibir
      const { data: receiveProduct, error: productError } = await supabase
        .from('user_posts')
        .select('*')
        .eq('id', receiveProductId)
        .single();

      if (productError) throw productError;

      // Crear el trueque
      const { data: trade, error } = await supabase
        .from('trades')
        .insert([{
          product_offer_id: offerProductId,
          product_receive_id: receiveProductId,
          offering_user_id: user.id,
          receiving_user_id: receivingUserId
        }])
        .select()
        .single();

      if (error) throw error;

      // Crear notificación para el usuario receptor
      await createNotification({
        user_id: receivingUserId,
        type: 'trade_proposal',
        title: 'Nueva propuesta de trueque',
        message: `${user.user_metadata?.username || 'Alguien'} quiere hacer trueque por tu producto "${receiveProduct.title}"`,
        related_product_id: receiveProductId,
        related_trade_id: trade.id,
        from_user_id: user.id
      });

      await fetchTrades();
    } catch (error) {
      console.error('Error creating trade:', error);
      throw error;
    }
  }, [user, createNotification, fetchTrades]);

  const updateTradeStatus = useCallback(async (tradeId: string, status: Trade['status']) => {
  try {
    const { error } = await supabase
      .from('trades')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', tradeId);

    if (error) throw error;

    // Actualizar estado local
    setTrades(prev => 
      prev.map(trade => 
        trade.id === tradeId ? { ...trade, status, updated_at: new Date().toISOString() } : trade
      )
    );

    // Obtener información del trueque para la notificación
    const trade = trades.find(t => t.id === tradeId);
    if (trade) {
      const notificationUserId = status === 'accepted' ? trade.offering_user_id : trade.receiving_user_id;
      const statusMessages: Record<string, string> = {
        accepted: 'aceptó',
        rejected: 'rechazó', 
        in_progress: 'está procesando',
        completed: 'completó',
        cancelled: 'canceló',
        pending: 'actualizó' // Agregar pending
      };

      await createNotification({
        user_id: notificationUserId,
        type: 'trade_update',
        title: `Trueque ${status === 'accepted' ? 'aceptado' : status}`,
        message: `El usuario ${user?.user_metadata?.username || 'alguien'} ${statusMessages[status] || 'actualizó'} tu propuesta de trueque`,
        related_trade_id: tradeId,
        from_user_id: user?.id
      });
    }

  } catch (error) {
    console.error('Error updating trade status:', error);
    throw error;
  }
}, [trades, user, createNotification]);

  const getTradeById = useCallback((tradeId: string) => {
    return trades.find(trade => trade.id === tradeId);
  }, [trades]);

  // Suscripción en tiempo real a trades
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('trades')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `offering_user_id=eq.${user.id}`
        },
        () => {
          fetchTrades();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `receiving_user_id=eq.${user.id}`
        },
        () => {
          fetchTrades();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchTrades]);

  // Cargar trades al iniciar
  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  return (
    <TradesContext.Provider value={{
      trades,
      loading,
      createTrade,
      updateTradeStatus,
      fetchTrades,
      getTradeById
    }}>
      {children}
    </TradesContext.Provider>
  );
};

export const useTrades = () => {
  const context = useContext(TradesContext);
  if (context === undefined) {
    throw new Error('useTrades must be used within a TradesProvider');
  }
  return context;
};