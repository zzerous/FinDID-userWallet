const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get('/', (req, res) => {
    let path = req.query.path;

    fs.readdir(path, function(err, items) {
        if(err) {
            res.send(err);
            return;
        }
        let files = [];
        for (let item of items) {
            files.push(item);
        }
        res.send({filelist : files});
    })
    return;
})

module.exports = router;