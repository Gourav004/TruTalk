import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    fullName: {
        type:String,
        required : true,
        minlength: 3,
        maxlength: 50,
    },
    email : {
        type: String,
        required: true,
        unique : true,
    },
    password : {
        type : String ,
        required : true,
        minlength : 6,
        maxlength : 10,
        },
    bio:{
        type : String,
        default : '',
    },
    profilePic:{
        type : String,
        default : '',
    },
    nativeLanguage:{
        type : String,
        default : '',
    },
    learningLanguage:{
        type : String,
        default : '',
    },
    location:{
        type : String,
        default : '',
    },
    isOnboarded:{
        type : Boolean,
        default : false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);



//pre hook = > becrypting our password before saving it to the database
userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next(); //if password is not modified then skip the hashing
    // const salt = await bcrypt.genSalt(10);
    const hashedPassword =  await bcrypt.hash(this.password , 10);
    this.password = hashedPassword;  //exttra 
    next(); 
});

const User = mongoose.model("User" , userSchema);
export default User;
