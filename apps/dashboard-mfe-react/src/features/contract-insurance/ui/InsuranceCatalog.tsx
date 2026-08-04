import { useEffect, useState } from 'react';
import { Badge, Button, Card } from '@design-system';
import {
  INSURANCE_EVENTS,
  getSharedState,
  publish,
  setSharedState,
  subscribe,
  type Customer,
  type Insurance,
  type InsuranceContract,
} from '@shared-utils';
import { insuranceCatalog } from '../../../entities/insurance/model/insurances';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function InsuranceCatalog() {
  const [customer, setCustomer] = useState<Customer | undefined>(() => getSharedState().customer);
  const [toast, setToast] = useState('');

  useEffect(() => subscribe<Customer>(INSURANCE_EVENTS.customerUpdated, setCustomer), []);

  const contract = (insurance: Insurance) => {
    if (!customer) {
      setToast('Cadastre o cliente antes de contratar um seguro.');
      return;
    }

    const insuranceContract: InsuranceContract = {
      id: `contract-${Date.now()}`,
      customer,
      insurance,
      contractDate: new Date().toISOString(),
      status: 'Ativa',
    };
    setSharedState({
      text: `${customer.name} contratou ${insurance.name}`,
      source: 'insurance-catalog-mfe',
      scope: 'insurance',
      customer,
      insuranceContract,
    });
    publish(INSURANCE_EVENTS.insuranceContracted, insuranceContract);
    setToast(`${insurance.name} contratado com sucesso.`);
  };

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <Card>
        {customer ? (
          <div>
            <Badge>Cliente identificado</Badge>
            <h3 style={{ margin: '0.5rem 0 0' }}>Olá, {customer.name.split(' ')[0]}</h3>
            <p style={{ margin: '0.35rem 0 0', color: '#6b7280' }}>Escolha a proteção mais adequada para este momento.</p>
          </div>
        ) : (
          <div>
            <Badge>Etapa 1</Badge>
            <h3 style={{ margin: '0.5rem 0 0' }}>Aguardando cadastro</h3>
            <p style={{ margin: '0.35rem 0 0', color: '#6b7280' }}>Este MFE consome o evento <strong>customer.updated</strong>.</p>
          </div>
        )}
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {insuranceCatalog.map((insurance) => (
          <Card key={insurance.id}>
            <Badge>Proteção</Badge>
            <h3 style={{ marginBottom: '0.35rem' }}>{insurance.name}</h3>
            <p style={{ minHeight: '3rem', marginTop: 0, color: '#6b7280', fontSize: '0.92rem' }}>{insurance.description}</p>
            <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '1rem' }}>{money.format(insurance.price)}/mês</strong>
            <Button onClick={() => contract(insurance)}>Contratar seguro</Button>
          </Card>
        ))}
      </div>
      {toast && <div role="status" style={{ padding: '0.85rem 1rem', background: '#ecfdf5', color: '#047857', borderRadius: '0.75rem', fontWeight: 600 }}>{toast}</div>}
    </div>
  );
}
