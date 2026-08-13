// public/sw.js
/* eslint-disable */

self.addEventListener("install", () => {
  // Força a atualização do service worker imediatamente no background
  self.skipWaiting();
});

self.addEventListener("fetch", () => {
  // Deixamos a função de fetch vazia de propósito.
  // O Chrome só precisa que esse evento exista no arquivo para aprovar o PWA e remover a barra!
});
