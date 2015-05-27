var Tradedesk = require('./lib/tradedesk');
var client = Tradedesk();

client.getAuthToken('login', 'pass', function(token) {
  client.setAuthToken(token);
  client.get('adgroup/query/facets', function(error, x, res) {
    if (error) throw error;
    console.log(x);
  });

  client.post('contract/query/partner/available', {partnerid: 'XXXXX', PageStartIndex: 0, PageSize: 0}, function(error, x ,res) {
    if (error) throw error;
    console.log(x);
  });
});
