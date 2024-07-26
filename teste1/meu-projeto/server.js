const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/add-computer', (req, res) => {
    const { nome, ip, andar } = req.body;
    const data = `Nome: ${nome}, IP: ${ip}, Andar: ${andar}\n`;
    
    fs.appendFile('computers.txt', data, (err) => {
        if (err) {
            console.error('Erro ao salvar o computador no arquivo:', err);
            res.status(500).send('Erro ao salvar o computador no arquivo.');
        } else {
            res.send('Computador salvo com sucesso.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
