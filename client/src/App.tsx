import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import Register from './scenes/auth/register';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/">
                    <Register />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
