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

-> HOW to MAKE A Cookie 
   - use Sign with all the args
   - write it in cookie under a name.

-> How to make a new Route
  - in Server.js make a new route pah with a newName (any) 
      -- app.use("/users" , userRouter)
  - import this userRouter  where you gonna add all ts routes. lets say user.route.js
      - and is wali file me router.get() use krna hai.
      --- Now make routes inside this (controllers)
         - import express and app.use(express.json());
         - write the routes export async function ()=>{}
                --import these into the main file of routes(parent) and use


-> Login API
Validate all the data (check if email and password are provided)
Find user in the database using User.findOne({ email })
Compare passwords using bcrypt.compare(enteredPassword, hashedPassword)
Create JWT token using ->  jwt.sign({ id: user._id }, secretKey, { expiresIn: "2d" })
Wrap token in a cookie with options like:
    httpOnly: true
    sameSite: "strict"
    maxAge: 2 * 24 * 60 * 60 * 1000 (2 days)
Send JSON response with:
success status
message: "Login successful"
safe user details (never include password)

->Logut API
   - Simply remove the cookies
        res.clearCookie("jwt);   
   - bs ho gya....

-> Integrating Stream into app
  - import StreamChat from stream-chat.
  - import all the api keys and secret key both
  - make a async function
   const streamClient = StreamChat.getInstance(apiKey, apiSecret);
export const upsertStreamUser = async (userData) =>{
    try {
       await streamClient.upsertUser(userData); 
       return userData;
    } catch (error) {
        console.error("Error upserting Stream user:", error.message);
    }
}

  - and in signup
   await upsertStreamUser(
    {
            id : user._id.toString(),
            name : user.fullName, 
            image : user.profilePic || "",

          }
          )

- Protect our route (onboarding route => only signup users can go there.)
   route.get("/onboard" , protectRoute , onBoard)
 - use userAuth like function
      - import jwt , User (protectRoute) and cookie parser(in server.js)
      - use 3 paras (req , res, next) 
      - use jwt( our token name) token = res.cookies.jwt   => cookie me se jwt nikaal liya hai.
      - verify it with => decoded jwt.verify(token , JWT_SECRET_KEY)  => verify kiya hai.
      - verify decoded with findById(decode.id);  => JWT me jo id mila usse actual user ko database se find kar rahe ho.
      - req.user => uski full info req.user me attach kar do. 
          - - To attach the currently logged-in user's full data to the request object so that:
               All upcoming routes/middlewares can access the authenticated user.
               You don’t need to fetch user from DB again and again.
      - next()  => onBoard middleware ko bhi to call krna hai.


--> Feed API (getRecommended User)
   - khud ko , friends ko exclude krna hai and actually onboarded hone chahiye.
   bs

--> getFriends API
   - use Ref and Populate.

--> 