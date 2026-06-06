const express=require('express');
const router=express.Router();
const { body, validationResult } = require('express-validator');
const sql=require('../db');
const {sendClinicNotification,sendPatientEmail}=require('../services/email');

router.post('/',[body('name').notEmpty(),body('phone').notEmpty()],async(req,res,next)=>{
 try {
   const errors=validationResult(req);
   if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()});
   const {name,email,phone,message}=req.body;
   const result=await sql`INSERT INTO appointments(name,email,phone,message)
     VALUES(${name},${email},${phone},${message}) RETURNING *`;
   await sendClinicNotification('New Appointment',`<p>${name}</p>`);
   if(email) await sendPatientEmail(email,name);
   res.json({success:true,appointment:result[0]});
 } catch (err) {
   next(err);
 }
});

module.exports=router;
