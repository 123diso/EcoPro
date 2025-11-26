import { supabase } from "../supabaseClient";
import type { Trade } from "../types/types";

export const createTrade = async (
  offerProductId: string, 
  receiveProductId: string, 
  offeringUserId: string, 
  receivingUserId: string
): Promise<Trade | null> => {
  try {
    const { data, error } = await supabase
      .from("trades")
      .insert([
        {
          product_offer_id: offerProductId,
          product_receive_id: receiveProductId,
          offering_user_id: offeringUserId,
          receiving_user_id: receivingUserId,
          status: "pending",
        },
      ])
      .select(`
        *,
        offer_product:product_offer_id(*),
        receive_product:product_receive_id(*)
      `)
      .single();

    if (error) {
      console.error("Error al crear el trueque:", error);
      throw error;
    }

    return data as Trade;
  } catch (error) {
    console.error("Error en createTrade:", error);
    return null;
  }
};

export const updateTradeStatus = async (
  tradeId: string, 
  status: Trade['status']
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("trades")
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", tradeId);

    if (error) {
      console.error("Error actualizando estado del trueque:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error en updateTradeStatus:", error);
    return false;
  }
};

export const getUserTrades = async (userId: string): Promise<Trade[]> => {
  try {
    const { data, error } = await supabase
      .from("trades")
      .select(`
        *,
        offer_product:product_offer_id(*),
        receive_product:product_receive_id(*),
        offering_user:offering_user_id(user_metadata, email),
        receiving_user:receiving_user_id(user_metadata, email)
      `)
      .or(`offering_user_id.eq.${userId},receiving_user_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error obteniendo trueques del usuario:", error);
      throw error;
    }

    return data as Trade[] || [];
  } catch (error) {
    console.error("Error en getUserTrades:", error);
    return [];
  }
};