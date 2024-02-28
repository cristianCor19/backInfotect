import product from '../models/product.js'


export async function saveProduct(req, res) {
    try {
        console.log('entro registro back');
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


