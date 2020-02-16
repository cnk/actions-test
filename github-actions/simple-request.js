const fs = require('fs');
const path = require('path');
const request = require('request-promise');

var github = {
  token: null,
  apiData: [],
  getAllTaggedRepos: function() {
    return request({
      "method": "GET",
      "uri": "https://api.github.com/search/repositories?q=topic:hack-for-la&sort=updated&order=desc",
      "json": true,
      "headers": {
        "Authorization": "token " + github.token,
        "User-Agent": "Hack For LA"
      }
    }).then(function(body) {
      body.items.forEach(function(project) {
        github.apiData.push({
          id: project.id,
          name: project.name,
          languages: { url: project.languages_url, data: [] },
          contributors: { url: project.contributors_url, data: [] }
        });
      });
    }).catch(function(err) {
      return err.message;
    });
  },
  getLanguageInfo: function(url) {
    return request({
      "method": "GET",
      "uri": url,
      "json": true,
      "headers": {
        "Authorization": "token " + github.token,
        "User-Agent": "Hack For LA"
      }
    }).then(function(body) {
      // The body contains an ordered list of languge + lines of code.
      // We care about the order of the names but not the number of lines of code.
      return Promise.resolve(Object.keys(body));
    }).catch(function(err) {
      return err.message;
    });
  },
  getContributorsInfo: function(url) {
    return request({
      "method": "GET",
      "uri": url,
      "json": true,
      "headers": {
        "Authorization": "token " + github.token,
        "User-Agent": "Hack For LA"
      }
    }).then(function(body) {
      // return a list of contributors sorted by number of commits
      let contributors = [];
      body.forEach(function(user) {
        contributors.push({
          "id": user.id,
          "github_url": user.html_url,
          "avatar_url": user.avatar_url,
          "gravatar_id": user.gravatar_id
        });
      });
      return Promise.resolve(contributors);
    }).catch(function(err) {
      return err.message;
    });
  }
}

async function main(params) {
  github.token = params.token;

  await github.getAllTaggedRepos();
  let lps = [];
  let cps = [];
  for (i = 0; i < github.apiData.length; i++) {
    lps.push(github.getLanguageInfo(github.apiData[i].languages.url));
    cps.push(github.getContributorsInfo(github.apiData[i].contributors.url));
  }
  await Promise.all(lps)
    .then(function(ls) {
      for (i = 0; i < ls.length; i++) {
        github.apiData[i].languages.data = ls[i]
      }
    })
    .catch(function(e) {
      console.log(e)
    });
  await Promise.all(cps)
    .then(function(cs) {
      for (i = 0; i < cs.length; i++) {
        github.apiData[i].contributors.data = cs[i]
      }
    })
    .catch(function(e) {
      console.log(e)
    });
  console.log(JSON.stringify(github.apiData));
  let jsonPath = path.join(__dirname, 'db.json');
  fs.writeFileSync(jsonPath, JSON.stringify(github.apiData));

}

main({ "token": process.argv[2] })
