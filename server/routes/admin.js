import  express  from "express";
import Post from '../models/Post.js';
import User from '../models/User.js';
const routers = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';




const adminLayout = '../views/layout/admin';
const jwtSecret =  'my blog';



/* 
    Check login
*/

const authMiddleware = (req,res,next) =>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: 'Unauthorised'});

    }

    try {
        const decoded = jwt.verify(token,jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({message: 'Unauthorized'});
    }
}


// GET 
// Admin - Login Page 


routers.get('/admin', async(req,res)=>{
    try {

        const locals ={
            title: 'Blog 1',
            description: 'First blog wrritten by me.'
        }
        
        res.render('admin/index',{locals, layout: adminLayout});

    } catch (error) {
        console.log(error);
    }
});




/*
    POST
    Admin - Check Login

*/


routers.post('/admin', async(req,res)=>{
    try {

        const {username, password } = req.body;

        const user = await User.findOne({username});

        if(!user){
            return res.status(401).json({message: 'Invalid Credentials'});
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid ){
            return res.status(401).json({message: 'Invalid Credentials'});
        }
        
        const token = jwt.sign({ userId: user._id}, jwtSecret);
        res.cookie('token',token,{httpOnly: true});

        res.redirect('/dashboard');
        
    } catch (error) {
        console.log(error);
    }
});






/* 

    GET
    Admin Dashboard

*/

routers.get('/dashboard', authMiddleware, async(req,res)=>{

    try {
        
        const locals ={
            title: 'Dashboard',
            description: 'First blog wrritten by me.'
        }

        const data = await Post.find();
        res.render('admin/dashboard',{
            locals,
            data,
            layout: adminLayout
        })
    } catch (error) {
        console.log(error);
    }

});


/* 
    GET
    Admin - Create New Post
*/

routers.get('/add-post', authMiddleware, async(req,res)=>{

    try {
        
        const locals ={
            title: 'Add Post',
            description: 'First blog wrritten by me.'
        }

        const data = await Post.find();
        res.render('admin/add-post',{
            locals,
            layout: adminLayout
        })
    } catch (error) {
        console.log(error);
    }

});

/* 
    POST
    Admin - Create New Post
*/

routers.post('/add-post', authMiddleware, async(req,res)=>{

    try {
        
        console.log(req.body);

        try {
            
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });

            await Post.create(newPost);
            res.redirect('/dashboard');

        } catch (error) {
            console.log(error);
        }
        

    } catch (error) {
        console.log(error);
    }

});




/* 
    GET
    Admin - Edit Post
*/

routers.get('/edit-post/:id', authMiddleware, async(req,res)=>{

    try {
        
        const locals ={
            title: 'Edit Post',
            description: 'First blog wrritten by me.'
        }

        const data = await Post.findOne({_id: req.params.id});
        res.render('admin/edit-post',{
            locals,
            data,
            layout: adminLayout
        })

    } catch (error) {
        console.log(error);
    }

});


/* 
    PUT
    Admin - Edit Post
*/

routers.put('/edit-post/:id', authMiddleware, async(req,res)=>{

    try {
        
        await Post.findByIdAndUpdate(req.params.id,{
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);

    } catch (error) {
        console.log(error);
    }

});





/*
    Delete
    Admin - Delete Post 
*/

routers.delete('/delete-post/:id', authMiddleware, async(req,res)=>{

    try {
        await Post.deleteOne({_id: req.params.id});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }

});



    // routers.post('/admin', async(req,res)=>{
    // try {

    //     const {username, password } = req.body;
        
    //     if(req.body.username === 'admin' && req.body.password === 'password'){
    //         res.send('You are logged in.')
    //     }else{
    //         res.send('Wrong username or password');
    //     }
    // } catch (error) {
    //     console.log(error);
    // }
    // });





/*
    POST
    Admin - Register

*/


routers.post('/register', async(req,res)=>{
    try {

        const {username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        
        try {
            
           const user = await User.create({ username, password:hashedPassword });    
           res.status(201).json({message: 'User Created', user});

        } catch (error) {
            if(error.code === 11000){
                res.status(409).json({message: 'User already in use'});
            }

            res.status(500).json({message: 'Internal server error'});
            
        }


    } catch (error) {
        console.log(error);
    }


});



/* 
    GET
    Admin Logout
*/

routers.get('/logout', (req,res)=>{
    res.clearCookie('token');
    res.redirect('/');    
});





export default routers;
