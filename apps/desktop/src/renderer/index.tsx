// src/renderer/index.tsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { AccountProvider } from './context/AccountContext';
import './styles/global.css';
import './styles/shared-components.css';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <AccountProvider>
      <App />
    </AccountProvider>
  );
}