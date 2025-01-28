import Sales from "../models/sales.js";
import Product from '../models/product.js';

export async function totalSold(req, res) {
    try {
        const sales = await Sales.find()

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

export async function totalSoldMonth(req, res) {
    try {
        const sales = await Sales.find()
        

        const salesDate = sales.map((item) => ({
            totalAmount: item.totalAmount,
            month: item.orderDate.getMonth(),
            year: item.orderDate.getFullYear(),

        }))

        const currentYear = new Date().getFullYear()

        const totalAmountCurrent = Object.entries(
            salesDate
                .filter((item) => item.year === currentYear)
                .reduce((amount, {month, totalAmount}) => {
                    amount[month] = (amount[month] || 0) + totalAmount;
                    return amount;
                }, {})
        ).map(([month, totalAmount]) => ({month, totalAmount}))

        const totalAmountPrevious = Object.entries(
            salesDate
                .filter((item) => item.year === currentYear-1)
                .reduce((amount, {month, totalAmount}) => {
                    amount[month] = (amount[month] || 0) + totalAmount;
                    return amount;
                }, {})
        ).map(([month, totalAmount]) => ({month, totalAmount}))



        return res.status(200).json({
            "status": true,
            "totalCurrentYear": totalAmountCurrent,
            "totalAmountPrevious": totalAmountPrevious
        })
    } catch (error) {

    }
}

export async function totalSoldCategory(req, res) {
    try {
        const sales = await Sales.find();

        const salesProducts = sales.flatMap(product =>
            product.items.map(({ category, quantity, price }) => ({ category, quantity, price }))
        );

        const totalAmountCategory = salesProducts.reduce((amount, { category, price, quantity }) => {
            amount[category] = (amount[category] || 0) + (price * quantity);
            return amount;
        }, {});

        const createArrayCategorys = Object.entries(totalAmountCategory)

        const categorys = createArrayCategorys.map(item => {
            return ({
                category: item[0],
                totalAmount: item[1]
            })

        })

        res.status(200).json({
            "status": true,
            "data": categorys
        })


    } catch (error) {

    }
}

export async function bestSellingProduct(req, res) {
    try {
        const sales = await Sales.find();

        const salesProducts = sales
            .map(product => product.items
                .map(({ productId, quantity }) => ({
                    productId, quantity
                }))).flat()



        const quantityProduct = salesProducts.reduce((amount, { productId, quantity }) => {
            amount[productId] = (amount[productId] || 0) + quantity;
            return amount;
        }, {});

        //method to obtain the maximun number of prodcuts from an array of objects
        const maxQuantity = Math.max(...Object.values(quantityProduct));

        //method to obtain the id of the product or products with the maximun number of sales
        const mostSoldProducts = Object.entries(quantityProduct)
            .filter(([_, quantity]) => quantity === maxQuantity)
            .map(([productId]) => productId);

        const idProduct = mostSoldProducts[0];

        const detailsProduct = await Product.findById(idProduct);

        const totalSold = maxQuantity * detailsProduct.price;

        const bestProduct = ({
            _id: detailsProduct._id,
            name: detailsProduct.name,
            price: detailsProduct.price,
            image: detailsProduct.image,
            type: detailsProduct.type,
            quantity: maxQuantity,
            totalSold: totalSold
        })

        res.status(200).json({
            "status": true,
            "data": bestProduct
        })

    } catch (error) {

    }
}