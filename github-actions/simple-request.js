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
                language_urls.push(project.languages_url);
                contributor_urls.push(project.contributors_url);
            });
            return language_urls;
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
    github.token = params.token
    await github.getAllTaggedRepos()
        //.map(github.getLanguageInfo);
    let projectIds = Object.keys(github.apiData)
    let lps = []
    let cps = []
    for (i = 0; i < projectIds.length; i++) {
        lps.push(github.getLanguageInfo(github.apiData[projectIds[i]].languages.url))
        cps.push(github.getContributorsInfo(github.apiData[projectIds[i]].contributors.url))
    }
    Promise.all(lps)
        .then(function(ls) {
            for (i = 0; i < ls.length; i++) {
                github.apiData[projectIds[i]].languages.data = ls[i]
                console.log(github.apiData[projectIds[i]].languages.data)
            }
        })
        .catch(function(e) {
            console.log(e)
        })
    Promise.all(cps)
        .then(function(cs) {
            for (i = 0; i < cs.length; i++) {
                github.apiData[projectIds[i]].contributors.data = cs[i]
                // console.log(github.apiData[projectIds[i]].contributors.data)
            }
        })
        .catch(function(e) {
            console.log(e)
        })
    var out = JSON.stringify(github.apiData);
    console.log(out)
}

main({ "token": process.argv[2] })