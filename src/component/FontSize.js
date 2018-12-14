import React from "react";
import {MenuItem, DropdownButton} from "react-bootstrap";
import  {Icon} from "./Components";

class FontSize extends React.Component{
	render(){
		return(
			<DropdownButton eventKey={1} title={<Icon>{this.props.icon}</Icon>}>
				<MenuItem eventKey='1'><i className="fa fa-envelope fa-fw"></i> User Profile</MenuItem>
				<MenuItem eventKey='2'><i className="fa fa-gear fa-fw"></i> Settings</MenuItem>
				<MenuItem eventKey='3'><i className="fa fa-sign-out fa-fw"></i> Logout</MenuItem>
			</DropdownButton>
		)
	}
}

export default FontSize;