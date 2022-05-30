import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App/App';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/error-fallback/ErrorFallback';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ['en', 'ru'],
    fallbackLng: 'en',
    detection: {
      order: ['localStorage'],
    },
    backend: {
      loadPath:
        'https://goldenmanbel.github.io/project-management-app/assets/locales/{{lng}}/translation.json',
      requestOptions: {
        cache: 'no-store',
      },
    },
  });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <HashRouter>
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
      </ErrorBoundary>
    </Provider>
  </HashRouter>
);
