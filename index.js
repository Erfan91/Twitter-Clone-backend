const express = require('express');
const app = express()
const mongoose = require('mongoose');
const cors = require('cors')

app.use(cors());
app.use(express.urlencoded({extended:true}))
// if you didn't insert you form type data inside form tag in html you need to use this code line below
app.use(express.json())
const port = 3002;
mongoose.connect('mongodb://localhost/twitter_users',()=>{
    console.log('connected successfuly');
},
console.log("couldn't connect to data base")
)
const UserSchema = new mongoose.Schema({
    identifier:String,
    phoneNumber:String,
    dateOfBirth:String,
    password:{type:mongoose.SchemaTypes.ObjectId,ref:'Password'}
})
const PasswordSchema = new mongoose.Schema({
    password:String,
})
const PostSchema = new mongoose.Schema({
    
    body:String,
    likes:[String],
    reply:[String]
})

CommentSchema = new mongoose.Schema({
    ownerID:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User"
    },
    postID:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"Post"
    },
    text:String
})


const PostModel = new mongoose.model('Post', PostSchema)
const UserModel = new mongoose.model('User', UserSchema)
const PassModel = new mongoose.model('Password', PasswordSchema)
app.post('/signup', (req,res,next)=>{
    const body = req.body
    UserModel.insertMany({
        identifier:body.name,
        phoneNumber:body.contactNumber,
        dateOfBirth:body.birthDate
    })
//   UserModel.insertMany({
//       identifier:body.name,
//       phoneNumber:body.contactNumber,
//       dateOfBirth:body.birthDate,
//       password:body.passcode
      
//   })
  console.log(body)
})

app.post('/signup/password',(req,res,next)=>{
    const body = req.body
   
    if(body.password !== body.confirmed){
        res.status(401).json({message:"password didn't matched"})
    }
    res.status(200).json({message:''})
     PassModel.create({
        password:body.password
    })
    console.log(body)

})

app.post('/isUser',(req,res,next)=>{
    const body = req.body
    

        UserModel.findOne({identifier:body.identity})
        .exec()
        .then((result)=>{  
            if(result){
                console.log(result)
                res.status(200).json({exist:true,id:result._id})
            }else{
                res.status(401).json({exist:false})
            }
        })
        // .catch(()=> res.status(401).send('ERROR invalid identifier'))
    
})

app.post('/isCorrect', (req,res,next)=>{
    const body = req.body;
    PassModel.findOne({password:body.passcode})
    .exec()
    .then(result=>{
        console.log(result)
        if(result){
            res.status(200).json({exist:true})
        }else{
            res.status(401).json({exist:false})
        }
    })
})

app.post('/tweeted', (req,res,next)=>{
    const body = req.body;
    console.log(body)
    PostModel.create({
        body:body.body
    }).then(result=>{
        console.log(result)
        res.json({postIdT:result._id})
    })
})

app.listen(port,()=>{
    console.log('listening on port ', port)
})






