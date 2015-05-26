var Tradedesk = require('./lib/tradedesk');
var client = Tradedesk({token: 'thetoken'});

client.get('adgroup/query/facets', function(error, x, res) {
  if (error) throw error;
  console.log(x);
});

client.get('/overview/partner', {partnerid: 'dly0gyd'}, function(error, x ,res) {
  if (error) throw error;
  console.log(x);
});

client.post('contract/query/partner/available', {partnerid: 'dly0gyd', PageStartIndex: 0, PageSize: 0}, function(error, x ,res) {
  if (error) throw error;
  console.log(x);
});

