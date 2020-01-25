# amplify-auth-next-storage

> Isomorphic cookie storage for Next.js apps using @aws-amplify/auth

### Installation

`$ npm install amplify-auth-next-storage`

### Usage

```js
import Auth from '@aws-amplify/auth';
import NextStorage from 'amplify-auth-next-storage';

Component.getInitialProps = async (ctx) => {
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

  return {};
};
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
