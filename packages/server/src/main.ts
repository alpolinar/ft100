import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
    const logger = new Logger("Root");

    process.on("uncaughtException", (...args) => {
        logger.error(args, args[0].stack);
    });

    const app = await NestFactory.create(AppModule, {
        rawBody: true,
    });

    const configService = app.get(ConfigService);
    const port = configService.get<number>("APP_PORT", 3001);

    app.enableCors({
        credentials: true,
        origin: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        })
    );
    await app.listen(port);
}
bootstrap();
