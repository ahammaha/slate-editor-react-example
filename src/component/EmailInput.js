import React from "react";
import "./EmailInput.css";

const EmailInput = (props) => {
	return(
		<div className="emailAddr">
			<table>
				<tbody>
					<tr>
						<td><span className="emailAddrLabel">To</span></td>
						<td>
							{props.toAddr.map((email,index)=>{
								return(
									<span key={index}>
									<span className="email-addr-style" key={email}>
									<span className="email-addr">{email}</span>
					         		<span className="close-button" 
										onClick={()=>props.removeEmail(email,props.type)}>
										<i class="material-icons">close</i>
									</span>
         							</span>{/*" "*/}
         							</span>
								)
							})}
							<input 
								className="emailAddrInput"
								type="text" 
								value={props.toAddrFieldVal} 
								onChange={props.onToAddrChange} 
								onKeyPress={props.addToAddr}/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}

export default EmailInput;