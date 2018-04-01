import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '@/store';
import App from '@/App';
import Profile from '@/components/modules/users/Profile';
import NotFound from '@/components/Pages/NotFound';

import 'scss/style.scss';
import 'scss/appStyles.scss';
import 'css/main.css';
// import 'semantic-ui-css/semantic.min.css';
// import { Button } from 'semantic-ui-react';


const UsersPage = () => <div>Users Page
  <Link to="/"><button> Go To Home</button></Link>
  </div>;
render(
  <Provider store={configureStore()}>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/users" exact component={UsersPage} />
        <Route exact path="/users/profile/:id" component={Profile} />
        <Route path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}
