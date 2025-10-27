import { supabase } from "../supabaseClient";
import type { Trade } from "../types/types";

export const createTrade = async (offerId: string, receiveId: string): Promise<Trade | null> => {
  const { data, error } = await supabase
    .from("trades")
    .insert([
      {
        product_offer_id: offerId,
        product_receive_id: receiveId,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error al crear el trueque:", error);
    return null;
  }

  return data as Trade;
};
