const express = require('express');
const app = express();
const fetch = require('node-fetch');
const path = require('path');
const querystring = require('querystring');
var engines = require('consolidate');

app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/search', (request, response) => {
  const type = request.body['type'];
  const str = request.body['str'];
  getHospitals();
  async function getHospitals() {
    let url;
    if (type.trim().localeCompare('drg') == 0) {
      url = `https://data.cms.gov/resource/tcsp-6e99.json?drg_definition=${str}&provider_state=CA`;
    }
    else if (type.trim().localeCompare('apc') == 0) url = `https://data.cms.gov/resource/fmbt-qrrw.json?apc_desc=${str}&provider_state=CA`;
    const api = await fetch(url);
    const api_data = await api.json();
    response.json(api_data);
  };
});

app.post('/see_more', (request, response) => {
  const hospital = request.body['hospital'];
  const proc = request.body['search'];
  response.render('see_more.html', { hospital: hospital });
});

app.get('/see_more/:data', async (request, response) => {
  const data = request.params.data.split('+');
  const hospital = decodeURI(data[0]);
  const proc = decodeURI(data[1]);  
  const type = data[2];
  const state = data[3]; 
  const hospital_ = querystring.escape(hospital);
  const proc_ = querystring.escape(proc);
  console.log(proc_);
  response.render('see_more.html', {hospital_, proc_, type, state});
});

app.post('/api', (request, response) => {
  const data = request.body;
  alert('here');
  response.json(data);
});

app.get('/api', (request, response) => {
    console.log('this one');
    response.json(request);
});

app.post('/querify', (request, response) => {
  const temp = request.body['name_temp'];
  const name = querystring.escape(temp);
  response.json(name);
});