import * as React from 'react';

import { Route, Switch } from 'react-router';

import Layout from 'src/components/Layout';
import DiscoverStepper from 'src/components/DiscoverStepper';
import Authorize from 'src/components/Authorize';

export default <Layout>
    <Switch>
        <Route path="/authorize" component={Authorize}/>
        <Route path="/:step?" exact component={DiscoverStepper} />
    </Switch>
</Layout>