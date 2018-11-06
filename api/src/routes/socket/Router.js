import Search from './routes/Search';
import Paginator from './routes/Paginator' ;

const InitAllRoutes = () => {
	new Search() ;
	new Paginator() ;
}

export default InitAllRoutes ;