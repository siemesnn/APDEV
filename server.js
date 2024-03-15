const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const hbs = require('hbs');
const userRoutes = require('./routes/userRoutes');
const labroutes = require('./routes/labRoutes');
const { client, connectToMongoDB, DB_NAME } = require('./model/database.js');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
//fixing css
app.use(express.static('public'));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));


// Connect to MongoDB
connectToMongoDB();

// Use body-parser middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
      secret: 'apdev123',
      resave: false,
      saveUninitialized: true,
    })
);

// API Endpoints
app.use('/api/users', userRoutes);
app.use('/api/labs', labroutes);
// app.use('/api/reservations', reservationRoutes);





// Handle GET request to the root route (index page)
app.get('/', (req, res) => {
  if (req.session.authenticated) {
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
// Update your /home route handler
app.get('/home', (req, res) => {
    if (req.session.authenticated) {
        res.render('homepage', { title: 'Labyrinth - Home Page', username: req.session.username });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});







// Handle GET request to the /profile route
//for viewing to b editted pa hehe
app.get('/profile', async (req, res) => {
    try {
        const username = req.session.username; 
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const user = await users.findOne({ username });

        if (user) {
            res.render('profile_edit', {
                title: 'Labyrinth - Profile Page',
                user: user // Pass the user object to the template
            });
        } else {
            // Handle case where user is not found (optional)
            res.status(404).render('error', { message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Internal server error' });
    }
});



//for viewing commented out const etc.
app.get('/edittprofile', (req, res) => {
    // Retrieve the username from the session or query parameter
    //const username = req.session.username || 'Guest'; // Default to 'Guest' if not found

    // Retrieve user as an object 
    //const user = users.find(user => user.username === username); // Like this muna since wala pang db : )


    res.render('profile_editting_page', 
        {
            title: 'Labyrinth - Edit Profile Page', 
            //username: username,
            //user: user // Rendering user para sa description DONT CHANGE PLS TY IM BEGIGNG YOU 
        
        }    
    );
});


// Handle GET request to the /profile route
//for viewing commented out const etc.
app.get('/viewprofile', (req, res) => {
    // Retrieve the username from the session or query parameter
    //const username = req.session.username || 'Guest'; // Default to 'Guest' if not found

    // Retrieve user as an object 
    //const user = users.find(user => user.username === username); // Like this muna since wala pang db : )


    res.render('profile_view', {
        title: 'Labyrinth - View Profile Page', 
        //username: username,
       // user: user // Rendering user para sa description DONT CHANGE PLS TY IM BEGIGNG YOU 
    
    });
});


// Handle GET request to the /reserve route
//for viewing commented out const etc.

app.post('/reservation/:labId', (req, res) => {
    if (req.session.authenticated) {
        const selectedLab = req.params.labId; // Access lab ID from route parameters
        res.render('reserve/reservation', { title: 'Reserve a Seat', username: req.session.username, labId: selectedLab });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});


//Handle GET request to the /resconfirmation route
app.get('/resconfirmation', (req, res) => {
    if (req.session.authenticated) {
        const selectedLab = req.params.labId; // Access lab ID from route parameters
        res.render('reserve/resconfirmation', { title: 'Reserve a Seat', username: req.session.username, labId: selectedLab });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Listening to the server on http://localhost:${port}`);
})