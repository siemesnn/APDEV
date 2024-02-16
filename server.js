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

app.post('/reservation', (req, res) => {
    const username = req.session.username || 'Guest'; // Default to 'Guest' if not found

    // Retrieve user as an object 
    const user = users.find(user => user.username === username); // Like this muna since wala pang db : )


    res.render('reserve/reservation', 
        {
            title: 'Reservation Page', 
            username: username,
            user: user // Rendering user para sa description DONT CHANGE PLS TY IM BEGIGNG YOU 
        
        });
});

// Handle GET request to the /profile route
app.get('/profile', (req, res) => {
    // Retrieve the username from the session or query parameter
    const username = req.session.username || 'Guest'; // Default to 'Guest' if not found
    const description = req.session.description;
    console.log('Description in session:', description); // Add this line for debugging

    // Retrieve user as an object 
    const user = users.find(user => user.username === username); // Like this muna since wala pang db : )


    res.render('editprofile', 
        {
            title: 'Labyrinth - Profile Page', 
            username: username,
            user: user // Rendering user para sa description DONT CHANGE PLS TY IM BEGIGNG YOU 
        
        }    
    );

});

app.get('/edittprofile', (req, res) => {
    // Retrieve the username from the session or query parameter
    const username = req.session.username || 'Guest'; // Default to 'Guest' if not found

    // Retrieve user as an object 
    const user = users.find(user => user.username === username); // Like this muna since wala pang db : )


    res.render('edittingprofile', 
        {
            title: 'Labyrinth - Edit Profile Page', 
            username: username,
            user: user // Rendering user para sa description DONT CHANGE PLS TY IM BEGIGNG YOU 
        
        }    
    );
});


// Handle GET request to the /profile route
app.get('/viewprofile', (req, res) => {
    // Retrieve the username from the session or query parameter
    const username = req.session.username || 'Guest'; // Default to 'Guest' if not found

    // Retrieve user as an object 
    const user = users.find(user => user.username === username); // Like this muna since wala pang db : )


    res.render('viewprofile', {
        title: 'Labyrinth - View Profile Page', 
        username: username,
        user: user // Rendering user para sa description DONT CHANGE PLS TY IM BEGIGNG YOU 
    
    });
});


// Handle GET request to the /reserve route
app.get('/reserve', (req, res) => {
    // Retrieve the username from the session or query parameter
    const username = req.session.username || 'Guest'; // Default to 'Guest' if not found
    const user = users.find(user => user.username === username); // Like this muna since wala pang db : )

    res.render('currentreservations', 
         {
             title: 'Labyrinth - Current Reservations Page', 
             username: username, 
             user: user // Rendering user para sa description DONT CHANGE PLS TY IM BEGIGNG YOU 

        
         }    
     )
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