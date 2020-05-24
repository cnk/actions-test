// const core = require('@actions/core');
const fs = require('fs');
// const path = require('path');

function main(params) {
  console.log('In the function main');

  const API_URL = 'https://www.vrms.io/api/recurringevents';
  let calendarFetch = fetch(API_URL, {method: 'GET'});

  calendarFetch
    .then(response => response.json())
    .then(data => {
      console.log(JSON.stringify(data, null, 2));
      fs.writeFileSync('github-actions/vrms_data.json', JSON.stringify(data, null, 2));
    });
}

main();
