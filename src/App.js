import React, { Component } from 'react';
import {MailEditor} from "./component";
import {Modal, Button, MenuItem, DropdownButton} from "react-bootstrap";
import "./App.css";

// import all templates 
import {EMPTY_TEMPLATE,WEEKLY_REPORT,SUMMARY_TEMPLATE} from "./templates/htmlTemplates.js";

class App extends Component {
	state={
		isEmailEditorOpen:false,
		initialValue:EMPTY_TEMPLATE,
		currentTemplate:"Empty Template",
		templates:["Empty Template","Weekly Report","Summary Template"]
	}
	selectTemplate=(e,template)=>{
		this.setState({currentTemplate:template})
		switch(template){
			case "Empty Template":
				this.setState({initialValue:EMPTY_TEMPLATE})
				return;
			case "Weekly Report":
				this.setState({initialValue:WEEKLY_REPORT})
				return;
			case "Summary Template":
				this.setState({initialValue:SUMMARY_TEMPLATE})
				return;
			default:
				return;
		}
	}
	render() {
		return (
			<div className="App">
		        <Button bsStyle="primary" onClick={this.toggleModal}>Compose Email</Button>
		        <Modal dialogClassName="emailModalDialog"
					show={this.state.isEmailEditorOpen}
					onHide={this.toggleModal}
					backdrop="static">
					<Modal.Header closeButton>
						<Modal.Title className="email-modal-title">
							SEND SUMMARY MAIL
							<div className="template-dropdown-container">
								<DropdownButton className="template-dropdown" id="template-dropdown" title={this.state.currentTemplate}>
									{this.state.templates.map((templateName, index) =>
										(<MenuItem key={index}
											active={this.state.currentTemplate===templateName}
											eventKey={index} 
											onMouseDown={event => (this.selectTemplate(event,templateName))}>
											{templateName}
										</MenuItem>)
									)}
								</DropdownButton>
							</div>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<MailEditor initialValue={this.state.initialValue} />
					</Modal.Body>
				</Modal>
			</div>
		);
	}
	toggleModal=()=>{
		this.setState(prevState => ({isEmailEditorOpen: !prevState.isEmailEditorOpen}));
	}
}

export default App;
