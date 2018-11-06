import cheerio from "cheerio"
import Debug from "../../helpers/Debug"
import QueryString from 'query-string'
import _ from "lodash"

const getPaginationOptions = ( $ ) => {

    const value = $( `#main_content_wrap .bottom_info .nav:nth-child(1)` ).text() ;
    const text = value.split("Страницы").shift().trim() ;
    const expand = text.split("из") ;
    const total = expand.pop().trim() ;
    const index = expand.join("").split("Страница").pop().trim() ;
    const params = {
        total: ! total || total == "" ? 1 : parseInt( total ) ,
        index: ! index || index == "" ? 1 : parseInt( index ) ,
        max: 50
    }

    return params ;
}
const getSearchSessionToken = ( html ) => {
    const pgBaseUrl = html.match(/PG_BASE_URL..\'(.*)\'/) ;
    if( pgBaseUrl && pgBaseUrl.length > 1 ) {
        const { search_id } = QueryString.parse( pgBaseUrl[ 1 ].split( "?" ).pop() ) ;
        return search_id ;
    }

    return null ;
}
export const subcontextExtractor = ( html ) => {
    const $ = cheerio.load( html , { decodeEntities: false }) ;
    const items = $( '.postImg.postImgAligned' ).toArray() ;
    const { attribs:{ title } } = _.first( items || [], 1 );

    return title ;
}
const extractor = ( html ) => {

    const $ = cheerio.load( html , { decodeEntities: false }) ;
    let items = $('#tor-tbl').find('tr') ;

    if( Boolean( items.text().indexOf( 'Не найдено' ) + 1 ) ) throw new Error( 'not found' ) ;

    const results = [] ;
    const length = items.length ;

    for (let i = 0; i < length; i++) {
        const document = items.find('td') ;
        const state = document.next() ;
        const category = state.next() ;
        const title = category.next() ;
        const author = title.next() ;
        const size = author.next() ;
        const seeds = size.next() ;
        const leechs = seeds.next() ;

        results.push({
            state: state.attr('title'),
            id: title.find('div a').attr('data-topic_id'),
            category: category.find('.f-name a').html(),
            title: title.find('div a ').html(),
            author: author.find('div a ').html(),
            size: size.find('*').html(),
            seeds: seeds.find('b').html(),
            leechs: leechs.find('b').html(),
            url: title.find('div a').attr('href')
        });

        items = items.next();
    }

    const data = _.filter( results, ({ id }) => { return ! _.isEmpty( id ) } ) ;
    const token = getSearchSessionToken( html ) ;
    const paginator = getPaginationOptions( $ ) ;

    return {
        token,
        data ,
        paginator
    };
}

export default  extractor ;