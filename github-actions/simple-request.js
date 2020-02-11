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
      body.items.forEach(function(project) {
        apiData[project.id] = {name: project.name,
                               languages: {url: project.languages_url},
                               contributors: {url: project.contributors_url}
                              };
        language_urls.push(project.languages_url);
      });
      return language_urls;
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
      return body;
    });
  }
}

function main(params) {
  return github.getAllTaggedRepos()
    .map(github.getLanguageInfo);
}

main().then(function(result) {
  console.log(result);
});
