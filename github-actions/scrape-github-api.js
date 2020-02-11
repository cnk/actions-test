const core = require('@actions/core');
const github = require('@actions/github');
const https = require("https");
const fs = require('fs');
const path = require('path')
const fetch = require("node-fetch");
const _ = require('lodash/core');


try {
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
  var language_calls = [];
  https.get(options, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);
      if (body.incomplete_results) {
        throw `We got ${body.total_count} projects but the response said this was not the full set`;
      }
      body.items.forEach(function(project) {
        apiData[project.id] = {name: project.name,
                               languages: {url: project.languages_url},
                               contributors: {url: project.contributors_url}
                              };

        language_calls.push(getLanguageData(project.languages_url));

      });
    });
  });
  console.log('Language calls list is:');
  console.log(language_calls);

  Promise.all(language_calls)
    .then(function(language_data) {
      console.log(language_data);
      // for (i = 0; i < language_data.length; i++) {
      //   names[i][lang] = language_data[i]
      // }
      // console.log(names)
    })
    .then(function() {
      console.log('API data is:');
      console.log(apiData);
    });

  // let jsonPath = path.join(__dirname, '..', 'db', 'db.json');
  // core.setOutput("json", apiData);
  // let newFileInfo = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  // console.log(newFileInfo.total_count);
} catch (error) {
  core.setFailed(error.message);
}

function getLanguageData(languages_url) {
  new Promise(function(resolve, reject) {
    fetch(languages_url)
      .then(function(response) {
        return response.json();
      })
      .then(function(body) {
        return (body)
      })
  })
}

