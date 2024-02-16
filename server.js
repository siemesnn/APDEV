const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const databasejson = require('./test/users.json')
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 8080;

// Parse json test data
const users = Object.values(databasejson.users);


// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API Endpoints
app.use('/api/users', userRoutes);  

// Set up session middleware
app.use(session({
    secret: 'apdev123',
    resave: false,
    saveUninitialized: true
}));

// Set the view engine and path folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));


// Handle GET request to the root route (index page)
app.get('/', (req, res) => {
    const session = req.session;
    if (session.isLogged) {
        res.redirect('/home');
    } else {
        res.render('index', { title: 'Labyrinth - Login Page' });
    }
});


//Handle GET request to the /register router (register-account)
app.get('/register', (req, res) => {
    res.render('register-account', { title: 'Labyrinth - Register Account' });
});



// Handle post request to the /home route
app.get('/home', (req, res) => {
    // Retrieve the username from the session or query parameter
    const username = req.query.username;

    // Save the username to the session
    req.session.username = username;
    req.isAuthenticated = true;

    res.render('selectlabs', { title: 'Labyrinth - Home Page', username: username });
});

// Handle GET request to the /profile route
app.get('/profile', (req, res) => {
    // Retrieve the username from the session or query parameter
    const username = req.session.username || 'Guest'; // Default to 'Guest' if not found
    const description = req.session.description;
    console.log('Description in session:', description); // Add this line for debugging

    res.render('editprofile', {
        title: 'Profile Page',
        username: username,
        description: description
    });
});
// Handle GET request to the /profile route
app.get('/viewprofile', (req, res) => {
    // Retrieve the username from the session or query parameter
    const username = req.session.username || 'Guest'; // Default to 'Guest' if not found
    const description = req.session.description;
    console.log('Description in session:', description); // Add this line for debugging

    res.render('viewprofile', {
        title: 'Profile Page',
        username: username,
        description: description
    });
});



// Handle GET request to the /reserve route
app.get('/reserve', (req, res) => {
    // Retrieve the username from the session or query parameter
    const username = req.session.username || 'Guest'; // Default to 'Guest' if not found

    res.render('currentreservations', 
         {
             title: 'Profile Page', 
             username: username, 
        
         }    
     )
});

// Handle GET request to the /profile route
app.get('/edittprofile', (req, res) => {
    // Retrieve the username from the session or query parameter
    const username = req.session.username || 'Guest'; // Default to 'Guest' if not found
    const description = req.session.description;
    console.log('Description: ', description);

    res.render('edittingprofile', 
         {
             title: 'Profile Page', 
             username: username, 
             description: description //doesnt work yet
        
         }    
     );

    //res.send(
    //    {
    //        title: 'Profile Page', 
    //        username: username 
     //   }
   // );
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