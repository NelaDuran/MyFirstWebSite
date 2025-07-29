
let dataArray = [];
let op = 0;
let pos = null;
let filteredData = [];
let currentFilter = 'Todos';


document.addEventListener('DOMContentLoaded', function () {
    loadData();
    document.getElementById('estados').addEventListener('change', filtrarPorEstado);
    document.getElementById('search').addEventListener('input', buscar);
});


function loadData() {
    const storedData = localStorage.getItem('appointments');
    if (storedData) {
        dataArray = JSON.parse(storedData);
    }
    pintar();
}


function saveData() {
    localStorage.setItem('appointments', JSON.stringify(dataArray));
}


function guardar() {
    if (validaciones()) {
        let datos = {
            numero: dataArray.length > 0 ? dataArray[dataArray.length - 1].numero + 1 : 1,
            nombre: document.getElementById("nombre").value,
            nombred: document.getElementById("nombred").value,
            telefono: document.getElementById("telefono").value,
            fecha: document.getElementById("fecha").value,
            hora: document.getElementById("hora").value,
            tipo: document.getElementById("tipo").value,
            sintomas: document.getElementById("sintomas").value,
            estado: document.getElementById("estado").value
        };

        if (op === 0) {
            dataArray.push(datos);
        } else {
            dataArray[pos] = datos;
            op = 0;
        }

        saveData();
        pintar();
        limpiar();

        // Cierra el modal correctamente con Bootstrap 5
        const modalEl = document.getElementById('exampleModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        // Confirmación visual
        Swal.fire({
            title: 'Cita guardada',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    }
}



function eliminar(i) {
    // Mostrar el modal de confirmación
    const confirmDeleteModal = document.getElementById('confirmDeleteModal');
    confirmDeleteModal.classList.add('show');
    confirmDeleteModal.style.display = 'block';


    // Configurar el botón de confirmación para eliminar la cita
    document.getElementById('confirmDeleteButton').onclick = function () {
        dataArray.splice(i, 1);
        saveData();
        pintar();
        confirmDeleteModal.classList.remove('show');
        confirmDeleteModal.style.display = 'none';
    };
}

function closeModal() {
    document.getElementById('confirmDeleteModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    const closeButton = document.getElementById('close-button');
    if (closeButton) {
        closeButton.onclick = closeModal;
    }
});

function pintar() {
    const citasDiv = document.getElementById("citas");
    citasDiv.innerHTML = "";


    // Ordenar las citas por fecha y hora
    dataArray.sort((a, b) => {
        const fechaA = new Date(a.fecha + ' ' + a.hora);
        const fechaB = new Date(b.fecha + ' ' + b.hora);
        return fechaA - fechaB;
    });


    let dataToDisplay = [...dataArray]; // Copia del array original


    // Aplicar filtro de estado
    if (currentFilter !== 'Todos') {
        dataToDisplay = dataToDisplay.filter(item => item.estado === currentFilter);
    }


    // Aplicar filtro de búsqueda
    const searchTerm = document.getElementById('search').value.toLowerCase();
    if (searchTerm) {
        dataToDisplay = dataToDisplay.filter(item =>
            item.nombre.toLowerCase().includes(searchTerm) ||
            item.nombred.toLowerCase().includes(searchTerm)
        );
    }


    dataToDisplay.forEach((item, i) => {
        const card = document.createElement("div");
        card.className = "card col-sm-6 col-md-4 col-lg-3"; // Ajuste para diferentes tamaños de pantalla
        card.innerHTML = `
    <img src="img/${item.tipo.toLowerCase()}.jpg" class="card-img-top" alt="${item.tipo}">
                <div class="card-body">
    <h5 class="card-title">${item.nombre}</h5>
    <p class="card-text">Propietario: ${item.nombred}</p>
    <p class="card-text">Teléfono: ${item.telefono}</p>
    <p class="card-text">Fecha: ${item.fecha}</p>
    <p class="card-text">Hora: ${item.hora}</p>
    <p class="card-text">Tipo: ${item.tipo}</p>
    <p class="card-text">Síntomas: ${item.sintomas}</p>
    <p class="card-text">Estado: ${item.estado}</p>
    <button class="btn btn-warning" onclick="editar(${i})" data-bs-toggle="modal" data-bs-target="#exampleModal">Editar</button>
    <button class="btn btn-danger" onclick="eliminar(${i})">Eliminar</button>
    </div>
    `;
        citasDiv.appendChild(card);
    });
}


function editar(i) {
    const item = dataArray[i];
    document.getElementById("numero").value = item.numero;
    document.getElementById("nombre").value = item.nombre;
    document.getElementById("nombred").value = item.nombred;
    document.getElementById("telefono").value = item.telefono;
    document.getElementById("fecha").value = item.fecha;
    document.getElementById("hora").value = item.hora;
    document.getElementById("tipo").value = item.tipo;
    document.getElementById("sintomas").value = item.sintomas;
    document.getElementById("estado").value = item.estado;
    op = 1;
    pos = i;
}


function limpiar() {
    document.getElementById("numero").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("nombred").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("hora").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("sintomas").value = "";
    document.getElementById("estado").value = "Abierta";
}


function validaciones() {
    const telefono = document.getElementById("telefono").value;
    const fecha = new Date(document.getElementById("fecha").value);
    const hoy = new Date();
    const hora = document.getElementById("hora").value;


    if (!document.getElementById("nombre").value.trim()) {
        Swal.fire({
            title: "Faltan datos",
            text: "Debe ingresar el nombre de la mascota",
            icon: "question"
        });
        return false;
    }
    if (!document.getElementById("nombred").value) {
        Swal.fire({
            title: "Faltan datos",
            text: "Debe ingresar el nombre del propietario",
            icon: "question"
        });
        return false;
    }
    if (!telefono || isNaN(telefono) || document.getElementById("telefono").value.length > 20) {
        Swal.fire({
            title: "Datos incorrectos",
            text: "Ingrese un número de teléfono válido",
            icon: "error"
        });
        return false;
    }

    if (fecha <= hoy) {
        Swal.fire({
            title: "Datos incorrectos",
            text: "Debe ingresar una fecha posterior a hoy",
            icon: "error"
        });
        return false;
    }

    const horaCita = parseInt(hora.split(':')[0]);
    if (horaCita < 8 || horaCita > 19) {
        Swal.fire({
            title: "Datos incorrectos",
            text: "El horario de atención es de 8 a.m. a 8 p.m.",
            icon: "error"
        });
        return false;
    }


    if (!document.getElementById("hora").value) {
        Swal.fire({
            title: "Faltan datos",
            text: "Debe seleccionar una hora",
            icon: "question"
        });
        return false;
    }
    if (!document.getElementById("tipo").value) {
        Swal.fire({
            title: "Faltan datos",
            text: "Debe seleccionar el tipo de mascota",
            icon: "question"
        });
        return false;
    }
    if (!document.getElementById("sintomas").value || document.getElementById("sintomas").value.length >
        400) {
        Swal.fire({
            title: "Faltan datos",
            text: "Es obligatorio que describa los síntomas en menos de 400 caracteres",
            icon: "question"
        });
        return false;
    }
    return true;
}


function filtrarPorEstado() {
    currentFilter = document.getElementById('estados').value;
    pintar();
}


function buscar() {
    pintar();
}
