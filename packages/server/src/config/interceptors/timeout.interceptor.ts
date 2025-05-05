import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    RequestTimeoutException,
} from "@nestjs/common";
import { Observable, TimeoutError, throwError } from "rxjs";
import { catchError, timeout } from "rxjs/operators";

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    // default 60 seconds
    constructor(private readonly timeLimit: number = 60000) {}

    intercept(
        _context: ExecutionContext,
        // biome-ignore lint/suspicious/noExplicitAny: allow
        next: CallHandler<any>
        // biome-ignore lint/suspicious/noExplicitAny: allow
    ): Observable<any> {
        return next.handle().pipe(
            timeout(this.timeLimit),
            catchError((err) => {
                if (err instanceof TimeoutError) {
                    return throwError(
                        () =>
                            new RequestTimeoutException(
                                "Request timeout exceeded"
                            )
                    );
                }
                return throwError(() => err);
            })
        );
    }
}
