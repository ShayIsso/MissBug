import express from 'express'
import { bugService } from './services/bug.service.js'

const app = express()

// Read
app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            console.log('err:', err)
            res.status(500).send('Cannot load bugs')
        })
})

// Create/Edit
app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        severity: +req.query.severity
    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            console.log('err:', err)
            res.status(500).send('Cannot save bug')
        })
})

// Get/Read by id
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            console.log('err:', err)
            res.status(500).send('Cannot load bug')
        })
})

//* Remove/Delete
app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send('Bug Removed'))
        .catch(err => {
            console.log('err:', err)
            res.status(500).send('Cannot remove bug')
        })
})



app.listen(3030, () => console.log('Server ready at port 3030'))