import * as React from 'react';
import { Route, Switch } from 'react-router';
import Authorize from './components/Authorize';
import DiscoverStepper from './components/DiscoverStepper';
import Layout from './components/Layout';



export default <Layout>
    <Switch>
        <Route path="/authorize" component={Authorize}/>
        <Route path="/:step?" exact component={DiscoverStepper} />
    </Switch>
</Layout>