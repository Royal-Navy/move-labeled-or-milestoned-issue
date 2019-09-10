const github = require('@actions/github');
const core = require('@actions/core');
const graphql = require('@octokit/graphql');

async function run() {
    const myToken = core.getInput('repo-token');
    const projectId = core.getInput('project-id');
    const columnId = core.getInput('column-id');
    const labelName = core.getInput('label-name');
    const context = github.context;

    console.log(context.payload.issue.labels);

    var found = false;
    context.payload.issue.labels.forEach(function(item){
        console.log(item.name)
        if(labelName == item.name){
            // the label matches
            console.log("the label matches: " + labelName)
            found = true;
        }
    })

    if(found){
        try{
            // This might fail since the card is already created?
            /*
            await octokit.projects.createCard({
                column_id: columnId,
                content_id: context.payload.issue.id,
                content_type: "Issue"
            });
            */

            console.log("runing graphQL query #1");
            const response1  = await graphql(
                `
                  {
                    repository($owner: String!, $repo: String!) {
                        issues(states:CLOSED) {
                          totalCount
                        }
                      }
                  } 
                `,
                {
                  owner: 'bbq-beets',
                  repo: 'konradpabjan-test',  
                  headers: {
                    Authorization: `bearer ${myToken}`
                  }
                }
              );

            
            console.log(response1);

            console.log("runing graphQL query #2");
            const response2  = await graphql(
                `
                  {
                    repository(owner:"konradpabjan", name:"Testing2") {
                        issues(states:CLOSED) {
                          totalCount
                        }
                      }
                  }
                `,
                {
                  headers: {
                    Authorization: `bearer ${myToken}`
                  }
                }
              );

            console.log(response2);

            console.log("runing graphQL query #3");
            const response3  = await graphql(
                `
                  {
                    projects(id:"3181121") {
                        columns() {
                            id
                        }
                    }
                  }
                `,
                {
                  headers: {
                    Authorization: `bearer ${myToken}`
                  }
                }
              );

            console.log(response3);



            
        } catch (error) {
            console.log(error)
            /*
            // fetch all of the columns for the project
            var columnInformation = await octokit.projects.listColumns({
                project_id: 3181121
            });
            console.log(columnInformation)
            // we're going to have to get all the columns in 
            columnInformation.data.forEach(function )
            */
        }
    }

    octokit.projects.listCards()

    return "Initial Testing";
}

run()
    .then(
        (testing) => { console.log(`Testing # ${testing}`) },
        (err)  => { console.log(err) }
    )
    .then(
        () => { process.exit() }
     )