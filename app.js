// 10 usuarios colombianos (datos ficticios) publicados en el repositorio
const API = 'https://raw.githubusercontent.com/daviid0611/buscador-usuarios/main/usuarios.json';
const $ = (id) => document.getElementById(id);
const input = $('buscar'), error = $('error');
const lista = $('lista'), detalle = $('detalle');
let usuarios = [];

// TEMA 3: fetch + async/await
async function cargarUsuarios() {
  try {
    const resp = await fetch(API);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    usuarios = await resp.json();
    pintar(usuarios);
  } catch (e) {
    error.textContent = 'No se pudo cargar: ' + e.message;
  }
}

// Crea los li de la lista (DOM dinámico)
function pintar(datos) {
  lista.replaceChildren(...datos.map((u) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.dataset.id = u.id;
    li.textContent = u.nombre; // evita XSS
    return li;
  }));
}

// TEMA 2: validación en tiempo real
input.addEventListener('input', () => {
  const v = input.value.trim();
  const ok = /^[a-záéíóúñ ]{2,}$/i.test(v);
  input.classList.toggle('valido', ok);
  input.classList.toggle('invalido', v !== '' && !ok);
  error.textContent = (v === '' || ok) ? ''
    : 'Escribe al menos 2 letras, sin números.';
  pintar(ok ? usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(v.toLowerCase()))
    : usuarios);
});

// TEMA 1: delegación en el ul
lista.addEventListener('click', (e) => {
  const li = e.target.closest('li.item');
  if (!li) return;
  const u = usuarios.find(
    (x) => x.id === Number(li.dataset.id));
  detalle.textContent =
    `${u.nombre}\n${u.correo}\n${u.empresa.nombre}`;
});

// Arranque: pide los usuarios al abrir la página
cargarUsuarios();
