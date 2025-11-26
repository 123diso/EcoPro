import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./TradeConfirm.css";

const TradeConfirm = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const raw = params.get("data");
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    if (raw) {
      try {
        setPayload(JSON.parse(raw));
      } catch (e) {
        console.error("Error parsing QR data:", e);
      }
    }
  }, []);

  const handleConfirm = async () => {
    if (!payload) return;

    const { productId } = payload;

    const { error } = await supabase
      .from("trades")
      .update({ status: "en_proceso" })
      .eq("product_id", productId);

    if (!error) {
      navigate(`/trade/${productId}`);
    }
  };

  if (!payload) return <p>Cargando...</p>;

  return (
    <div className="trade-confirm-page">
      <h2 className="trade-confirm-title">
        <span onClick={() => navigate(-1)}>←</span> Confirmar Trueque
      </h2>

      <div className="trade-confirm-card">
        <img src={payload.image} alt="Producto" />

        <h3 className="trade-confirm-product-name">{payload.name}</h3>

        <p className="trade-confirm-product-info">{payload.category}</p>
        <p className="trade-confirm-product-info">{payload.condition}</p>

        <div className="trade-confirm-info-box">
          Estás a punto de confirmar el trueque de este producto.
        </div>

        <button className="trade-confirm-btn" onClick={handleConfirm}>
          Confirmar Trueque
        </button>

        <p className="trade-confirm-hint">
          Esta acción actualizará el estado del trueque.
        </p>
      </div>
    </div>
  );
};

export default TradeConfirm;
