import { initMongoDB } from './db/initMongoDB.js';
import { startServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  await initMongoDB();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  startServer();
};

void bootstrap();


const PORT = 3000;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello world!',
  });
});

app.use('*', (req, res, next) => {
  res.status(404).json({
    message: 'Not found',
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/students', upload.single('avatar'), function (req, res, next) {
  // Обробка завантаженого файлу
});

app.post('/students', upload.array('photos', 10), function (req, res, next) {
  // Обробка завантажених файлів
});

app.post('/students', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 8 }
]), function (req, res, next) {
  // Обробка завантажених файлів
});
