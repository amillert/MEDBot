import { ErrorHandler, Injectable, Inject, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from './services/logger.service';
import { ErrorInterceptor } from './_helpers/error.inceptor';
@Injectable()
export class ErrorsHandler implements ErrorHandler {
    constructor(private ngZone: NgZone, private logger: LoggerService,
        @Inject(ToastrService) private toastrService: ToastrService) { }

    handleError(error: Error) {
        this.ngZone.run(() => {
            if (!error.message) {
                this.toastrService.error(JSON.parse(error['_body']).error, error.message)
                if (error instanceof HttpErrorResponse) {
                    console.error('Backend returned status code: ', error.status);
                    console.error('Response body:', error.message);
                    this.logger.logError("Status: " + error.status + " Message " + error.message)
                }
            }
        })
    }
} 