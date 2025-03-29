import express from 'express'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import cookieParser from 'cookie-parser'
const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Read
app.get('/api/bug', (req, res) => {
    const { txt = '', minSeverity = 0 } = req.query
    const filterBy = { txt, minSeverity: +minSeverity }

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot load bugs')
        })
})

// Create
app.post('/api/bug/', (req, res) => {
    const bugToSave = req.body

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot add bugs', err)
            res.status(500).send('Cannot add bug')
        })
})

// Update 
app.put('/api/bug/:bugId', (req, res) => {
    const bugToSave = req.body

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
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



app.listen(3030, () => loggerService.info('Server ready at port 3030'))