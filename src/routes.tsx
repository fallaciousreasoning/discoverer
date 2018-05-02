import * as React from 'react';

import { Route, Switch } from 'react-router';

import Layout from './components/Layout';
import DiscoverStepper from 'src/components/DiscoverStepper';

const TestComponent = (props: any) => <div>Foo</div>
const BarComponent = (props: any) => <div>Bar</div>

export default <Layout>
    <Switch>
        <Route path="/:step?" exact component={DiscoverStepper} />
    </Switch>
</Layout>