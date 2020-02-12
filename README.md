# actions-test
Learning how to use github actions


# API Rate Limiting

The GitHub API rate limits unauthenticated calls. When the promises work, we run into that limit fairly quickly. To get around that, make a personal access token. 
	1. Go to your account information
	2. Click "Settings"
	3. Choose "Developer Settings"
	4. Make a new "Personal Access Token"


Then to run the code, install node v12, run `npm install` from the github-actions directory, then call the code as: 
```
  node simple-request.js <access token here>
  node chained.js <access token here>
```