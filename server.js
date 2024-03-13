const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const hbs = require('hbs');
const userRoutes = require('./routes/userRoutes');
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




// Handle GET request to the root route (index page)
app.get('/', (req, res) => {
  if (req.session.authenticated) {
    // res.redirect('/home');
    res.status(200).json(req.session)
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




app.post('/reservation', (req, res) => {

    res.render('reserve/reservation', { title: 'Labyrinth - Reservation Page' });

    //const username = req.session.username || 'Guest'; // Default to 'Guest' if not found

    // Retrieve user as an object 
    //const user = users.find(user => user.username === username); // Like this muna since wala pang db : )


    //res.render('reserve/reservation', 
       // {
          //  title: 'Reservation Page', 
            //username: username,
           // user: user // Rendering user para sa description DONT CHANGE PLS TY IM BEGIGNG YOU 
        
       // });
});

// Handle GET request to the /profile route
//for viewing to b editted pa hehe
app.get('/profile', (req, res) => {
    // Retrieve the username from the session or query parameter
    //const username = req.session.username || 'Guest'; // Default to 'Guest' if not found

    // Retrieve user as an object 
    //const user = users.find(user => user.username === username); // Like this muna since wala pang db : )


    res.render('profile_edit', 
        {
            title: 'Labyrinth - Profile Page', 
            //username: username,
            //user: user // Rendering user para sa description DONT CHANGE PLS TY IM BEGIGNG YOU 
        
        }    
    );

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

app.get('/reserve', (req, res) => {
    // Retrieve the username from the session or query parameter
    //const username = req.session.username || 'Guest'; // Default to 'Guest' if not found
    //const user = users.find(user => user.username === username); // Like this muna since wala pang db : )

    res.render('reservations_current', 
         {
             title: 'Labyrinth - Current Reservations Page', 
             //username: username, 
             //user: user // Rendering user para sa description DONT CHANGE PLS TY IM BEGIGNG YOU 

        
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
})