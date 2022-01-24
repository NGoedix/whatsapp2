bcrypt = require('bcrypt')

module.exports.hashPassword = hashPassword;
module.exports.comparePassword = comparePassword;

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    return hash;
}

async function comparePassword(password, hash) {
    const isSame = await bcrypt.compare(password, hash);
    
    return isSame;
}