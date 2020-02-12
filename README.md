# actions-test
Learning how to use github actions.

# Purpose

The Hack For LA web site lists projects being developed under its auspices. We would like to list the project languages and contributors for each project. Since GitHub has both of these pieces of information, we would like to use the GitHub API to pull this data each day - and if any of it has changed, update the project cards and republish the site. 

Stephen Nelson started this project (see https://github.com/StephenVNelson/website/tree/projects_page) and developed the general strategy: use GitHub Actions to query this information and write it to a json file in the website's repository. Committing this file to the gh-pages branch will trigger a rebuild of the web site. The project card and project page will look at data read from this db.json file to fill in languages and contributors from the json data.

The overall plan sounds good but the API calls to get the data still need a bit of work. The first call to list all of Hack for LA's projects is working - but that just gives is the list of projects and the urls for querying the other data. We need to extend Stephen's main.js code to produce the data we want to consume. The format we are looking for is a list (or object with the project id as the key) of objects with the following format:

```
	{
		"name": project.name,
		"languages": {
		    "url": project.languages_url,
		    "data": ["Ruby", "HTML", "Dockerfile"]
		},
		contributors: { 
			"url": project.contributors_url, 
			"data": {"id": user.id,
			         "github_url": user.html_url,
			         "avatar_url": user.avatar_url,
			         "gravatar_id": user.gravatar_id
			   		 }
			   		}
	}
```

2/11/2020 Running the code in simple-request.js as shown below demonstrates that the first call works and that the individual language calls and its data processing works, but we are not getting the data assigned to the language's data attribute. I suspect a timing issue - my console.log(apiData) is running before the Promise.all()s are finished resolving. (or I could be completely wrong.)


# API Rate Limiting

The GitHub API rate limits unauthenticated calls. When the promises work, we run into that limit fairly quickly. To get around that, make a personal access token. 
	1. Go to your account information
	2. Click "Settings"
	3. Choose "Developer Settings"
	4. Make a new "Personal Access Token"


Then to run the code, install node v12, run `npm install` from the github-actions directory, then call the code as: 
```
  node simple-request.js <access token here>
```