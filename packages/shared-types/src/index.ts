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
