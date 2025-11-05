import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './styles/global.css';

const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        rootElement
    );
} else {
    console.error('Root element not found');
}