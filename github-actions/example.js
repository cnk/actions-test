const fetch = require("node-fetch");

const options = {
  hostname: 'api.github.com',
  method : 'GET',
  path: '/search/repositories?q=topic:hack-for-la&sort=updated&order=desc',
  headers: {
    'Accept': 'application/vnd.github.mercy-preview+json',
    'User-Agent': 'HackForLA'
  }
}

var apiData = {};

fetch('https://api.github.com/search/repositories?q=topic:hack-for-la&sort=updated&order=desc')
  .then(function (response) {
    // Get a JSON object from the response
    // This is a weird quirk of Fetch
    return response.json();
  }).then(function (data) {
    let language_calls = [];
    data.items.forEach(function(project) {
      apiData[project.id] = {name: project.name,
                             languages: {url: project.languages_url},
                             contributors: {url: project.contributors_url}
                            };

      language_calls.push(fetch(project.languages_url));

    });
    return language_calls;
  }).then(function (language_call_promises) {
    Promise.all(language_call_promises)
      .then(function (responses) {
        // Get a JSON object from each of the responses
        return responses.map(function (response) {
          return response.json();
        });
      }).then(function (data) {
        // Log the data to the console
        // You would do something with both sets of data here
        console.log(data);
      }).catch(function (error) {
        // if there's an error, log it
        console.log(error);
      });

  }).catch(function (error) {
    // if there's an error, log it
    console.log(error);
  });

