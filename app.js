var express = require('express');
var path = require('path');
var app = express();
const exphbs = require('express-handlebars');
const fs = require('fs');
app.use(express.urlencoded({ extended: true }));
const port = process.env.port || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

//step 8
// const hbs = exphbs.create({
//     extname: '.hbs',
//     helpers: {
//         hasWebsite: function(website, options) {
//             if (website && website.trim() !== '') {
//                 return options.fn(this); // Render the block if the website exists
//             }
//             return options.inverse(this); // Skip the block if the website is empty
//         }
//     }
// });

//step 9
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main', // Main layout with header/footer
    helpers: {
        highlightIfNoWebsite: function(website) {
            // Check if the website is empty or "N/A"
            return (!website || website.trim().toLowerCase() === 'n/a') ? 'highlight' : '';
        }
    },
    partialsDir: path.join(__dirname, 'views/partials')
});


// Set up Handlebars as the template engine
app.engine('.hbs', hbs.engine); // ({ extname: '.hbs' }));
app.set('view engine', 'hbs');

//load movie data from json file
let movieData2 = [];
fs.readFile(path.join(__dirname, 'movieData2.json'), (err, data) => {
    if (err) {
        console.error("Error reading movie Data:", err);
        return;
    }
    movieData2 = JSON.parse(data);
});
// Define routes
app.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});
app.get('/users', function (req, res) {
    res.send('respond with a resource');
});
//Route to display all movies
app.get('/movies', function (req, res) {
    res.render('movies', { title: 'All Movies', movies: movieData2 });
});
//Route to display movie by ID
app.get('/movies/:id', function (req, res) {
    const id = req.params.id;
    const movie = movieData2.find(m => m.Movie_ID == id);
    if (movie) {
        res.render('movieDetails', { title: 'Movie', movie: movie });
    } else {
        res.render('error', { title: 'Error', message: 'Movie not found' });
    }
});
//Route to display search form for movie ID
app.get('/movies/search/id', function (req, res) {
    res.render('searchID', { title: 'Search by Movie ID' });
});

// Route to handle POST request for movie search by ID
app.post('/movies/search/id', function (req, res) {
    const id = req.body.id.trim();
    const movie = movieData2.find(m => m.Movie_ID == parseInt(id, 10));
    if (movie) {
        res.render('movieDetails', { title: 'Movie Details', movie: movie });
    } else {
        res.render('error', { title: 'Error', message: 'Movie not found' });
    }
});
// Route to display search form for movie by title
app.get('/movies/search/title', function (req, res) {
    res.render('searchTitle', { title: 'Search by Movie Title' });
});

// Route to handle POST request for movie search by title
app.post('/movies/search/title', function (req, res) {
    const title = req.body.title.trim().toLowerCase();
    const foundMovies = movieData2.filter(m => m.Title.toLowerCase().includes(title));
    if (foundMovies.length > 0) {
        res.render('movies', { title: 'Movies Found', movies: foundMovies });
    } else {
        res.render('error', { title: 'Error', message: 'No movies found' });
    }
});
//Step 7
app.get('/viewData', function (req, res) {
    res.render('viewData', { title: 'Sales Info', movies: movieData2 });
});

// Handle unknown routes
app.get('*', function (req, res) {
    res.render('error', { title: 'Error', message: 'Wrong Route' });
});

// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})