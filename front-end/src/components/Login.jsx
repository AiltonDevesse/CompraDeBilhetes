import React from 'react';
import axios from 'axios';
import avatar from '../image/avatar.svg';
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


toast.configure()
const notify = (message) => {
    toast(message)
}

export default class Login extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            email: " ",
            senha: " ",
            loading: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault(); //evitar muitos cliques
        const credenciais = {
            email: this.state.email,
            password: this.state.senha
        }

        this.setState({loading: true})
        
        axios.post(`http://localhost:3001/loginQuery`, credenciais)
            .then(res => {
                localStorage.setItem("email",credenciais.email);
                this.props.handleSucessfulAuth("a");
            }).catch((error) => { notify(error.response.data.message);
            
        });
        setTimeout(()=>{
            this.setState({loading: false});
        }, 2000)
    }
    
    render(){
        const {loading} = this.state;
        return( 
            <div className="login-content">
                <form id="formu" action="login" method="POST" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    <img src={avatar} alt="avatar"/>
                    <h2 className="title">Bem-vindo</h2>
                    <div>
                        <div className="input-div one">
                            <div className="i">
                                <i className="fa fa-envelope"></i>
                            </div>
                            <div className="div">
                                <input placeholder="E-mail" type="email" name= "email" className="input" required/>
                            </div>
                        </div>
                                        
                        <div className="input-div pass">
                            <div className="i"> 
                                    <i className="fas fa-lock"></i>
                            </div>
                            <div className="div">
                                <input placeholder="Senha" type="password" name ="senha" className="input" required/>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="bt" value="Login" name="login" disabled={loading}>
                            {loading && <i className="fas fa-spinner fa-spin"></i>}
                            {!loading && <span>Login</span>}
                    </button>
                    <label htmlFor="showNovaConta" className="showNovaConta-label" id="labelIndex">criar nova conta</label>
                </form>
            </div>
        );
    }
}