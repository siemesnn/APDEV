const User = require('../model/user');
const {client, DB_NAME } = require('../model/database');


exports.registerUser = async (req, res) => {

    const db = client.db(DB_NAME);
    const users = db.collection('users');
    try {
        const { name, email, username, password, confirmPassword, role } = req.body;

        if (password !== confirmPassword) {
            res.status(400).json({ message: "Passwords do not match!" });
            return;
        }

        // Check if the username already exists using Mongoose
        const existingUser = await users.findOne({ username });

        if (existingUser) {
            res.status(400).json({ message: "Username is already taken!" });
            return;
        }

        // Hash the password before storing it in the database

        // Create a new user document using the Mongoose model
        const newUser = new User({
            name,
            email,
            username,
            password,
            role,
            description : '',
            profilePicture: 'https://www.redditstatic.com/avatars/avatar_default_02_4856A3.png',
            reservations : [],
        });

        // Save the new user to the database
        await users.insertOne(newUser);

        res.json({ message: "Registration successful" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Reuse the MongoDB client and database connection
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const userLogin = await users.findOne({ username });

        if (!userLogin) {
            res.status(401).json({ message: "Invalid credentials!" });
            return;
        }

        if (userLogin.password !== password) { 
            res.status(401).json({ message: "Invalid credentials!" });
            return;
        }

        // Check if req.session exists, if not, initialize it
        if (!req.session) {
            req.session = {};
        }

        req.session.username = username;
        req.session.authenticated = true;
        res.status(201).json(req.session);

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};





    exports.returnUser = (req, res) => {
        // Check if the user exists
        const { username, password } = req.body;
    
        const users = Object.values(userjson.users); // Convert users object to an array
    
        const user = users.find(user => user.username === username && user.password === password);
    
        // Debugging information
        console.log('User:', user);
    
        // Send appropriate status and user data
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(401).send('Invalid username or password');
        }
    };
