import React, {useState} from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Msg from '../components/Msg.jsx'
import Map from '../components/Map.jsx'
import Footer from '../components/Footer.jsx'

import '../css/bootstrap.min.a.css' // da problemas ao layout do login
import '../css/bootstrap-theme.min.css'
import '../css/fontAwesome.css'
import '../css/hero-slider.css'
import '../css/owl-carousel.css'
import '../css/datepicker.css'
import '../css/tooplate-style.css'
import logo from '../image/logo2.png'
import {loadStripe} from '@stripe/stripe-js';
import {
    Elements, 
    CardElement, 
    useStripe, 
    useElements
} from '@stripe/react-stripe-js'

import env from "react-dotenv";

const stripePublicKey = env.REACT_APP_KEY
const price_per_km = env.REACT_APP_PRICE_PER_KM

const stripePromise = loadStripe(stripePublicKey)

const provincies = ["Cabo Delgado","Gaza","Inhambane","Manica","Nampula","Maputo","Niassa","sofala","Tete","Zambezia"]

toast.configure()

const notify = (message) => {
    toast(message)
}

const CheckoutForm = () => {
    
    const stripe = useStripe();
    const elements = useElements();

    //onChange={date=> setTicket({...ticket_states,depart_D: date})}

    const [amount,setAmount] = useState(0)
    const [isLoading, setLoading] = useState(false)

    const handleChange = event=> {       
        localStorage.setItem(event.target.name,event.target.value);

        if(event.target.name === "from" || event.target.name === "to")
        {   
            var a = localStorage.getItem('from') 
            var b = localStorage.getItem('to')
            if(a !== null && b !== null)
                callback(a,b)
        }
    }
    
    // get distance
    function callback(a,b) {
        var from = "", to = ""
        var coordenates=["-14.146474505777185,38.62012337689581","-23.32717,32.34752","-23.64070,35.29293","-16.85309,38.25967",
                        "-15.11703,39.27298","-25.97594,32.57932","-12.94611,36.47686","-19.83119,34.83713","-15.96070,33.58754","-16.61018,36.93783"]
       
        setLoading(true);

        for(let i=0; i<provincies.length; i++)
        {   if(provincies[i]===a)
                from = coordenates[i]
        }
    
        for(let i=0; i<provincies.length; i++)
        {   if(provincies[i]===b)
                to = coordenates[i]
        }
        console.log(from+"e: "+to)
        
        //get Distance from the python API"
        axios.post(`http://localhost:5000/distance`, {from:from,to:to})
            .then(res => {
                console.log(res)
                var val = Math.trunc((res.data.distance/1000)*price_per_km)
                localStorage.setItem('amount', val*100); //multiplicado por 100 porque stripe entende 2099 como 20,99
                setAmount(val);
                localStorage.setItem('duration', res.data.duration);
            }).catch((error) => { console.log("Something went wrong");
        });
        setLoading(false);
    }

    const handleSubmit = async event => {
        
        event.preventDefault();

        setLoading(true);

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement((CardElement))
        });

        if(!error){
            const {id} = paymentMethod;

            const ticket = {
                email: localStorage.getItem('email'),    
                from: localStorage.getItem('from'),
                to: localStorage.getItem('to'),
                depart: localStorage.getItem('depart_D'),
                return: localStorage.getItem('return_D'),
                time: localStorage.getItem('time'),
                trip: localStorage.getItem('trip'),
                id: id,
                amount: localStorage.getItem('amount'),
                duration: localStorage.getItem('duration')
            }
            localStorage.clear();
            localStorage.setItem('email',ticket.email)

            console.log(ticket)

            if(ticket.trip === "one-way")
                ticket.return = "-------"
            try{
                const requestOne = await axios.post("http://localhost:3001/purchase", ticket);
                const requestTwo = await axios.get("http://localhost:3001/fetch-pdf", { responseType: 'blob' });

                axios
                .all([requestOne, requestTwo])
                .then(
                    axios.spread((...responses) => {
                        const responseOne = responses[0];
                        const responseTwo = responses[1];

                    // use/access the results
                    notify(responseOne.data.confirm)
                    const pdfBlob = new Blob([responseTwo.data], { type: 'application/pdf' });
                    saveAs(pdfBlob, 'DTransport_Ticket.pdf');
                    })
                )
                .catch(errors => {
                    console.log(errors)
                    notify(errors.requestOne.data.message);
                });
            }catch (er){
                notify(er);
            }
        }
        else
            notify(error);
        setLoading(false);
    }
    
    return(
        <form onSubmit={handleSubmit} >
            <div className="col-md-6">
                <fieldset>
                    <label htmlFor="from">From:</label>
                    <select required name='from' onChange={handleChange}>
                        <option value="">Select the Province</option>
                        {   provincies.map(value=>(
                                    <option value={value}>{value}</option>
                                )
                            )
                        }
                    </select>
                </fieldset>
            </div>
            <div className="col-md-6">
                <fieldset>
                    <label htmlFor="to">To:</label>
                    <select required name='to' onChange={handleChange}>
                        <option value="">Select the Province</option>
                        {   provincies.map(value=>(
                                    <option value={value}>{value}</option>
                                )
                            )
                        }
                    </select>
                </fieldset>
            </div>
            <div className="col-md-6">
                <fieldset>
                    <label htmlFor="departure">Departure date:</label>
                    <DatePicker showYearropdown scrollableMonthYearDropdown 
                        minDate={new Date()} dateFormat='dd/MM/yyyy' 
                        onChange={date=> localStorage.setItem('depart_D', date)} name="departure" 
                        className="form-control date" type="text" id="departure" 
                        placeholder="Select date..." required=""/>
                </fieldset>
            </div>
            <div className="col-md-6">
                <fieldset>
                    <label htmlFor="return">Return date:</label>
                    <DatePicker showYearropdown scrollableMonthYearDropdown 
                        minDate={new Date()} dateFormat='dd/MM/yyyy' 
                        onChange={date=> localStorage.setItem('return_D', date)} name="return" type="text" 
                        className="form-control date" id="return" 
                        placeholder="Select date..." required=""/>
                </fieldset>
            </div>
            <div className="col-md-6">
                <fieldset>
                    <label htmlFor="time">Time:</label>
                    <select required name='time' onChange={handleChange}>
                        <option value="">Select a Time</option>
                        <option value="08:00">08:00</option>
                        <option value="12:00">12:00</option>
                        <option value="19:00">19:00</option>
                    </select>
                </fieldset>
            </div>
            <div className="col-md-6">
                <div className="radio-select" id="trips">
                    <div className="row" id="trips">
                        <div className="col-md-4 col-sm-5 col-xs-6">
                            <label htmlFor="round">Round</label>
                            <input type="radio" name="trip" id="round" value="round" required="required"onChange={handleChange}/>
                        </div>
                        <div className="col-md-2 col-sm-6 col-xs-6">
                            <label htmlFor="oneway">Oneway</label>
                            <input type="radio" name="trip" id="oneway" value="one-way" required="required"onChange={handleChange}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12">    
                <fieldset> 
                    <label htmlFor="card">Credit Card:</label>                           
                    <CardElement/>
                    {!isLoading && (
                        <button type="submit" id="form-submit" className="btn">
                            Buy {amount}$
                        </button>
                    )}
                    {isLoading && (
                        <button className="btn" disabled>
                            <i className="fas fa-spinner fa-spin"></i> Processing...
                        </button>
                    )}
                </fieldset>
            </div>
        </form>  
    )
}


