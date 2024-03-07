const User = require('../model/user');
const bcrypt = require('bcrypt');
const {client, DB_NAME } = require('../model/database');
exports.loginUser = async (req, res) => {
    // Check if the user exists
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

        const passwordMatch = await bcrypt.compare(password, userLogin.password);

        if (passwordMatch) {
            if (!req.session) {
                req.session = {};
            }

            if (req.session.authenticated) {
                req.session.username = username;
                res.status(201).json(req.session);
            } else {
                req.session.authenticated = true;
                req.session.username = username;
                res.status(201).json(req.session);
            }
        } else {
            res.status(401).json({ message: "Invalid credentials!" });
        }

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
