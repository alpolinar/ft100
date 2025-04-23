/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
        );
        return await queryInterface.createTable("game", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal("uuid_generate_v4()"),
            },
            game_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            current_total: {
                allowNull: false,
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            current_player_id: {
                allowNull: true,
                type: Sequelize.UUID,
            },
            winner_id: {
                allowNull: true,
                type: Sequelize.UUID,
            },
            fk_player_one_id: {
                allowNull: true,
                type: Sequelize.UUID,
            },
            fk_player_two_id: {
                allowNull: true,
                type: Sequelize.UUID,
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
        return await queryInterface.dropTable("game");
    },
};
