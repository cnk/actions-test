const core = require('@actions/core');
const github = require('@actions/github');
const https = require("https");
const fs = require('fs');
const path = require('path')


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
  https.get(options, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);
      console.log(body);
      // let newBody = JSON.stringify(body, null, 2);
      // let jsonPath = path.join(__dirname, '..', 'db', 'db.json');
      // core.setOutput("json", newBody)
    });
  });

  // let newFileInfo = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  // console.log(newFileInfo.total_count);
} catch (error) {
  core.setFailed(error.message);
}
