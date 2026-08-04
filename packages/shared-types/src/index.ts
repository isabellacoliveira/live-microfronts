// Contratos compartilhados entre apps e packages.
// Responsabilidade: centralizar interfaces e tipos usados por host e MFEs.

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  unread: boolean;
};

export type Customer = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
};

export type Insurance = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type InsuranceContract = {
  id: string;
  customer: Customer;
  insurance: Insurance;
  contractDate: string;
  status: 'Ativa';
};
