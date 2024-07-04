const express = require("express");
const db = require('./db'); 

const app = express(); 

app.use(express.json()); 

//permite agregar un producto 
app.post('/products', (req,res) =>{
let {name, quantity, price} = req.body; 

price = parseFloat(price); 
quantity = parseInt(quantity); 

if(isNaN(quantity) || quantity <= 0){
    return res.status(400).json({error: 'La cantidad debe ser un número positivo'});
}
if(isNaN(price) || price <= 0){
    return res.status(400).json({error: 'El precio debe ser un número positivo'});
}

if (typeof name!= "string" || typeof quantity != "number" || typeof price != "number"){
    return res.send('dato incorrecto')}

if(!name ||!quantity ||!price){
    return res.status(400).json({error: 'Todos los campos son obligatorios'});
}
const productoExist= db.find( producto => producto.name === name); 

if(productoExist){
    return res.status(400).json({error: 'El producto ya existe'});
}

const id= new Date().getTime();
const newProducto = {id: id, name: name, price: price, quantity: quantity};
db.push(newProducto);
res.send('se ha creado un nuevo producto'); 

})

//obtener todos los productos
app.get('/products', (req,res) => {
res.json(db);

})

//devuelve el producto por su id 
app.get('/products/:id', (req,res) => {
    const {id} = req.params; 
    const producto = db.find( producto => producto.id === parseInt(id));
    if(!producto){
        return res.status(404).json({error: 'Producto no encontrado'});
    }
    res.json(producto)
})

//actualiza un producto por su id
app.put('/products/:id', (req,res) => {
    const {id} = req.params; 
    const producto = db.find( producto => producto.id ===  parseInt(id));
    if(!producto){
        return res.status(404).json({error: 'Producto no encontrado'});
    }
    let {name,quantity,price} = req.body; 
    price = parseFloat(price);
    quantity= parseInt(quantity);

    if(isNaN(quantity) || quantity <= 0){
        return res.status(400).json({error: 'La cantidad debe ser un número positivo'});
    }
    if(isNaN(price) || price <= 0){
        return res.status(400).json({error: 'El precio debe ser un número positivo'});
    }
    if (typeof name!= "string" || typeof quantity != "number" || typeof price != "number"){
        return res.send('dato incorrecto')}
        
    if(!name ||!quantity ||!price)
        return res.status(400).json({error: 'Todos los campos son obligatorios'});

    producto.name= name; 
    producto.price= price;
    producto.quantity= quantity;

    res.send('se ha modificado e prodcuto')

})

//Eliminar un prodcuto por su id
app.delete('/products/:id', (req,res) => {
    const {id} = req.params; 
    const producto = db.find(producto => producto.id === parseInt(id));
    if(!producto){
        return res.status(404).json({error: 'Producto no encontrado'});
    }
    const producIndex= db.findIndex( prodcuto => producto.id === prodcuto.id);
    db.splice(producIndex, 1);
    res.send('se ha eliminado el prodcuto')

} )



app.listen(3000, (req, res)=> console.log('servidor corriendo en el puerto 3000'))