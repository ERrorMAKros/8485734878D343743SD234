import React, { Component } from "react";
import { Debug } from "../../utils/Common";
import { connect } from "react-redux";
import { getRootCatalogueAction, getViewForumAction } from "../../redux/actions/CatalogueActions";
import { bindActionCreators } from "redux";

@connect(
  ({ Catalogue })=>({ Catalogue }),
  dispatch => bindActionCreators({ getRootCatalogueAction, getViewForumAction }, dispatch )
)
export default class extends Component {
  constructor( props ) {
    super( props );
    /* debug */ Debug.info( "Catalogue()", null, this );
  }
  render() {
    return <div>underconstruction...</div>;
  }
  componentDidMount() {
    this.props.getRootCatalogueAction() ;
  }
}