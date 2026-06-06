require('dotenv').config();
const express=require('express');
const cors=require('cors');
const rateLimit=require('express-rate-limit');
const appointmentRoutes=require('./routes/appointments');
const contactRoutes=require('./routes/contact');

const app=express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(cors({origin:process.env.FRONTEND_URL}));
app.use(rateLimit({windowMs:15*60*1000,max:100}));

app.get('/',(req,res)=>res.json({success:true,message:'Clinic API Running'}));
app.use('/api/appointments',appointmentRoutes);
app.use('/api/contact',contactRoutes);

app.use((err,req,res,next)=>{
 console.error(err);
 res.status(500).json({success:false,error: err.message || 'Server error'});
});

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>console.log(`Server running on ${PORT}`));
