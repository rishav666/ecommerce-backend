const mongoose = require('mongoose');
const ProductSchema=new mongoose.Schema({
  productName:{
    type:String,
    required:true
  },
  productPrice:{
    type:Number,
    required:true
  },
  productTitle:{
    type:String,
    required:true
  },
  productCount:{
    type:Number,
    required:true,
    default:0
  },
  imageUrl:{
    type:String,
    required:true
  },
  productCatagory:{
    type:String
  }
})
module.exports=mongoose.model('Product',ProductSchema);
