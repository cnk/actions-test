// from https://medium.com/adobetech/how-to-combine-rest-api-calls-with-javascript-promises-in-node-js-or-openwhisk-d96cbc10f299

var request = require('request-promise');

var github = {
    token: null,
    apiData: {},
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
            //let apiData = {};
            let language_urls = [];
            let contributor_urls = [];
            body.items.forEach(function(project) {
                github.apiData[project.id] = {
                    name: project.name,
                    languages: {
                        url: project.languages_url,
                        data: []
                    },
                    contributors: { url: project.contributors_url, data: [] }
                };
            });
            return github.apiData;
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
            return Object.keys(body);
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
            let contributors = [];
            body.forEach(function(user) {
                contributors.push({
                    "id": user.id,
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
async function main(params) {
    github.token = params.token
    await github.getAllTaggedRepos()
    let projectIds = Object.keys(github.apiData)
    for (i = 0; i < projectIds.length; i++) {
        github.apiData[projectIds[i]].languages.data = github.getLanguageInfo(github.apiData[projectIds[i]].languages.url)
        github.apiData[projectIds[i]].contributors.data = github.getContributorsInfo(github.apiData[projectIds[i]].contributors.url)
    }
    let output = JSON.stringify(github.apiData);
    console.log(output)
}
main({ "token": process.argv[2] })