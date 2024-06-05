import Poycot from "../models/poycot.js";
import {v2 as cloudinary} from 'cloudinary';

const getPoycot = async (req , res) => {
  const productId = req.params.id;

  try {
    const poycot = await Poycot.findById(productId);
    res.status(200).json({poycot});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}
const getPoycots = async (req , res) => {
  try {
    const poycot = await Poycot.find();
    res.status(200).json(poycot);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}

const createPoycot = async (req, res) => {
  const { name, img } = req.body;

  if (!name || !img) {
    return res.status(400).json({ error: "Name and image are required" });
  }

  try {

    const uploadResponse = await cloudinary.uploader.upload(img);
    const imageUrl = uploadResponse.secure_url;


    const newProduct = new Poycot({
      name: name,
      img: imageUrl
    });


    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);

  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in createProduct: ", err);
  }
};


const updatePoycot = async (req, res) => {
  const { name } = req.body;
  let { img } = req.body;
  const productId = req.params.id;


  try {
    let product = await Poycot.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product Not Found" });
    }

    if (img) {
      if (product.img) {
        await cloudinary.uploader.destroy(product.img.split("/").pop().split(".")[0]);
      }
      const uploadResponse = await cloudinary.uploader.upload(img);
      img = uploadResponse.secure_url;
    }

    product.name = name || product.name;
    product.img = img || product.img;

    product = await product.save();

    res.status(200).json(product);

  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updateProduct: ", err);
  }
};

const deletePoycot = async (req , res) => {
  try {
    const poycot = await Poycot.findById(req.params.id);
    if(!poycot){
      return res.status(404).json({error:"poycot not found"});
    }
    await Poycot.findByIdAndDelete(poycot);

    res.status(200).json({success: "deleted poycot"});
    
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}



export {
  getPoycot,
  getPoycots,
  createPoycot,
  updatePoycot,
  deletePoycot
}