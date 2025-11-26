import { useSearchParams, useNavigate } from "react-router-dom";

const TradeStart = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const productId = params.get("productId");

  const handleContinue = () => {
    navigate(`/trade/select?productA=${productId}`);
  };

  if (!productId) return <h2>Error: QR inválido</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Iniciar Trueque</h1>
      <p>Estás iniciando un trueque por el producto:</p>
      <strong>{productId}</strong>

      <button onClick={handleContinue}>Elegir producto para ofrecer</button>
    </div>
  );
};

export default TradeStart;
