import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const firebaseConfig = {
    apiKey: "AIzaSyCCJvYJXNoK7UInqcfSHZURUXHD4uyVx_s",
    authDomain: "angtodo-3da1e.firebaseapp.com",
    projectId: "angtodo-3da1e",
    storageBucket: "angtodo-3da1e.appspot.com",
    messagingSenderId: "195589931087",
    appId: "1:195589931087:web:f2adf0b4a5c30587936a3a",
    measurementId: "G-FJY436RDSH"
  };

  const server = express();
  const distFolder = join(process.cwd(), 'dist/ang-todo/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  server.get('/api/**', (req, res) => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);


    res.status(404).send(JSON.stringify(auth));
  });

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
