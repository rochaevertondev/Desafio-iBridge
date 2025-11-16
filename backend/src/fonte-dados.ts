import { DataSource } from 'typeorm';
import { Campanha } from './entidades/campanha.entidade';
import { Lista } from './entidades/lista.entidade';
import { Operador } from './entidades/operador.entidade';
import { Situacao } from './entidades/situacao.entidade';
import { Categoria } from './entidades/categoria.entidade';
import { Contato } from './entidades/contato.entidade';
import { Chamada } from './entidades/chamada.entidade';

const FonteDados = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Nirv@n@1',
  database: 'ibridge_db',
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
