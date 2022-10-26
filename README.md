# AI-project

knex:
yarn add knex  pg @types/pg
yarn knex init -x ts
yarn knex migrate:latest
yarn knex seed:run 

# Stand on the production branch
git checkout production

# Merge the changes from main branch
git merge main

# Push the production to remote (github)
git push origin production

# Stand back on the main branch for future commits
git checkout main

123