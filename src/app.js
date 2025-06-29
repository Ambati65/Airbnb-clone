if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

// Configuration
const connectDB = require('./config/database');
const createSessionConfig = require('./config/session');
const configurePassport = require('./config/passport');

// Routes
const listingRouter = require('./routes/listing');
const reviewRouter = require('./routes/review');
const userRouter = require('./routes/user');

// Constants
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.ATLAS_URL || "mongodb://127.0.0.1:27017/wanderlust";

// Connect to database
connectDB();

// App configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

// Session configuration
const sessionOptions = createSessionConfig(MONGO_URL);
app.use(session(sessionOptions));

// Flash messages
app.use(flash());

// Passport configuration
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Middleware to pass variables to templates
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Route handlers
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);

// Error handling for unknown routes
app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
