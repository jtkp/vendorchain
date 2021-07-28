import React from 'react';

// pages
import AppHeader from './components/AppHeader';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ContractEdit from './pages/ContractEdit';


// packages
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';


function App() {
  const [login, setLogin] = React.useState();

  // check if user is logged in - 
  // FIXME: currently save password into local storage
  React.useEffect(() => {
    if (localStorage.getItem('user')) setLogin(true);
    console.log(login);
  }, [login]);

  const logout = () => {
    localStorage.removeItem('user');
    setLogin(false);
  };
  
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route
            path='/'
            render={({ match: { url } }) => (
              <>
                <AppHeader logout={logout}/>
                {/* Home page */}
                <Switch>
                  <Route exact path={url} component={Home}/>
                  <Route exact path={`${url}home`} component={Home}/>
                  <Route exact path={`${url}login`} component={Login}/>
                  <Route exact path={`${url}register`} component={Register}/>
                  <Route exact path={`${url}dashboard`} component={Dashboard} />

                  {/* Contract edit TODO: use contract id here*/}
                  <Route exact path={`${url}contract/edit/:id`} component={ContractEdit} />

                  <Route exact path="*" component={NotFound} />

                </Switch>
              </>
            )}
          />
          {/* Any other path leads to 404 page */}
          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
