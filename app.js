const Express = require("express")
const Cors = require("cors")
const Mongoose = require("mongoose")
const Bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("./models/users")

let app = Express()
app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb+srv://jisna19:jisna9947@cluster0.fzxusrj.mongodb.net/blogAppDb?retryWrites=true&w=majority&appName=Cluster0")

//sign in
app.post("/signIn",async(req,res)=>{
    
    let input=req.body
    let result=userModel.find({email:req.body.email}).then(
    (items)=>{
        if (items.length>0) {

            const passwordValidation=Bcrypt.compareSync(req.body.password,items[0].password)
            if (passwordValidation) {

                jwt.sign({email:req.body.email},"blogApp",{exporesIn:"1d"},
                    (error,token)=>{
                        if (error) {
                            res.json({"status":"error","errorMessage":error})
                        } else {
                            res.json({"status":"success","token":token,"userId":items[0]._id})
                    }
            })
                
            } else {

                res.json({"status":"Incorrect Password"})
                
            }
            
        } else {
            res.json({"status":"Invalid email id"})
        }
    }
    ).catch()


})


//sign up
app.post("/signup", async (req, res) => {
    let input = req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword

    userModel.find({ email: req.body.email }).then(
        (items) => {

            if (items.length > 0) {

                res.json({ "status": "email id already exist" })

            } else {

                let result = new userModel(input)
                result.save()
                res.json({ "status": "success" })

            }
        }
    ).catch(
        (error) => {}
    )





})


app.listen(3000, () => {
    console.log("Server started")
})