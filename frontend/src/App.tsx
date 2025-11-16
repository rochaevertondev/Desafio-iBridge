import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResumoTable from './components/ResumoTable';
import HorizontalBarChart from './components/HorizontalBarChart';

type ResumoRow = {
  campanha: string;
  lista: string;
  chamadas: number;
  sem_contato: number;
  contato: number;
  abordagens: number;
  fechamentos: number;
};

export default function App() {
  const [resumo, setResumo] = useState<ResumoRow[]>([]);
  const [topOperadores, setTopOperadores] = useState<{ operador: string; fechamentos: number }[]>([]);
  const [topListas, setTopListas] = useState<{ lista: string; fechamentos: number }[]>([]);
  const [topCampanhas, setTopCampanhas] = useState<{ campanha: string; fechamentos: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const base = (import.meta.env.VITE_API_BASE as string);

    Promise.all([
      axios.get<ResumoRow[]>(`${base}/resumo`),
      axios.get<{ operador: string; fechamentos: number }[]>(`${base}/top-operadores`),
      axios.get<{ lista: string; fechamentos: number }[]>(`${base}/top-listas`),
      axios.get<{ campanha: string; fechamentos: number }[]>(`${base}/top-campanhas`),
    ])
      .then(([rRes, rOp, rList, rCamp]) => {
        setResumo(rRes.data);
        setTopOperadores(rOp.data);
        setTopListas(rList.data);
        setTopCampanhas(rCamp.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Erro ao carregar dados do backend');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app">
      <header>
        <h1>iBridge Dashboard</h1>
      </header>

      {loading && <p>Carregando dados...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <main>
          <section className="table-section">
            <h2>Resumo por Lista</h2>
            <ResumoTable rows={resumo} />
          </section>

          <section className="charts">
            <div className="chart">
              <h3>Top 10 Fechamentos por Operador</h3>
              <HorizontalBarChart
                labels={topOperadores.map((r) => r.operador)}
                data={topOperadores.map((r) => r.fechamentos)}
              />
            </div>

            <div className="chart">
              <h3>Top 10 Fechamentos por Lista</h3>
              <HorizontalBarChart labels={topListas.map((r) => r.lista)} data={topListas.map((r) => r.fechamentos)} />
            </div>

            <div className="chart">
              <h3>Top 10 Fechamentos por Campanha</h3>
              <HorizontalBarChart
                labels={topCampanhas.map((r) => r.campanha)}
                data={topCampanhas.map((r) => r.fechamentos)}
              />
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
