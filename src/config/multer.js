import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Obtenha o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..'); 

// Configuração do multer
const storage = multer.diskStorage({
  destination: resolve(__dirname, '..', '..', 'uploads'), // Atualizado para usar __dirname
  filename: (request, file, callback) => {
    callback(null, uuidv4() + extname(file.originalname));
  },
});

// Exportar uma instância do multer com a configuração
export default () => multer({ storage });
