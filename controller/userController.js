const User = require('../model/user');
const {client, DB_NAME } = require('../model/database');
const bcrypt = require("bcrypt");


exports.registerUser = async (req, res) => {

    const db = client.db(DB_NAME);
    const users = db.collection('users');
    try {
        const { name, email, username, password, confirmPassword, role } = req.body;

        console.log("password ", password);
        console.log("confirmPassword", confirmPassword);

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
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds); //hashs user pw with 10rounds

        // Create a new user document using the Mongoose model
        const newUser = new User({
            name,
            email,
            username,
            password: hash,
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
            return res.status(401).json({ message: "User not found!" });
        }

        console.log("password",password);
        console.log("db",userLogin.password);
        const bcrypt = require("bcrypt");
        const result = await bcrypt.compare(password, userLogin.password); //comapres user unhashed pw with hashed pw
        
        console.log("password",password);
        console.log("db",userLogin.password);
        console.log("result", result);


        if (result) {
            req.session = req.session || {};
            req.session.authenticated = true;
            req.session.username = username;
            return res.status(200).json(req.session);
        } else {
            return res.status(401).json({ message: "Invalid credentials!" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.getUser = async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const user = await users.findOne({ username: req.session.username });
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};




exports.editDescription = async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const user = await users.findOne({ username: req.session.username });

        await users.updateOne({ username: req.session.username }, { $set: { description: req.body.description } });

        res.status(200).json({ message: "Description updated" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

exports.editPFP = async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const user = await users.findOne({ username: req.session.username });

        await users.updateOne({ username: req.session.username }, { $set: { pictureURL: req.body.pictureURL } });

        res.status(200).json({ message: "Profile Picture updated" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}