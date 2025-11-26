// import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/useAuthContext";

const TradeConfirm = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const productA = params.get("productA");
  const productB = params.get("productB");

  const handleConfirm = async () => {
    const { error } = await supabase.from("trades").insert({
      product_offer_id: productA,
      product_receive_id: productB,
      offering_user_id: null, // dueño producto A (si lo sabes)
      receiving_user_id: user?.id, // usuario B
      status: "pendiente"
    });

    if (!error) navigate("/perfil");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Confirmar Trueque</h1>

      <p>Producto que quieres obtener: {productA}</p>
      <p>Producto que vas a ofrecer: {productB}</p>

      <button onClick={handleConfirm}>Confirmar Trueque</button>
    </div>
  );
};

export default TradeConfirm;
