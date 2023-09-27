
const express = require('express');
const app = express();
const port = 443; // Default HTTPS port
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;

passport.use(
  new SamlStrategy(
    {
      entryPoint: 'https://login.microsoftonline.com/679e131c-fff7-46e7-a34e-8dcacf2445fe/saml2',
      issuer: 'https://ashuhw.github.io/ssolapp/',
      callbackUrl: '/sso',
      cert: 'MIIC8DCCAdigAwIBAgIQbiMfDtj67KpHJkCcFcxsADANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQDEylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGVkIFNTTyBDZXJ0aWZpY2F0ZTAeFw0yMzA5MjYxMjIwMDdaFw0yNjA5MjYxMjIwMDdaMDQxMjAwBgNVBAMTKU1pY3Jvc29mdCBBenVyZSBGZWRlcmF0ZWQgU1NPIENlcnRpZmljYXRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7j5U0f3DlNsdKCZE2A14E2Exz82ua5iJWldALJktAS1GmhVPrdTCQwELUl5YIIDSEgX9a7KOnD2QP7Lz8X38ChCFrZuymgs4G52Hu4nRPx8ABJgcT0Zfvx6ubax7ZMMPdJJogHkqAPv0IU9Ra8ockQ/FbsoA0tFpKHKSvwMf672jR16Dgxb6369cXzUNs2xcpKZo43VpjL1rkiieRJVQAUmDN2Oemi0u8BfnRXtXLt3cSqcKrZI7gNQaY2+pYRS+2QlR003foGBXnkMxqL9rL0t0/1u+c8TiJUsaU3pwF91FIqQ0RSPSyturr8MfHYt/RNw44qU/XYuC/m3QqWJ0hQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQDXAI4dm5dSBVmyqbqU+A9L4xCAPuLR4TeZPwQqBJd/zdptmFya7sEFxJ8uvrmQvNIhfWqZz9Gic3IIWI7NZgIeYMg9JnJEgDj7YennFFBvMQ4K27uMfSJr820j5rb3h7x9SkY/YlkDGHNA6NIHuIQL45P564X1YXXQIO48gNPrSFazdIOxN/lC4jKz/wkN2Wgat0wbYu5AnIuyaPtFCXcUTcCSlVMUGFs+lwNfOZv5KQ8Y28wLmVoh2RusVwe6KpMBz1H13b32NBsSwmNrYYH4sLfkNJKiTfshYX0J4FYn+aiRJMHC3AvYtU+CFvRulCxx71HWQwas/cTvBgvLBYJJ',
    },
    (profile, done) => {  // It’s callback function to handle user profile data received after successful authentication.
      return done(null, profile);
    }
  )
);

app.use(passport.initialize());

app.get('/login', (req, res, next) => {
  passport.authenticate('saml', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {

      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });

  })(req, res, next);
});
app.all('/callback', (req, res, next) => {

  passport.authenticate('saml', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/userdetails');
    });

  })(req, res, next);
});

app.get('/userdetails', (req, res) => {
  res.send('You are authorized user..!!Welcome to your Node.js application with SSO!');
});

app.listen(3003, () => {

    console.log('Server started on http://localhost:3003');
  
  }); 