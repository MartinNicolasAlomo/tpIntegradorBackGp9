const urlProducts = "http://localhost:3000/api/";
let formularioObtenerProducto = document.querySelector(".formulario-obtener-producto");
let contenedorObjetoEncontrado = document.querySelector(".contenedor-objeto-encontrado");

formularioObtenerProducto.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        contenedorObjetoEncontrado.innerHTML = "<p>Cargando producto...</p>"    //  Muestra estado de carga
        console.log("carga");


        //  Extraemos la info de los campos del formulario
        let formData = new FormData(event.target);                          //  Objeto JS especifico de info de formularios HTML 
        let data = Object.fromEntries(formData.entries());                  //  Transformamos el objeto FormData en nun objeto JS normal
        console.log(data);
        console.log("entries");

        //Ahora que obtenemos el objeto con el campo de idProf, vamos a guardarlo en una variable
        let idProd = data.idProd.trim();
        console.log(idProd);
        if (!idProd) {
            throw new Error(`Error en el envio de datos del formulario`)
        }
        console.log("idprod");

        let response = await fetch(`${urlProducts}products/${idProd}`);
        console.log(response);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        console.log("response");

        let datos = await response.json();
        console.log(datos);
        if (!datos.payload || datos.payload.lenght === 0) {
            throw new Error(`No se encontró el producto solicitado.`)
        }
        console.log("datinos");

        let producto = datos.payload[0];                                    //  Guardamos nuestro producto en una variable
        console.log(producto);
        console.log("payload");

        mostrarProducto(producto);
    } catch (error) {
        alert(`${error.message}`);
        console.error(`Error al obtener el producto:`, error.message);
        //contenedorObjetoEncontrado.innerHTML = `<p>${error.message}</p>`
    }
});

function mostrarProducto(producto) {
    let carta = `
                        <div class="carta-producto">
                            <div class="contenedor-imagen-producto">
                                <img class="imagen-producto" src="${producto.imagen}" alt="${producto.nombre}">
                            </div>
                            <div class="contenedor-nombre-producto">
                                <h3 class="nombre-producto">${producto.nombre}</h3>
                            </div>
                            <div class="contenedor-id-producto">
                                <p class="id-producto">ID: ${producto.id}</p>
                            </div>
                            <div class="contenedor-precio-producto">
                                <p class="precio-producto">$${producto.precio.toFixed(2)}</p>
                            </div>
                        </div>
                    `;
    contenedorObjetoEncontrado.innerHTML = carta;

    let idProd = producto.id;
}
