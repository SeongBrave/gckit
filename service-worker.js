/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "1c1c71c9c356a86ee66ff921ff248533"
  },
  {
    "url": "about/index.html",
    "revision": "3730aba9716285939e43a687c7abc12c"
  },
  {
    "url": "assets/css/0.styles.782bbe82.css",
    "revision": "849f3f73734c7e9e60308b77aab16c31"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.82dbe597.js",
    "revision": "6305f0b31001498ccb0f8ed75c6cf74e"
  },
  {
    "url": "assets/js/11.022297eb.js",
    "revision": "c69b1f4b8af453da8794ef8741500f36"
  },
  {
    "url": "assets/js/12.41d70fdd.js",
    "revision": "d2fa32849ec6cce9f904296df02b88a9"
  },
  {
    "url": "assets/js/13.23dc5993.js",
    "revision": "eb77ebdb1679b0bd96c8ac1ee877addf"
  },
  {
    "url": "assets/js/14.b6a780c4.js",
    "revision": "373ebc3c5700467e2ff423b103002610"
  },
  {
    "url": "assets/js/2.4c7d351d.js",
    "revision": "d2a0f97226ed66891ce42ed1b2e1c751"
  },
  {
    "url": "assets/js/3.fb030b46.js",
    "revision": "f2c5b0a3e4c36e0fccf712b20d5fed68"
  },
  {
    "url": "assets/js/4.3369d02e.js",
    "revision": "31a39a5bf51266000389baf60a474223"
  },
  {
    "url": "assets/js/5.705a88f4.js",
    "revision": "44110730753371f960cbf66dcf7f7c49"
  },
  {
    "url": "assets/js/6.25ea6206.js",
    "revision": "5b026694b59e37cbc56d7953565b4d29"
  },
  {
    "url": "assets/js/7.50c22630.js",
    "revision": "f7137d12fcb5b8ee2e40e8c1c57bb2a7"
  },
  {
    "url": "assets/js/8.a3da28c3.js",
    "revision": "4e782720b24f80e339ba50debb30854f"
  },
  {
    "url": "assets/js/9.f5d7515f.js",
    "revision": "7fd49cbf114c5a85d1770685a932f42b"
  },
  {
    "url": "assets/js/app.9f22f953.js",
    "revision": "e67da19ab589ea585ead665959b4c088"
  },
  {
    "url": "config/index.html",
    "revision": "b73cd7b563094e0aeafa616a0e223556"
  },
  {
    "url": "favicon.png",
    "revision": "5a52df3789126801b84391079ba3498c"
  },
  {
    "url": "guide/advanced/cocoapods.html",
    "revision": "64b5142732e4f3ad0d82ed7faffff238"
  },
  {
    "url": "guide/advanced/gtype-config.html",
    "revision": "9ae8eb900fc4644d836df235a5685630"
  },
  {
    "url": "guide/advanced/lang-config.html",
    "revision": "36283efa18ff0d746546a1daae9d1239"
  },
  {
    "url": "guide/basic-config.html",
    "revision": "2285f206de1f3e02e2cd8ab5e44bcb91"
  },
  {
    "url": "guide/generate.html",
    "revision": "05f24d3205362ad27a79ab8710eb1e2d"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "503c23c15d7b0a8d419742c3c13cfbb9"
  },
  {
    "url": "guide/index.html",
    "revision": "7525e79c821f36f1cd54c432214ae18c"
  },
  {
    "url": "hero.png",
    "revision": "5a52df3789126801b84391079ba3498c"
  },
  {
    "url": "icons/gckit-process.png",
    "revision": "a6e84ecd475f9a81cad8f2418e922d83"
  },
  {
    "url": "icons/generate-001.png",
    "revision": "7ee75f6f676918b2a9e95f59c5a7f179"
  },
  {
    "url": "icons/gtype-config-001.gif",
    "revision": "c225b3c34add8d90015deb22ac225c12"
  },
  {
    "url": "icons/gtype-config-002.png",
    "revision": "252639bb946be68b29870b335fb2bb86"
  },
  {
    "url": "icons/guide-getting-started-001.png",
    "revision": "7f1f34a5dfbd29fbddc8b2ae43a7cbd0"
  },
  {
    "url": "icons/guide-getting-started-002.png",
    "revision": "17ae73a6b6c1551bfbafc5f92f7728d9"
  },
  {
    "url": "icons/lang-config-001.gif",
    "revision": "b9393b5008a71175cceee8c0bb100e83"
  },
  {
    "url": "icons/lang-config-002.png",
    "revision": "ce0f6110f4368ef9827bea3fd8858848"
  },
  {
    "url": "index.html",
    "revision": "db74576ee04b174e96a5f3f88c7180e5"
  },
  {
    "url": "template/index.html",
    "revision": "7fbd7fb4aa155d4ce761fcd845497c78"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
