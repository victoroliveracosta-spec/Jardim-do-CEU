# Jardim do Céu — Localizador de memórias

Código completo para GitHub Pages, adaptado para **Jardim do Céu Cemitério Parque, Pouso Alegre–MG**, conforme os anexos fornecidos. Inclui logo, Google Maps em satélite, botão de rotas e interface de busca por nome, idade, falecimento, quadra, setor e jazigo.

## Situação da base

**A planilha do Jardim do Céu ainda não foi fornecida.** `dados.json` está vazio e o site mostra “Consulta de falecidos em preparação”. Não foram reaproveitados falecidos, datas ou localizações de outro cemitério, nem adicionados nomes fictícios. O mapa e a rota até o cemitério já funcionam. A busca é habilitada automaticamente quando `dados.json` contém registros válidos.

## Publicar no GitHub Pages

1. Extraia o ZIP.
2. Crie um repositório no GitHub e envie o conteúdo da pasta `jardim-do-ceu-github` para a raiz. O arquivo `index.html` precisa ficar na raiz.
3. Em **Settings → Pages → Build and deployment**, selecione **Deploy from a branch**.
4. Escolha **main**, **/(root)** e **Save**.
5. Aguarde a publicação e abra o endereço indicado em **Visit site**.

Envie os arquivos extraídos, não somente o ZIP. O site não requer build, Node ou banco de dados.

## Testar localmente

Na pasta do projeto, execute `python -m http.server 8000` (ou `py -m http.server 8000` no Windows) e abra `http://localhost:8000`. Abrir o HTML por duplo clique pode bloquear a leitura de JSON.

## Estrutura

- `index.html`: página e diálogos de ajuda.
- `style.css`: estilos responsivos e identidade visual.
- `app.js`: busca, ficha e Google Maps.
- `config.js`: endereço do cemitério e opções do mapa.
- `dados.json`: lista de falecidos; atualmente `[]`.
- `localizacoes.json`: coordenadas confirmadas dos jazigos; atualmente `{}`.
- `logo.png`: imagem enviada, preservada como recebida.
- `scripts/converter_planilha.py`: conversor de relatório XLS compatível.
- `requirements.txt`: dependência do conversor; não é necessária para abrir o site.
- `.nojekyll`: publicação estática pelo GitHub Pages.

## Inserir os registros

Cada item de `dados.json` deve ter os campos abaixo. Não coloque este modelo incompleto na base: preencha com dados reais e conferidos.

| Campo | Tipo | Conteúdo |
| --- | --- | --- |
| `id` | número | Identificador único |
| `name` | texto | Nome completo |
| `location` | texto | Localização no padrão `CEM: nome  .  QRD: quadra  .  SET: setor  .  JAZ: jazigo`; vazio se ausente |
| `age` | texto | Idade ao falecer; vazio se ausente |
| `calculated` | booleano | `true` se calculada pelas datas; caso contrário `false` |
| `death` | texto | Data de falecimento em DD/MM/AAAA; vazio se ausente |

O conversor funciona com relatório `.xls` cuja primeira aba tenha, na segunda linha, “Nome Completo” na coluna A, “Localização” na E, “Nascimento” na F, “Idade” na H e “Falecimento” na I. Se a planilha do Jardim do Céu tiver estrutura diferente, adapte o conversor antes de executar.

```sh
python -m pip install -r requirements.txt
python scripts/converter_planilha.py "Falecidos Jardim do Ceu.xls" --output dados.json
```

Não envie o relatório original ao repositório. O conversor gera somente os campos usados no site, sem CPF. Dados estáticos publicados podem ser baixados integralmente pelos visitantes; esta versão não tem autenticação. Confirme também se a coluna Localização representa o jazigo atual, especialmente após traslados.

## Google Maps

A consulta configurada é: **Jardim do Céu Cemitério Parque, Avenida Major Rubens Storino, 4350, Pouso Alegre, MG, Brasil**, baseada no mapa anexado.

O modo padrão incorpora o mapa por consulta de nome e endereço, sem chave. Para fixar o mapa do estabelecimento, no Google Maps use **Compartilhar → Incorporar um mapa**, copie somente o valor `src` do iframe e preencha `embedUrl` em `config.js`. Opcionalmente configure `googleMapsApiKey` para usar a Maps Embed API, habilitada no Google Cloud e restrita aos domínios do site. Nunca inclua credenciais de servidor.

Sem coordenadas de jazigo, a rota leva **ao cemitério**. O Google recebe somente o nome/endereço do estabelecimento ou coordenadas; a busca por falecidos acontece no navegador e não envia seus nomes ao Google.

## Pontos dos jazigos

Em `localizacoes.json`, use como chave o valor exato de `location` do registro. O valor deve ser um objeto com latitude real em `lat`, longitude real em `lng` (ambas numéricas) e `confirmed: true`. Não invente coordenadas. Ao selecionar um registro com ponto cadastrado, o mapa centraliza nele e oferece uma rota a pé.

O Google pode não reconhecer os caminhos internos ou acessíveis do cemitério. Conferir um ponto não valida automaticamente o trajeto sugerido. Para orientação interna precisa, é necessário levantar os jazigos e os caminhos com a equipe. Esta versão não faz rastreamento GPS em tempo real.

## Referências

- GitHub Pages: https://docs.github.com/pt/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Google Maps incorporado: https://support.google.com/maps/answer/7101463
- Maps Embed API: https://developers.google.com/maps/documentation/embed/embedding-map

Este pacote é independente e não foi enviado automaticamente a nenhuma conta GitHub.
