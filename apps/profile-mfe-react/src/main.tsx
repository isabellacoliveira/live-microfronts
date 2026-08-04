import React from 'react';
import ReactDOM from 'react-dom/client';
import ProfileApp from './App';

// Profile MFE React - bootstrap.
// Responsabilidade: quando executado standalone, monta o ProfileApp no #root.
// Quando carregado pelo host via Module Federation, o host usa o componente exposto
// (./App) diretamente, e este arquivo não é executado.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProfileApp />
  </React.StrictMode>
);
