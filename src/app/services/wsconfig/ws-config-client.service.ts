import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, interval, of } from 'rxjs';
import { map, retry, catchError, finalize, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';

//import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class WsConfigClientService {
    private appHost: string = "environment.appHost";
    private isDevelopment: boolean = true;
    userName: any;
    constructor( 
        private http: HttpClient,
        public router: Router) {}

    handleError(err: any){
        let errorMessage = '';
       
        if(err.error instanceof ErrorEvent){
            errorMessage = `Mensaje: ${err.message}`;         
        }else{
            errorMessage = `Estatus: ${err.status}\nMensaje: ${err.message}`;
        }
         if(err.status == 0){

         }


       return throwError(errorMessage);

    }

    getObject( serviceName: string): Observable<any> {
       
        let httpGet = this.http.get( this.appHost + serviceName, {
            headers: new HttpHeaders({
                'cookie-aplicativa': sessionStorage.getItem('cookie-aplicativa') || '{}',
                'Authorization': 'Bearer ' + sessionStorage.getItem('Bearer'),
                'Access-Control-Allow-Headers': 'Content-Type'
            })
        });
        
        return httpGet.pipe(retry(3), catchError(this.handleError), finalize(()=>{}),
                mergeMap((response: any ) => (response.status !== 200)
                ? (response.status == 401 ? of(this.postObject( '/auth/logout', {user: this.userName}).pipe(
                finalize(()=>{this.router.navigateByUrl('//')})).subscribe( (response: any) => {
                        sessionStorage.clear();
                    }))
      
                    :  of())
                : of(response)
             ));
    }

    getObjectDocument( serviceName: string): Observable<any> {
        return this.http.get( this.appHost + serviceName, {
            headers: new HttpHeaders({
                 'Accept': 'application/pdf',
                 'cookie-aplicativa': sessionStorage.getItem('cookie-aplicativa') || '{}',
                 'Authorization': 'Bearer ' + sessionStorage.getItem('Bearer')
            }),
            responseType: 'blob'
        });
    }

    postObjectDocument( serviceName: string, serviceBody: any): Observable<any> {
        return this.http.post( this.appHost + serviceName,  serviceBody,{
            headers: new HttpHeaders({
                 'Accept': 'application/pdf',
                 'cookie-aplicativa': sessionStorage.getItem('cookie-aplicativa') || '{}',
                 'Authorization': 'Bearer ' + sessionStorage.getItem('Bearer')
            }),
            responseType: 'blob'
        });
    }



    postObject( serviceName: string, serviceBody: any ): Observable<any> {

        if( this.isDevelopment ) {
            return this.createMockRequest( serviceName, serviceBody );
        } else {
        	let tokenRq : string = sessionStorage.getItem('cookie-aplicativa') || '{}';
        	let Bearer : string = sessionStorage.getItem('Bearer') || '{}';
	    	if( !tokenRq)
	    	{
	    		tokenRq = ''; 
	    	}
	    	if( !Bearer)
	    	{
	    		Bearer = ''; 
	    	}
            return this.http.post(
                this.appHost + serviceName,
                serviceBody,
                {
                    headers:  new HttpHeaders({
                    	'cookie-aplicativa': tokenRq,
                    	'Authorization': 'Bearer ' + Bearer,
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Content-Type': 'application/json'
                    }),
                    observe: 'response'
                }).pipe(
                        map( data  =>{
                            let token : string = data.headers.get('cookie-aplicativa') || '{}';
                            let Bearer : string = data.headers.get('Bearer') || '{}';
                      
                        	if(token)
                            {
                                sessionStorage.setItem('cookie-aplicativa', token);
                            }
                            if( Bearer)
                            {
                            	sessionStorage.setItem('Bearer', Bearer);
                            }
                            return data.body;
                        }), retry(3), catchError(this.handleError), finalize(()=>{  }),
                            mergeMap((response: any ) => (response.status !== 200)
                            ? (response.status == 401 ? of(this.postObject( '/auth/logout', {user: this.userName}).pipe(
                               finalize(()=>{this.router.navigateByUrl('//')})).subscribe( (response: any) => {
                                    sessionStorage.clear();
                                }))
                          
                            :  of(), of(response)
                            )
                        : of(response)
                        ));
        }
    }

    private createMockRequest( serviceName: string, serviceBody: any ): Observable<any> {
        let serviceId = '';

        if( serviceBody.id !== null && typeof serviceBody.id !== 'undefined' ) {
            serviceId = '/' + serviceBody.id;
        } else if( serviceBody.clave !== null && typeof serviceBody.clave !== 'undefined' ) {
            serviceId = '/' + serviceBody.clave;
        }

        let mockService = serviceName + serviceId;

        return this.http.get( this.appHost + mockService );
    }
}
