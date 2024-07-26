const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Função para carregar os computadores do arquivo
const loadComputersFromFile = () => {
    try {
        const data = fs.readFileSync('computers.txt', 'utf8');
        return data.trim().split('\n').map(line => {
            const [nome, ip, andar] = line.split(', ').map(item => item.split(': ')[1]);
            return { nome, ip, andar };
        }).filter(computer => computer.nome && computer.ip && computer.andar);
    } catch (err) {
        console.error('Erro ao ler o arquivo:', err);
        return [];
    }
};

// Função para salvar os computadores no arquivo
const saveComputersToFile = (computers) => {
    const data = computers.map(({ nome, ip, andar }) => `Nome: ${nome}, IP: ${ip}, Andar: ${andar}`).join('\n');
    fs.writeFileSync('computers.txt', data, 'utf8');
};

app.post('/add-computer', (req, res) => {
    const { nome, ip, andar } = req.body;

    const computers = loadComputersFromFile();

    const alreadyExists = computers.some(computer => computer.nome === nome && computer.ip === ip && computer.andar === andar);

    if (alreadyExists) {
        return res.status(400).send('Computador já existe.');
    }

    computers.push({ nome, ip, andar });
    saveComputersToFile(computers);

    res.send('Computador salvo com sucesso.');
});

app.get('/get-computers', (req, res) => {
    const computers = loadComputersFromFile();
    res.json(computers);
});

app.delete('/delete-computer/:nome/:ip/:andar', (req, res) => {
    const { nome, ip, andar } = req.params;

    let computers = loadComputersFromFile();
    const initialLength = computers.length;

    computers = computers.filter(computer => !(computer.nome === nome && computer.ip === ip && computer.andar === andar));

    if (computers.length === initialLength) {
        return res.status(404).send('Computador não encontrado.');
    }

    saveComputersToFile(computers);
    res.send('Computador excluído com sucesso.');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
