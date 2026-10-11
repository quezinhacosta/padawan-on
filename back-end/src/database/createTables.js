const { initDb } = require('./index');

console.log('Criando tabelas no banco de dados...');
initDb();
console.log('Tabelas criadas/verificadas com sucesso!');
