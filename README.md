# Desafio Técnico

O desafio consiste em importar dados de um arquivo JSON, armazenar em um banco relacional e apresentar um painel web com resumo e rankings.

## Objetivo

Construir um sistema simples com:

- Backend: NestJS (TypeScript) + TypeORM + MySQL
- Frontend: React (Vite, TypeScript)
- Dashboard: Chart.js + chartjs-plugin-datalabels

## Dados

O dataset está disponível em:

https://www.ibridge.com.br/dados-teste-tecnico.json

### Exemplo de item do JSON

```json
{
  "operacao_id": 18,
  "operacao_nome": "OPERAÇÃO 18",
  "lista_id": 1627,
  "lista_nome": "LISTA 1627",
  "campanha_id": 77,
  "campanha_nome": "CAMPANHA 77",
  "contato_id": 7709912,
  "contato_nome": "CONTATO 7709912",
  "chamada_id": 10556306,
  "chamada_datahora": "05/08/2025 17:00",
  "chamada_telefone": 1197709912,
  "chamada_operador_id": 459,
  "chamada_operador_nome": "OPERADOR 459",
  "chamada_situacao_id": 1,
  "chamada_situacao_nome": "SEM CONTATO",
  "chamada_categoria_id": 404200,
  "chamada_categoria_nome": "SEM CONTATO - CAIXA POSTAL"
}
```

## Modelagem do Banco (sugestão)

```
campanha(id, nome)

lista(id, nome, campanha_id)

operador(id, nome)

situacao(id, nome)

Popular inicialmente com:

1 = Sem Contato

2 = Contato

3 = Abordagem

4 = Fechamento

categoria(id, nome)

contato(id, nome, telefone)

chamada(id, datahora, contato_id, lista_id, campanha_id, operador_id, situacao_id, categoria_id)
```

## Regras de Importação

Usar chamada_id como chave primária.

Se já existir, atualizar; senão, inserir.

Converter chamada_datahora de dd/mm/yyyy HH:mm → YYYY-MM-DD HH:mm:ss.

Normalizar telefone para conter apenas dígitos.

Criar registros de campanha, lista, operador, contato e categoria caso não existam.

## Scripts esperados
### Backend

npm run migrate → cria as tabelas

npm run import → baixa e grava os dados no banco

npm run start:dev → inicia a API

### Frontend

npm run dev → inicia a aplicação React

## Endpoints obrigatórios

GET /resumo → quadro resumo por lista

GET /top-operadores → top 10 fechamentos por operador

GET /top-listas → top 10 fechamentos por lista

GET /top-campanhas → top 10 fechamentos por campanha

## Dashboard esperado
1. Tabela Resumo por Lista
Campanha	Lista	Chamadas	Sem Contato	Contato	Abordagem	Fechamento
CAMPANHA 1	LISTA 101	250	90	80	50	30
CAMPANHA 2	LISTA 102	200	60	60	40	40
CAMPANHA 3	LISTA 103	180	50	60	30	30

2. Top 10 Fechamentos por Operador (gráfico horizontal)
3. Top 10 Fechamentos por Lista (gráfico horizontal)
4. Top 10 Fechamentos por Campanha (gráfico horizontal)

Os gráficos devem exibir os valores ao lado das barras.