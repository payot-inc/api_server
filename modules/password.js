const bkfd2Password = require('pbkdf2-password')
const hasher = bkfd2Password()

module.exports = {
    create: (password) => {

        return new Promise((resolve, reject) => {
            hasher({ password: password}, (err, pass, salt, hash) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({ password: pass, salt, hash })
                }
            })
        })
    },
    match: (password, salt, hash) => {
        return new Promise((resolve, reject) => {
            let check = { password, salt }
            
            hasher(check, (err, p, s, h) => {
                if (err) reject(err)
                else resolve(hash === h)
            })
        })
    }
}