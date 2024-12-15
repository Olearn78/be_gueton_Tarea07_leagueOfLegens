document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "https://ddragon.leagueoflegends.com/cdn/12.18.1/data/es_ES/champion.json";
    const listaCampeones = document.getElementById("listaCampeones");

    let campeones = [];

    // Obtener los datos de los campeones
    async function fetchCampeones() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            campeones = Object.values(data.data).map((campeon) => ({
                id: campeon.key,
                nombre: campeon.name,
                tipos: campeon.tags,
                descripcion: campeon.blurb,
                imagen: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${campeon.id}_0.jpg`,
            }));
            renderizarCampeones();
        } catch (error) {
            console.error("Error al obtener los datos de campeones:", error);
            listaCampeones.innerHTML = `<p class="text-danger text-center">Error al cargar los campeones. Intente nuevamente más tarde.</p>`;
        }
    }

    // Renderizar los campeones en el DOM
    function renderizarCampeones(filtro = "todos") {
        listaCampeones.innerHTML = "";

        const campeonesFiltrados =
            filtro === "todos"
                ? campeones
                : campeones.filter((campeon) =>
                    campeon.tipos.some((tipo) => tipo.toLowerCase() === filtro.toLowerCase())
                );

        if (campeonesFiltrados.length === 0) {
            listaCampeones.innerHTML = `<p class="text-warning text-center">No se encontraron campeones para este filtro.</p>`;
            return;
        }

        campeonesFiltrados.forEach((campeon) => {
            const divCampeon = document.createElement("div");
            divCampeon.classList.add("col-12", "col-sm-6", "col-lg-4");
            divCampeon.innerHTML = `
                <div class="card h-100 shadow-sm" style="cursor: pointer;">
                    <img src="${campeon.imagen}" class="card-img-top" alt="${campeon.nombre}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${campeon.nombre}</h5>
                        <div>
                            ${campeon.tipos
                                .map(
                                    (tipo) => `<span class="badge bg-primary me-1">${tipo.toUpperCase()}</span>`
                                )
                                .join("")}
                        </div>
                    </div>
                </div>
            `;

            // Agregar evento para abrir nueva ventana
            divCampeon.addEventListener("click", () => {
                abrirVentanaCampeon(campeon);
            });

            listaCampeones.appendChild(divCampeon);
        });
    }

    // Abrir una nueva ventana con detalles del campeón
    function abrirVentanaCampeon(campeon) {
        const nuevaVentana = window.open("", "_blank", "width=600,height=800");
        nuevaVentana.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${campeon.nombre}</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Rubik', sans-serif;
                        text-align: center;
                        margin: 0;
                        padding: 1rem;
                        background-color: #f8f9fa;
                    }
                    img {
                        max-width: 100%;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    }
                    h1 {
                        margin-top: 1rem;
                        font-size: 2rem;
                        text-transform: uppercase;
                    }
                    p {
                        font-size: 1.2rem;
                        color: #6c757d;
                    }
                </style>
            </head>
            <body>
                <h1>${campeon.nombre}</h1>
                <img src="${campeon.imagen}" alt="${campeon.nombre}">
                <p>${campeon.descripcion}</p>
                <button onclick="window.close()" class="btn btn-primary mt-3">Cerrar</button>
            </body>
            </html>
        `);
        nuevaVentana.document.close();
    }

    // Manejar los filtros
    document.querySelectorAll(".btn-header").forEach((boton) => {
        boton.addEventListener("click", () => {
            const filtro = boton.id === "todos" ? "todos" : boton.id;
            renderizarCampeones(filtro);
        });
    });

    // Cargar los campeones al iniciar
    await fetchCampeones();
});
