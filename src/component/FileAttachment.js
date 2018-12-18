import React from 'react';

class FileAttachment extends React.Component{
	componentDidMount() {
		this.newData.scrollIntoView({ behavior: "smooth" })
	}
	render(){
		return(
			<div className="file-attachment-div" ref={(ref) => this.newData = ref}>
				<a readOnly className="file-attachment" href={this.props.src}>
					<span className="filename">{this.props.filename}</span>
					<span className="grey-text">({this.props.fileSize})</span>
					<span className="remove-attachment" onClick={()=>this.props.removeAttachment(this.props.src)}></span>
				</a>
			</div>
		)
	}
}

export default FileAttachment;