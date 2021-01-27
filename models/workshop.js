const mongoose=require('mongoose');

const WorkshopSchema = new mongoose.Schema({
  workshopName:{
    type:String,
    required:true
  },
  contact:{
    type:String,
    required:true
  },
  lat:{
    type:Number,
    required:true
  },
  long:{
    type:Number,
    required:true
  }
});

module.exports=mongoose.model('Workshop',WorkshopSchema);