module.exports = {
  modelBaseDirectory: 'src/models',
  models: '**/*.ts',
  data: 'fixtures',
  db: process.env.MONGO_URL ?? 'mongodb://localhost/admin',
};
