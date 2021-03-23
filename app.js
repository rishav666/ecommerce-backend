const express = require('express');
const mongoose = require('mongoose');
const stripe = require("stripe")("sk_test_51IRToJDwtyBH8m2hs27m3oTjSLrJQmUcZ01SKWZKJfRkCgc5Oi8hYRdCeNleJanKrblYrt5EemWzBKYQ7BznwFzM006YHH6D94");
// add the key
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const cors = require('cors');
const app=express();
const PORT=process.env.port||3002;
const Product = require('./Schema/Product');
const path = require('path');




app.use(bodyParser.json({limit:'30mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}));
app.use(cors())
//mongodb connect

const DATABASE="mongodb+srv://rishav:12345@ecommerce.m5dor.mongodb.net/ecommerce?retryWrites=true&w=majority"
mongoose.connect(DATABASE,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
  console.log("mongoose connected");
})
.catch(()=>{
    console.log("error while connecting mongoose");
})


app.get('/',(req,res)=>{
  res.send("i am working in appjs")
  console.log("hii in get in appjs");
})
app.post('/postproduct',(req,res)=>{
  res.send("its saving")
  var {productName,productPrice,productTitle,productCount,imageUrl,productCatagory}=req.body

const newProduct=new Product({
  productName,
  productPrice,
  productTitle,
  productCount,
  imageUrl,
  productCatagory
})

newProduct.save(function(err){
  if(err){
    console.log("error while saving a object");
  }
  else{
    console.log("sa ved a object");
  }

});


})

app.get('/getdata',async(req,res)=>{
  try{
    const product=await Product.find();

    res.status(200).json(product)
  }
  catch(error){
    console.log("error while retriving data");
  }
})


app.get('/getdataid/:id',async(req,res)=>{
  const {id} =req.params


  try{
    const product=await Product.findById(id);

    res.status(200).json(product)
  }
  catch(error){
    console.log("error while retriving data in id");
  }
})




app.post("/payment",(req,res)=>{
  const {product,token}=req.body;
  console.log("make payment bro");
  console.log("product",product);

  const idempontencyKey=uuidv4();
  return stripe.customers
  .create({
    email:token.email,
    source:token.id
  })
  .then(customer=>{
    stripe.charge.create(
      {
        amount:product.price*100,
        currency:"usd",
        customer:customer.id,
        receipt_email:token.email,
        description:product.name,
        shipping:{
          name:token.card.name,
          address:{
            country:token.card.address_country
          }
        }
      },
      {idempontencyKey}
    );
  })
  .then(result=>res.status(200).json(result))
  .catch(err=>console.log(err));
});

app.listen(PORT,()=>{
  console.log("up at 3002 in appjs");
})
