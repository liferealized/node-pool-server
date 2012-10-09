node-pool-server
================

Small app to sit in front of bitcoind to solo mine on.

To run the app, first install node.js in your environment and clone this repo to your server. Once completed, run:

``` js
  npm install
```

This will install all of the dependencies for the app.

Copy the file ``` example.config.js``` to ```config.js``` and edit the configuration to your liking. Then run:

``` js
  node app
```