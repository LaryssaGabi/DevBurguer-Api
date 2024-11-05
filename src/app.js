import express from 'express';
import routes from './routes.js';
import cors from 'cors';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import './database/index.js';

const corsOptions = {
    origin: 'https://dev-burguer-web.vercel.app',
    credential: true,
}

// Obter o __dirname no contexto de ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

class App {
    constructor() {
        this.app = express();

        this.app.use(cors(corsOptions));
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use("/product-file", express.static(resolve(__dirname, '..', 'uploads')));
        this.app.use("/category-file", express.static(resolve(__dirname, '..', 'uploads')));
    }

    routes() {
        this.app.use(routes);
    }
}

export default new App().app;
