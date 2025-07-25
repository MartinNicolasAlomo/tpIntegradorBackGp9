// geastiona peticions y respuestas
import Products from "../models/product.models.js"



export const getAllProducts = async (req, res) => {
    try {
        let [rows] = await Products.selectAllProducts();

        res.status(200).json({
            success: true,
            payload: rows,
            message: rows.length === 0 ? "No se encontraron productos" : "Productos encontrados"
        });

    } catch (error) {
        console.error("Error obteniendo productos", error);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor al obtener producto."
        });
    }
};


export const getProductByID = async (req, res) => {
    try {
        let { id } = req.params;
        let [rows] = await Products.selectProductByID(id);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: `No se encontró el prodcuto con ID: ${id}`
            })
        }

        res.status(200).json({
            success: true,
            payload: rows
        });

        console.log(rows);

    } catch (error) {
        console.error(`Error obteniendo productos con ID: ${id}`, error.message);
        res.status(500).json({
            success: false,
            error: "Error interno del servidor al obtener un producto por ID."
        });
    }
};





export const removeProduct = async (req, res) => {
    // validate ID
    try {
        let { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Se requiere un ID para eliminar un producto"
            })
        }

        let [result] = await Products.deleteProduct(id);

        if (result.affectedRows === 0) {
            return res.status(404), json({
                success: false,
                message: `No se encontró un producto con ID ${id}`
            })
        }

        return res.status(200).json({
            success: true,
            message: `Producto con ID ${id} eliminado correctamente`
        });

    } catch (error) {
        console.error("Error en DELETE /products/:id", error);
        return res.status(500), json({
            success: false,
            message: `Error al eliminar producto con ID ${id}`, error,
            error: error.message
        });
    }
}


export const postProducto = async (req, res) => {
    console.log("POST /altaProducto Body:", req.body);
    let { codigo, nombre, precio, img, categorias, activo } = req.body;
    if (!nombre || !precio) {
        return res.status(400).json({
            success: false,
            message: "Faltan campos obligatorios: código, nombre o precio"
        });
    }

    try {
        const [result] = await Products.insertarProducto(codigo, nombre, precio, img, categorias, activo);

        if (result.affectedRows === 1) {
            return res.status(201).json({
                success: true,
                message: "Producto agregado correctamente",
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "No se insertó ninguna fila"
            });
        }

    } catch (error) {
        console.error("Error creando producto:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Ya existe un producto con ese código"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error interno al crear el producto"
        });
    }
}

export const putProducto = async (req, res) => {
    console.log("PUT - Body", req.body);
    const { nombre, precio, img, categoria, activo, codigo } = req.body;
    try {
        const result = await Products.actualizarProducto(nombre, precio, img, categoria, activo, codigo);
        if (result[0].affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontró el producto para actualizar"
            });
        }
        res.status(200).json({
            success: true,
            message: "Producto actualizado correctamente"
        });
    } catch (error) {
        console.error("errr", error);
        res.status(500).json({
            success: false,
            message: "Error actualizando producto"
        })
    }
}


export const patchProducto = async (req, res) => {
    const { id } = req.params;
    const { activo } = req.body;    // El estado de actividad true/fasle

    if (activo === undefined) {
        return res.status(400).json({
            success: false,
            message: "Falta el campo 'activo'"
        });
    }

    try {

        const result = await Products.actualizarEstadoActivo(id, activo);


        if (result[0].affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontró el producto"
            });
        }

        res.status(200).json({
            success: true,
            message: `Estado del Producto actualizado. Activo: ${activo}`
        });


    } catch (error) {
        console.error("Error en PATCH estado activo:", error);
        res.status(500).json({
            success: false,
            message: "Error actualizando el estado activo del producto"
        });
    }
};

