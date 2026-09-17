// Service worker da demonstração: deixa o app abrir sem rede e instalar no celular.
// Estratégia: rede primeiro para navegação (nunca servir tela velha depois de um deploy),
// cache primeiro para os arquivos com hash no nome, que nunca mudam de conteúdo.

const VERSAO = 'medfinance-v1';
const SHELL = ['/', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSAO).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((chaves) => Promise.all(chaves.filter((c) => c !== VERSAO).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navegação: tenta a rede; sem rede, entrega o shell do cache.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((resposta) => {
          const copia = resposta.clone();
          caches.open(VERSAO).then((cache) => cache.put('/', copia));
          return resposta;
        })
        .catch(() => caches.match('/').then((r) => r ?? Response.error()))
    );
    return;
  }

  // Demais arquivos: cache primeiro, preenchendo conforme forem pedidos.
  event.respondWith(
    caches.match(request).then((emCache) => {
      if (emCache) return emCache;
      return fetch(request).then((resposta) => {
        if (resposta.ok && resposta.type === 'basic') {
          const copia = resposta.clone();
          caches.open(VERSAO).then((cache) => cache.put(request, copia));
        }
        return resposta;
      });
    })
  );
});
