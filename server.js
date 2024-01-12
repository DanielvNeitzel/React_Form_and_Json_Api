// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

const app = express();
const PORT = process.env.PORT || 3001; // Porta padrão do servidor.

// Configuração para executar servidor evitando erros de CORS.
app.use(cors());
app.use(bodyParser.json());

// API de gravação dos dados na pasta física.
app.post('/api/cadastro', (req, res) => {
  const cadastroData = req.body;
  const fileName = `${cadastroData.email.replace(/\s+/g, '_')}.json`;
  const filePath = path.join(__dirname, 'cadastro', fileName);

  // Verifica se o arquivo já existe
  if (fs.existsSync(filePath)) {
    console.log('Cadastro já existe para esse e-mail.');
    return res.status(409).json({ error: 'Cadastro já existe para esse e-mail.' });
  }

  fs.writeFileSync(filePath, JSON.stringify(cadastroData, null, 2));

  // Retorno dos dados no console para confirmação de salvamento dentro do JSON.
  console.log('Cadastro salvo:', cadastroData);
  console.log(`Arquivo JSON salvo em: ${filePath}`);
  res.status(200).json({ message: 'Cadastro salvo com sucesso! Verifique sua pasta.' });
});

// Retorna se o server está rodando e em qual porta.
app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
