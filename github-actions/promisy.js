const { exec } = require('child_process');
const { writeFile } = require('fs-extra');
const https = require('https')
const path = require('path')
const fetch = require('node-fetch');
const core = require('@actions/core');
try {
    const options = {
        hostname: 'api.github.com',
        method: 'GET',
        path: '/search/repositories?q=topic:hack-for-la&sort=updated&order=desc',
        headers: {
            'Accept': 'application/vnd.github.mercy-preview+json',
            'User-Agent': 'HackForLA'
        }
    }
    var names = {}
    var promisesL = []
    var promisesC = []
    https.get(options, res => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
            body += data;
        });
        res.on("end", () => {
            body = JSON.parse(body)
                //console.log(body)
                //let newBody = JSON.stringify(body, null, 2);
            for (i = 0; i < body.items.length; i++) {
                names[i] = {
                    name: body.items[i].name,
                    iterator: body.items[i].id
                }
                promisesL.push(new Promise(function(resolve, reject) {
                    fetch(`https://api.github.com/repos/hackforla/${body.items[i].name}/languages`)
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(body) {
                            return (body)
                        })
                }))
                promisesC.push(new Promise(function(resolve, reject) {
                    fetch(`https://api.github.com/repos/hackforla/${body.items[i].name}/contributors`)
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(body) {
                            return (body)
                        })
                }))
            };
            Promise.all(promisesL)
                .then(function(L) {
                    for (i = 0; i < L.length; i++) {
                        names[i][lang] = L[i]
                    }
                    console.log(names)
                })
            Promise.all(promisesC)
                .then(function(C) {
                    for (i = 0; i < C.length; i++) {
                        names[i][lang] = C[i]
                    }
                    console.log(names)
                })
        });
    })
} catch (e) { console.log(e) }
