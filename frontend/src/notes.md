-2 folder bnao
  - backend
  -frontend

-frontend setup
  - npm create vite@latest .

-backend setup
   - npm init -y => package.json
   - npm install 

- changes in package.json
   - "type" : "module"
   - scripts : {
    "dev": "nodemon src/server.js"   //server.js is file name with location
   }
   - dependencies.....

-install all the dependencies - express, mongoose , jsw web token , cookies parser, cors  by npm i

all set... 

- create routes folder in src
make all the routes in one file under router and use in server.js
