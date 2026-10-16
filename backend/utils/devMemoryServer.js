const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

(async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri('coursedesk');
  console.log('In-memory MongoDB started');
  console.log('MONGO_URI=' + uri);

  const envPath = path.join(__dirname, '..', '.env');
  let env = '';
  if (fs.existsSync(envPath)) {
    env = fs.readFileSync(envPath, 'utf8');
    if (env.includes('MONGO_URI=')) {
      env = env.replace(/MONGO_URI=.*/g, `MONGO_URI=${uri}`);
    } else {
      env += `\nMONGO_URI=${uri}\n`;
    }
  } else {
    env = `PORT=5000\nMONGO_URI=${uri}\nJWT_SECRET=coursedesk_jwt_secret_batch3_final_2026\nCLIENT_URL=http://localhost:5173\nNODE_ENV=development\n`;
  }
  fs.writeFileSync(envPath, env);
  console.log('Updated backend/.env');
  console.log('Keep this process running while you use the app.');

  setInterval(() => {}, 1 << 30);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
