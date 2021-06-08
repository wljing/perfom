import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Desktop from '@/pages/desktop';
// import Lock from '@/pages/lock';

export default () => (
  <Router>
    <Route path="/" exact component={Desktop} />
    {/* <Route path="/" exact component={Test} /> */}
  </Router>
);