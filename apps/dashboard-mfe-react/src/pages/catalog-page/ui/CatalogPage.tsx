import { InsuranceCatalog } from '../../../features/contract-insurance/ui/InsuranceCatalog';

export function CatalogPage() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', padding: '1.25rem', borderRadius: '1rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em' }}>MFE INSURANCE CATALOG</span>
        <h2 style={{ margin: '0.35rem 0 0' }}>Encontre a proteção ideal</h2>
        <p style={{ margin: '0.35rem 0 0' }}>Responsabilidade única: ofertar seguros e publicar <strong>insurance.contracted</strong>.</p>
      </div>
      <InsuranceCatalog />
    </div>
  );
}
