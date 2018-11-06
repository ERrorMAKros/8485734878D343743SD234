import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Style from "./style.scss";
import ExplorerCard from "./Item";
import NextPagination from "./NextPagination";
import { PaginatorRequest } from "../../redux/requests/PaginatorRequest";

@connect(
	({ Search })=>Search
)
class Explorer extends PureComponent {
	render() {
		const { data, paginator:{ total, index }, token } = this.props ;
		const items = data.map( item=><ExplorerCard key={ item.id } { ...item } /> ) ;
		const numPagesLeft = total-index ;
		const nextButton = <NextPagination key="loadNext" onClick={ this.onPaginator } numPagesLeft={ numPagesLeft } enabled={ this.hasPaginationEnabled() } /> ;

		return (
            <div className={ Style.Explorer }>
                {[ items , nextButton ]}
            </div>
        );
	}
	hasPaginationEnabled() {
		const { paginator:{ index, total } } = this.props ;
		const hasEnabled = ! Boolean( index == total ) ;
		return hasEnabled ;
	}
	onPaginator = ( target ) => {
		const { token, keyword, paginator } = this.props ;
		return PaginatorRequest({ ...paginator, keyword, token }) ;
	}
}

export default Explorer ;