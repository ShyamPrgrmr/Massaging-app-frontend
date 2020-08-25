import React from 'react';
import './App.css';
import sendImg from './image.svg'
import MsgComponent from './component/msgcomponent';
import axios from 'axios';
import lodingImg from './loding.gif';
import openSocket from 'socket.io-client';

class App extends React.Component{
  constructor(){
    super();
    this.state = {login:false,
                  toggleLogin:false,
                  toggleRegister:false,
                  noTouch:false,
                  regname:'',
                  regpass:'',
                  regemail:'',
                  loginname:'',
                  loginpassword:'',
                  url:'https://warm-brushlands-24002.herokuapp.com/',
                  token:'',
                  msg:'',
                  msgqueue:[],
                  userid:''
                };
    this.btnLogin    = this.btnLogin.bind(this);
    this.btnRegister = this.btnRegister.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.btnLogout = this.btnLogout.bind(this);
    this.sendMsg = this.sendMsg.bind(this);

    let data = {name:'Shyam Pradhan (Admin) ',msg:'Do not use abusive language.',time:'Apna time aayega!'};
    let que = [];
    que.push(data);
    this.state.msgqueue = que;
  }

  componentDidMount=()=>{
    
    axios.get(this.state.url).then((result)=>{
    }).catch((result)=>{
      console.log("error");
    });

    const socket = openSocket(this.state.url);
    socket.on('posts',data=>{
      if(data.action==='create'){
        if(data.message.userid!=this.state.userid){
        this.addmsg(data.message.username,data.message.msg,data.message.time);
      }
      }
    });
  }

  login =(e)=>{
    e.preventDefault();
    this.setState({toggleLogin:false});
    let email = this.state.loginname;
    let pass = this.state.loginpassword;
    axios.post(this.state.url+'login',{email:email,pass:pass}).then(result=>{
      if(result.data.success){
          this.setState({token:result.data.token,login:true,userid:result.data.userid});
      }else{
        alert('Login credentials are wrong');
      }
      this.setState({toggleLogin:false,toggleRegister:false,noTouch:false});
    }).catch(err=>{
      console.log(err);
      this.setState({toggleLogin:false,toggleRegister:false,noTouch:false});
    });
  }
  register=(e)=>{
    e.preventDefault();
    this.setState({toggleRegister:false});
    let name = this.state.regname;
    let pass = this.state.regpass;
    let email = this.state.regemail;
    axios.post(this.state.url+'register',{name:name,email:email,pass:pass}).then(result=>{
      if(result.data.success){
        alert("registration successfull");
        this.setState({toggleLogin:false,toggleRegister:false,noTouch:false});
      }
    }).catch(err=>{
      console.log("Email already registered");
      this.setState({toggleLogin:false,toggleRegister:false,noTouch:false});
    });
  }

  onChange=(e)=>{
      e.preventDefault();
      this.setState({[e.target.name]:e.target.value})
  }

  closePopup=(e)=>{
    e.preventDefault();
    this.setState({toggleLogin:false,toggleRegister:false,noTouch:false});
  }

  btnLogout=(e) =>{
    e.preventDefault();
    this.setState({token:'',login:false});
  }
  btnLogin=(e)=>{
    e.preventDefault();
   let btn = !this.state.toggleLogin;
   this.setState({toggleLogin:btn,noTouch:btn})
  }
  btnRegister=(e)=>{
    e.preventDefault();
    let btn = !this.state.toggleRegister;
   this.setState({toggleRegister:btn,noTouch:btn})
  }
  toggleRegister=()=>{
    if(this.state.toggleRegister){
      return(
      <div className="register-form">
          <button onClick={this.closePopup} className="closebtn">Close</button>
          <label>Name</label>
          <input type="text" name="regname" onChange={this.onChange}></input>
          <label>Email</label>
          <input type="text" name="regemail" onChange={this.onChange}></input>
          <label>Password</label>
          <input type="password" name='regpass' onChange={this.onChange}></input>
          <button class='btn btn-full' name="regpass" onClick={this.register}>Register</button>
      </div>
    );
    }else{
      return(<div></div>);
    }
  }
  toggleLogin=()=>{
    if(this.state.toggleLogin){
      return(
      <div className="login-form">
          <button onClick={this.closePopup} className="closebtn">Close</button>
          <label>Email</label>
          <input type="text" name="loginname" onChange={this.onChange}></input>
          <label>Password</label>
          <input type="password" name="loginpassword" onChange={this.onChange}></input>
          <button class='btn btn-full' onClick={this.login}>Login</button>
      </div>
    )
    }else{
      return(<div></div>);
    }
  }
  isLogin=(e)=>{
    if(this.state.login){return(<button className="NavBtn" onClick={this.btnLogout}>Logout</button>);}else{return(<button className="NavBtn" onClick={this.btnLogin}>Login</button>);}
  }

  showRegister=(e)=>{
    if(this.state.login){return(<li></li>);}else{return(<li><button className="NavBtn" onClick={this.btnRegister}>Register</button></li>);}
  }

  noTouch=()=>{
    if(this.state.noTouch){
      return(<div className='noTouch'>
        <img src={lodingImg}></img>
      </div>);
    }else{
      return(<div></div>);
    }
  }
  
  loadmsg=()=>{
    let msgqueue = this.state.msgqueue;
    const mesgs = msgqueue.map(data=>{
      const loadData = {
        name:data.name,
        msg:data.msg,
        time:data.time
      };
      return(<MsgComponent 
                name={loadData.name}
                msg={loadData.msg}
                time={loadData.time}>
              </MsgComponent>)
    });
    return mesgs;
  }

  addmsg=(name,msg,time)=>{
    let msgqueue = this.state.msgqueue;
    msgqueue.push({name:name,msg:msg,time:time});
    this.setState({msgqueue:msgqueue},()=>{
      this.setState({noTouch:false});
    })
  }
  
  sendMsg=(e)=>{
    e.preventDefault(); 
    let token = this.state.token;
    let msg  = this.state.msg;
    this.setState({noTouch:true});
    axios.post(this.state.url+'postmsg',{token:token,msg:msg}).then(
      result =>{
        if(result.data.success){
        let name = result.data.name;
        let time = result.data.time;
        this.addmsg(name,msg,time);
        }else{
          alert(result.data.msg);
        }
      }
    ).catch(()=>{
      this.setState({noTouch:false});
      alert("Please do login")
    });
  }

  render(){
    return(
      <div>
      {this.toggleRegister()}
      {this.toggleLogin()}
      <div className="container">
          {this.noTouch()}
          <nav>
            <ul>
              <li>{this.isLogin()}</li>
              {this.showRegister()}
            </ul>
          </nav>
          <div className="chat">
            <div className="chat-dis">
              {this.loadmsg()}
            </div>
            <div className="chat-form">
              <input type='text' className='text' onChange={this.onChange} name='msg' id='msg'></input>
              <button className='btn' onClick={this.sendMsg}>
                <svg>
                  <use xlinkHref={sendImg+'#icon-checkmark'}></use>
                </svg>
              </button>
            </div>
          </div>
      </div>
      </div>
    );
  }
}
export default App;
