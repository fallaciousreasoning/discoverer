import React from 'react';
import {Route, IndexRoute } from 'react-router';

import {Layout} from './components/Layout';
import FindPage from './components/FindPage';
import PlaylistPage from './components/PlaylistPage';

const routes = (
    <Route path="/" component={Layout}>
        <IndexRoute component={FindPage}/>
    </Route>
)

export default routes;