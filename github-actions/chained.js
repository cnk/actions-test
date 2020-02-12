// from https://medium.com/adobetech/how-to-combine-rest-api-calls-with-javascript-promises-in-node-js-or-openwhisk-d96cbc10f299

var request = require('request-promise');

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
      let apiData = [];
      let language_urls = [];
      let contributor_urls = [];
      body.items.forEach(function(project) {
        apiData.push({id: project.id,
                      name: project.name,
                      languages: {url: project.languages_url},
                      contributors: {url: project.contributors_url}
                    });
        language_urls.push(github.getLanguageInfo(project.languages_url));
        contributor_urls.push(github.getContributorsInfo(project.contributors_url));
      });
      return [apiData, language_urls, contributor_urls];
    }).then(function(apiData, language_calls, contributor_calls) {
      Promise.all([language_calls])
        .then(function(responses) {
          responses.map(function(response) {
            console.log(response);
          });
          for (var i = 0; i < responses.length; i++) {
            // apiData[i].languages['data'] = responses[i];
            console.log(responses[i]);
          }
          return apiData;
        // }).catch(function(err) {
        //   console.log('Problem in languages promise');
        //   return err.message;
        });
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
  console.log(result);
});

