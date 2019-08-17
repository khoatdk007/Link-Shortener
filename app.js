const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const dbUrl = process.env.DB_URL;
const generate = require("./generate-id");

let collection;

app.use(express.json());
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post("/api/shorten", urlencodedParser, (req, res) => {
    const inputUrl = req.body.url;
    let shortUrl = req.protocol + "://" + req.get("host") + "/";
    collection.findOne({ url: inputUrl }, (err, result) => {
        if (err) throw err;
        if (result) {
            return res.send(shortUrl + result.id);
        }
        let usedIds = [];
        collection.find({}).toArray((err, result) => {
            if (err) throw err;
            usedIds = result.map(obj => { return obj.id; });
        });
        const shortId = generate(6, usedIds);
        const newObj = { id: shortId, url: inputUrl };
        res.send(shortUrl + shortId);
        collection.insertOne(newObj);
        return;
    });
});

app.use(express.static("public"));
app.get("/:id", (req, res) => {
    const id = req.params.id;
    collection.findOne({ id: id }, (err, result) => {
        if (err) throw err;
        if (result) {
            res.redirect(result.url);
        } else {
            res.sendFile(path.join(__dirname, "error", "notfound.html"));
            res.status(404);
        }
    });
});

MongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    collection = client.db("lnk-shorter").collection("links");
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
});
console.log("Connected to MongoDB");
