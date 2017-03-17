import React from 'react';
import {Route, IndexRoute } from 'react-router';

import {Layout} from './components/Layout';
import GeneratorPage from './components/GeneratorPage';

const routes = (
    <Route path="/*" component={Layout}>
        <IndexRoute component={GeneratorPage}/>
    </Route>
)

export default routes;