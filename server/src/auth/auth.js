import jwt from "jsonwebtoken";

export const createRefreshToken = (userId) => {
	const refreshToken = jwt.sign(
		{
			_id: userId,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: "7d",
		}
	);
	return refreshToken;
};

export const createAccessToken = (userId) => {
	const accessToken = jwt.sign(
		{
			_id: userId,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "20s",
		}
	);
	return accessToken;
};

export const verifyAccessToken = (token) => {
	try {
		const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		return data;
	} catch (err) {
		return null;
	}
};

export const verifyRefreshToken = (token) => {
	try {
		const data = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
		return data;
	} catch (err) {
		return null;
	}
};
