#node-tradedesk
---
## Description
node-tradedesk is a node.js module for interacting with The Trade Desk's API. View the API's documentation at [https://apis.thetradedesk.com/v3/doc](https://apisb.thetradedesk.com/v3/doc)

## Example
A token is necessary for all API calls. The module can either be instantianted with a previously obtained token:
```javascript
var Tradedesk = require('./lib/tradedesk');
var client = Tradedesk({token: 'thetoken'});

client.get('adgroup/query/facets', function(error, x, res) {
  if (error) throw error;
  console.log(x);
});
```

Or, if a token hasn't been retrieved yet:
```javascript
var Tradedesk = require('./lib/tradedesk');
var client = Tradedesk();

client.getAuthToken('username', 'password', function(token) {
  client.setAuthToken(token);
  client.get('adgroup/query/facets', function(error, x, res) {
    if (error) throw error;
    console.log(x);
  });

  client.post('contract/query/partner/available', {partnerid: 'xxxxx',
              PageStartIndex: 0, PageSize: 0}, function(error, x ,res) {
    if (error) throw error;
    console.log(x);
  });
});
```
