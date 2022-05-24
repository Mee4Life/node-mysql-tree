const Tag = require('../models/tags')
/**
 * add to add new tag
 * edit to edit one tag required new name as name and the tag id
 * get all to get all the tags
 * get all tag branches getTagBranches
 * search tag by name SearchTagByName
 */
const add = ('/', (req, res) => {
    if (!req.body.name) return res.status(400).json({ error: { message: 'the tag name is required' } })

    // extract the data
    const data = req.body
    data.user = req.user.id

    // create tag object: 
    const tag = new Tag(data)

    // save tag to the database :
    tag.save((err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
})

const edit = ('/', (req, res) => {
    if (!req.body.name || !req.body.id) return res.status(400).json({ error: { message: 'tag name and id is required' } })
    // update tag name by id function 
    Tag.updateNameById(req.body.id, req.body.name, (err, result) => {
        if (err) return res.status(500).json(err)
        if (result.affectedRows > 0) return res.json({ edited: true, name: req.body.name })
        return res.json({ edited: false, msg: 'tag cannot be found' })
    })
})

const getAll = ('/', (req, res) => {
    Tag.getAll(req.user.id, (err, result) => {
        if (err) return res.status(500).json(err)
        res.json(result)
    })
})



// to get all tag branches
const getTagBranches = ('/', (req, res, next) => {
    if (!req.query.id) return next()
    Tag.getTagBranches(req.query.id, (err, result) => {
        if (err) return res.status(500).json(err)
        result = parseArrExtra(result)
        return res.json(result)
    })
})



const SearchTagByName = ('/search', (req, res) => {
    if (req.query.q.length <= 0) return Tag.getAll(req.user.id, (err, result) => res.json(result))
    if (!req.query.q) return res.status(400).json({ error: 'need q query' })
    Tag.searchTagByName(req.query.q, (err, result) => {
        if (err) return res.status(500).json({ error: err })
        res.json(result)
    })
})




// functoin to parse branch extra
function parseArrExtra(result) {
    result = result.map((b) => {
        b.extra = JSON.parse(b.extra)
        return b
    })
    return result
}



module.exports = {
    add,
    edit,
    getAll,
    getTagBranches,
    SearchTagByName,
}