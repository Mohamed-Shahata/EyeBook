import mongoose from "mongoose";

const poycotSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  img:{
    type: String,
    required: true,
    default: ""
  },

},{
  timestamps: true,
})

const Poycot = mongoose.model("Poycot" , poycotSchema);

export default Poycot;