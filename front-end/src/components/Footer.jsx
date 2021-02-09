import React from 'react';

export default class footer extends React.Component{

    handleLogOut()
    {   localStorage.removeItem("email");
        window.location.reload();
    }

    render(){
        return( 
            <footer>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="primary-button">
                                <button href="#" className="btn" onClick={this.handleLogOut}>Log Out</button>
                            </div>
                        </div>
                        <div className="col-md-12"> 
                            <ul className="social-icons">
                                <li><a href="facebook.com"><i className="fa fa-facebook"></i></a></li>
                                <li><a href="twitter.com"><i className="fa fa-twitter"></i></a></li>
                                <li><a href="linkedin.com"><i className="fa fa-linkedin"></i></a></li>
                                <li><a href="#"><i className="fa fa-rss"></i></a></li>
                                <li><a href="#"><i className="fa fa-behance"></i></a></li>
                            </ul>
                        </div>
                        <div className="col-md-12">
                            <p/>Copyright &copy; Grupo 7A
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}