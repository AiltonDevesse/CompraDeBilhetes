import React, { useState } from 'react';
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import emailjs from 'emailjs-com';

toast.configure()
const notify = (message) => {
    toast(message)
}

const Msg = () => {

    const [isLoading, setLoading] = useState(false)
 
    const handleSubmit = event => {
        event.preventDefault(); //evitar muitos cliques
        setLoading(true);
        emailjs.sendForm('service_5myceph', 'template_zsv219v', event.target, 'user_UKiOQuIwgQnwGF0yCU1De')
            .then((result) => {
                notify("Your e-mail was sent");
                setLoading(false);
            }, (error) => {
                notify("It wasn't possible to send your email");
            });
    }

    return( 
        <section className="contact-form">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="section-heading">
                            <h2>Leave us a message</h2>
                        </div>
                    </div>
                    <div className="col-md-6 col-md-offset-3">
                        <form id="contact" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <fieldset>
                                        <input name="name" type="text" className="form-control" id="name" placeholder="Your name..." required=""/>
                                    </fieldset>
                                </div>
                                <div className="col-md-6">
                                    <fieldset>
                                        <input name="email" type="email" className="form-control" id="email" placeholder="Your email..." required=""/>
                                    </fieldset>
                                </div>
                                <div className="col-md-12">
                                    <fieldset>
                                        <textarea name="message" rows="6" className="form-control" id="message" placeholder="Your message..." required=""></textarea>
                                    </fieldset>
                                </div>
                                <div className="col-md-12">
                                    <fieldset>
                                        {!isLoading && (
                                            <button type="submit" id="form-submit" className="btn">
                                                Submit Your E-mail
                                            </button>
                                        )}
                                        {isLoading && (
                                            <button className="btn" disabled>
                                                <i className="fas fa-spinner fa-spin"></i> Sending...
                                            </button>
                                        )}
                                    </fieldset>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Msg;