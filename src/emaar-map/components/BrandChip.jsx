// BrandChip: small "Emaar Misr" label at the top.
import "../styles/brand.css";

export default function BrandChip() {
  return (
    <div className="brand">
      <div className="brand-mark" aria-hidden="true" />
      <div>
        <div className="brand-title">Emaar Misr</div>
        <div className="brand-sub">Projects in Egypt</div>
      </div>
    </div>
  );
}
