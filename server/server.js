//create server
const express = require('express');
const app = express();
app.use(express.json())
const _PORT = 3001;
const cors = require('cors');
app.use(cors())
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// connect to DB
const username ="aabusamra", 
      password = process.env.PASSWORD,
      database = "mernproject";

const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.e1jjoin.mongodb.net/${database}?retryWrites=true&w=majority`)


// Import user model
const UserModel = require('./models/Users')


// get request
app.get('/users', async(req, res) => {
    const users =await UserModel.find();
    res.json(users)
})

// create user
app.post('/createUser',async(req,res) => {
     const newUser = new UserModel(req.body)
     await newUser.save();
    res.json(req.body)
})


//Admin Model
const AdminModel = require('./models/admins');
app.post("/register",async(req,res) => {
    const {username,password} = req.body
    const admin =await AdminModel.findOne({username})

    admin && res.json({message: "user already exists!"})   // if condition
    
    const hashedPassword = bcrypt.hashSync(password, 10)

    const newAdmin = new AdminModel({username, password : hashedPassword
    });
    await newAdmin.save();
    return res.json({message: "Admin created successfully!"})
});

app.post("/login", async(req,res) => {
    const {username ,password} = req.body
    // username check
    const admin = await AdminModel.findOne({username})
    !admin && res.json({message: "Admin doesn't exist!"})
    // password check
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    !isPasswordValid && res.json({message: "Username or Password is not correct"})

    const token = jwt.sign({id: admin._id}, process.env.SECRET)
    return res.json({token, adminID: admin._id})
})




app.listen(_PORT, () => console.log("DONE!! Server Works"));