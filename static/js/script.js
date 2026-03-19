/*
=============================================
SCRIPT.JS — index.html
Carga artículos desde la API (o datos de ejemplo)
y permite buscarlos en tiempo real.
=============================================
*/


/* =============================================
   DATOS DE EJEMPLO
   Simula la respuesta de GET /api/articles
   Cuando la API esté lista, reemplaza con fetch().
   El buscador filtra este array localmente.
============================================= */
const articulosEjemplo = [
  {
    slug:     'imperio-romano',
    title:    'El Imperio Romano',
    category: 'Historia Antigua',
    excerpt:  'El mayor imperio de la antigüedad que dominó Europa, África y Asia durante siglos.',
    image:    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/0_Colosseum_-_Rome_111001_%282%29.JPG/1280px-0_Colosseum_-_Rome_111001_%282%29.JPG',
    date:     'Mar 2024'
  },
  {
    slug:     'revolucion-francesa',
    title:    'La Revolución Francesa',
    category: 'Edad Moderna',
    excerpt:  'El levantamiento popular que cambió el mundo e instauró los ideales de libertad e igualdad.',
    image:    'https://www.roamingparis.com/wp-content/uploads/2023/01/Liberty-Leading-the-People-by-Eugene-Delacroix-1024x811.jpg',
    date:     'Abr 2024'
  },
  {
    slug:     'segunda-guerra-mundial',
    title:    'Segunda Guerra Mundial',
    category: 'Siglo XX',
    excerpt:  'El conflicto más devastador de la historia humana, que involucró a decenas de naciones.',
    image:    'https://cdn.britannica.com/34/205334-050-79DF4216/troops-Omaha-Beach-American-beach-presence-vehicles-June-6-1944.jpg',
    date:     'May 2024'
  },
  {
    slug:     'civilizacion-egipcia',
    title:    'Civilización Egipcia',
    category: 'Historia Antigua',
    excerpt:  'Una de las civilizaciones más longevas, constructora de pirámides y cuna de la escritura.',
    image:    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/1280px-Kheops-Pyramid.jpg',
    date:     'Jun 2024'
  },
  {
    slug:     'renacimiento',
    title:    'El Renacimiento',
    category: 'Edad Moderna',
    excerpt:  'El florecimiento cultural y artístico que transformó Europa entre los siglos XIV y XVII.',
    image:    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/402px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
    date:     'Jul 2024'
  },
  {
    slug:     'grecia-antigua',
    title:    'Grecia Antigua',
    category: 'Historia Antigua',
    excerpt:  'Cuna de la democracia, la filosofía y las olimpiadas. Base de la civilización occidental.',
    image:    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/The_Parthenon_in_Athens.jpg/1280px-The_Parthenon_in_Athens.jpg',
    date:     'Ago 2024'
  }
];

/* articulosCargados guarda todos los artículos una vez que cargan */
/* lo usamos para buscar sin tener que volver a llamar la API */
let articulosCargados = [];


/* =============================================
   CREAR UNA CARD DE ARTÍCULO
   Recibe un objeto artículo y devuelve HTML.
============================================= */
function crearCard(articulo) {
  return `
    <div class="col-12 col-md-6 col-lg-4">
    <!-- col-12/md-6/lg-4: Bootstrap - 1/2/3 columnas según tamaño de pantalla -->

      <a href="article.html?slug=${articulo.slug}" class="text-decoration-none">
      <!-- text-decoration-none: Bootstrap - sin subrayado en el enlace -->

        <div class="card article-card h-100">
        <!-- card: Bootstrap - caja con borde -->
        <!-- h-100: Bootstrap - todas las cards tienen la misma altura -->

          <img src="${articulo.image}" class="card-img-top article-card-img" alt="${articulo.title}">
          <!-- card-img-top: Bootstrap - imagen en la parte superior de la card -->

          <div class="card-body d-flex flex-column">
          <!-- card-body: Bootstrap - padding interior -->
          <!-- d-flex flex-column: Bootstrap - para empujar la fecha al fondo -->

            <span class="badge article-card-badge mb-2">${articulo.category}</span>
            <!-- badge: Bootstrap - pastilla de categoría -->
            <!-- mb-2: Bootstrap - margen inferior 8px -->

            <h5 class="card-title article-card-title">${articulo.title}</h5>
            <!-- card-title: Bootstrap - título de la card -->

            <p class="card-text article-card-excerpt flex-grow-1">${articulo.excerpt}</p>
            <!-- card-text: Bootstrap - párrafo de la card -->
            <!-- flex-grow-1: Bootstrap - ocupa el espacio libre (empuja fecha abajo) -->

            <div class="d-flex justify-content-between align-items-center mt-3">
            <!-- d-flex justify-content-between: Bootstrap - fecha y flecha en extremos -->
            <!-- mt-3: Bootstrap - margen superior 16px -->
              <small class="article-card-date">${articulo.date}</small>
              <span class="article-card-arrow">→</span>
            </div>

          </div>
        </div>

      </a>
    </div>
  `;
}


