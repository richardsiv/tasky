// Modal
const modal = new bootstrap.Modal('#modalFormLista', {})

function obtenerTareas() {
  return localStorage.getItem("tareas")
    ? JSON.parse(localStorage.getItem("tareas"))
    : [];
}

function guardarTareas(tareas) {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}


function ordenarTareas(tareas) {
  tareas.sort(function(a, b) {
      let fechaA = new Date(a.fecha.dia + " " + a.fecha.horaInicio);
      let fechaB = new Date(b.fecha.dia + " " + b.fecha.horaInicio);
      return fechaA > fechaB ? -1 : fechaA < fechaB ? 1 : 0;
  });
  let agrupado = tareas.reduce(function(acumulador, tarea) {
      let dia = tarea.fecha.dia;
      if (!acumulador[dia]) {
          acumulador[dia] = [];
      }
      acumulador[dia].push(tarea);
      return acumulador;
  }, {});
  let resultado = Object.entries(agrupado).map(function(par) {
      let dia = par[0];
      let tareas = par[1];
      let objeto = {
          titulo: dia,
          fecha: {
              dia: tareas
          }
      };
      return objeto;
  });
  return resultado;
}


function mostrarTareas() {
  let tareas = obtenerTareas();
  $("#grupo-listas").empty();

  const tareasOrdenadas = ordenarTareas(tareas);

  tareasOrdenadas.forEach(diaEnGeneral => {
    console.log('Dia con tareas ordenadas', diaEnGeneral);

    let tareasRenderizadas;

    diaEnGeneral.fecha.dia.forEach((tareaEspecifico, i) => {

      const tareaRenderizada = `
        <label class="list-group-item d-flex gap-3">
          <input class="form-check-input flex-shrink-0" type="checkbox" value="" style="font-size: 1.375em;">
          <span class="pt-1 form-checked-content">
            <strong>${tareaEspecifico.titulo}</strong>
            <small class="d-block text-muted">
              <i class="bi bi-calendar-event-fill"></i>
              ${tareaEspecifico.fecha.horaInicio} – ${tareaEspecifico.fecha.horaFin}
            </small>
          </span>
          <div class="ms-auto p-2 d-flex flex-nowrap ">
            <i class="bi bi-pencil p-2" style="color: #ffc107;"></i>
            <i class="bi bi-x-lg p-2" style="color: red;"></i>
          </div>
        </label>
      `;
      tareasRenderizadas = tareasRenderizadas ? tareasRenderizadas + tareaRenderizada : tareaRenderizada

      if (i === diaEnGeneral.fecha.dia.length - 1) {
        const lista = `
          <div class="list-group w-auto">
            <p class="mt-sm-0">${diaEnGeneral.titulo}</p>
            ${tareasRenderizadas}
          </div>
        `;
        $('#grupo-listas').append(lista)
      }
    })
  });
}

function crearTarea(titulo, fecha) {
  let tareas = obtenerTareas();

  let tarea = {
    titulo,
    fecha,
  };

  tareas.push(tarea);

  guardarTareas(tareas);
  mostrarTareas();
  modal.hide()
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

$(document).ready(function () {
  mostrarTareas();
});

$("#form-tarea").submit(function (event) {
  event.preventDefault();
  let titulo = $("#titulo").val();
  let fecha = {
    dia: $("#fecha").val(),
    horaInicio: $("#fecha-inicio").val(),
    horaFin: $("#fecha-fin").val(),
  };
  crearTarea(titulo, fecha);
  limpiarInputs()
});

$("#modalFormLista").on("hidden.bs.modal", function () {
  limpiarInputs();
});

function limpiarInputs() {
  $("#titulo").val("");
  $("#fecha").val("");
  $("#fecha-inicio").val("");
  $("#fecha-fin").val("");
}