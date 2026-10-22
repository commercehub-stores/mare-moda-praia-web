import Link from "next/link";

export default function NotFound() {
  return (
    <div className="plp-head page" style={{ alignItems: "flex-start", paddingBottom: 40 }}>
      <p className="eyebrow">Erro 404</p>
      <h1 className="display" style={{ fontSize: 56, margin: 0 }}>
        Essa onda já passou.
      </h1>
      <p className="muted">A página que você procurou não existe mais.</p>
      <Link href="/" className="btn btn-ink">
        Voltar para a home
      </Link>
    </div>
  );
}
