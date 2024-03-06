import product from '../models/product.js'


export async function saveProduct(req, res) {
    try {
    
        const { id_product, name, price, description, image, quantity, type } = req.body
        const Product = await product.findOne({ id_product: id_product })
        if (!Product) {
            
            const newProduct = new product({
                id_product,
                name,
                price,
                description,
                image: image,
                quantity: quantity,
                type: type
            })


            const dataProductSave = await newProduct.save()
            return res.status(200).json({
                "status": true,
                "dataProductSave": dataProductSave
            })
        } else {
            return res.status(200).json({
                "status": false,
                "message": "Producto ya registrado ya registrado"
            })
        }
    } catch (error) {
        return res.status(500).json({
            "status": false,
            "error": error,
            "message": "No se pudo crear el producto"
        })
    }
}
export async function obtainAllProducts(req, res) {
    try {
        const dataProducts = await product.find()
        return res.status(200).json({
            "status": true,
            "data": dataProducts
        })
    } catch (error) {
        return res.status(500).json({
            "status": false,
            "error": error,
            "message": "Error al obtener los productos"
        })
    }
}

export async function findProductById(req, res) {
    try {
        const id = req.params.id
        const dataProduct = await product.findById(id)
        return res.status(200).json({
            "status": true,
            "data": dataProduct
        })
    } catch (error) {
        return res.status(500).json({
            "status": false,
            "error": error,
            "message": "No se encontro el producto"
        })
    }
}

export async function deleteProduct(req, res) {
    try {
        const id = req.params.id
        const productDeleted = await product.findByIdAndDelete(id)
        return res.status(200).json({
            "status": true,
            "productDeleted": productDeleted
        })
    } catch (error) {
        return res.status(500).json({
            "status": false,
            "error": error,
            "message": "No se pudo eliminar el producto"
        })
    }
}

export async function searchProducts(req, res) {
    try {
        console.log('within search');
        const { query } = req.query;

        console.log(query);

        // Realiza una consulta a la base de datos (MongoDB) para obtener productos relacionados
        if (query !== null && query !== undefined) {
            const regex = new RegExp(query, 'i'); // 'i' indica insensibilidad a mayúsculas y minúsculas
            const results = await product.find({
                $or: [
                    { name: { $regex: regex } },
                    { description: { $regex: regex } }
                ]
            });

            res.json(results);
        } else {
            res.status(400).json({ message: 'La consulta de búsqueda es nula o indefinida.' });
        }
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}


