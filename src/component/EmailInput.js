import React from "react";
import "./EmailInput.css";

class EmailInput extends React.Component{
	render(){
		return(
			<div className="emailAddr">
				<table>
					<tbody>
						<tr>
							<td><span className="emailAddrLabel">To</span></td>
							<td className="email-input-container" onClick={() => {this.myInp.focus()}}>
								{this.props.toAddr.map((email,index)=>{
									return(
										<span key={index}>
										<span className="email-addr-style" key={email}>
										<span className="email-addr">{email}</span>
										<span className="close-button" 
											onClick={()=>this.props.removeEmail(email,this.props.type)}>
											<i className="material-icons">close</i>
										</span>
										</span>{/*" "*/}
										</span>
									)
								})}
								<input ref={(ip) => this.myInp = ip}
									className="emailAddrInput"
									type="text" 
									value={this.props.toAddrFieldVal} 
									onChange={this.props.onToAddrChange} 
									onKeyPress={this.props.addToAddr}/>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		)
	}
}

export default EmailInput;