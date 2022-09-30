# Split Associator

The Split Associator library allows you to handle the lifecycle of a user as they pass from anonymous, to logged in, and perhaps associated with other IDs such as accounts or customer. 

The Associator wraps the Split Javascript client - it requires a client side SDK key from [Split.io](https://www.split.io) in order to function. 

This demo shows how it can be used. 

Initial Call
```JS
const associator = new Associator('CLIENT_SDK_KEY', {'attr1': 'val1'}, true);
```

Note that the `getReady` function returns a promise.
This function is important because it matches the key to the trafficType - ensuring that splits that are called with the proper key.
```JS
associator.getReady(key, trafficType).then(() => {
  doSomething();
}
```

This is how you get treatments. The associator will automatically select the proper key for the split based upon the split's traffic type. The `config` parameter lets you optionally elect to recieve dynamic configuration. It can be `true` or `false`. 
```JS
associator.getTreatment(splitName, config)
```


The `track` function is used to track events - with an optional value and optional properties. It will automatically track for all traffic types that it knows about
```JS
associator.track(eventType, value, properties)
```


The `destroy` methods can be used to either destroy the client for an individual key or destroy all clients. 
Note that you can't bring a client back to life once you've destroyed it. 
```JS
associator.destroy(key);
associator.destroyAll();
```

The _Associator_ class itself is in the `public/js/script.js` file. 

To run this demo, first update with your client side SDK key in the `views/login.ejs` file and then in the terminal run `npm install` and then `node index.js` to run the demo server.

It will serve locally on port 3000
