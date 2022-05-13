const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 9000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(fileUpload());
app.listen(PORT, function() {
    console.log('server listening on port ', PORT);
})

databaseMiddleware = require('../middleware/database.middleware');

app.post('/create-presentation', async (req,res) => {
    const credential = req.body.credential;
    console.log(credential);

    const result = databaseMiddleware.createPresentation(CID);
    if (result.status == -1) {
        res.send("failed: \n" + result.err);
        return;
    }

    console.log("successful insert Presentation");
    res.send("create presentation: success");

});

app.post('/get-presentation', async (req, res) => {
    const address = req.body.address;
    const pid = req.body.pid;
    console.log(address)
    console.log(pid);

    const result = databaseMiddleware.getPresentation(address, pid);
    if (result.status == -1){
        res.send("failed: \n" + result.err);
        return;
    }
    console.log("successful get Presentation");
    res.send("get presentation: success");
})

app.post('/get-did', async (req, res) => {
    const address = req.body.address;
    console.log(address);

    const result = databaseMiddleware.getDID(address);
    if (result.status == -1){
        res.send("failed: \n" + result.err);
        return;
    }
    console.log("successful get did");
    res.send("get did: success");
})