const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Set the view engine and path folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Handle GET request to the root route (index page)
app.get('/', (req, res) => {
    res.render('index', { title: 'Login Page' });
});

// Handle POST request when the login form is submitted
app.post('/home', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log('Username:', username);

    // Assume all logins are valid for testing/development
    // For production, replace this with your actual authentication logic
    const isAuthenticated = true;

    if (isAuthenticated) {
        // Store the authenticated username in the session
        req.session.username = username;

        // Redirect to the homepage or render the homepage view
        res.redirect(`/home?username=${username}`);
    } else {
        // Authentication failed, you can redirect back to the login page or handle accordingly
        res.redirect('/');
    }
});

// Handle GET request to the /home route
app.get('/home', (req, res) => {
    // Retrieve the username from the session or query parameter
    const username = req.session.username || req.query.username || 'Guest'; // Default to 'Guest' if not found

    res.render('reserve/reservation', { title: 'Home Page', username: username });
});

// Handle GET request to the /profile route
app.get('/profile', (req, res) => {
    // Retrieve the username from the session or query parameter
    const username = req.session.username || req.query.username || 'Guest'; // Default to 'Guest' if not found

    res.render('editprofile', { title: 'Profile Page', username: username });
});

//Handle GET request to the /resconfirmation route
app.get('/resconfirmation', (req, res) => {
    // Retrieve the username from the session or query parameter
    const username = req.session.username || req.query.username || 'Guest'; // Default to 'Guest' if not found

    res.render('reserve/resconfirmation', { title: 'Reservation Confirmation', username: username });
});

app.post('/resconfirmation', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log('Username:', username);

    // Perform authentication logic here

    // Redirect to the homepage or render the homepage view
    res.render('reserve/resconfirmation', { title: 'Reservation Confirmation', username: username });
});

// Start the server
app.listen(port, () => {
    console.log(`Listening to the server on http://localhost:${port}`);
});

















// const express = require('express');
// const path = require('path'); 
// const app= express();
// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: true }));
// const port=process.env.PORT||3000;

// //home route

// app.set('view engine', 'ejs');

// //set path folder
// app.use(express.static('public'));

// app.set('views', path.join(__dirname, 'views'));


// app.get('/', (req, res) => {
//     res.render('index', {title: 'Login Page'});
// })

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + 'js/index.html'); remove this maybe 
// });
// app.post('/home', (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     console.log('Username:', username); this one also 

//     // Perform authentication logic here

//     // Redirect to the homepage or render the homepage view
//     res.render('reserve/homepage', { title: 'Home Page', username: username }); remove this line
// });



// app.get('/home', (req,res) => {
//     res.render('reserve/homepage', {title: 'Home Page'});
// });

// app.listen(port, () => {console.log("Listening to the server on http://localhost:3000")});