import React from 'react';

type ResumoRow = {
  campanha: string;
  lista: string;
  chamadas: number;
  sem_contato: number;
  contato: number;
  abordagens: number;
  fechamentos: number;
};

export default function ResumoTable({ rows }: { rows: ResumoRow[] }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Campanha</th>
            <th>Lista</th>
            <th>Chamadas</th>
            <th>Sem Contato</th>
            <th>Contato</th>
            <th>Abordagem</th>
            <th>Fechamento</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              <td>{r.campanha}</td>
              <td>{r.lista}</td>
              <td>{r.chamadas}</td>
              <td>{r.sem_contato}</td>
              <td>{r.contato}</td>
              <td>{r.abordagens}</td>
              <td>{r.fechamentos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
