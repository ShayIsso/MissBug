import fs from 'fs'

import { utilService } from './util.service.js'

const users = utilService.readJsonFile('data/user.json')

export const userService = {
    query,
    remove,
    getById,
    getByUsername,
    signup,
}

function query() {
    const usersToReturn = users.map(user => ({
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
    }))
    return Promise.resolve(usersToReturn)
}

function signup({ fullname, username, password }) {
    if (!fullname || !username || !password ) {
        return Promise.reject('Incomplete credentials')
    }

    const user = {
        _id: utilService.makeId(),
        fullname,
        username,
        password,
        isAdmin: false,
    }
    users.push(user)

    return _saveUsersToFile().then(() => ({
        _id: user._id,
        fullname: user.fullname,
        isAdmin: user.isAdmin,
    }))
}

function remove(userId) {
    console.log(userId)
    const idx = users.findIndex(user => user._id === userId)
    if (idx === -1) return Promise.reject('sorry not found')
    users.splice(idx, 1)

    return _saveUsersToFile()
}

function getById(userId) {
    var user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found!')

    user = { ...user }
    delete user.password

    return Promise.resolve(user)
}

function getByUsername(username) {
    const user = users.find(user => user.username === username)
    return Promise.resolve(user)
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const content = JSON.stringify(users, null, 2)
        fs.writeFile('./data/user.json', content, err => {
            if (err) {
                console.error(err)
                return reject(err)
            }
            resolve()
        })
    })
}
