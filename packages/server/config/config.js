/**
 * @description Config info for sequelize cli
 * @link https://sequelize.org/master/manual/migrations.html
 */

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
        host: process.env.DB_HOST,
        dialect: "postgres",
        seederStorage: "sequelize",
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
        host: process.env.DB_HOST,
        dialect: "postgres",
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true,
            },
        },
    },
};
