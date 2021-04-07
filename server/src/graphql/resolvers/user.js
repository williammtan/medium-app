import { User } from "../../models/user.model";
import bcrypt from "bcrypt";
import { UserInputError } from "apollo-server-express";
import { createAccessToken, createRefreshToken } from "../../auth/auth";
import { requiresAuth } from "../../auth/permissions";

export default {
	Query: {
		me: requiresAuth.createResolver(async (_, __, context) => {
			const userId = context.req.user;
			const user = User.findById(userId);
			return user;
		}),
		users: async () => {
			let users = await User.find();
			let new_users = [];

			for (const i in users) {
				let user = users[i];
				let followers = [];
				for (const j in user.following) {
					let following_id = user.following[j];
					followers.push(users.filter((user) => user._id == following_id)[0]);
				}
				user.followers = followers;
				new_users.push(user);
			}

			return new_users;
		},
		user: async (_, args) => {
			const user = User.findById(args._id);
			return user;
		},
	},
	Mutation: {
		register: async (
			_,
			{ registerInput: { username, email, password, confirmPassword } }
		) => {
			// check username and id is not available {username email, password, confirmPassword}
			const testUsername = await User.findOne({ username: username });
			const testEmail = await User.findOne({ email: email });

			// verify password match and strength
			const passwordMatch = password == confirmPassword;
			const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
			const passwordStrength = password.match(passwordPattern);

			const valid = {
				username: !testUsername,
				email: !testEmail,
				passwordMatch: passwordMatch,
				passwordStrength: !!passwordStrength,
			};

			if (Object.values(valid).some((valid) => !valid)) {
				// not valid return {}
				throw new UserInputError(JSON.stringify(valid));
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const user = new User({
				username,
				password: hashedPassword,
				email,
			});
			await user.save();
			return true;
		},
		login: async (_, { loginInput: { username, password } }, { res }) => {
			// get user from email
			const user = await User.findOne({ username: username });

			if (!user) {
				// user not existing
				return null;
			}

			// check if password is correct
			const valid = await bcrypt.compare(password, user.password);

			if (!valid) {
				// passwords don't match
				return null;
			}

			// return refresh and access tokens
			const refreshToken = createRefreshToken(user._id);
			const accessToken = createAccessToken(user._id);

			res.cookie("refreshToken", refreshToken);
			res.cookie("accessToken", accessToken);

			return user;
		},
		logout: requiresAuth.createResolver((_, __, context) => {
			try {
				context.res.clearCookie("accessToken");
				context.res.clearCookie("refreshToken");
				return true;
			} catch (err) {
				console.log(err);
				return false;
			}
		}),
	},
};
