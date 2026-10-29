# Usar o localizador no totem

## O que esta versão oferece

- **Tela cheia:** ocupa a tela com a página inteira. Toque novamente no botão para sair ou pressione Esc.
- **Expandir mapa:** amplia somente o Google Maps. O botão **Voltar à consulta** permanece acima do mapa. Em navegadores sem suporte à API de tela cheia, o mapa ocupa a janela do navegador.
- **Instalar aplicativo:** instala o site como PWA quando suportado, com atalho próprio e janela sem barra de endereço. Não é um instalador EXE ou APK.
- Controles maiores para toque. O teclado de digitação é o teclado do sistema operacional; habilite o teclado virtual do totem caso ele não apareça ao tocar no campo.

## Publicação

Substitua os arquivos do repositório pelos arquivos extraídos deste ZIP. Mantenha `index.html`, os JSON e os novos `manifest.webmanifest`, `sw.js`, `totem.js`, `totem.css` e a pasta `icons` na raiz de publicação. Não envie somente o ZIP.

Para dois sites, use repositórios/endereço diferentes ou subpastas separadas. Cada aplicativo tem escopo e cache próprios; mantenha todos os arquivos de cada cemitério juntos. O manifesto usa caminhos relativos e funciona em subpastas do GitHub Pages.

## Instalação no Windows

1. Publique em HTTPS (por exemplo, GitHub Pages).
2. Abra o endereço no Microsoft Edge ou Google Chrome, fora do modo privado.
3. Toque em **Instalar aplicativo** e confirme na janela do navegador. Se o navegador ainda não oferecer o pedido, o botão abre orientações para usar seu menu de instalação.
4. Abra pelo novo atalho. Para ocupar a tela inteira, toque em **Tela cheia**.
5. Repita com o outro cemitério para ter os dois aplicativos instalados.

A instalação abre em janela própria; ela não equivale a bloquear o computador. Por segurança do navegador, o site não pode ativar tela cheia sozinho ao carregar: é preciso um toque ou iniciar o navegador em modo quiosque. A disponibilidade da instalação depende do navegador, políticas e sistema operacional.

## Totem Windows: iniciar diretamente em tela cheia

O Microsoft Edge oferece modo quiosque. Crie um atalho no Windows cujo destino tenha o formato abaixo, substituindo `https://SEU-ENDERECO/` pelo endereço publicado real:

```text
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --kiosk "https://SEU-ENDERECO/" --edge-kiosk-type=fullscreen --no-first-run
```

Se o Edge estiver em `C:\Program Files\Microsoft\Edge\Application\msedge.exe`, use esse caminho. Feche janelas anteriores do Edge se o atalho não abrir no modo esperado.

Para iniciar ao entrar no Windows, pressione **Win + R**, digite `shell:startup` e coloque o atalho nessa pasta. Isso inicia o navegador depois do login; não configura login automático nem bloqueio do sistema. Para encerrar esse modo de teste, use **Alt + F4**.

Para um totem público bloqueado em um único aplicativo, a equipe de TI deve configurar **Acesso atribuído / Quiosque** do Windows. O botão de tela cheia do site não substitui essa configuração. Os links de rotas e do Google podem abrir outra janela; avalie a navegação permitida no navegador do totem.

Documentação Microsoft: https://learn.microsoft.com/pt-br/deployedge/microsoft-edge-configure-kiosk-mode

## Android / iPad

- **Android, Chrome:** menu → Instalar aplicativo / Adicionar à tela inicial.
- **iPad, Safari:** Compartilhar → Adicionar à Tela de Início.

Para bloquear um tablet no aplicativo, use o recurso de quiosque/gerenciamento do sistema. A tela cheia por botão não tem o mesmo suporte em todos os navegadores; a expansão do mapa dentro da janela continua disponível.

## Internet e cache

Google Maps e rotas **precisam de internet**. Não há download de mapas offline.

Depois de um carregamento completo com internet e da ativação do service worker, a interface e os arquivos de consulta podem ser reutilizados do cache quando a rede falhar. O site sinaliza o estado offline detectado pelo navegador; essa detecção não garante que o Google esteja acessível. A busca offline usa a última base salva neste dispositivo, que pode estar desatualizada. O Jardim do Céu inclui os 5.706 registros dos livros I, II e III.

Cada acesso tenta primeiro baixar os arquivos atuais. Para atualizar, publique os novos arquivos e recarregue com internet. Se alterar a lista de arquivos do service worker, atualize também a versão de `CACHE` em `sw.js` (por exemplo, de v1 para v2). Limpar os dados do site remove o cache; não remove os dados hospedados.

A instalação deve ser feita por HTTPS ou localhost. Abrir o HTML por duplo clique não oferece instalação nem leitura confiável dos dados. O Google Maps dentro do iframe não é controlado pelo cache do aplicativo.

## Localização de jazigos

A ampliação não cria coordenadas dos jazigos. Sem um ponto real e confirmado em `localizacoes.json`, a rota leva somente ao cemitério. O Google pode não conhecer os caminhos internos; confirme o trajeto com a equipe.