/* =============================================
   MOSTRAR CARDS EN EL GRID
   Recibe un array de artículos y los renderiza.
   Si el array está vacío muestra un mensaje.
============================================= */
function mostrarCards(articulos) {

  const grid = document.getElementById('articlesGrid');
  /* obtenemos el contenedor del grid */

  if (articulos.length === 0) {
  /* si no hay artículos que mostrar... */

    grid.innerHTML = `
      <div class="col-12 text-center py-5">
      <!-- text-center: Bootstrap - centra el texto -->
      <!-- py-5: Bootstrap - padding vertical 48px -->
        <p class="article-card-date fs-5">No se encontraron artículos.</p>
        <!-- fs-5: Bootstrap - font-size de 1.25rem -->
        <button class="btn btn-eco btn-ghost mt-3" onclick="limpiarBusqueda()">
          Ver todos los artículos
        </button>
        <!-- mt-3: Bootstrap - margen superior 16px -->
        <!-- onclick: al hacer clic llama a limpiarBusqueda() -->
      </div>
    `;
    return; /* sale de la función, no hay más que hacer */
  }

  grid.innerHTML = articulos.map(crearCard).join('');
  /* .map(crearCard): aplica crearCard() a cada artículo → array de strings HTML */
  /* .join(''): une el array en un solo string */
  /* grid.innerHTML = ...: inserta todas las cards en el grid */
}


/* =============================================
   SKELETONS DE CARGA
   Muestra 6 cards grises animadas mientras
   espera la respuesta de la API.
============================================= */
function mostrarSkeletons() {

  const grid = document.getElementById('articlesGrid');
  let html = '';
  /* acumulamos el HTML de los 6 skeletons */

  for (let i = 0; i < 6; i++) {
  /* creamos 6 skeletons (uno por cada card esperada) */
    html += `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card article-card h-100">
          <div class="placeholder-glow">
            <div class="placeholder w-100 article-card-img-skeleton"></div>
            <!-- placeholder-glow: Bootstrap - animación de brillo -->
            <!-- placeholder: Bootstrap - bloque gris animado -->
            <!-- w-100: Bootstrap - ancho completo -->
          </div>
          <div class="card-body">
            <p class="placeholder-glow mb-2"><span class="placeholder col-4"></span></p>
            <p class="placeholder-glow mb-3">
              <span class="placeholder col-10 d-block"></span>
              <span class="placeholder col-7 d-block"></span>
              <!-- d-block: Bootstrap - cada línea en su propia fila -->
            </p>
            <p class="placeholder-glow">
              <span class="placeholder col-12 d-block"></span>
              <span class="placeholder col-12 d-block"></span>
              <span class="placeholder col-8 d-block"></span>
            </p>
          </div>
        </div>
      </div>
    `;
  }

  grid.innerHTML = html;
}


/* =============================================
   FILTRAR ARTÍCULOS POR TÉRMINO DE BÚSQUEDA
   Busca el término en título, categoría y extracto.
   No distingue mayúsculas/minúsculas.
============================================= */
function filtrarArticulos(termino) {

  const terminoLower = termino.toLowerCase();
  /* .toLowerCase(): convierte el texto a minúsculas para comparar sin distinguir mayúsculas */
  /* ej: "ROMA" y "roma" y "Roma" son lo mismo */

  const resultados = articulosCargados.filter(function(articulo) {
  /* .filter(): devuelve un nuevo array con solo los elementos que pasen la condición */
  /* recorre cada artículo y devuelve true si coincide con el término */

    return (
      articulo.title.toLowerCase().includes(terminoLower)    ||
      /* .includes(): devuelve true si el string contiene el término */
      /* || : OR - basta con que UNO sea true */
      articulo.category.toLowerCase().includes(terminoLower) ||
      articulo.excerpt.toLowerCase().includes(terminoLower)
      /* buscamos en título, categoría Y extracto */
    );
  });

  return resultados;
  /* devuelve el array filtrado */
}


