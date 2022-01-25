bcrypt = require('bcrypt')

module.exports.hashPassword = hashPassword;
module.exports.comparePassword = comparePassword;
module.exports.encode = encode_utf8;
module.exports.decode = decode_utf8;

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    return hash;
}

async function comparePassword(password, hash) {
    const isSame = await bcrypt.compare(password, hash);
    
    return isSame;
}

function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
return decodeURIComponent(escape(s));
}