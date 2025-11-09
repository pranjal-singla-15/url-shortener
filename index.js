const express = require('express');
const {connectToMongoDb} = require('./connection');
const URL = require('./models/url');
const path = require('path');
const urlRoute = require('./routes/url');
const userRoute = require('./routes/user');
const staticRoute = require('./routes/staticRouter');
const {restrictToLoggedinUserOnly} = require('./middlewares/auth');
const querystring = require("node:querystring");
const app = express();
const PORT = 4000;
const cookieParser = require('cookie-parser');

connectToMongoDb('mongodb://localhost:27017/short-url');

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use("/url",restrictToLoggedinUserOnly, urlRoute);
app.use("/", staticRoute);
app.use("/user", userRoute);
app.use(cookieParser());


// app.get("/test", async (req, res) => {
//     const allUrls = await URL.find({});
//     return res.render("home",{
//         urls: allUrls
//     });
// })
app.get('/:shortId',async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{
        $push: {
            visitHistory:{
                timestamp: Date.now(),
            }
        }
    })
    res.redirect(entry.redirectedURL);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


