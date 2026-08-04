import { RegisterCustomerForm } from '../../../features/register-customer/ui/RegisterCustomerForm';

export function CustomerPage() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #0f766e, #14b8a6)', color: 'white', padding: '1.25rem', borderRadius: '1rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em' }}>MFE CUSTOMER</span>
        <h2 style={{ margin: '0.35rem 0 0' }}>Dados do segurado</h2>
        <p style={{ margin: '0.35rem 0 0' }}>Responsabilidade única: manter o cadastro e publicar atualizações do cliente.</p>
      </div>
      <RegisterCustomerForm />
    </div>
  );
}
