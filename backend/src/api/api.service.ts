import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ApiService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async resumoPorLista() {
    const sql = `
      SELECT
        camp.nome as campanha,
        lst.nome as lista,
        COUNT(ch.id) as chamadas,
        -- sem contato: falta contato_id ou contato sem telefone, ou categoria indicando 'sem contato'
        SUM(CASE WHEN (ch.contato_id IS NULL OR ct.telefone IS NULL OR ct.telefone = '' OR LOWER(IFNULL(cat.nome,'')) LIKE '%sem contato%' OR LOWER(IFNULL(cat.nome,'')) LIKE '%não atende%' OR LOWER(IFNULL(cat.nome,'')) LIKE '%linha muda%' OR LOWER(IFNULL(cat.nome,'')) LIKE '%caixa postal%' OR LOWER(IFNULL(cat.nome,'')) LIKE '%número inválido%') THEN 1 ELSE 0 END) as sem_contato,
        SUM(CASE WHEN (ch.contato_id IS NOT NULL AND ct.telefone IS NOT NULL AND ct.telefone <> '') THEN 1 ELSE 0 END) as contato,
        -- heurísticas para 'abordagem'
        SUM(CASE WHEN LOWER(IFNULL(cat.nome, '')) LIKE '%agend%' OR LOWER(IFNULL(cat.nome, '')) LIKE '%atend%' THEN 1 ELSE 0 END) as abordagens,
        -- heurísticas para 'fechamento' (aceite/venda/contratado)
        SUM(CASE WHEN LOWER(IFNULL(cat.nome, '')) LIKE '%aceit%' OR LOWER(IFNULL(cat.nome, '')) LIKE '%venda%' OR LOWER(IFNULL(cat.nome, '')) LIKE '%contrat%' THEN 1 ELSE 0 END) as fechamentos
      FROM chamada ch
      LEFT JOIN lista lst ON ch.lista_id = lst.id
      LEFT JOIN campanha camp ON lst.campanha_id = camp.id
      LEFT JOIN contato ct ON ch.contato_id = ct.id
      LEFT JOIN categoria cat ON ch.categoria_id = cat.id
      GROUP BY camp.nome, lst.nome
      ORDER BY camp.nome, lst.nome
    `;

    const rows = await this.dataSource.query(sql);
    return rows.map((r) => ({
      campanha: r.campanha,
      lista: r.lista,
      chamadas: Number(r.chamadas),
      sem_contato: Number(r.sem_contato),
      contato: Number(r.contato),
      abordagens: Number(r.abordagens),
      fechamentos: Number(r.fechamentos),
    }));
  }

  async topOperadores(limit = 10) {
    const sql = `
      SELECT op.nome as operador, COUNT(ch.id) as fechamentos
      FROM chamada ch
      LEFT JOIN operador op ON ch.operador_id = op.id
      LEFT JOIN categoria cat ON ch.categoria_id = cat.id
      -- use same heuristics as resumo for 'fechamentos' and guard against NULL names
      WHERE LOWER(IFNULL(cat.nome, '')) LIKE '%aceit%'
         OR LOWER(IFNULL(cat.nome, '')) LIKE '%venda%'
         OR LOWER(IFNULL(cat.nome, '')) LIKE '%contrat%'
         OR LOWER(IFNULL(cat.nome, '')) LIKE '%fech%'
      GROUP BY op.id, op.nome
      ORDER BY fechamentos DESC
      LIMIT ?
    `;
    const rows = await this.dataSource.query(sql, [limit]);
    return rows.map((r) => ({ operador: r.operador, fechamentos: Number(r.fechamentos) }));
  }

  async topListas(limit = 10) {
    const sql = `
      SELECT lst.nome as lista, COUNT(ch.id) as fechamentos
      FROM chamada ch
      LEFT JOIN lista lst ON ch.lista_id = lst.id
      LEFT JOIN categoria cat ON ch.categoria_id = cat.id
      -- use same heuristics as resumo for 'fechamentos' and guard against NULL names
      WHERE LOWER(IFNULL(cat.nome, '')) LIKE '%aceit%'
         OR LOWER(IFNULL(cat.nome, '')) LIKE '%venda%'
         OR LOWER(IFNULL(cat.nome, '')) LIKE '%contrat%'
         OR LOWER(IFNULL(cat.nome, '')) LIKE '%fech%'
      GROUP BY lst.id, lst.nome
      ORDER BY fechamentos DESC
      LIMIT ?
    `;
    const rows = await this.dataSource.query(sql, [limit]);
    return rows.map((r) => ({ lista: r.lista, fechamentos: Number(r.fechamentos) }));
  }

  async topCampanhas(limit = 10) {
    const sql = `
      SELECT camp.nome as campanha, COUNT(ch.id) as fechamentos
      FROM chamada ch
      LEFT JOIN campanha camp ON ch.campanha_id = camp.id
      LEFT JOIN categoria cat ON ch.categoria_id = cat.id
      -- use same heuristics as resumo for 'fechamentos' and guard against NULL names
      WHERE LOWER(IFNULL(cat.nome, '')) LIKE '%aceit%'
         OR LOWER(IFNULL(cat.nome, '')) LIKE '%venda%'
         OR LOWER(IFNULL(cat.nome, '')) LIKE '%contrat%'
         OR LOWER(IFNULL(cat.nome, '')) LIKE '%fech%'
      GROUP BY camp.id, camp.nome
      ORDER BY fechamentos DESC
      LIMIT ?
    `;
    const rows = await this.dataSource.query(sql, [limit]);
    return rows.map((r) => ({ campanha: r.campanha, fechamentos: Number(r.fechamentos) }));
  }
}
