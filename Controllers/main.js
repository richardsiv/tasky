// Modal
const modal = new bootstrap.Modal('#modalFormLista', {})

let esEditar = false;
let idTareaEditar = 0;

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

function generarHex() {
  let n = Math.floor(Math.random() * 65536);
  let s = n.toString(16).padStart(4, "0");
  return s;
}

function generarId() {
  let s1 = generarHex();
  let s2 = generarHex();
  let s3 = generarHex();
  let s4 = generarHex();
  let id = s1 + "-" + s2 + "-" + s3 + "-" + s4;
  return id;
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
          <div class="ms-auto p-2 d-flex flex-nowrap">
            <i class="bi bi-pencil p-2" style="color: #ffc107;" id="edit_${tareaEspecifico.id}"></i>
            <i class="bi bi-x-lg p-2" style="color: red;" id="delete_${tareaEspecifico.id}"></i>
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
    id: generarId(),
    titulo,
    fecha,
  };

  tareas.push(tarea);

  guardarTareas(tareas);
  mostrarTareas();
  modal.hide()
}

function editarTarea(id) {
  let tareas = obtenerTareas();
  let tarea = tareas.filter((tarea) => tarea.id === id)[0];
  $("#titulo").val(tarea.titulo);
  $("#fecha-inicio").val(tarea.fecha.horaInicio);
  $("#fecha-fin").val(tarea.fecha.horaFin);
  $("#fecha").val(tarea.fecha.dia);
  esEditar = true;
  idTareaEditar = id;
  modal.show();
}

function eliminarTarea(id) {
  let tareas = obtenerTareas();

  const tareasFiltradas = tareas.filter((tarea) => tarea.id !== id)

  if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
    guardarTareas(tareasFiltradas);
    mostrarTareas();
  }
}

$(document).ready(function () {
  mostrarTareas();
});

$(document).on("click", ".bi-pencil", function (e) {
  e.stopPropagation();
  let id = $(this).attr("id");
  editarTarea(id.split('_')[1]);
});

$(document).on("click", ".bi-x-lg", function (e) {
  e.stopPropagation();
  let id = $(this).attr("id");
  eliminarTarea(id.split('_')[1]);
});

$("#form-tarea").submit(function (event) {
  event.preventDefault();
  let titulo = $("#titulo").val();
  let fecha = {
    dia: $("#fecha").val(),
    horaInicio: $("#fecha-inicio").val(),
    horaFin: $("#fecha-fin").val(),
  };
  if (esEditar) {
    guardarTareaEditada(idTareaEditar, titulo, fecha)
  } else {
    crearTarea(titulo, fecha);
  }
  limpiarInputs()
});

function guardarTareaEditada(id, titulo, fecha) {
  let tareas = obtenerTareas();

  let tarea = tareas.map((t) => {
    let tareaAEditar = t
    if (t.id === id) {
      tareaAEditar.titulo = titulo;
      tareaAEditar.fecha = fecha;
    }
    return tareaAEditar
  })

  guardarTareas(tarea);
  mostrarTareas();
  modal.hide();

  esEditar = false;
  idTareaEditar = 0;
}

$("#modalFormLista").on("hidden.bs.modal", function () {
  limpiarInputs();
});

function limpiarInputs() {
  $("#titulo").val("");
  $("#fecha").val("");
  $("#fecha-inicio").val("");
  $("#fecha-fin").val("");
}