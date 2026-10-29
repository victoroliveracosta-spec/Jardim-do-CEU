/* Tela cheia e instalação: nenhuma permissão é solicitada ao carregar a página. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const map = byId('viewport');
  const full = byId('fullscreenSite');
  const expand = byId('expandMap');
  const restore = byId('restoreMap');
  const install = byId('installApp');
  const message = byId('totemMessage');
  let pendingInstall = null;
  let messageTimer;

  function tell(text) {
    clearTimeout(messageTimer);
    message.textContent = text;
    message.hidden = false;
    messageTimer = setTimeout(() => { message.hidden = true; }, 7000);
  }
  function syncFullscreen() {
    const mapOpen = document.fullscreenElement === map || map.classList.contains('map-expanded');
    restore.hidden = !mapOpen;
    expand.setAttribute('aria-expanded', String(mapOpen));
    full.textContent = document.fullscreenElement ? 'Sair da tela cheia' : 'Tela cheia';
    full.setAttribute('aria-pressed', String(Boolean(document.fullscreenElement)));
  }
  full.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else tell('Este navegador não permite tela cheia por botão. No computador, use F11 ou o modo quiosque.');
    } catch { tell('Tela cheia não disponível neste ambiente. No computador, use F11 ou o modo quiosque.'); }
    syncFullscreen();
  });
  expand.addEventListener('click', async () => {
    try {
      if (map.requestFullscreen) await map.requestFullscreen();
      else throw new Error('Fullscreen indisponível');
    } catch {
      map.classList.add('map-expanded');
      document.body.classList.add('map-is-expanded');
    }
    syncFullscreen();
    restore.focus();
  });
  async function closeMap() {
    if (document.fullscreenElement === map) {
      try { await document.exitFullscreen(); } catch { tell('Use Esc para sair da tela cheia.'); }
    }
    map.classList.remove('map-expanded');
    document.body.classList.remove('map-is-expanded');
    syncFullscreen();
    expand.focus();
  }
  restore.addEventListener('click', closeMap);
  document.addEventListener('fullscreenchange', syncFullscreen);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && map.classList.contains('map-expanded')) closeMap();
  });

  function refreshInstallState() {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    install.hidden = standalone;
  }
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    pendingInstall = event;
    refreshInstallState();
  });
  window.addEventListener('appinstalled', () => {
    pendingInstall = null;
    install.hidden = true;
    tell('Aplicativo instalado. Abra pelo atalho criado no dispositivo.');
  });
  install.addEventListener('click', async () => {
    if (!pendingInstall) { byId('installDialog').showModal(); return; }
    const prompt = pendingInstall;
    pendingInstall = null;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome !== 'accepted') tell('Instalação cancelada. Você pode continuar usando o site.');
    } catch { byId('installDialog').showModal(); }
  });
  byId('closeInstall').addEventListener('click', () => byId('installDialog').close());

  function networkStatus() {
    byId('networkStatus').hidden = navigator.onLine;
  }
  window.addEventListener('online', networkStatus);
  window.addEventListener('offline', networkStatus);
  networkStatus();
  refreshInstallState();
  syncFullscreen();
  if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {
        // O site e os mapas continuam funcionando sem o cache local.
        tell('O cache local não pôde ser ativado. Use o site com conexão à internet.');
      });
    });
  }
})();
