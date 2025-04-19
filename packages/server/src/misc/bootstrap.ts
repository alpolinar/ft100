import chalk from "chalk";
import Table from "cli-table3";
import figlet from "figlet";

export const info = (version: string, name: string, appPort: number) => {
    const table = new Table();
    table.push({ version: `${version}` }, { port: `${appPort}` });
    const n = name.lastIndexOf("/");
    const result = name.substring(n + 1);
    console.log(
        chalk.yellow(
            figlet.textSync(result, {
                horizontalLayout: "default",
                verticalLayout: "default",
            })
        )
    );
    console.log(table.toString());
};

export const bootstrapWrapper = (_: () => Promise<void>) => {
    console.log("Starting bootstrap");
    try {
        _().catch((e) => {
            console.log(`Bootstrap Error => ${e}`);
        });
    } catch (e) {
        console.log(e);
    }
};
