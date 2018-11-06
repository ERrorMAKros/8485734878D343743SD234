import MD5 from "md5";

export default class AuthController {
    static genSecretHash( ...args ) {
        return MD5( [ ...arguments ].join("") ) ;
    }
}