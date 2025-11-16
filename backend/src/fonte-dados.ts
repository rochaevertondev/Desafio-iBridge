import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Campanha } from './entidades/campanha.entidade';
import { Lista } from './entidades/lista.entidade';
import { Operador } from './entidades/operador.entidade';
import { Situacao } from './entidades/situacao.entidade';
import { Categoria } from './entidades/categoria.entidade';
import { Contato } from './entidades/contato.entidade';
import { Chamada } from './entidades/chamada.entidade';

const FonteDados = new DataSource({
  type: (process.env.DB_TYPE) as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    Campanha,
    Lista,
    Operador,
    Situacao,
    Categoria,
    Contato,
    Chamada,
  ],
  migrations: ['src/migracoes/*.ts'],
  synchronize: false,
});

export default FonteDados;
