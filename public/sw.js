/**
 * 基础 Service Worker — 离线缓存
 * 缓存关键静态资源，确保弱网/离线时基础页面可用
 */

const CACHE_NAME = "iching-v1";
const STATIC_ASSETS = [
  "/",
  "/search",
  "/history",
  "/manifest.json",
];

// 安装：预缓存静态页面
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// 激活：清理旧缓存
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    })
  );
});

// 请求：缓存优先，API 请求走网络
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // API 请求：仅走网络
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // 静态资源：缓存优先
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
      );
    })
  );
});
