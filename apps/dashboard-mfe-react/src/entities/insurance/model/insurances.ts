import type { Insurance } from '@shared-utils';

export const insuranceCatalog: Insurance[] = [
  { id: 'auto', name: 'Seguro Auto', price: 189.9, description: 'Proteção para colisões, roubo e assistência 24 horas.' },
  { id: 'residencial', name: 'Seguro Residencial', price: 79.9, description: 'Cobertura para sua casa, bens e emergências.' },
  { id: 'vida', name: 'Seguro Vida', price: 64.9, description: 'Segurança financeira para quem você ama.' },
  { id: 'viagem', name: 'Seguro Viagem', price: 42.9, description: 'Assistência médica e proteção durante a viagem.' },
];
