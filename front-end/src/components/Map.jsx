import React from 'react';

export default class Map extends React.Component{
    
    render(){
        return( 
            <section className="map">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div id="map">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114869.8960674932!2d32.552714572211904!3d-25.879867538090362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ee6907869e02c27%3A0xfb5d1a512b67e2ba!2sMaputo%20International%20Airport!5e0!3m2!1sen!2smz!4v1610052446752!5m2!1sen!2smz" width="100%" height="500" frameBorder="0" style={{border: "0"}} allowFullScreen></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}