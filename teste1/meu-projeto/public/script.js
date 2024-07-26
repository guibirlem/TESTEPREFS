document.addEventListener('DOMContentLoaded', (event) => {
    loadComputers();
    document.getElementById('computer-form').addEventListener('submit', saveComputer);
});

function showForm() {
    document.getElementById('form-container').classList.toggle('hidden');
}

function saveComputer(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const ip = document.getElementById('ip').value;
    const andar = document.getElementById('andar').value;

    const computer = { nome, ip, andar };

    fetch('/add-computer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(computer)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        return response.text();
    })
    .then(data => {
        console.log(data);
        loadComputers();
    })
    .catch(error => alert(error.message));

    document.getElementById('computer-form').reset();
    document.getElementById('form-container').classList.add('hidden');
}

function loadComputers() {
    const primeiroAndarList = document.getElementById('primeiro-andar');
    const segundoAndarList = document.getElementById('segundo-andar');
    const terceiroAndarList = document.getElementById('terceiro-andar');
    const quartoAndarList = document.getElementById('quarto-andar');

    primeiroAndarList.innerHTML = '';
    segundoAndarList.innerHTML = '';
    terceiroAndarList.innerHTML = '';
    quartoAndarList.innerHTML = '';

    fetch('/get-computers')
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text); });
            }
            return response.json();
        })
        .then(data => {
            data.forEach((computer, index) => {
                const computerDiv = document.createElement('div');
                computerDiv.classList.add('computer');
                computerDiv.innerHTML = `
                    <p><strong>Nome:</strong> ${computer.nome}</p>
                    <p><strong>IP:</strong> ${computer.ip}</p>
                    <p><strong>Andar:</strong> ${computer.andar}</p>
                    <button onclick="deleteComputer(${index})">Excluir</button>
                `;
                switch (computer.andar) {
                    case '1':
                        primeiroAndarList.appendChild(computerDiv);
                        break;
                    case '2':
                        segundoAndarList.appendChild(computerDiv);
                        break;
                    case '3':
                        terceiroAndarList.appendChild(computerDiv);
                        break;
                    case '4':
                        quartoAndarList.appendChild(computerDiv);
                        break;
                    default:
                        break;
                }
            });
        })
        .catch(error => console.error('Erro:', error));
}

function deleteComputer(index) {
    fetch('/delete-computer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        loadComputers();
    })
    .catch(error => alert(error.message));
}
