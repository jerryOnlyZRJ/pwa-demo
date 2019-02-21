/**
 * @description ServiceWoker.js
 * **特别注意**：sw.js不能被缓存
 * 安装和激活生命周期只有初次执行 sw.js 才会触发
 */
// 定义本次sw.js，便于后期更新
const cacheName = "my-test-cache-v1";
// 自定义待缓存内容
const filesToCache = [
    "/js/index.js",
    "/css/index.css",
    "/images/kebi.jpg",
    "/index.html",
    "/"
];
// self 是表示 ServiceWork 作用域 也是全局变量
// 初次进入service worker安装阶段
self.addEventListener("install", function (event) {
    //缓存对象
    console.log("安装阶段");
    event.waitUntil(updateStaticCache());
});
//caches 缓存对象
function updateStaticCache() {
    return caches.open(cacheName)
        .then(function (cache) {
            //原子操作 如果中间有某一个文件挂了 全部缓存失败
            /**
             * @description 将所有文件添加进缓存
             * @param {Array<String>} filesToCache 待缓存文件路径数组
             */
            return cache.addAll(filesToCache);
        })
        //再页面更新的过程中 新的serviceWorker马上生效
        .then(() => self.skipWaiting());
}

// 更新缓存
self.addEventListener("activate", function (event) {
    console.log("激活阶段");
    //移除过期的对象 保证新的更新进入
    event.waitUntil(caches.keys().then(function (keysList) {
        return Promise.all(keysList.map(function (key) {
            if (key !== cacheName) {
                console.log("Removing old cache", key);
                return caches.delete(key);
            }
        }));
    }));
});

// 拦截所有请求
self.addEventListener("fetch", function (event) {
    console.log("经过Service Worker拦截的数据：", event.request);
    //event.respondWith(new Response("Hello World"));
    event.respondWith(
        // 匹配缓存，能够匹配则响应缓存，否则重新拉取
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    )
});