import React from 'react';
import ReactDOM from 'react-dom/client';
import DashboardApp from './App';

// Dashboard MFE React - bootstrap.
// Responsabilidade: quando executado standalone, monta o DashboardApp no #root.
// Quando carregado pelo host via Module Federation, o host usa o componente exposto
// (./App) diretamente, e este arquivo não é executado.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DashboardApp />
  </React.StrictMode>
);
