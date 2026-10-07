import React, { useState, useCallback } from 'react';
import { supabase } from './supabaseClient';

const AZUL = '#1B6FAB';
const VERDE = '#6BBF4E';
const FUNDO = '#F0F4F8';
const BORDA = '#D4E6F1';

const styles = {
  page: {
    minHeight: '100vh',
    background: FUNDO,
    fontFamily: "'Poppins', sans-serif",
    padding: '24px 16px',
  },
  header: {
    maxWidth: '640px',
    margin: '0 auto 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: AZUL,
    borderBottom: `4px solid ${VERDE}`,
    borderRadius: '10px',
    padding: '16px 22px',
  },
  logoText: { color: '#fff', fontWeight: 800, fontSize: '20px' },
  logoSub: { color: 'rgba(255,255,255,0.85)', fontSize: '12px' },
  card: {
    maxWidth: '640px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '12px',
    border: `1px solid ${BORDA}`,
    padding: '28px 26px',
    boxShadow: '0 2px 10px rgba(27,111,171,0.08)',
  },
  titulo: { fontSize: '19px', fontWeight: 800, color: AZUL, marginBottom: '4px' },
  subtitulo: { fontSize: '13px', color: '#5b6b7a', marginBottom: '18px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#33404a', margin: '16px 0 6px' },
  input: {
    width: '100%',
    padding: '11px 13px',
    fontSize: '14px',
    borderRadius: '8px',
    border: `1.5px solid ${BORDA}`,
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '11px 13px',
    fontSize: '14px',
    borderRadius: '8px',
    border: `1.5px solid ${BORDA}`,
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  radioGroup: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  radioOpt: (sel) => ({
    padding: '9px 16px',
    borderRadius: '8px',
    border: `1.5px solid ${sel ? VERDE : BORDA}`,
    background: sel ? '#f0faf0' : '#fff',
    fontSize: '13px',
    color: sel ? '#256b1f' : '#33404a',
    cursor: 'pointer',
    fontWeight: sel ? 700 : 500,
  }),
  botao: {
    width: '100%',
    marginTop: '24px',
    padding: '13px',
    background: AZUL,
    color: '#fff',
    fontWeight: 700,
    fontSize: '14px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  botaoSec: {
    width: '100%',
    marginTop: '10px',
    padding: '13px',
    background: '#fff',
    color: AZUL,
    fontWeight: 700,
    fontSize: '14px',
    border: `1.5px solid ${AZUL}`,
    borderRadius: '8px',
    cursor: 'pointer',
  },
  nav: { display: 'flex', gap: '10px', marginTop: '22px' },
  erro: {
    background: '#fff3f3',
    border: '1px solid #f5c2c2',
    color: '#c0392b',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    marginTop: '14px',
  },
  lgpd: {
    background: FUNDO,
    border: `1px solid ${BORDA}`,
    borderRadius: '8px',
    padding: '16px 18px',
    fontSize: '12.5px',
    color: '#4a5a68',
    lineHeight: 1.7,
    marginTop: '14px',
  },
  checkLgpd: (sel) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '13px 15px',
    borderRadius: '8px',
    border: `1.5px solid ${sel ? VERDE : BORDA}`,
    background: sel ? '#f0faf0' : '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#374151',
    marginTop: '18px',
  }),
  progWrap: { display: 'flex', gap: '5px', maxWidth: '640px', margin: '0 auto 14px' },
  progBar: (state) => ({
    flex: 1,
    height: '5px',
    borderRadius: '4px',
    background: state === 'done' ? VERDE : state === 'atual' ? AZUL : BORDA,
  }),
  gridInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '10px',
    margin: '18px 0 22px',
  },
  infoCard: {
    background: FUNDO,
    border: `1px solid ${BORDA}`,
    borderRadius: '10px',
    padding: '14px 12px',
    textAlign: 'center',
  },
  infoIcon: { fontSize: '20px', marginBottom: '4px' },
  infoLabel: { fontSize: '11px', color: '#6b7a88', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' },
  infoValor: { fontSize: '13px', color: '#1a2733', fontWeight: 700, marginTop: '2px' },
  secaoTitulo: {
    fontSize: '12px',
    fontWeight: 800,
    color: AZUL,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginTop: '20px',
    marginBottom: '8px',
  },
  listaItem: { display: 'flex', gap: '8px', fontSize: '13.5px', color: '#3d4a56', padding: '4px 0', lineHeight: 1.5 },
  checkIcon: { color: VERDE, fontWeight: 800 },
  botaoCandidatar: {
    width: '100%',
    marginTop: '22px',
    padding: '14px',
    background: AZUL,
    color: '#fff',
    fontWeight: 700,
    fontSize: '14.5px',
    border: 'none',
    borderRadius: '9px',
    cursor: 'pointer',
  },
};

