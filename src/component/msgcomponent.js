import React from 'react';

class MsgComponet extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return( 
        <div className="chat-dis-msg">
            <div class="name">{this.props.name}</div>
            <div class="msg">{this.props.msg}</div>
            <div class="time">{this.props.time}</div>
        </div>);
    }
}

export default MsgComponet;