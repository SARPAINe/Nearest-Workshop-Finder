const express=require('express');
const router=express.Router();
const Workshop=require('../models/workshop');

router.get('/',(req,res)=>{
  console.log(req.user.username);
  if(req.isAuthenticated())
  {
    res.render('index',{
      title:"Home Page",
      content:"<h1>Here is your location!<h1>"
    });

  }
  else{
    res.render("register",{
      title:"Register"
    });
  }
})

router.get('/api/v1/sarpaine',(req,res)=>{
  Workshop.find((err,workshops)=>{
    res.send(workshops);
  });
})

module.exports=router;