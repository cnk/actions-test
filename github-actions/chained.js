// from https://medium.com/adobetech/how-to-combine-rest-api-calls-with-javascript-promises-in-node-js-or-openwhisk-d96cbc10f299

const fs = require('fs');
const path = require('path');
const request = require('request-promise');

var github = {
  token: null,

  getAllTaggedRepos: function() {
    return request({
      "method":"GET",
      "uri": "https://api.github.com/search/repositories?q=topic:hack-for-la&sort=updated&order=desc",
      "json": true,
      "headers": {
        "Authorization": "token " + github.token,
        "User-Agent": "Hack For LA"
      }
    }).then(function(body) {
      console.log('CNK starting first then ********');
      let apiData = [];
      let languages_calls = [];
      let contributors_calls = [];
      body.items.forEach(function(project) {
        apiData.push({id: project.id,
                      name: project.name,
                      languages: {url: project.languages_url, data: []},
                      contributors: {url: project.contributors_url, data: []}
                    });
        languages_calls.push(github.getLanguageInfo(project.languages_url));
        contributors_calls.push(github.getContributorsInfo(project.contributors_url));
      });
      return [apiData, languages_calls, contributors_calls];
    }).then(function(apiData, languages_calls, contributors_calls) {
      console.log('CNK starting second then ********');
      console.log(languages_calls);
      Promise.all(languages_calls)
        .then(function(responses) {
          for (var i = 0; i < responses.length; i++) {
            apiData[i].languages.data = responses[i];
            console.log(responses[i]);
          }
        }).catch(function(err) {
          console.log('Problem in languages Promise.all');
          return err.message;
        });

      Promise.all(contributors_calls)
        .then(function(responses) {
          for (var i = 0; i < responses.length; i++) {
            apiData[i].contributors.data = responses[i];
          }
        }).catch(function(err) {
          console.log('Problem in contributors Promise.all');
          return err.message;
        });

      return apiData;
    }).catch(function(err) {
      console.log('Problem getting hack for la repos');
      return err.message;
    });
  },

  getLanguageInfo: function(url) {
    return request({
      "method":"GET",
      "uri": url,
      "json": true,
      "headers": {
        "Authorization": "token " + github.token,
        "User-Agent": "Hack For LA"
      }
    }).then(function(body) {
      return Object.keys(body);
    }).catch(function(err) {
      console.log('Problem getting language info at url ' + url);
      return err.message;
    });
  },

  getContributorsInfo: function(url) {
    return request({
      "method":"GET",
      "uri": url,
      "json": true,
      "headers": {
        "Authorization": "token " + github.token,
        "User-Agent": "Hack For LA"
      }
    }).then(function(body) {
      let contributors = [];
      body.forEach(function(user) {
        contributors.push({"id": user.id,
                           "github_url": user.html_url,
                           "avatar_url": user.avatar_url,
                           "gravatar_id": user.gravatar_id
                          });
      });
      return contributors;
    }).catch(function(err) {
      console.log('Problem getting contributors info at url ' + url);
      return err.message;
    });
  }

}

function main(params) {
  github.token = params.token
  return github.getAllTaggedRepos();
}

main({"token": process.argv[2]}).then(function(result) {
  console.log(JSON.stringify(result));
});

