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





// For handlebars 
hbs.registerHelper('getReservationDate', function(reservations, desiredDate) {
    for (let i = 0; i < reservations.length; i++) {
        const reservation = reservations[i];
        if (reservation.date === desiredDate) {
            return true;
        }
    }
    return false;
});

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
            if (user.role == 'student'){
                const reservation = db.collection('reservation');
                const Reservation = await reservation.find({ reserved_by: user.username }).toArray();


                console.log("User Reservations:", Reservation); // Log the reservations to the console

                res.render('profile_edit', {
                    title: 'Labyrinth - Profile Page', 
                    user: user, // Pass the user object to the template
                    Reservation: Reservation 
                });


            } else{
                
                    //const reservation = db.collection('reservation');
                    //const Reservation = await reservation.find({ reserved_by: user.username }).toArray();
    
    
                    //console.log("User Reservations:", Reservation); // Log the reservations to the console
    
                    res.render('admin_profile_edit', {
                        title: 'Labyrinth - Profile Page', 
                        user: user, // Pass the user object to the template
                        //Reservation: Reservation 
                    });

            }
            
            
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
app.get('/edittprofile', async (req, res) => {
    try {
        const username = req.session.username; 
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const user = await users.findOne({ username });

        if (user) {
            
            //console.log("User Reservations:", Reservation); // Log the reservations to the console

            res.render('profile_editting_page', {
                title: 'Labyrinth - Edit Profile Page', 
                user: user, // Pass the user object to the template
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

app.get('/reserve', async (req, res) => {
    try {
        const username = req.session.username;
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const user = await users.findOne({ username });

        if (user) {
            const reservation = db.collection('reservation');
            let Reservation;

            if (user.role === 'student') {
                Reservation = await reservation.find({ reserved_by: user.username }).toArray();
                console.log("User Reservations:", Reservation); // Log the reservations to the console

                 res.render('reservations_current', {
                title: 'Labyrinth - Current Reservations Page',
                user: user, // Pass the user object to the template
                Reservation: Reservation
            });

            } else {
                Reservation = await reservation.find().toArray();
            }

            console.log("User Reservations:", Reservation); // Log the reservations to the console

            res.render('reservations_current_admin_view', {
                title: 'Labyrinth - Current Reservations Page',
                user: user, // Pass the user object to the template
                Reservation: Reservation
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});






// Handle GET request to the /profile route
//for viewing commented out const etc.
app.get('/viewprofile', async (req, res) => {
    try {
        const username = req.query.username;
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const user = await users.findOne({ username });

        if (user) {
            const reservation = db.collection('reservation');
            const Reservation = await reservation.find({ reserved_by: user.username }).toArray();
            console.log("User Reservations:", Reservation); // Log the reservations to the console

            res.render('profile_view', {
                title: 'Labyrinth - View Profile Page',
                user: user,
                Reservation: Reservation
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Handle GET request to the /reserve route


//for viewing commented out const etc.

app.post('/reservation/:labId', async (req, res) => {
    if (req.session.authenticated) {
        try {
            const db = client.db(DB_NAME);
            const labs = db.collection('labs');
            const lab = await labs.findOne({ name: req.params.labId });

            if (!lab) {
                return res.status(404).json({ message: 'Lab not found' });
            }

            // Get the current date and time
            const currentDate = new Date();
            const currentDateStr = currentDate.toISOString().split('T')[0]; // Extract date part


            console.log("Current Date:", currentDateStr);
            const currentTime = currentDate.getHours() + ":" + currentDate.getMinutes();

            const selectedLab = req.params.labId; // Access lab ID from route parameters

            // Pass the currentDate as date to the template
            res.render('reserve/reservation', {
                title: 'Reserve a Seat',
                username: req.session.username,
                labId: selectedLab,
                lab: lab,
                date: currentDateStr, // Pass the currentDate to the template
                currentTime: currentTime,
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
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
});
