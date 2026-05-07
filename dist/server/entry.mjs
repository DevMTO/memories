import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_s5yIAHgX.mjs';
import { manifest } from './manifest_DTyK_SN9.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/admin/tours.astro.mjs');
const _page3 = () => import('./pages/api/destinations.astro.mjs');
const _page4 = () => import('./pages/api/tours.astro.mjs');
const _page5 = () => import('./pages/blogs.astro.mjs');
const _page6 = () => import('./pages/destinations/_slug_.astro.mjs');
const _page7 = () => import('./pages/flights.astro.mjs');
const _page8 = () => import('./pages/login.astro.mjs');
const _page9 = () => import('./pages/packages/_id_.astro.mjs');
const _page10 = () => import('./pages/packages.astro.mjs');
const _page11 = () => import('./pages/tours/_id_.astro.mjs');
const _page12 = () => import('./pages/tours.astro.mjs');
const _page13 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/admin/tours.astro", _page2],
    ["src/pages/api/destinations.ts", _page3],
    ["src/pages/api/tours.ts", _page4],
    ["src/pages/blogs.astro", _page5],
    ["src/pages/destinations/[slug].astro", _page6],
    ["src/pages/flights.astro", _page7],
    ["src/pages/login.astro", _page8],
    ["src/pages/packages/[id].astro", _page9],
    ["src/pages/packages.astro", _page10],
    ["src/pages/tours/[id].astro", _page11],
    ["src/pages/tours/index.astro", _page12],
    ["src/pages/index.astro", _page13]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///C:/Users/ebell/Documents/memories/dist/client/",
    "server": "file:///C:/Users/ebell/Documents/memories/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
{
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
