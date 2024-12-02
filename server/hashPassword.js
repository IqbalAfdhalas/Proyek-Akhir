const bcrypt = require("bcrypt");

const password = "Admin#123";
const hashedPassword = bcrypt.hashSync(password, 10);

console.log("Hashed Password:", hashedPassword);
