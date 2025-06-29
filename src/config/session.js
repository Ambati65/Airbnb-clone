const MongoStore = require('connect-mongo');

const createSessionConfig = (mongoUrl) => {
    const store = MongoStore.create({
        mongoUrl: mongoUrl,
        crypto: {
            secret: process.env.SECRET,
        },
        touchAfter: 24 * 3600, // 24 hours
    });

    store.on('error', (err) => {
        console.log('Error on mongo session store:', err);
    });

    return {
        store,
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
        },
    };
};

module.exports = createSessionConfig;
