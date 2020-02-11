# GitHub Actions for Hack For LA website

The Hack for LA's website https://www.hackforla.org is a standard [Jekyll][jekyll] site hosted on [GitHub pages][ghpages]. The main content is a list of projects built by teams in our organization. Some of the data we want to show for each project is available from their GitHub repository. In particular the languages the project uses and a ranked list of contributors. Rather than ask the team leads to update that information on their project's Hack for LA profile, we would like to query that information from GitHub daily.

We have built a GitHub Action to write that information to a data file that can be used to update project profile pages whenever Jeckyll rebuilds our site. The code to do this constructed as follows: 

# Create 

Does Promise.all return in the same order promises were pushed to the array? (even though it is filled in asyncronosly?)