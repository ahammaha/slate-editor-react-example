import React, { Component } from 'react';
import {MailEditor} from "./component";
import {Modal, Button, MenuItem, DropdownButton} from "react-bootstrap";
import "./App.css";

// import all templates 
import blankTemplate from "./templates/BlankTemplate.json";
import template1 from './templates/Template1.json';
import template2 from './templates/Template2.json';

class App extends Component {
	state={
		isEmailEditorOpen:false,
		initialValue:blankTemplate,
		currentTemplate:"Empty Template",
		templates:["Empty Template","Template1","Template2"]
	}
	selectTemplate=(e,template)=>{
		console.log(template)
		this.setState({currentTemplate:template})
		switch(template){
			case "Empty Template":
				this.setState({initialValue:blankTemplate})
				return;
			case "Template1":
				this.setState({initialValue:template1})
				return;
			case "Template2":
				this.setState({initialValue:template2})
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
							<DropdownButton className="template-dropdown" id="template-dropdown" title={this.state.currentTemplate}>
								{this.state.templates.map((templateName, index) =>
									(
										<MenuItem key={index}
											active={this.state.currentTemplate===templateName}
											eventKey={index} 
											onMouseDown={event => (this.selectTemplate(event,templateName))}>
											{templateName}
										</MenuItem>
										)
									)}
							</DropdownButton>
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
