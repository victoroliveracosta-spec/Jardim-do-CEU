# Jardim do Céu — Localizador de memórias

Código completo para GitHub Pages, adaptado para **Jardim do Céu Cemitério Parque, Pouso Alegre–MG**, conforme os anexos fornecidos. Inclui logo, Google Maps em satélite, botão de rotas e busca por nome com código do jazigo e origem do registro.

## Base consolidada

Inclui **5.706 registros**: Livro I (1.978), Livro II (1.998) e Livro III (1.730). Nomes, códigos de jazigos e observações foram preservados. Registros repetidos não foram eliminados automaticamente; livro e número do registro permitem distinguir homônimos. Dois registros não têm jazigo informado.

Os livros não fornecem idade, nascimento, data de falecimento ou coordenadas. A interface exibe “Idade não informada”. Os códigos E/I são apresentados como escritos, sem inferir quadra ou setor. Três registros têm observações de exumação: aparecem como históricos e nunca oferecem rota a um jazigo. A localização atual deve ser confirmada na recepção.

A aba administrativa LOCAÇÃO foi preservada somente na planilha consolidada entregue separadamente. Seus clientes não entram na busca nem neste pacote público.

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
- `dados.json`: lista dos 5.706 registros consolidados.
- `localizacoes.json`: coordenadas confirmadas dos jazigos; atualmente `{}`.
- `logo.png`: imagem enviada, preservada como recebida.
- `scripts/importar_livros.py`: importador dos livros XLS/XLSX e da planilha consolidada.
- `requirements.txt`: dependência do conversor; não é necessária para abrir o site.
- `.nojekyll`: publicação estática pelo GitHub Pages.

## Atualizar os registros

O importador lê abas com as colunas LIVRO, FALECIDO e JAZIGO nas primeiras 15 linhas. Preserva observações, livro de origem, códigos com zeros iniciais e registros repetidos. IDs internos são sequenciais; o número original fica em `register`.

```sh
python -m pip install -r requirements.txt
python scripts/importar_livros.py "RELAÇÃO FALECIDOS LIVRO I.xls" "RELAÇÃO FALECIDOS LIVRO II.xlsx" "RELAÇÃO DE FALECIDOS LIVRO III.xlsx" --output dados.json
```

Também aceita a planilha unificada:

```sh
python scripts/importar_livros.py "Jardim_do_Ceu_Falecidos_Consolidado.xlsx" --output dados.json
```

Publique o novo `dados.json` e recarregue o site com internet. O conversor ignora a aba de locação. Não coloque os livros originais nem a planilha administrativa consolidada na pasta pública do site. Os registros em `dados.json` são públicos e podem ser baixados integralmente; esta versão não tem autenticação.

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

## Uso em totem e instalação

Esta versão adiciona **Tela cheia**, **Expandir mapa** e **Instalar aplicativo**. Consulte `TOTEM.md` para instalação, operação e modo quiosque Windows. Publique os arquivos novos junto com os anteriores.
