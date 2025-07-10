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

- initialising git
   - git init
   - make a repo on github
   - give all commands
   - git remote remove origin -> if(origin already exists)

-> Mongoose
  - goto mongodb website
  - projects
  - create new project
  - Create a new Cluster
  - Copy password -> Create database
  -  CHoose a connection method -> Drivers
  - make a folder of constants-> make varoables -> paste it MONGO_URL
  --> Make a Database folder
  - make adb.js file
  - async function
  - await mongoose.connect(MONGO_URL)

-> SET up STREAM API key and secret key

-> create models for ddatabbase
  - create a user schema -> two args -> schema , timestamps:true;
  - timestamp will give the infor about createdAt and updatedAt
  - Salting the pass with becrypt before save user pre. (before schema declaration)

-> Creating Signup API
  - validate all the data
  - make a new instance of the user Schema using await
  - create a JWT token with JWT.sign (unique id : user id , secretKey , expiresIn : "2d")
  - wrap it in a cookie (with some params for safety)