export default class MainPage extends React.Component{

    render(){
        return( 
            <div>
                <section className="banner" id="top">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-5">
                                <div className="left-side">
                                    <div className="logo">
                                        <img src={logo} alt="Flight Template"/>
                                    </div>
                                    <div className="tabs-content">
                                        <h4>Choose Your Direction:</h4>
                                        <ul className="social-links">
                                            <li><a href="http://facebook.com">Find us on <em>Facebook</em><i className="fa fa-facebook"></i></a></li>
                                            <li><a href="http://youtube.com">Our <em>YouTube</em> Channel<i className="fa fa-youtube"></i></a></li>
                                            <li><a href="http://instagram.com">Follow our <em>instagram</em><i className="fa fa-instagram"></i></a></li>
                                        </ul>
                                    </div>
                                    <div className="page-direction-button">
                                        <a><i className="fa fa-phone"></i>+258 848143699</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5 col-md-offset-1">
                                <section id="first-tab-group" className="tabgroup">
                                    <div id="tab1">
                                        <div className="submit-form">
                                            <h4>Check availability for <em>direction</em>:</h4>
                                            <div id="form-submit">
                                                <div className="row">     
                                                    <Elements stripe={stripePromise} id="card">
                                                        <CheckoutForm/>                                                        
                                                    </Elements>
                                                </div>             
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="contact-us">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="section-heading">
                                    <h2>Contact Information</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Msg />
                <Map />
                <Footer />
            </div>
        )
    }
}