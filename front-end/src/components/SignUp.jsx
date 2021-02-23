import React from 'react';
import axios from 'axios';
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import emailjs from 'emailjs-com';

toast.configure()
const notify = (message) => {
    toast(message)
}

const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const formValid = ({ formErrors, ...rest }) => {
    let valid = true;

    // validate form errors being empty
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    // validate the form was filled out
    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });

    return valid;
};

export default class SignUp extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            nome: "",
            apelido: "",
            email: "",
            senha: "",
            confirm_senha: "",
            formErrors: {
                nome: "",
                apelido: "",
                email: "",
                senha: "",
                confirm_senha: ""
            },
            loading: false,
            msg: "Thank you for registering on DTransport"
                +"\nIn order to activate your account, please verify your e-mail address."
                +"\nYou can verify your e-mail by clicking the link:"
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        let formErrors = { ...this.state.formErrors };
        const { name, value } = event.target;

        switch (name) {
            case "nome":
                formErrors.nome =
                    value.length < 3 && value !== "" ? "minimum 3 characaters required" : "";
                break;
            case "apelido":
                formErrors.apelido =
                    value.length < 3 && value !== "" ? "minimum 3 characaters required" : "";
                break;
            case "email":
                formErrors.email = emailRegex.test(value)
                    && value !== "" ? ""
                    : "invalid email address";
                break;
            case "senha":
                formErrors.senha =
                    value.length < 6 && value !== "" ? "minimum 6 characaters required" : "";
                break;
            case "confirm_senha":
                formErrors.confirm_senha =
                    value !== this.state.senha && this.state.confirm_senha !== "" ? "Password don't match!!" : "";
                break;

            default:
                break;
        }
        this.setState({ formErrors, [name]: value }, () => console.log(this.state));
    }

    handleSubmit = event => {
        event.preventDefault(); //evitar muitos cliques
        const credenciais = {
            nome: this.state.nome,
            apelido: this.state.apelido,
            email: this.state.email,
            password: this.state.senha,
            status: "Not active"
        }

        this.setState({loading: true})

        
        if(formValid(this.state)) {
            axios.post(`http://localhost:3001/SignUpQuery`, credenciais)
            .then(res => {
                emailjs.sendForm('service_5myceph', 'template_j0hsmc5', event.target, 'user_UKiOQuIwgQnwGF0yCU1De')
                    .then((result) => {
                        notify("Check your e-mail to activate the account");
                    }, (error) => {
                        notify("It wasn't possible to send you an email");
                    });
            }).catch((error) => {
                notify(error)
            });
        }
        else
            notify("Fill the form correctly") 
        
        setTimeout(()=>{
            this.setState({loading: false});
        }, 2000)
    }
    render(){
        const {loading} = this.state
        const {formErrors} = this.state
        var {msg} = this.state
        msg += `http://localhost:3001/activate?token=${this.state.email}`
        return( 
            <div className="signup-content">
                <form id="formul" className="novaConta" action="signup" method="POST" onSubmit={this.handleSubmit} onChange={this.handleChange} noValidate>
                    <h2 className="title">Nova conta</h2>
                    <div>
                        <div className="input-div one">
                            <div className="i">
                                <i className="fas fa-user"></i>
                            </div>
                            <div className="div">
                                <input noValidate placeholder="Name" type="text" name= "nome" className="input" required/>
                                {formErrors.nome.length > 0 && (
                                    <span className="errorMessage">{formErrors.nome}</span>
                                )}
                            </div>
                        </div>
                        <div className="input-div one">
                            <div className="i">
                                <i className="fas fa-user"></i>
                            </div>
                            <div className="div">
                                <input noValidate placeholder="Surname" type="text" name= "apelido" className="input" required/>
                                {formErrors.apelido.length > 0 && (
                                    <span className="errorMessage">{formErrors.apelido}</span>
                                )}
                            </div>                         
                        </div>
                        <div className="input-div one">
                            <div className="i">
                                <i className="fa fa-envelope"></i>
                            </div>
                            <div className="div">
                                <input noValidate placeholder="E-mail" type="email" name= "email" className="input" required/>
                                {formErrors.email.length > 0 && (
                                    <span className="errorMessage">{formErrors.email}</span>
                                )}
                            </div>                        
                        </div>
                                   
                        <div className="input-div pass">
                            <div className="i"> 
                                    <i className="fas fa-lock"></i>
                            </div>
                            <div className="div">
                                <input noValidate placeholder="Password" type="password" name ="senha" className="input" required/>
                                {formErrors.senha.length > 0 && (
                                    <span className="errorMessage">{formErrors.senha}</span>
                                )}      
                            </div>               
                        </div>
                        <div className="input-div pass">
                            <div className="i"> 
                                    <i className="fas fa-lock"></i>
                            </div>
                            <div className="div">
                                <input noValidate placeholder="Confirm Password" type="password" name ="confirm_senha" className="input" required/>                                             
                                {formErrors.confirm_senha.length > 0 && (
                                    <span className="errorMessage">{formErrors.confirm_senha}</span>
                                )}
                            </div>
                        </div>
                        <textarea type="hidden" style={{display: "none"}} name="message" value={msg} className="form-control" id="message"></textarea>
                    </div>
                    <button type="submit" className="bt" value="signup" name="signup">
                        {loading && <i className="fas fa-spinner fa-spin"></i>}
                        {!loading && <span>SignUp</span>}
                    </button>
                    <label htmlFor="showLogin" className="showLogin-label" id="labelIndex">ja tem conta</label>
                </form>
            </div>
        );
    }
}