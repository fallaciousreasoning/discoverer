import * as React from 'react';

import { Route, Switch } from 'react-router';

import Layout from './components/Layout';

const TestComponent = (props: any) => <div>Foo</div>
const BarComponent = (props: any) => <div>Bar</div>

export default <Layout>
    <Switch>
        <Route path="/" exact component={TestComponent} />
        <Route path="/bar" component={BarComponent} />
    </Switch>
</Layout>