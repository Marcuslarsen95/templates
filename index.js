import express from "express";

// run following in command line: 
// npm init -y; npm i express nodemon ejs; nodemon index.js; 

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');


app.get("/", (req, res) => {
    res.render('index.ejs', {
        // insert data here
    });
})

app.use((req, res) => {
  res.status(404).render('404.ejs', { url: req.originalUrl });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})