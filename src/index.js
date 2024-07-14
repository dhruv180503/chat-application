import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ChatContextProvider } from './context/ChatContext';
import { AuthContextProvider } from './context/AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
