import React, { PureComponent } from "react";
import Style from "./style.scss";
import { connect } from "react-redux";
import { Input, Progress } from 'antd';
import { bindActionCreators } from "redux";
import { setKeyword } from "../../redux/actions/SearchActions";
import { SearchRequest } from "../../redux/requests/SearchRequest";
import Explorer from "../Explorer";
import { percentage } from "../../utils/Common";

const { Search } = Input ;

@connect(
	({ Search })=>Search ,
	dispatch => bindActionCreators({ setKeyword }, dispatch )
)
export default class extends PureComponent {
	state={
    defaultKeywordValue: ""
	}
	render() {
    const { paginator:{ total, index } } = this.props ;
    const { defaultKeywordValue } = this.state ;
    return (
			<div className={ Style.Search }>
				<div key="search" className={ Style.Keywords }>
					<Search defaultValue={ defaultKeywordValue } onSearch={ this.onSearch } enterButton={ <span>SEARCH</span> } size="large" />
          <Progress className={ Style.ProgressBar } percent={ percentage( index, total ) * 100 } status="active" />
				</div>
				<div key="results" className={ Style.Results }>
					<Explorer/>
				</div>
			</div>
		);
	}
	onSearch = ( keyword ) => {
		this.props.setKeyword( keyword ) ;
		SearchRequest( keyword ) ;
	}
}