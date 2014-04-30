// ------------------------
//  Let me explain it config
// ------------------------
module.exports = {

    // Server
    BIND_PORT: (3000),

    // MySQL
    MYSQL_HOST: 'localhost',
    MYSQL_PORT: 3306,
    MYSQL_USERNAME: 'root',
    MYSQL_PASSWORD: '',
    MYSQL_DATABASE: 'conference_dev',

    // Runtime options
    // Remember to build a minified version in the angular_build directory
    // before turning debug off.
    DEBUG: true,

    // MISC
    GOOGLE_MAPS_API_KEY: '',

    // GMAIL ACCOUNT (For sending password reset emails)
    GMAIL_USERNAME: '',
    GMAIL_PASSWORD: ''
}