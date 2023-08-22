const path = require('path');
const fs = require('fs');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
  );

module.exports = class Cart {
    static addProduct(id, productPrice){
        //fetch precious cart
        //analyse cart, find existing product
        //add new product/increase quantity
        fs.readFile(p, (err, fileContent) => {
            let cart = { products:[] , totalPrice:0 }
            if(!err){
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex((product) => product.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            }else{
                updatedProduct = { id:id, qty:1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice; //adding one more plus infront of productPrice converts it to a number.
            fs.writeFile(p, JSON.stringify(cart), err=>{
                console.log(err);
            })   
        })
    }
}