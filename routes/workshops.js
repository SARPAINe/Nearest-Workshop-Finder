const express=require('express');
const router=express.Router();
const {body,validationResult}=require('express-validator');

const Workshop=require('../models/workshop');
var auth=require('../config/auth');
var isUser=auth.isUser;
var isAdmin=auth.isAdmin;

///get all workshop
router.get('/',isAdmin,async (req,res)=>{
  let count;
  count = await Workshop.countDocuments((err,c)=>{
    count=c;
    console.log('inside '+count);
  });
  Workshop.find((err,workshops)=>{
    console.log('outside '+count);
    res.render('admin/workshops',{
      count:count,
      workshops:workshops
    }); 
  });
});

//get add workshop
router.get('/add-workshop',isAdmin,(req,res)=>{
  let workshopName="";
  let contact="";
  let lat="";
  let long="";
  res.render('admin/add_workshop',{
    workshopName:workshopName,
    contact:contact,
    lat:lat,
    long:long
  });
})


//post add workshop
router.post('/add-workshop',[
  body('workshopName','WorkShop name is required').notEmpty(),
  body('contact','Contact Number is required').notEmpty(),
  body('lat','Latitude is require').notEmpty(),
  body('lat','Latitude must be decimal number').isDecimal(),
  body('long','Longitude is required').notEmpty(),
  body('long','Longitude must be decimal number').isDecimal()
],(req,res)=>{
  var errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.render('admin/add_workshop',{
      workshopName:workshopName,
      contact:contact,
      lat:lat,
      long:long,
      errors:errors.errors
    });
  }
  else{
    var workshopName=req.body.workshopName;
    var contact=req.body.contact;
    var lat=req.body.lat;
    var long=req.body.long;
    const workshop=new Workshop({
    workshopName:workshopName,
    contact:contact,
    lat:lat,
    long:long
  })

  workshop.save(err=>{
    if(err)
    console.log(err);
  })
  req.flash("success","Workshop added!")
  res.redirect('/admin/workshops');

  }

})

//get edit workshop
router.get('/edit-workshop/:id',isAdmin,async (req,res,next)=>{
  let workshop;
  try{
    workshop=await Workshop.findById(req.params.id);
  }catch(error)
  {
    console.log(err);
  }
  res.render('admin/edit_workshop',{
    workshopName:workshop.workshopName,
    contact:workshop.contact,
    lat:workshop.lat,
    long:workshop.long,
    id:req.params.id
  });
});

//post edit workshop

router.post('/edit-workshop/:id',[
  body('workshopName','WorkShop name is required').notEmpty(),
  body('contact','Contact Number is required').notEmpty(),
  body('lat','Latitude is require').notEmpty(),
  body('lat','Latitude must be decimal number').isDecimal(),
  body('long','Longitude is required').notEmpty(),
  body('long','Longitude must be decimal number').isDecimal()
],async (req,res)=>{
  console.log(req.body);
  var errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.render('admin/edit_workshop',{
      workshopName:req.body.workshopName,
      contact:req.body.contact,
      lat:req.body.lat,
      long:req.body.long,
      id:req.params.id,
      errors:errors.errors
    });
  }
  else
  {
    console.log(req.params.id);
    let workshop;
    try{
      workshop=await Workshop.findById(req.params.id);
    }catch(error)
    {
      console.log(error);
    }
    workshop.workshopName=req.body.workshopName;
    workshop.contact=req.body.contact;
    workshop.lat=req.body.lat;
    workshop.long=req.body.long;
    workshop.save(err=>{
      if(err)
      console.log(err);
    })
    req.flash("success","Workshop edited!")
    res.redirect('/admin/workshops');
  }
});
// get delete workshop
router.get('/delete-workshop/:id',isAdmin,(req,res,next)=>{
  console.log(req.params.id);
  let id=req.params.id;
  Workshop.findByIdAndRemove(id,err=>{
        if(err)
        {
          console.log(err);
        }
        
      });
  req.flash('success','Workshop deleted!');
  res.redirect("/admin/workshops");
})

module.exports=router;