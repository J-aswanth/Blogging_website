// require('dotenv').config();

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import expressEjsLayouts from "express-ejs-layouts";

import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";

import router from './server/routes/main.js';
import connectDB from './server/config/db.js';
import routers from './server/routes/admin.js';
import isActiveRoute from "./server/helpers/routeHelpers.js";





const app = express();
const PORT = 8000 ||  process.env.PORT;

// Invoke connectDB function
connectDB();


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cookieParser());

app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    }),
    
//cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 

}));



app.use(express.static('public'));

app.use(expressEjsLayouts);
app.set('layout','./layout/main');
app.set('view engine','ejs');


app.locals.isActiveRoute = isActiveRoute;

app.use('/',router);
app.use('/',routers);




app.listen(PORT,()=>{
    console.log('App lisssssssss');
})
