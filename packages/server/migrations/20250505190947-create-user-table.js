/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`
        );

        return await queryInterface.createTable("user", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal("uuid_generate_v4()"),
            },
            username: {
                allowNull: false,
                type: Sequelize.STRING,
                defaultValue: Sequelize.literal(
                    `'user_' || encode(gen_random_bytes(4), 'hex')`
                ),
                unique: true,
            },
            email: {
                allowNull: true,
                type: Sequelize.STRING,
                unique: true,
            },
            verified: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            token: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            img: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            last_login_at: {
                allowNull: true,
                type: Sequelize.DATE,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface) {
        return await queryInterface.dropTable("user");
    },
};
