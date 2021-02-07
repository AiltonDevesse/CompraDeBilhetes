import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import Index from './Pages/index.jsx';
import MainPage from './Pages/MainPage.jsx';
import NotFound from './Pages/NotFound';


const isAuthenticated = () => !!localStorage.getItem('email');

class Routes extends Component{
    render(){
        return(
            <>
                <Router>
                    <Switch>
                        <Route exact path={"/index"} render={props=>(
                            <Index {...props}/>
                        )}/>
                        <Route path="/" component={ Private }/>
                    </Switch>
                </Router>
            </>
        )
    }
}


function Private() {
    
    return (
      isAuthenticated() ? (
          <Router>
              <Switch>
                <Route exact path={"/"} render={props =>(
                    <MainPage {...props}/>
                )}/>
                <Route component={ NotFound }/>
              </Switch>
              {/* Footer */}
          </Router>
      )
      :
      (
          <Redirect to="/index"/>
      )
    )
}

export default Routes;



