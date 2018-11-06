import { Cookie, CookieJar } from 'tough-cookie'
import http from 'http'
import querystring from 'querystring'
import windows1251 from 'windows-1251'
import EventEmitter from 'events'
import Debug from '../../helpers/Debug'
import Bottleneck  from "bottleneck"
import _ from "lodash"

class RutrackerApi extends EventEmitter {
    static singleton() {
        if( ! RutrackerApi.$Singleton ) RutrackerApi.$Singleton = new RutrackerApi() ;
        return RutrackerApi.$Singleton ;
    }
    constructor() {
        super( ...arguments ) ;
        _.assign( this, {
            host: 'rutracker.org' ,
            login_path: '/forum/login.php' ,
            search_path: '/forum/tracker.php' ,
            download_path: '/forum/dl.php' ,
            topic: '/forum/viewtopic.php' ,
            cookie: null
        } )
        /* debug */ Debug.info( "RutrackerApi()", null, this );
    }

    login( login_username, login_password ) {
        return new Promise(( resolve, reject ) => {
            const body = querystring.stringify({
                login_username,
                login_password,
                login: 'Вход'
            });
            const options = {
                hostname: this.host,
                port: 80,
                path: this.login_path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length
                }
            };
            const req = http.request(options, ({ statusCode, headers }) => {

                /* debug */ Debug.log( "RuTrackerAPI()", "login([ statusCode, headers ])", { statusCode, headers } )

                if ( parseInt( statusCode ) == 302 ) {
                    this.cookie = headers['set-cookie'][0];
                    return resolve( this.cookie ) ;
                } else reject( new Error( "Login failed" ) )
            });

            req.on( 'error', reject );
            req.write( body );
            req.end();
        })
    }
    search( keyword, parser ) {

        if ( ! _.isString( this.cookie ) ) throw Error('Unauthorized: Use `login` method first') ;
        if ( ! keyword  ) throw TypeError('Expected at least one argument') ;

        return new Promise(( resolve, reject ) => {

            let payload = '';

            const query = `?nm=${ encodeURIComponent( keyword.toLowerCase() ) }` ;
            const path = `${ this.search_path }${ query }` ;
            const options = {
                hostname: this.host,
                port: 80,
                path: path,
                method: 'POST',
                headers: { 'Cookie': this.cookie }
            };

            /* debug */ Debug.log( "RutrackerApi()", "search([ keyword, options ])", { keyword, options } );

            const req = http.request(options, (res) => {
                if ( parseInt( res.statusCode ) == 200 ) {

                    res.setEncoding('binary');
                    res.on( 'data', ( buffer )=>{ payload = payload + windows1251.decode( buffer, { mode: 'html' }) });
                    res.on( 'end', () => {

                        let response, error ;
                        try { response = parser( payload ) }
                        catch({ message }) {  error = message }
                        finally { return error ? reject( new Error( `"${ keyword }" ${ error }` ) ) : resolve( response ) }
                    } );

                } else reject( new Error( `Http status code is ${ res.statusCode }` ) ) ;
            });

            req.on( 'error', reject );
            req.end();
        }) ;
    }
    pagenate( offset, token, keyword, parser /* function */ ) {

        /* debug */ Debug.log( "RutrackerApi()", "pagenate([ offset, token, keyword ])", { offset, token, keyword } );

        if ( ! _.isString( this.cookie ) ) throw Error('Unauthorized: Use `login` method first') ;
        if ( ! keyword  || ! offset || ! token ) throw TypeError('Expected at least one argument') ;

        return new Promise(( resolve, reject ) => {

            let payload = '';

            // https://rutracker.org/forum/tracker.php?search_id=6Z2YA9917gwg&start=50&nm=ninja

            const query = `?search_id=${ token }&start=${ offset }&nm=${ encodeURIComponent( keyword.toLowerCase() ) }` ;
            const path = `${ this.search_path }${ query }` ;

            /* debug */ Debug.log( "RutrackerApi()", "pagenate([ path ])", path );

            const options = {
                hostname: this.host,
                port: 80,
                path: path,
                method: 'POST',
                headers: { 'Cookie': this.cookie }
            };

            /* debug */ Debug.log( "RutrackerApi()", "pagenate([ options ])", options );

            const req = http.request(options, (res) => {
                if ( parseInt( res.statusCode ) == 200 ) {

                    res.setEncoding('binary');
                    res.on( 'data', ( buffer )=>{ payload = payload + windows1251.decode( buffer, { mode: 'html' }) });
                    res.on( 'end', async () => {

                        /* debug */ Debug.log( "RutrackerApi()", "pagenate([ payload ])", payload );

                        let response, error ;
                        try { response = await parser( payload ) }
                        catch({ message }) {  error = message }
                        finally { return error ? reject( new Error( `"${ keyword }" ${ error }` ) ) : resolve( response ) }
                    } );

                } else reject( new Error( `Http status code is ${ res.statusCode }` ) ) ;
            }) ;

            req.on( 'error', reject );
            req.end();
        }) ;
    }
    subcontext( id, parser /* function */ ) {
        /* debug */ Debug.log( "RutrackerApi()", "subcontext([ id ])", id );

        if ( ! _.isString( this.cookie ) ) throw Error('Unauthorized: Use `login` method first') ;
        if ( ! id ) throw TypeError('Expected at least one argument') ;

        /**
         * @todo тут нужно включить "bottleneck" для limit`а запросов ;
         */

        let payload = '';
        const query = `?t=${ id }` ;
        const path = `https://${  this.host }${ this.topic }${ query }` ;

        /* debug */ Debug.log( "RutrackerApi()", "subcontext([ path ])", path );

        return new Promise(( resolve, reject ) => {

            let payload = '';

            // https://rutracker.org/forum/viewtopic.php?t=3640538

            const query = `?t=${ id }` ;
            const path = `${ this.topic }${ query }` ;
            const options = {
                hostname: this.host,
                port: 80,
                path: path,
                method: 'GET',
                headers: { 'Cookie': this.cookie }
            };
            const req = http.request(options, (res) => {
                if ( parseInt( res.statusCode ) == 200 ) {

                    res.setEncoding('binary');
                    res.on( 'data', ( buffer )=>{ payload = payload + windows1251.decode( buffer, { mode: 'html' }) });
                    res.on( 'end', () => {

                        //  /* debug */ Debug.log( "RutrackerApi()", "subcontext([ payload ])", payload );

                        let response, error ;
                        try { response = parser( payload ) }
                        catch({ message }) {  error = message }
                        finally { return ! error && resolve( response ) }
                    } );

                } else reject( new Error( `Http status code is ${ res.statusCode }` ) ) ;
            }) ;

            req.on( 'error', reject );
            req.end();
        }) ;
    }
}

RutrackerApi.$Singleton = null ;
RutrackerApi.$RequestsLimiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 254
});

export default RutrackerApi ;