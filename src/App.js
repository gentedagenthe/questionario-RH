import React from 'react';
import QuestionarioAnalistaRH from './QuestionarioAnalistaRH';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const rota = window.location.pathname;

  if (rota.startsWith('/admin')) {
    return <AdminPanel />;
  }

  if (process.env.REACT_APP_INSCRICOES_ENCERRADAS === 'true') {
    return (
      <div style={{ minHeight: '100vh', background: '#F0F4F8', fontFamily: "'Poppins', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{ maxWidth: '520px', background: '#fff', border: '1px solid #D4E6F1', borderRadius: '12px', padding: '32px 26px', textAlign: 'center' }}>
          <div style={{ fontSize: '19px', fontWeight: 800, color: '#1B6FAB', marginBottom: '8px' }}>Inscrições encerradas</div>
          <div style={{ fontSize: '13px', color: '#5b6b7a' }}>
            O período de inscrições para a vaga de Analista de Recursos Humanos foi encerrado. Agradecemos o seu interesse.
          </div>
        </div>
      </div>
    );
  }

  return <QuestionarioAnalistaRH />;
}
