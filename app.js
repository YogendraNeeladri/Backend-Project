const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');
const mongoose = require('mongoose');
const Register = require("./src/models/registers");

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

const { connectdb } = require("./src/db/conn");
connectdb();

const port = 4004;

const static_path = path.join(__dirname, "./public");
const template_path = path.join(__dirname, "./templates/views");
const partials_path = path.join(__dirname, "./templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    if (req.session.userEmail) {
        res.render('index', { title: 'Home Page', userEmail: req.session.userEmail });
    } else {
        res.render('index', { title: 'Home Page', userEmail: null });
    }
});

app.get('/index', (req, res) => {
    res.render('index', { title: 'Index Page' });
});

app.get('/home', (req, res) => {
    res.render('home', { title: 'Home Page' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login Page' });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Registration Page' });
});

app.get('/contactUs', (req, res) => {
    res.render('contactUs', { title: 'Contact us Page' });
});

app.post('/register', async (req, res) => {
    try {
        const { username, email, phone, password, confirmpassword } = req.body;
        
        if (!username || !email || !phone || !confirmpassword) {
            return res.status(401).json({
                success: false,
                message: "Please enter all details"
            });
        }

        if (password === confirmpassword) {
            const registerEmployee = await Register.create({
                username,
                email,
                phone,
                password,
                confirmpassword
            });

            req.session.userEmail = req.body.email;
            res.redirect("login")

        } else {
            return res.status(401).send("passwords are not matching");
        }
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Register.findOne({ email, password });
        
        if (user) {
            req.session.userEmail = email;
            res.redirect("home");
            // return res.status(200).json({
            //     success: true,
            //     message: "login sucess"
            // })
        } else {
            return res.status(401).send("Invalid email or password");
        }
    } catch (error) {
        return res.status(400).send("Error logging in: " + error.message);
    }
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
