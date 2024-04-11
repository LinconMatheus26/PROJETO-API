// Defina o nome do cache
var cacheName = 'PROJETO-OTIMIZADO+-v1.0';

// Evento de instalação do Service Worker
self.addEventListener('install', event => {
  // Pula imediatamente para o novo Service Worker
  self.skipWaiting();
  
  // Aguarda até que o cache seja aberto e todos os recursos sejam adicionados ao cache
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll([
        './index.html',
        './styles.css',
        './script.js' ,
        './imagens/backgroundsite.jpg',
        './imagens/assets/favicon.png',
        './imagens/assets/logotopsaude.jpg',
        './imagens/assets/icon_120.png',
        './imagens/assets/icon_114.png',
        './imagens/assets/icon_180.png',
        './imagens/assets/icon_192.png',
        './imagens/assets/icon_256.png',
        './imagens/assets/icon_512.png',
      ]))
  );
});

// Evento de ativação do Service Worker
self.addEventListener('activate', event => {
  // Limpa caches antigos
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Evento de busca (fetch) do Service Worker
self.addEventListener('fetch', event => {
  // Responde à solicitação usando o cache, se disponível
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna a resposta do cache, se disponível
        if (response) {
          return response;
        }
        // Se o recurso não estiver em cache, busca na rede
        return fetch(event.request);
      })
  );
});

// Ouvinte de mensagem para pular a etapa de espera
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
