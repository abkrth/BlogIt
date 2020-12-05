const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const Blog = require('./blog')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error('Password cannot contain "password"');
            }
        },
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    avatar: {
        type: Buffer,
    },
})

userSchema.virtual("blogs", {
    ref: "Blog",
    localField: "_id",
    foreignField: "owner"
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString()}, "thakursaab")
    
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	delete userObject.tokens;
	// delete userObject.avatar;
	return userObject;
};

// static methods are for the whole model
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error("Unable to login");
	}
    //const isMatch = await bcrypt.compare(password, user.password);
    console.log(password)
    console.log(user.password)
    const isMatch = (user.password == password)
	if (!isMatch) {
		throw new Error("Unable to login");
	}
	return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User