const ETAPAS = [
  { id: 'lgpd', titulo: '', sub: '' },
  { id: 'dados', titulo: 'Dados Pessoais', sub: 'Preencha seus dados de identificação e contato.' },
  { id: 'situacao', titulo: 'Situação Profissional Atual', sub: 'Conte sua situação atual e disponibilidade.' },
  { id: 'formacao', titulo: 'Formação e Experiência', sub: 'Sua trajetória na área de Recursos Humanos.' },
  { id: 'captacao', titulo: 'Captação, Seleção e Integração', sub: 'Como você conduz a entrada de novos colaboradores.' },
  { id: 'desenvolvimento', titulo: 'Desenvolvimento e Suporte às Lideranças', sub: 'Treinamentos, avaliações e apoio aos gestores.' },
  { id: 'indicadores', titulo: 'Indicadores e Visão de Negócio', sub: 'Sua relação com indicadores, iniciativa e crescimento do negócio.' },
  { id: 'motivacao', titulo: 'Perfil e Motivação', sub: 'O que te move e o que espera desta oportunidade.' },
  { id: 'disponibilidade', titulo: 'Localização e Disponibilidade', sub: 'Informações essenciais sobre local e horário de trabalho.' },
  { id: 'fim', titulo: '', sub: '' },
];

const inicial = {
  // Dados Pessoais
  nome: '', cpf: '', email: '', telefone: '', cidade_atual: '', estado_atual: '',
  com_quem_mora: '',
  // Situação Profissional
  situacao_profissional: '', empresa_atual: '', cargo_atual: '', disponibilidade_inicio: '',
  // Formação e Experiência
  formacao: '', tempo_experiencia_rh: '', experiencia_rh: '', experiencia_varejo: '',
  // Captação, Seleção e Integração
  captacao_selecao: '', quadro_completo: '', integracao: '',
  // Desenvolvimento e Suporte às Lideranças
  treinamento: '', suporte_liderancas: '', avaliacoes: '',
  // Indicadores e Visão de Negócio
  indicadores: '', iniciativa_criatividade: '', sustentabilidade_negocio: '',
  // Perfil e Motivação
  motivacao_vaga: '', contribuicao: '', pretensao_salarial: '',
  // Localização e Disponibilidade
  reside_campo_grande: '', disponibilidade_mudanca: '', disponibilidade_horario: '',
  // LGPD
  lgpd_aceite: false,
};

// ---------- Campos definidos FORA do componente para evitar perda de foco ----------

const CampoTexto = React.memo(function CampoTexto({ label, valor, campo, onChange, placeholder, tipo = 'text' }) {
  return (
    <>
      <label style={styles.label}>{label} *</label>
      <input
        style={styles.input}
        type={tipo}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onChange(campo, e.target.value)}
      />
    </>
  );
});

const CampoTextArea = React.memo(function CampoTextArea({ label, valor, campo, onChange, placeholder, linhas = 3 }) {
  return (
    <>
      <label style={styles.label}>{label} *</label>
      <textarea
        style={styles.textarea}
        rows={linhas}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onChange(campo, e.target.value)}
      />
    </>
  );
});

