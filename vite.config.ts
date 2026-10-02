import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { OctoberHome, OctoberUltra } from './src/OctoberPages';
import { StaticHeader, StaticFooter } from './src/StaticShell';
import { publicSeoPages, schemaFor, SITE_ORIGIN } from './src/october-seo';

const escapeHtml = (s:string) => s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// Pre-render the two redesigned pages using the SAME React components/copy.
// No extra service, browser executable, API credentials, or dependency is needed.
export default defineConfig({
  plugins: [react(), {
    name: 'cellztech-public-prerender',
    apply: 'build',
    closeBundle() {
      const output=resolve('dist');
      const template=readFileSync(resolve(output,'index.html'),'utf8');
      for(const [route,data] of Object.entries(publicSeoPages)) {
        let html=template.replace(/<title>[\s\S]*?<\/title>/,`<title>${escapeHtml(data.title)}</title>`);
        const tags=[['name','description',data.description],['property','og:title',data.title],['property','og:description',data.description],['property','og:url',SITE_ORIGIN+route],['name','twitter:title',data.title],['name','twitter:description',data.description]];
        for(const [attribute,key,value] of tags) html=html.replace(new RegExp(`<meta ${attribute}="${key}" content="[^"]*"\\s*\\/?>`),`<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`);
        html=html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/,`<link rel="canonical" href="${SITE_ORIGIN+route}" />`);
        html=html.replace(/<script id="cellztech-schema" type="application\/ld\+json">[\s\S]*?<\/script>/,`<script id="cellztech-schema" type="application/ld+json">${JSON.stringify(schemaFor(route,'en')).replace(/</g,'\\u003c')}</script>`);
        if(route==='/' || route==='/ultra-mobile') {
          const page=createElement(route==='/'?OctoberHome:OctoberUltra,{lang:'en'});
          const body=renderToStaticMarkup(createElement(Fragment,null,createElement(StaticHeader,{path:route}),page,createElement(StaticFooter)));
          html=html.replace('<div id="root"></div>',`<div id="root">${body}</div>`);
        }
        const dir=route==='/'?output:resolve(output,route.slice(1));
        mkdirSync(dir,{recursive:true});writeFileSync(resolve(dir,'index.html'),html);
      }
      console.log('CellzTech: 2 public pages pre-rendered; 11 unique route metadata files written.');
    }
  }],
  server: { port:5173 }
});
