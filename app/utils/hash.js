import crypto from "crypto"

export const hashPassword = async (password) => {
    const salt = crypto.randomBytes(16).toString("hex")
    const derivedKey = await new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 64, (err, key) => {
            if (err) reject(err)
            resolve(key)
        })
    })
    return `${salt}:${derivedKey.toString("hex")}`
}

export const verifyPassword = async (password, hash) => {
    const [salt, storedKey] = hash.split(":")
    const derivedKey = await new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 64, (err, key) => {
            if (err) reject(err)
            resolve(key)
        })
    })
    return storedKey === derivedKey.toString("hex")
}

// export const getCountOfCourses = (p)