/* =============================================
   ACTUALIZAR TÍTULO DE LA SECCIÓN
   Cambia "Artículos recientes" por
   "X resultados para 'término'" al buscar.
============================================= */
function actualizarTituloSeccion(termino, cantidad) {

  const titulo = document.querySelector('.section-title');
  /* querySelector: busca el PRIMER elemento que coincida con el selector CSS */

  if (termino === '') {
  /* si el buscador está vacío, volvemos al título original */
    titulo.textContent = 'Artículos recientes';
  } else {
    titulo.textContent = `${cantidad} resultado${cantidad !== 1 ? 's' : ''} para "${termino}"`;
    /* ${cantidad !== 1 ? 's' : ''}: si hay más de 1 resultado agrega la "s" de plural */
    /* operador ternario: condición ? valor_si_true : valor_si_false */
  }
}


/* =============================================
   LIMPIAR BÚSQUEDA
   Vuelve a mostrar todos los artículos y
   limpia el input del buscador.
   Se llama desde el botón "Ver todos".
============================================= */
function limpiarBusqueda() {

  const input = document.getElementById('inputBusqueda');
  if (input) input.value = '';
  /* vaciamos el input del buscador */

  actualizarTituloSeccion('', articulosCargados.length);
  /* restauramos el título de la sección */

  mostrarCards(articulosCargados);
  /* mostramos todos los artículos de nuevo */
}


/* =============================================
   CARGAR ARTÍCULOS AL INICIO
   Muestra skeletons, espera la API y renderiza.
============================================= */
async function cargarArticulos() {

  mostrarSkeletons();
  /* mostramos skeletons mientras "carga" */

  try {

    await new Promise(r => setTimeout(r, 600));
    /* simula 600ms de tiempo de respuesta de la API */

    /* ---- CUANDO LA API ESTÉ LISTA, REEMPLAZA ESTO: ----
    const res       = await fetch('/api/articles?page=1&limit=6');
    articulosCargados = await res.json();
    ---------------------------------------------------- */

    articulosCargados = articulosEjemplo;
    /* guardamos los artículos en la variable global */
    /* así el buscador puede filtrarlos sin llamar la API de nuevo */

    mostrarCards(articulosCargados);
    /* renderizamos las cards reales */

  } catch (error) {
    console.error('Error al cargar artículos:', error);
    /* console.error: muestra el error en la consola (F12) */

    document.getElementById('articlesGrid').innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          No se pudieron cargar los artículos.
        </div>
      </div>
    `;
    /* alert alert-danger: Bootstrap - caja de error roja */
  }
}


/* =============================================
   BUSCADOR
   Escucha lo que escribe el usuario en tiempo real.
   Filtra los artículos ya cargados sin llamar la API.
============================================= */
const inputBusqueda = document.getElementById('inputBusqueda');
/* obtenemos el input del buscador */

if (inputBusqueda) {
/* verificamos que el elemento existe antes de agregar eventos */

  /* Busca mientras el usuario escribe (tiempo real) */
  inputBusqueda.addEventListener('input', function() {
  /* 'input': se dispara CADA VEZ que el usuario escribe o borra una letra */
  /* diferencia con 'keydown': input solo se activa cuando el texto cambia */

    const termino = inputBusqueda.value.trim();
    /* .value: texto actual del input */
    /* .trim(): elimina espacios al inicio y al final */

    if (articulosCargados.length === 0) return;
    /* si los artículos aún no cargaron, no hacemos nada */

    if (termino === '') {
    /* si el usuario borró todo, mostramos todos los artículos de nuevo */
      actualizarTituloSeccion('', articulosCargados.length);
      mostrarCards(articulosCargados);
      return;
    }

    const resultados = filtrarArticulos(termino);
    /* filtramos los artículos por el término escrito */

    actualizarTituloSeccion(termino, resultados.length);
    /* actualizamos el título con la cantidad de resultados */

    mostrarCards(resultados);
    /* mostramos solo los artículos que coinciden */
  });


  /* También busca al presionar Enter (por si acaso) */
  inputBusqueda.addEventListener('keydown', function(evento) {
  /* 'keydown': se dispara cuando el usuario presiona una tecla */

    if (evento.key === 'Enter') {
    /* si presionó Enter, hacemos scroll a la sección de artículos */

      const seccion = document.getElementById('articulos');
      /* obtenemos la sección de artículos */

      if (seccion) {
        seccion.scrollIntoView({ behavior: 'smooth' });
        /* .scrollIntoView(): hace scroll hasta el elemento */
        /* behavior: 'smooth': animación suave en vez de salto brusco */
      }
    }
  });

}


/* Iniciamos la carga al abrir la página */
cargarArticulos();