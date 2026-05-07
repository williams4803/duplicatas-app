import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const apiBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

function App() {
  const [duplicatas, setDuplicatas] = useState([]);
  const [form, setForm] = useState({
    numero: '',
    valor: '',
    vencimento: '',
    status: 'Pendente',
    prioridade: 'Média',
    categoria: 'Geral',
    observacoes: '',
    responsavel: ''
  });
  const [ticker, setTicker] = useState('PETR4.SA');
  const [quote, setQuote] = useState(null);
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState(null);

  const fetchDuplicatas = useCallback(async () => {
    const response = await fetch(`${apiBase}/duplicatas`);
    const data = await response.json();
    setDuplicatas(data);
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${apiBase}/monitoramento/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await fetch(`${apiBase}/monitoramento/alerts`);
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
    }
  }, []);

  const fetchQuote = useCallback(async (symbol) => {
    try {
      const response = await fetch(`${apiBase}/b3/quote/${encodeURIComponent(symbol)}`);
      const data = await response.json();
      if (!response.ok) {
        setQuote({ error: data.message || 'Não foi possível buscar a cotação' });
        return;
      }
      setQuote(data);
    } catch (error) {
      setQuote({ error: 'Erro de conexão ao buscar a cotação' });
    }
  }, []);

  useEffect(() => {
    fetchDuplicatas();
    fetchStats();
    fetchAlerts();
  }, [fetchDuplicatas, fetchStats, fetchAlerts]);

  useEffect(() => {
    fetchQuote(ticker);
  }, [ticker, fetchQuote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${apiBase}/duplicatas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({
      numero: '',
      valor: '',
      vencimento: '',
      status: 'Pendente',
      prioridade: 'Média',
      categoria: 'Geral',
      observacoes: '',
      responsavel: ''
    });
    fetchDuplicatas();
    fetchStats();
    fetchAlerts();
  };

  const handleDelete = async (id) => {
    await fetch(`${apiBase}/duplicatas/${id}`, { method: 'DELETE' });
    fetchDuplicatas();
  };

  return (
    <div className="App">
      <h1>Gerenciamento de Duplicatas</h1>

      {/* Dashboard de Monitoramento */}
      {stats && (
        <section className="dashboard-section">
          <h2>📊 Dashboard</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total de Duplicatas</h3>
              <p className="stat-number">{stats.totalDuplicatas}</p>
            </div>
            <div className="stat-card">
              <h3>Pendentes</h3>
              <p className="stat-number pending">{stats.pendentes}</p>
            </div>
            <div className="stat-card">
              <h3>Pagas</h3>
              <p className="stat-number paid">{stats.pagas}</p>
            </div>
            <div className="stat-card">
              <h3>Vencidas</h3>
              <p className="stat-number overdue">{stats.vencidas}</p>
            </div>
            <div className="stat-card">
              <h3>Valor Total</h3>
              <p className="stat-number">R$ {(stats.valorTotal ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="stat-card">
              <h3>Valor Pendente</h3>
              <p className="stat-number">R$ {(stats.valorPendente ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </section>
      )}

      {/* Alertas */}
      {alerts && ((alerts.vencendo?.length > 0) || (alerts.vencidas?.length > 0)) && (
        <section className="alerts-section">
          <h2>🚨 Alertas</h2>
          {alerts.vencidas?.length > 0 && (
            <div className="alert-group">
              <h3>Duplicatas Vencidas</h3>
              <ul className="alert-list overdue">
                {alerts.vencidas.map(d => (
                  <li key={d._id}>
                    <strong>{d.numero}</strong> - R$ {d.valor} - Venceu em {new Date(d.vencimento).toLocaleDateString('pt-BR')}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {alerts.vencendo?.length > 0 && (
            <div className="alert-group">
              <h3>Vencendo nos Próximos 7 Dias</h3>
              <ul className="alert-list warning">
                {alerts.vencendo.map(d => (
                  <li key={d._id}>
                    <strong>{d.numero}</strong> - R$ {d.valor} - Vence em {new Date(d.vencimento).toLocaleDateString('pt-BR')}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Cotação B3 */}
      <section className="quote-section">
        <h2>Cotação B3</h2>
        <div className="quote-form">
          <input
            type="text"
            placeholder="Ticker Ex: PETR4.SA"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          />
          <button type="button" onClick={() => fetchQuote(ticker)}>
            Buscar Cotação
          </button>
        </div>
        {quote && (
          <div className="quote-result">
            {quote.error ? (
              <p>{quote.error}</p>
            ) : (
              <>
                <p><strong>{quote.longName || quote.shortName}</strong> ({quote.symbol})</p>
                <p>Preço atual: R$ {quote.regularMarketPrice}</p>
                <p>Variação: {quote.regularMarketChangePercent?.toFixed(2)}%</p>
                <p>Última atualização: {(() => { const t = quote.regularMarketTime; if (!t) return '---'; const d = typeof t === 'number' ? new Date(t * 1000) : new Date(t); return isNaN(d) ? '---' : d.toLocaleString('pt-BR'); })()}</p>
              </>
            )}
          </div>
        )}
      </section>

      {/* Formulário de Cadastro */}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Número da Duplicata"
            value={form.numero}
            onChange={(e) => setForm({ ...form, numero: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Valor"
            value={form.valor}
            onChange={(e) => setForm({ ...form, valor: e.target.value })}
            required
          />
          <input
            type="date"
            value={form.vencimento}
            onChange={(e) => setForm({ ...form, vencimento: e.target.value })}
            required
          />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="Pendente">Pendente</option>
            <option value="Pago">Pago</option>
            <option value="Vencido">Vencido</option>
            <option value="Cancelado">Cancelado</option>
          </select>
          <select value={form.prioridade} onChange={(e) => setForm({ ...form, prioridade: e.target.value })}>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
            <option value="Urgente">Urgente</option>
          </select>
          <input
            type="text"
            placeholder="Categoria"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          />
          <input
            type="text"
            placeholder="Responsável"
            value={form.responsavel}
            onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
          />
        </div>
        <textarea
          placeholder="Observações"
          value={form.observacoes}
          onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
          rows="3"
        />
        <button type="submit">Adicionar Duplicata</button>
      </form>

      {/* Lista de Duplicatas */}
      <div className="duplicatas-list">
        <h2>Lista de Duplicatas</h2>
        <ul>
          {duplicatas.map((d) => (
            <li key={d._id} className={`duplicata-item ${d.status.toLowerCase()}`}>
              <div className="duplicata-header">
                <strong>{d.numero}</strong> - R$ {d.valor} - {new Date(d.vencimento).toLocaleDateString('pt-BR')}
                <span className={`status-badge ${d.status.toLowerCase()}`}>{d.status}</span>
              </div>
              <div className="duplicata-details">
                <small>Prioridade: {d.prioridade} | Categoria: {d.categoria}</small>
                {d.responsavel && <small> | Responsável: {d.responsavel}</small>}
                {d.observacoes && <p><em>{d.observacoes}</em></p>}
              </div>
              <button onClick={() => handleDelete(d._id)}>Deletar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