const CampoRadio = React.memo(function CampoRadio({ label, valor, campo, onChange, opcoes }) {
  return (
    <>
      <label style={styles.label}>{label} *</label>
      <div style={styles.radioGroup}>
        {opcoes.map((op) => (
          <div
            key={op}
            style={styles.radioOpt(valor === op)}
            onClick={() => onChange(campo, op)}
          >
            {op}
          </div>
        ))}
      </div>
    </>
  );
});


const Cabecalho = () => (
  <div style={styles.header}>
    <div>
      <div style={styles.logoText}>genthe</div>
      <div style={styles.logoSub}>que entende de gente</div>
    </div>
    <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', textAlign: 'right' }}>
      Processo Seletivo<br />
      <strong style={{ color: '#fff' }}>Analista de Recursos Humanos | Varejo</strong>
    </div>
  </div>
);

const Rodape = () => (
  <div style={{ textAlign: 'center', marginTop: '26px', fontSize: '12px', color: '#8a97a3' }}>
    contato@genthe.com.br &nbsp;|&nbsp; www.genthe.com.br &nbsp;|&nbsp; @gentheconsultoria
  </div>
);

export default function QuestionarioAnalistaRH() {
  const [tela, setTela] = useState('vaga');
  const [lgpdAceite, setLgpdAceite] = useState(false);
  const [lgpdErro, setLgpdErro] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [form, setForm] = useState(inicial);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const set = useCallback((campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
  }, []);

  const validar = useCallback(() => {
    if (etapa === 1) {
      if (!form.nome.trim()) return 'Informe o nome completo.';
      if (!form.cpf.trim()) return 'Informe o CPF.';
      if (!form.email.trim()) return 'Informe o e-mail.';
      if (!form.telefone.trim()) return 'Informe o telefone.';
      if (!form.cidade_atual.trim()) return 'Informe a cidade onde reside atualmente.';
      if (!form.estado_atual.trim()) return 'Informe o estado onde reside atualmente.';
      if (!form.com_quem_mora) return 'Informe com quem mora atualmente.';
    }
    if (etapa === 2) {
      if (!form.situacao_profissional) return 'Informe a situação profissional atual.';
      if (!form.empresa_atual.trim()) return 'Informe a empresa atual ou a mais recente.';
      if (!form.cargo_atual.trim()) return 'Informe o cargo atual ou o mais recente.';
      if (!form.disponibilidade_inicio) return 'Informe a disponibilidade para início.';
    }
    if (etapa === 3) {
      if (!form.formacao.trim()) return 'Informe sua formação.';
      if (!form.tempo_experiencia_rh) return 'Informe o tempo de experiência em Recursos Humanos.';
      if (!form.experiencia_rh.trim()) return 'Descreva sua experiência em Recursos Humanos.';
      if (!form.experiencia_varejo) return 'Informe se possui experiência no segmento de varejo.';
    }
    if (etapa === 4) {
      if (!form.captacao_selecao.trim()) return 'Descreva como conduz um processo de captação e seleção.';
      if (!form.quadro_completo.trim()) return 'Descreva como atua para manter o quadro de colaboradores completo.';
      if (!form.integracao.trim()) return 'Descreva como estrutura a integração de novos colaboradores.';
    }
    if (etapa === 5) {
      if (!form.treinamento.trim()) return 'Descreva como planeja e organiza treinamentos.';
      if (!form.suporte_liderancas.trim()) return 'Descreva uma situação de suporte a uma liderança.';
      if (!form.avaliacoes.trim()) return 'Descreva como acompanha as avaliações de experiência e de desempenho.';
    }
    if (etapa === 6) {
      if (!form.indicadores.trim()) return 'Descreva os indicadores de gestão de pessoas que já implantou ou acompanhou.';
      if (!form.iniciativa_criatividade.trim()) return 'Descreva uma ação que propôs por iniciativa própria.';
      if (!form.sustentabilidade_negocio.trim()) return 'Descreva como o RH pode contribuir para o crescimento do negócio.';
    }
    if (etapa === 7) {
      if (!form.motivacao_vaga.trim()) return 'Informe o que te motivou a se candidatar.';
      if (!form.contribuicao.trim()) return 'Descreva como pode contribuir para a empresa.';
      if (!form.pretensao_salarial.trim()) return 'Informe a pretensão salarial.';
    }
    if (etapa === 8) {
      if (!form.reside_campo_grande) return 'Informe se reside em Campo Grande/MS.';
      if (form.reside_campo_grande === 'Não' && !form.disponibilidade_mudanca) return 'Informe a disponibilidade de mudança.';
      if (!form.disponibilidade_horario) return 'Informe a disponibilidade para o horário de trabalho.';
    }
    return '';
  }, [etapa, form]);

  const avancarLgpd = useCallback(() => {
    if (!lgpdAceite) { setLgpdErro(true); return; }
    setForm((f) => ({ ...f, lgpd_aceite: true }));
    setTela('form');
    window.scrollTo(0, 0);
  }, [lgpdAceite]);

  const enviar = useCallback(async () => {
    setEnviando(true);
    setErro('');
    try {
      const { error } = await supabase.from('candidatos_analista_rh').insert([{ ...form }]);
      if (error) throw error;
      setTela('fim');
      window.scrollTo(0, 0);
    } catch (e) {
      setErro('Ocorreu um erro ao enviar. Tente novamente em instantes.');
    } finally {
      setEnviando(false);
    }
  }, [form]);

  const avancar = useCallback(() => {
    const msg = validar();
    if (msg) { setErro(msg); return; }
    setErro('');
    if (etapa < ETAPAS.length - 2) {
      setEtapa((e) => e + 1);
      window.scrollTo(0, 0);
    } else {
      enviar();
    }
  }, [etapa, validar, enviar]);

  const voltar = useCallback(() => {
    if (etapa > 1) { setEtapa((e) => e - 1); setErro(''); window.scrollTo(0, 0); }
  }, [etapa]);

  const progresso = () => {
    const total = ETAPAS.length - 2;
    const atualIdx = etapa - 1;
    return (
      <div style={styles.progWrap}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={styles.progBar(i < atualIdx ? 'done' : i === atualIdx ? 'atual' : 'pendente')} />
        ))}
      </div>
    );
  };

  // ---------- Tela da Vaga ----------
  if (tela === 'vaga') {
    return (
      <div style={styles.page}>
        <Cabecalho />
        <div style={{ ...styles.card, maxWidth: '640px' }}>
          <div style={styles.titulo}>Analista de Recursos Humanos</div>
          <div style={styles.subtitulo}>Varejo / Rede de Lojas de Roupas · Campo Grande/MS</div>

          <div style={styles.gridInfo}>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>💰</div>
              <div style={styles.infoLabel}>Salário</div>
              <div style={styles.infoValor}>R$ 3.500,00 bruto</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>🕗</div>
              <div style={styles.infoLabel}>Horário</div>
              <div style={styles.infoValor}>Seg a Sex · 07:30 às 17:20</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>📍</div>
              <div style={styles.infoLabel}>Local</div>
              <div style={styles.infoValor}>Campo Grande/MS</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>📄</div>
              <div style={styles.infoLabel}>Contratação</div>
              <div style={styles.infoValor}>CLT</div>
            </div>
          </div>

          <div style={styles.secaoTitulo}>🎁 Benefícios</div>
          <div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Vale Alimentação de R$ 500,00 por mês</div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Vale Transporte (se necessário)</div>
          </div>

          <div style={styles.secaoTitulo}>📚 Requisitos</div>
          <div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Ensino Superior completo em Psicologia, Administração, Gestão de Recursos Humanos ou áreas correlatas</div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Experiência mínima de 5 anos em Recursos Humanos</div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Vivência em recrutamento e seleção, integração e treinamento e desenvolvimento</div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Experiência no suporte a lideranças e no acompanhamento de indicadores de gestão de pessoas</div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Desejável vivência no segmento de varejo</div>
          </div>

          <button style={styles.botaoCandidatar} onClick={() => { setTela('lgpd'); window.scrollTo(0, 0); }}>
            Candidate-se agora →
          </button>
        </div>
        <Rodape />
      </div>
    );
  }

  // ---------- Tela LGPD ----------
  if (tela === 'lgpd') {
    return (
      <div style={styles.page}>
        <Cabecalho />
        <div style={{ ...styles.card, maxWidth: '640px' }}>
          <div style={{ fontSize: '30px', marginBottom: '10px' }}>🔒</div>
          <div style={styles.titulo}>Proteção de Dados — LGPD</div>
          <div style={styles.lgpd}>
            As informações fornecidas neste questionário serão utilizadas exclusivamente para fins de recrutamento e seleção pela <strong>Genthe Consultoria em Gestão de Pessoas</strong>, em conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD)</strong>.<br /><br />
            Seus dados serão tratados com segurança, sigilo e responsabilidade, podendo ser compartilhados com a empresa contratante vinculada a este processo seletivo. Ao prosseguir, você também autoriza a realização de verificação de antecedentes junto a órgãos públicos, utilizando CPF e nome completo, como parte da etapa de triagem.<br /><br />
            Você poderá solicitar a correção, a atualização ou a exclusão dos seus dados a qualquer momento pelo e-mail <strong>contato@genthe.com.br</strong>. Ao continuar, você declara ter lido e concordado com o tratamento dos seus dados pessoais para participação neste processo seletivo, nos termos da LGPD.
          </div>
          <div style={styles.checkLgpd(lgpdAceite)} onClick={() => { setLgpdAceite((v) => !v); setLgpdErro(false); }}>
            <span style={{ fontSize: '16px' }}>{lgpdAceite ? '✅' : '⬜'}</span>
            Li e concordo com o tratamento dos meus dados pessoais, incluindo a verificação de antecedentes, para participação neste processo seletivo, conforme a LGPD.
          </div>
          {lgpdErro && <div style={styles.erro}>É necessário concordar com os termos para continuar.</div>}
          <button style={styles.botao} onClick={avancarLgpd}>Iniciar questionário →</button>
        </div>
        <Rodape />
      </div>
    );
  }

  // ---------- Tela final ----------
  if (tela === 'fim') {
    return (
      <div style={styles.page}>
        <Cabecalho />
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <div style={{ fontSize: '38px', marginBottom: '10px' }}>✅</div>
          <div style={styles.titulo}>Questionário enviado com sucesso!</div>
          <div style={{ fontSize: '13px', color: '#5b6b7a', marginTop: '8px' }}>
            Obrigada pela sua participação no processo seletivo. Nossa equipe analisará suas respostas e entrará em contato em breve.
          </div>
        </div>
        <Rodape />
      </div>
    );
  }

  const e = ETAPAS[etapa];

  return (
    <div style={styles.page}>
      <Cabecalho />
      {progresso()}
      <div style={styles.card}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: VERDE, letterSpacing: '0.5px' }}>
          ETAPA {etapa} DE {ETAPAS.length - 2}
        </div>
        <div style={styles.titulo}>{e.titulo}</div>
        <div style={styles.subtitulo}>{e.sub}</div>

        {e.id === 'dados' && (
          <>
            <CampoTexto label="Nome completo" campo="nome" valor={form.nome} onChange={set} placeholder="Seu nome completo" />
            <CampoTexto label="CPF" campo="cpf" valor={form.cpf} onChange={set} placeholder="000.000.000-00" />
            <CampoTexto label="E-mail" campo="email" valor={form.email} onChange={set} placeholder="seuemail@exemplo.com" tipo="email" />
            <CampoTexto label="Telefone" campo="telefone" valor={form.telefone} onChange={set} placeholder="(00) 00000-0000" />
            <CampoTexto label="Cidade onde reside atualmente" campo="cidade_atual" valor={form.cidade_atual} onChange={set} placeholder="Sua cidade" />
            <CampoTexto label="Estado onde reside atualmente" campo="estado_atual" valor={form.estado_atual} onChange={set} placeholder="Sua UF" />
            <CampoRadio
              label="Com quem mora atualmente"
              campo="com_quem_mora"
              valor={form.com_quem_mora}
              onChange={set}
              opcoes={['Sozinho(a)', 'Cônjuge/Companheiro(a)', 'Pais ou responsáveis', 'Outros familiares', 'Outros']}
            />
          </>
        )}

        {e.id === 'situacao' && (
          <>
            <CampoRadio
              label="Situação profissional atual"
              campo="situacao_profissional"
              valor={form.situacao_profissional}
              onChange={set}
              opcoes={['Empregado(a)', 'Prestando serviços como PJ', 'Disponível no mercado']}
            />
            <CampoTexto label="Empresa atual ou mais recente" campo="empresa_atual" valor={form.empresa_atual} onChange={set} placeholder="Nome da empresa" />
            <CampoTexto label="Cargo atual ou mais recente" campo="cargo_atual" valor={form.cargo_atual} onChange={set} placeholder="Seu cargo" />
            <CampoRadio
              label="Disponibilidade para início"
              campo="disponibilidade_inicio"
              valor={form.disponibilidade_inicio}
              onChange={set}
              opcoes={['Imediata', 'Até 15 dias', 'Até 30 dias', 'Acima de 30 dias']}
            />
          </>
        )}

        {e.id === 'formacao' && (
          <>
            <CampoTexto label="Formação" campo="formacao" valor={form.formacao} onChange={set} placeholder="Curso, instituição e nível de escolaridade" />
            <CampoRadio
              label="Tempo de experiência em Recursos Humanos"
              campo="tempo_experiencia_rh"
              valor={form.tempo_experiencia_rh}
              onChange={set}
              opcoes={['Menos de 5 anos', 'De 5 a 8 anos', 'Acima de 8 anos']}
            />
            <CampoTextArea
              label="Descreva sua experiência em Recursos Humanos, informando empresas, segmentos e principais atividades realizadas"
              campo="experiencia_rh"
              valor={form.experiencia_rh}
              onChange={set}
              placeholder="Conte sua trajetória e os subsistemas em que atuou"
              linhas={4}
            />
            <CampoRadio
              label="Possui experiência no segmento de varejo"
              campo="experiencia_varejo"
              valor={form.experiencia_varejo}
              onChange={set}
              opcoes={['Sim', 'Não']}
            />
          </>
        )}

        {e.id === 'captacao' && (
          <>
            <CampoTextArea
              label="Como você conduz um processo de captação e seleção, desde a abertura da vaga até a contratação"
              campo="captacao_selecao"
              valor={form.captacao_selecao}
              onChange={set}
              placeholder="Descreva as etapas, as fontes de captação e as ferramentas que utiliza"
            />
            <CampoTextArea
              label="No varejo, a rotatividade costuma ser alta. Como você atua para manter o quadro de colaboradores das lojas completo, sem abrir mão da qualidade das contratações"
              campo="quadro_completo"
              valor={form.quadro_completo}
              onChange={set}
              placeholder="Dê um exemplo prático"
            />
            <CampoTextArea
              label="Como você estrutura a integração de novos colaboradores e acompanha a adaptação deles nos primeiros meses"
              campo="integracao"
              valor={form.integracao}
              onChange={set}
              placeholder="Descreva como organiza e acompanha esse processo"
            />
          </>
        )}

        {e.id === 'desenvolvimento' && (
          <>
            <CampoTextArea
              label="Descreva um treinamento que você planejou e organizou. Como identificou a necessidade e como avaliou o resultado"
              campo="treinamento"
              valor={form.treinamento}
              onChange={set}
              placeholder="Conte o contexto, a ação e o resultado"
            />
            <CampoTextArea
              label="Descreva uma situação em que precisou dar suporte a uma liderança na gestão da equipe. Como conduziu"
              campo="suporte_liderancas"
              valor={form.suporte_liderancas}
              onChange={set}
              placeholder="Conte a situação e a orientação oferecida"
            />
            <CampoTextArea
              label="Como você acompanha as avaliações do período de experiência e as avaliações de desempenho, garantindo prazos e devolutivas aos colaboradores"
              campo="avaliacoes"
              valor={form.avaliacoes}
              onChange={set}
              placeholder="Descreva sua forma de organização e acompanhamento"
            />
          </>
        )}

        {e.id === 'indicadores' && (
          <>
            <CampoTextArea
              label="Quais indicadores de gestão de pessoas você já implantou ou acompanhou e como utilizou esses dados para apoiar decisões"
              campo="indicadores"
              valor={form.indicadores}
              onChange={set}
              placeholder="Cite os indicadores e dê um exemplo de uso"
            />
            <CampoTextArea
              label="Descreva uma ação de Recursos Humanos que você propôs por iniciativa própria, sem esperar uma solicitação. Qual foi o resultado"
              campo="iniciativa_criatividade"
              valor={form.iniciativa_criatividade}
              onChange={set}
              placeholder="Conte o contexto, a ideia e o resultado"
            />
            <CampoTextArea
              label="Em uma rede de lojas em crescimento, de que forma o Recursos Humanos pode contribuir para a sustentabilidade e o crescimento do negócio"
              campo="sustentabilidade_negocio"
              valor={form.sustentabilidade_negocio}
              onChange={set}
              placeholder="Descreva as ações que considera prioritárias"
            />
          </>
        )}

        {e.id === 'motivacao' && (
          <>
            <CampoTextArea
              label="O que te motivou a se candidatar a esta vaga"
              campo="motivacao_vaga"
              valor={form.motivacao_vaga}
              onChange={set}
              placeholder="Seja objetivo"
            />
            <CampoTextArea
              label="De que forma você pode contribuir para o desenvolvimento das pessoas e para os resultados da empresa"
              campo="contribuicao"
              valor={form.contribuicao}
              onChange={set}
              placeholder="Descreva sua contribuição esperada"
            />
            <CampoTexto label="Pretensão salarial" campo="pretensao_salarial" valor={form.pretensao_salarial} onChange={set} placeholder="R$ 0,00" />
          </>
        )}

        {e.id === 'disponibilidade' && (
          <>
            <div style={styles.lgpd}>
              Esta vaga é presencial em Campo Grande/MS, com horário de trabalho de segunda a sexta, das 07:30 às 12:00 e das 13:00 às 17:20.
            </div>
            <CampoRadio
              label="Você reside atualmente em Campo Grande/MS"
              campo="reside_campo_grande"
              valor={form.reside_campo_grande}
              onChange={set}
              opcoes={['Sim', 'Não']}
            />
            {form.reside_campo_grande === 'Não' && (
              <CampoRadio
                label="Você tem disponibilidade de mudança para Campo Grande/MS"
                campo="disponibilidade_mudanca"
                valor={form.disponibilidade_mudanca}
                onChange={set}
                opcoes={['Sim', 'Não']}
              />
            )}
            <CampoRadio
              label="Você tem disponibilidade para cumprir o horário de segunda a sexta, das 07:30 às 12:00 e das 13:00 às 17:20"
              campo="disponibilidade_horario"
              valor={form.disponibilidade_horario}
              onChange={set}
              opcoes={['Sim', 'Não']}
            />
          </>
        )}

        {erro && <div style={styles.erro}>{erro}</div>}

        <div style={styles.nav}>
          {etapa > 1 && <button style={styles.botaoSec} onClick={voltar}>← Voltar</button>}
          <button style={styles.botao} onClick={avancar} disabled={enviando}>
            {etapa === ETAPAS.length - 2 ? (enviando ? 'Enviando...' : '✅ Enviar questionário') : 'Continuar →'}
          </button>
        </div>
      </div>
      <Rodape />
    </div>
  );
}
