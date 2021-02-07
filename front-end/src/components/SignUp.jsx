import React from 'react';
import axios from 'axios';
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

toast.configure()
const notify = (message) => {
    toast(message)
}

export default class SignUp extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            nome: " ",
            apelido: " ",
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
            nome: this.state.nome,
            apelido: this.state.apelido,
            email: this.state.email,
            password: this.state.senha,
        }

        this.setState({loading: true})
        
        axios.post(`http://localhost:3001/SignUpQuery`, credenciais)
            .then(res => {
                this.props.handleSucessfulAuth("a");
            }).catch((error) => {
                notify(error.response.data.message)
        });
            
        setTimeout(()=>{
            this.setState({loading: false});
        }, 2000)
    }
    render(){
        const {loading} = this.state;
        return( 
            <div className="signup-content">
                <form className="novaConta" action="signup" method="POST" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    <h2 className="title">Nova conta</h2>
                    <div>
                        <div className="input-div one">
                            <div className="i">
                                <i className="fas fa-user"></i>
                            </div>
                            <div className="div">
                                <input placeholder="Nome" type="text" name= "nome" className="input" required/>
                            </div>
                        </div>
                        <div className="input-div one">
                            <div className="i">
                                <i className="fas fa-user"></i>
                            </div>
                            <div className="div">
                                <input placeholder="Apelido" type="text" name= "apelido" className="input" required/>
                            </div>
                        </div>

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

                    <button type="submit" className="bt" value="signup" name="signup">
                        {loading && <i className="fas fa-spinner fa-spin"></i>}
                        {!loading && <span>Login</span>}
                    </button>
                    <label htmlFor="showLogin" className="showLogin-label" id="labelIndex">ja tem conta</label>
                </form>
            </div>
        );
    }
}