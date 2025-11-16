import axios from 'axios';
import FonteDados from './fonte-dados';
import { Campanha } from './entidades/campanha.entidade';
import { Lista } from './entidades/lista.entidade';
import { Operador } from './entidades/operador.entidade';
import { Situacao } from './entidades/situacao.entidade';
import { Categoria } from './entidades/categoria.entidade';
import { Contato } from './entidades/contato.entidade';
import { Chamada } from './entidades/chamada.entidade';

interface ChamadaJson {
  chamada_id: number;
  chamada_datahora: string;
  campanha: string;
  lista: string;
  operador: string;
  situacao: string;
  categoria: string;
  nome: string;
  telefone?: unknown;
}


function parseDataHora(dataHora: string): Date {
  const [data, hora] = dataHora.split(' ');
  const [dia, mes, ano] = data.split('/');
  return new Date(`${ano}-${mes}-${dia}T${hora}:00`);
}

function processarTelefone(telefone: string | number | unknown): string | null {
  // Aceita números ou strings (alguns registros vêm como number no JSON)
  if (telefone === null || telefone === undefined) return null;

  let t: string;
  if (typeof telefone === 'number') {
    t = String(telefone);
  } else if (typeof telefone === 'string') {
    if (telefone.toLowerCase() === 'unknown') return null;
    t = telefone;
  } else {
    return null;
  }

  // Remove todos os caracteres não numéricos
  let telefoneNormalizado = t.replace(/\D/g, '');

  if (telefoneNormalizado.length === 0) return null;
  return telefoneNormalizado;
}

async function main() {
  await FonteDados.initialize();
  console.log('Conectado ao banco');

  const url = 'https://www.ibridge.com.br/dados-teste-tecnico.json';
  const resposta = await axios.get<ChamadaJson[]>(url);
  const chamadasJson = resposta.data;

  console.log(`${chamadasJson.length} chamadas recebidas`);

  const campanhaRepo = FonteDados.getRepository(Campanha);
  const listaRepo = FonteDados.getRepository(Lista);
  const operadorRepo = FonteDados.getRepository(Operador);
  const situacaoRepo = FonteDados.getRepository(Situacao);
  const categoriaRepo = FonteDados.getRepository(Categoria);
  const contatoRepo = FonteDados.getRepository(Contato);
  const chamadaRepo = FonteDados.getRepository(Chamada);

  for (const item of chamadasJson) {
    const dataConvertida = parseDataHora(item.chamada_datahora);

    
    const rawTelefone = (item as any).chamada_telefone ?? (item as any).contato_telefone ?? (item as any).telefone ?? null;
    const apenasDigitos = processarTelefone(rawTelefone);

    let telefoneParaSalvar: string | undefined;
    if (apenasDigitos && apenasDigitos.length >= 8) {
      telefoneParaSalvar = apenasDigitos;
    }

    const campanhaNome = (item as any).campanha ?? (item as any).campanha_nome ?? (item as any).campanhaNome ?? null;
    let campanha = await campanhaRepo.findOneBy({ nome: campanhaNome });
    if (!campanha) {
      campanha = campanhaRepo.create({ nome: campanhaNome });
      await campanhaRepo.save(campanha);
    }

    const listaNome = (item as any).lista ?? (item as any).lista_nome ?? (item as any).listaNome ?? null;
    let lista = await listaRepo.findOneBy({ nome: listaNome });
    if (!lista) {
      lista = listaRepo.create({ nome: listaNome, campanha });
      await listaRepo.save(lista);
    }

    const operadorNome = (item as any).operador ?? (item as any).chamada_operador_nome ?? (item as any).chamada_operador ?? null;
    let operador = await operadorRepo.findOneBy({ nome: operadorNome });
    if (!operador) {
      operador = operadorRepo.create({ nome: operadorNome });
      await operadorRepo.save(operador);
    }

    const situacaoNome = (item as any).situacao ?? (item as any).chamada_situacao_nome ?? (item as any).chamada_situacao ?? null;
    let situacao = await situacaoRepo.findOneBy({ nome: situacaoNome });
    if (!situacao) {
      situacao = situacaoRepo.create({ nome: situacaoNome });
      await situacaoRepo.save(situacao);
    }

    const categoriaNome = (item as any).categoria ?? (item as any).chamada_categoria_nome ?? (item as any).chamada_categoria ?? null;
    let categoria = await categoriaRepo.findOneBy({ nome: categoriaNome });
    if (!categoria) {
      categoria = categoriaRepo.create({ nome: categoriaNome });
      await categoriaRepo.save(categoria);
    }

    const contatoNome = (item as any).nome ?? (item as any).contato_nome ?? (item as any).contatoNome ?? null;
    let contato;
    if (telefoneParaSalvar !== undefined && telefoneParaSalvar !== null) {
      contato = await contatoRepo.findOneBy({ telefone: telefoneParaSalvar });
    } else if (contatoNome) {
      contato = await contatoRepo.findOneBy({ nome: contatoNome });
    }

    if (!contato) {
      const contatoData: any = { nome: contatoNome, telefone: telefoneParaSalvar ?? '' };
      contato = contatoRepo.create(contatoData);
      await contatoRepo.save(contato);
    }

    let chamada = await chamadaRepo.findOneBy({ id: item.chamada_id });
    if (chamada) {
      chamada.datahora = dataConvertida;
      chamada.campanha = campanha;
      chamada.lista = lista;
      chamada.operador = operador;
      chamada.situacao = situacao;
      chamada.categoria = categoria;
      chamada.contato = contato;
    } else {
      chamada = chamadaRepo.create({
        id: item.chamada_id,
        datahora: dataConvertida,
        campanha,
        lista,
        operador,
        situacao,
        categoria,
        contato,
      });
    }

    await chamadaRepo.save(chamada);
  }

  console.log('Importação concluída com sucesso');
  process.exit(0);
}

main().catch((err) => {
  console.error('Erro na importação:', err);
  process.exit(1);
});
