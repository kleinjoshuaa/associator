const path = require("path")
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require("body-parser");

const app = express()
const port = 3000


app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


app.get('/', (req, res) => {
     res.render('login')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})