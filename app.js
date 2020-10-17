var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expreeSanitizer = require("express-sanitizer"),
    app = express();

app.use(bodyParser.urlencoded({
        extended: true
     }));
     
app.use(bodyParser.json());

app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expreeSanitizer());
app.set("view engine","ejs");
mongoose.set('useFindAndModify', false);

// MONGODB CONFIG
mongoose.connect("mongodb://localhost/blog_app",{
     useNewUrlParser: true,
     useUnifiedTopology: true 
});

// SETTING UP SCHEMA
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// RESTFUL ROUTES
app.get("/",(req,res)=>{
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs",(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});
// NEW ROUTE
app.get("/blogs/new",(req,res)=>{
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs",(req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,(err,newblog)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
        
    });
});

// SHOW ROUTE
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog});
        }
    });
   
});

// EDIT ROUTE
app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            console.log(err);
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
    
});

// UPDATE ROUTE
app.put("/blogs/:id",(req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id",(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
});



app.listen('3000',()=>{
   console.log("server is running...")
});




