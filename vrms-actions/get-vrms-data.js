const fs = require('fs');

function main(params) {
  console.log('In the function main');

  const API_URL = 'https://www.vrms.io/api/recurringevents';
  let calendarFetch = fetch(API_URL, {method: 'GET'});

  calendarFetch
    .then(response => response.json())
    .then(data => {
      console.log(JSON.stringify(data, null, 2));
      fs.writeFileSync('_data/vrms_data.json', JSON.stringify(data, null, 2));
    });
}

main();
