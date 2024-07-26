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
    let computers = JSON.parse(localStorage.getItem('computers')) || [];
    computers.push(computer);
    localStorage.setItem('computers', JSON.stringify(computers));

    fetch('/add-computer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(computer)
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        loadComputers();
    })
    .catch(error => console.error('Erro:', error));

    document.getElementById('computer-form').reset();
    document.getElementById('form-container').classList.add('hidden');
}

function loadComputers() {
    const computersList = document.getElementById('computers-list');
    computersList.innerHTML = '';

    let computers = JSON.parse(localStorage.getItem('computers')) || [];
    computers.forEach((computer, index) => {
        const computerDiv = document.createElement('div');
        computerDiv.classList.add('computer');
        computerDiv.innerHTML = `
            <p><strong>Nome:</strong> ${computer.nome}</p>
            <p><strong>IP:</strong> ${computer.ip}</p>
            <p><strong>Andar:</strong> ${computer.andar}</p>
            <button onclick="deleteComputer(${index})">Excluir</button>
        `;
        computersList.appendChild(computerDiv);
    });
}

function deleteComputer(index) {
    let computers = JSON.parse(localStorage.getItem('computers')) || [];
    computers.splice(index, 1);
    localStorage.setItem('computers', JSON.stringify(computers));
    loadComputers();
}
