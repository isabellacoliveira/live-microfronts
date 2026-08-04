import { useState } from 'react';
import { Button, Card, Input } from '@design-system';
import { INSURANCE_EVENTS, publish, setSharedState, type Customer } from '@shared-utils';
import type { CustomerFormValues } from '../../../entities/customer/model/types';

const initialValues: CustomerFormValues = {
  name: 'Isabella Cruz',
  cpf: '123.456.789-00',
  email: 'isabella@exemplo.com',
  phone: '(11) 99999-0000',
};

export function RegisterCustomerForm() {
  const [values, setValues] = useState(initialValues);
  const [success, setSuccess] = useState(false);

  const update = (field: keyof CustomerFormValues, value: string) => {
    setSuccess(false);
    setValues((current) => ({ ...current, [field]: value }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const customer: Customer = { id: 'customer-isabella', ...values };

    setSharedState({
      text: `Cliente atualizado: ${customer.name}`,
      source: 'customer-mfe',
      scope: 'customer',
      customer,
    });
    publish(INSURANCE_EVENTS.customerUpdated, customer);
    setSuccess(true);
  };

  return (
    <Card>
      <form onSubmit={submit} style={{ display: 'grid', gap: '0.8rem' }}>
        <div>
          <h3 style={{ margin: 0 }}>Cadastro do cliente</h3>
          <p style={{ color: '#6b7280', margin: '0.35rem 0 0' }}>
            Ao salvar, este MFE publica <strong>customer.updated</strong> para os consumidores interessados.
          </p>
        </div>
        <Input aria-label="Nome" placeholder="Nome" value={values.name} onChange={(event) => update('name', event.target.value)} required />
        <Input aria-label="CPF" placeholder="CPF" value={values.cpf} onChange={(event) => update('cpf', event.target.value)} required />
        <Input aria-label="E-mail" type="email" placeholder="E-mail" value={values.email} onChange={(event) => update('email', event.target.value)} required />
        <Input aria-label="Telefone" placeholder="Telefone" value={values.phone} onChange={(event) => update('phone', event.target.value)} required />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button type="submit">Salvar cadastro</Button>
          {success && <span role="status" style={{ color: '#047857', fontWeight: 600 }}>Cadastro salvo com sucesso.</span>}
        </div>
      </form>
    </Card>
  );
}
