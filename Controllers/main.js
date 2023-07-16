
// const myModal = document.getElementById('myModal')
// const myInput = document.getElementById('myInput')

// myModal.addEventListener('shown.bs.modal', () => {
//   myInput.focus()
// })

function obtenerTareas() {
    return localStorage.getItem("tareas") ? JSON.parse(localStorage.getItem("tareas")) : []
}

function guardarTareas(tareas) {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function mostrarTareas() {
    let tareas = obtenerTareas();
    $("#tabla-tareas").empty();
    for (let i = 0; i < tareas.length; i++) {
        let tarea = tareas[i];
        console.log('Tarea', tarea)
        let fila = $("<tr></tr>");
        fila.append($("<td></td>").text(tarea.tarea));
        let celdaAcciones = $("<td></td>");
        let botonEditar = $("<button></button>").addClass("btn btn-warning").text("Editar");
        let botonEliminar = $("<button></button>").addClass("btn btn-danger").text("Eliminar");
        botonEditar.click(function() {
            editarTarea(i);
        });
        botonEliminar.click(function() {
            eliminarTarea(i);
        });
        celdaAcciones.append(botonEditar).append(botonEliminar);
        fila.append(celdaAcciones);
        $("#tabla-tareas").append(fila);
    }
}

function crearTarea(descripcion) {
    let tareas = obtenerTareas();
    let tarea = {
        tarea: descripcion,
    };
    tareas.push(tarea);
    guardarTareas(tareas);
    mostrarTareas();
}

function editarTarea(indice) {
    let tareas = obtenerTareas();
    let tarea = tareas[indice];
    let nuevoTitulo = prompt("Ingresa tu tarea", tarea.tarea);
    if (nuevoTitulo) {
        tarea.tarea = nuevoTitulo;
        guardarTareas(tareas);
        mostrarTareas();
    }
}

function eliminarTarea(indice) {
    let tareas = obtenerTareas();
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
        tareas.splice(indice, 1);
        guardarTareas(tareas);
        mostrarTareas();
    }
}

$(document).ready(function() {
    mostrarTareas();
});

$("#form-tarea").submit(function(event) {
    event.preventDefault();
    let titulo = $("#tarea").val();
    crearTarea(titulo);
    $("#tarea").val("");
});
