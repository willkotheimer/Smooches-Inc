import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/tailwind.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.Fragment>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.Fragment>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
