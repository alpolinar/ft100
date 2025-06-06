/** @type {import('sequelize-cli').Migration} */

const GamePhase = {
    Complete: "Complete",
    CountdownToStart: "CountdownToStart",
    InProgress: "InProgress",
    WaitingForPlayers: "WaitingForPlayers",
};

module.exports = {
    async up(queryInterface, Sequelize) {
        return await Promise.all([
            queryInterface.addColumn("game", "phase", {
                type: Sequelize.ENUM([
                    GamePhase.Complete,
                    GamePhase.WaitingForPlayers,
                    GamePhase.InProgress,
                    GamePhase.CountdownToStart,
                ]),
                allowNull: false,
                defaultValue: GamePhase.WaitingForPlayers,
            }),
            queryInterface.addColumn("game", "countdown_ends_at", {
                type: Sequelize.DATE,
                allowNull: true,
            }),
        ]);
    },

    async down(queryInterface) {
        return await Promise.all([
            queryInterface.removeColumn("game", "phase"),
            queryInterface.removeColumn("game", "countdown_ends_at"),
            queryInterface.sequelize.query(`DROP TYPE "enum_game_phase";`),
        ]);
    },
};
