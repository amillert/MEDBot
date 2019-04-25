import { ErrorHandler, Injectable, Inject, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
@Injectable()
export class ErrorsHandler implements ErrorHandler {
    constructor(private ngZone: NgZone,
        @Inject(ToastrService) private toastrService: ToastrService) { }

    handleError(error: Error) {
        this.ngZone.run(() => {
            console.log(error)
            this.toastrService.error(JSON.parse(error['_body']).error, error.message)
            if (error instanceof HttpErrorResponse) {
                //Backend returns error 404, 500 etc				  
                console.error('Backend returned status code: ', error.status);
                console.error('Response body:', error.message);
            } else {
                //A client-side or network error	          
                console.error('An error occurred:', error.message);
            }
        })
    }
} 