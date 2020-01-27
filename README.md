# amplify-auth-next-storage

> Isomorphic cookie storage for Next.js apps using @aws-amplify/auth

### Installation

`$ npm install amplify-auth-next-storage`

### Usage

```js
// utils/auth-utils.js

// Placing your configuration into a reusable utility function isn't strictly
// necessary, but makes repeated use of the configuration function easier

import Auth from '@aws-amplify/auth';
import NextStorage from 'amplify-auth-next-storage';

export function configurePool(ctx) {
  Auth.configure({
    region: 'us-east-1',
    userPoolId: 'us-east-1_xxxxx',
    userPoolWebClientId: 'xxxxxxxxxxxxxxx',
    storage: new NextStorage(ctx, {
      domain: '.yourdomain.com',
      expires: 365,
      path: '/',
      secure: true,
    }),
  });
}

// pages/_app.js

import React from 'react';
import { configurePool } from 'utils/auth-utils';

const YourApp = ({ Component, pageProps }) => {
  // Running this once at the app level, client-side, allows you to
  // use `Auth` methods in all of your components 

  configurePool();

  return <Component {...pageProps} />;
};

YourApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  // However, we need to configure the pool every time it's needed within getInitialProps

  configurePool(appContext.ctx);

  // ... do stuff with Auth. e.g. Auth.currentUserInfo

  return { ...appProps };
};

export default YourApp;

// components/FancyComponent.js

import React from 'react';
import { configurePool } from 'utils/auth-utils';

const FancyComponent = () => {
  // You can use auth here without configuring the pool since we already
  // configured it at the YourApp level

  Auth.currentUserInfo().then(currentUser => console.log(currentUser));

  return <div>Fancy Component</div>;
}

FancyComponent.getInitialProps = async (ctx) => {
  // If we need Auth in this component server-side, we need to configure the pool again

  configurePool(ctx);

  await Auth.currentUserInfo().then(currentUser => console.log(currentUser));

  return {};
}
```

### Options

```js
new NextStorage(ctx, options)
```

- `ctx` is the Next.js ctx object
- `options` are identical to Amplify's `cookieStorage` configuration options.

https://aws-amplify.github.io/docs/js/authentication#manual-setup

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| domain **(required)** | string | *none* | Cookies domain |
| expires | number | 365 | Cookie expiration in days |
| path | string | / | Cookies path |
| secure | boolean | true | Cookie secure flag |

### Notes

If you're struggling to get `Auth.configure` to work properly on the server side, one workaround is to use something like `node-fetch` as the global fetch.

```js
// _app.js

import fetch from 'node-fetch';

global.fetch = fetch;

// ... the rest of your _app.js file
```