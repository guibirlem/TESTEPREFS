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

    fs.readFile('computers.txt', 'utf8', (err, fileData) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).send('Erro ao ler o arquivo.');
        }

        const computers = fileData.trim().split('\n').filter(line => line.trim() !== '');
        const alreadyExists = computers.some(line => {
            const [fileNome, fileIp, fileAndar] = line.split(', ').map(item => item.split(': ')[1]);
            return fileNome === nome && fileIp === ip && fileAndar === andar;
        });

        if (alreadyExists) {
            return res.status(400).send('Computador já existe.');
        }

        fs.appendFile('computers.txt', data, (err) => {
            if (err) {
                console.error('Erro ao salvar o computador no arquivo:', err);
                return res.status(500).send('Erro ao salvar o computador no arquivo.');
            } else {
                console.log('Computador salvo com sucesso.');
                return res.send('Computador salvo com sucesso.');
            }
        });
    });
});

app.get('/get-computers', (req, res) => {
    fs.readFile('computers.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).send('Erro ao ler o arquivo.');
        } else {
            const computers = data.trim().split('\n').map(line => {
                const [nome, ip, andar] = line.split(', ').map(item => item.split(': ')[1]);
                return { nome, ip, andar };
            });
            console.log('Computadores carregados:', computers);
            return res.json(computers);
        }
    });
});

app.post('/delete-computer', (req, res) => {
    const { index } = req.body;

    fs.readFile('computers.txt', 'utf8', (err, fileData) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).json({ error: 'Erro ao ler o arquivo.' });
        }

        const computers = fileData.trim().split('\n').map(line => {
            const [nome, ip, andar] = line.split(', ').map(item => item.split(': ')[1]);
            return { nome, ip, andar };
        });

        if (index < 0 || index >= computers.length) {
            return res.status(400).json({ error: 'Índice inválido.' });
        }

        computers.splice(index, 1);
        const newContent = computers.map(c => `Nome: ${c.nome}, IP: ${c.ip}, Andar: ${c.andar}`).join('\n');

        fs.writeFile('computers.txt', newContent, (err) => {
            if (err) {
                console.error('Erro ao atualizar o arquivo:', err);
                return res.status(500).json({ error: 'Erro ao atualizar o arquivo.' });
            }

            console.log('Computador excluído com sucesso.');
            return res.json({ message: 'Computador excluído com sucesso.' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
