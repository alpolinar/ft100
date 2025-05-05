import {
    CallHandler,
    ExecutionContext,
    HttpException,
    Inject,
    Injectable,
    Logger,
    NestInterceptor,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Effect } from "effect";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AppConfigService } from "src/app-config/app.config.service";
import { getOpts } from "src/common/utils/request";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly ctxPrefix: string = "LoggingInterceptor";
    private readonly logger = new Logger("LoggingInterceptor");
    private readonly excludePaths: ReadonlyArray<string> = [];

    constructor(
        @Inject(AppConfigService) private readonly appConfig: AppConfigService
    ) {}

    /**
     * Intercept method, logs before and after the request being processed
     * @param context details about the current request
     * @param call$ implements the handle method that returns an Observable
     */
    public intercept(
        context: ExecutionContext,
        call$: CallHandler
    ): Observable<unknown> {
        const opts = Effect.runSync(getOpts(context));

        if (this.excludePaths.includes(opts.url)) {
            return call$.handle();
        }

        return call$.handle().pipe(
            tap({
                next: (value) => {
                    this.logNext(value, context);
                },
                error: (error) => {
                    this.logError(error, context);
                },
            })
        );
    }

    /**
     * Logs the request response in success cases
     * @param _body body returned
     * @param context details about the current request
     */
    private logNext(
        _body: unknown,
        context: ExecutionContext,
        traceId?: string
    ): void {
        const opts = Effect.runSync(getOpts(context, traceId));
        this.logger.log(JSON.stringify(opts), "LoggingInterceptor");
    }

    /**
     * Logs the request response in success cases
     * @param error Error object
     * @param context details about the current request
     */
    private logError(
        error: Error,
        context: ExecutionContext,
        traceId?: string
    ): void {
        const opts = Effect.runSync(getOpts(context, traceId));
        const ctx = GqlExecutionContext.create(context);
        if (error instanceof HttpException) {
            const statusCode: number = error.getStatus();
            if (statusCode > 399 && statusCode < 500) {
                return;
            }
            const clientVersion: string =
                ctx.getContext()?.req?.headers?.version || "unknown";
            const serverVersion = this.appConfig.get("npm_package_version");
            const info = `${this.ctxPrefix} - ${statusCode} - ${opts.method} - ${opts.url} - Client Version: ${clientVersion} - Server Version: ${serverVersion}`;
            const message = `Outgoing response - ${statusCode} - ${opts.method} - ${opts.url}`;

            const ret = { message: message, error: error, ctx: info };
            this.logger.error(
                JSON.stringify(ret, Object.getOwnPropertyNames(ret))
            );
        }
    }
}
