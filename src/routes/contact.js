const express=require('express');
const router=express.Router();
const sql=require('../db');

router.post('/',async(req,res,next)=>{
 try {
   const {name,email,subject,message}=req.body;
   const result=await sql`INSERT INTO contact_messages(name,email,subject,message)
     VALUES(${name},${email},${subject},${message}) RETURNING *`;
   res.json({success:true,contact:result[0]});
 } catch (err) {
   next(err);
 }
});

module.exports=router;
