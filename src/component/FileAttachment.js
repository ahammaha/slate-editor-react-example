import React from 'react';
import "./FileAttachment.css";

class FileAttachment extends React.Component{
	componentDidMount() {
		this.newData.scrollIntoView({ behavior: "smooth" })
	}
	render(){
		return(
			<div className="file-attachment-div" ref={(ref) => this.newData = ref}>
				<a readOnly className="file-attachment" href={this.props.src}>
					<span className="file-details">
						<span className="filename">{this.props.filename}</span>
						<span className="invoiceAmount">{this.props.fileSize}</span>
					</span>
					<span className="remove-attachment" 
							onClick={()=>this.props.removeAttachment(this.props.src)}>
						<i className="material-icons">close</i>
					</span>
				</a>
			</div>
		)
	}
}

export default FileAttachment;