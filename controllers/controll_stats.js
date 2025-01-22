import Sales from "../models/sales.js";
import Product from '../models/product.js';

export async function totalSold(req, res){
    try {
        const sales = await Sales.find()
        
        // const totalAmount = sales.map(sold => sold.totalAmount)
        const totalAmount = sales
        .map(sold => sold.totalAmount)
        .reduce((totalAmount, amount) => totalAmount + amount, 0)

        return res.status(200).json({
            "status": true,
            "data": totalAmount
        })
    } catch (error) {
        
    }
}


export async function bestSellingProduct(req, res){
    try {
        const sales = await Sales.find();

        const salesProducts = sales
        .map(product => product.items
        .map(({id, quantity}) => ({
            id, quantity 
        }))).flat()

        
        const quantityProduct = salesProducts.reduce((amount, { id, quantity }) => {
            amount[id] = (amount[id] || 0) + quantity;
            return amount;
          }, {});

        console.log(quantityProduct);
        
          
        //method to obtain the maximun number of prodcuts from an array of objects
        const maxQuantity = Math.max(...Object.values(quantityProduct));
  
        //method to obtain the id of the product or products with the maximun number of sales
        const mostSoldProducts = Object.entries(quantityProduct)
        .filter(([_, quantity]) => quantity === maxQuantity)
        .map(([id]) => id);

        const idProduct = mostSoldProducts[0];

        const detailsProduct = await Product.findById(idProduct);

        const bestProduct = ({
            _id: detailsProduct._id,
            name: detailsProduct.name,
            price: detailsProduct.price,
            image: detailsProduct.image,
            type: detailsProduct.type,
            quantity: maxQuantity
        })

        
        
    
      
        res.status(200).json({
            "status": true,
            "data": bestProduct
        })
        
    } catch (error) {
        
    }
}