// Selecciona los elementos del DOM necesarios
const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#Formulario');

let searchQuery = ''; // Variable para guardar la consulta

// Añade un event listener al cargar la ventana
window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarGatos); // Escucha el evento submit del formulario y llama a la función buscarGatos
});

// Función para manejar la búsqueda de gatos
function buscarGatos(e) {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Obtiene el valor ingresado por el usuario
    const query = document.querySelector('#query').value.trim();
    searchQuery = query; // Guarda la consulta actual

    // Verifica si el campo está vacío
    if (query === "") {
        mostrarError("El campo de búsqueda no puede estar vacío");
        return;
    }

    // Llama a la función para consultar la API de Pixabay
    consultarAPI(query);
}

// Función para mostrar errores
function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');
    if (!alerta) {
        // Crea una nueva alerta si no existe
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100');
        alerta.innerHTML = `<strong>Error!</strong> <span>${mensaje}</span>`;
        container.insertBefore(alerta, formulario);
        setTimeout(() => alerta.remove(), 3000); // Elimina la alerta después de 3 segundos
    }
}

// Función para consultar la API de Pixabay
function consultarAPI(query) {
    const API_KEY = '49140862-41e7ac94d4f22e61e549f9836'; // Reemplaza con tu clave de API de Pixabay
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&video_type=photo&per_page=32    `;

    fetch(url)
        .then(respuesta => respuesta.json()) // Convierte la respuesta a JSON
        .then(datos => {
            mostrarGatos(datos); // Llama a la función para mostrar los resultados
        })
        .catch(error => mostrarError("Hubo un error al buscar las imágenes"));
}

// Función para mostrar las imágenes de gatos
function mostrarGatos(datos) {
    limpiarHTML(); // Limpia los resultados previos

    if (datos.totalHits > 0) {
        // Si hay resultados, muestra las imágenes
        datos.hits.forEach(hit => {
            const imageCard = document.createElement('div');
            imageCard.classList.add('image-card');

            const image = document.createElement('img');
            image.src = hit.webformatURL; // URL de la imagen

            const overlay = document.createElement('div');
            overlay.classList.add('overlay');
            overlay.innerHTML = `<p>Autor: ${hit.user}</p>`;

            imageCard.appendChild(image);
            imageCard.appendChild(overlay);
            resultado.appendChild(imageCard);
        });
    } else {
        // Si no hay resultados, muestra un mensaje personalizado
        resultado.innerHTML = `<p>No se encontraron imágenes para "<strong>${searchQuery}</strong>".</p>`;
    }
}

// Función para limpiar el HTML previo
function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild); // Elimina todos los elementos hijos del div resultado
    }
}
