import { Redirect } from '@docusaurus/router';
import React from 'react';

export default function Home(): JSX.Element {
  return <Redirect to="/docs/intro" />;
}
