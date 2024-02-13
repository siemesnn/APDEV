class user {
    constructor(id, name, email, password, username, pictureURL, role, description, reservations) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.username = username;
        this.pictureURL = pictureURL;
        this.role = role;
        this.description = description;
    }
}

module.exports = user;