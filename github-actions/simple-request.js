// from https://medium.com/adobetech/how-to-combine-rest-api-calls-with-javascript-promises-in-node-js-or-openwhisk-d96cbc10f299

var request = require('request-promise');

var github = {
  getAllTaggedRepos: function() {
    return request({
      "method":"GET",
      "uri": "https://api.github.com/search/repositories?q=topic:hack-for-la&sort=updated&order=desc",
      "json": true,
      "headers": {
        "User-Agent": "Hack For LA"
      }
    }).then(function(body) {
      let apiData = {};
      let language_urls = [];
      let contributor_urls = [];
      body.items.forEach(function(project) {
        apiData[project.id] = {name: project.name,
                               languages: {url: project.languages_url},
                               contributors: {url: project.contributors_url}
                              };
        language_urls.push(project.languages_url);
        contributor_urls.push(project.contributors_url);
      });
      return contributor_urls;
    }).catch(function(err) {
      return err.message;
    });
  },

  getLanguageInfo: function(url) {
    return request({
      "method":"GET",
      "uri": url,
      "json": true,
      "headers": {
        "User-Agent": "Hack For LA"
      }
    }).then(function(body) {
      return Object.keys(body);
    }).catch(function(err) {
      return err.message;
    });
  },

  getContributorsInfo: function(url) {
    return request({
      "method":"GET",
      "uri": url,
      "json": true,
      "headers": {
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
      return err.message;
    });
  }

}

function main(params) {
  return github.getAllTaggedRepos()
    .map(github.getContributorsInfo);
}

main().then(function(result) {
  console.log(result);
});
