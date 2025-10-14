const bcrypt = require('bcrypt');
module.exports = {
    hashPassword: async function (password) {
        const hashedPassword = await bcrypt.hash(password,12);
        return hashedPassword;
    },
     comparePassword : async function (password, hashedPassword) { 
        const match = await bcrypt.compare(password, hashedPassword)  
        if (!match) {
            throw new Error('Mot de passe incorrect');
        }
     return match;
    }
};