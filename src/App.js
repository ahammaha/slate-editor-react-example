import React, { Component } from 'react';
import {MailEditor} from "./component";
import {Modal, Button} from "react-bootstrap";
import "./App.css";

class App extends Component {
	state={
		isEmailEditorOpen:false
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
						<Modal.Title className="email-modal-title">New Message</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<MailEditor />
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
