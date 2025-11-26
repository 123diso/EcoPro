import { useSearchParams, useNavigate } from "react-router-dom";
import { useUserProducts } from "../../context/UserProductsContext";

const TradeSelect = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { userProducts } = useUserProducts();

  const productA = params.get("productA");

  const handleSelect = (productB: string) => {
    navigate(`/trade/confirm?productA=${productA}&productB=${productB}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Elige el producto que vas a ofrecer</h1>

      {userProducts.map((p) => (
        <div key={p.id} style={{ marginBottom: 12 }}>
          <img src={p.image} width="120" />
          <p>{p.title}</p>
          <button onClick={() => handleSelect(p.id)}>Ofrecer este</button>
        </div>
      ))}
    </div>
  );
};

export default TradeSelect;
