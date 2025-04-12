import express from 'express'
import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'
import { authService } from './services/auth.service.js'
import { loggerService } from './services/logger.service.js'
import cookieParser from 'cookie-parser'
const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Read
app.get('/api/bug', (req, res) => {
    const queryOptions = parseQueryParams(req.query)

    // const { txt = '', minSeverity = 0, pageIdx } = req.query
    // const filterBy = { txt, minSeverity: +minSeverity, pageIdx }

    bugService.query(queryOptions)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot load bugs')
        })
})

function parseQueryParams(queryParams) {
    const filterBy = {
        txt: queryParams.txt || '',
        minSeverity: +queryParams.minSeverity || 0,
        labels: queryParams.labels || [],
    }

    const sortBy = {
        sortField: queryParams.sortField || '',
        sortDir: +queryParams.sortDir || 1,
    }

    const pagination = {
        pageIdx: queryParams.pageIdx !== undefined ? +queryParams.pageIdx || 0 : queryParams.pageIdx,
        pageSize: +queryParams.pageSize || 3,
    }

    return { filterBy, sortBy, pagination }
}

// Create
app.post('/api/bug/', (req, res) => {
    const { title, description, severity, labels } = req.body

    if (!title || severity !== undefined) res.status(400).send('Missing required fields')

    const bug = {
        title,
        description,
        severity: +severity || 1,
        labels: labels || [],
    }
    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot add bugs', err)
            res.status(500).send('Cannot add bug')
        })
})

// Update 
app.put('/api/bug/:bugId', (req, res) => {
    const { title, description, severity, labels, _id } = req.body

    if (!_id || !title || severity === undefined) return res.status(400).send('Missing required fields')

    const bug = {
        _id,
        title,
        description,
        severity: +severity,
        labels: labels || [],
    }

    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot update bugs', err)
            res.status(500).send('Cannot update bug')
        })
})


// Get/Read by id
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    let visitedBugs = req.cookies.visitedBugs || []

    if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit')
    if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)

    console.log('User visited at the following bugs:', visitedBugs)
    res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 })
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot load bug')
        })
})

//* Remove/Delete
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send('Bug Removed'))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug')
        })
})


//* ------------------- Auth API -------------------

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    console.log('credentials:', credentials)

    userService.signup(credentials)
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot signup', err)
            res.status(401).send('Cannot signup')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = {
        username: req.body.username,
        password: req.body.password,
    }
    authService.checkLogin(credentials)
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot login', err)
            res.status(401).send('Cannot login')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})

// User API
app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})



app.listen(3030, () => loggerService.info('Server ready at port 3030'))