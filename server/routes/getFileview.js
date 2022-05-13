const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get('/', (req, res) => {
    let path = req.query.path;

    fs.readFile(path, 'utf8', function(err, file) {
        if(err) {
            res.send(err);
            return;
        }
        console.log(file)
        res.send(file);
    })
    return;
})

module.exports = router;