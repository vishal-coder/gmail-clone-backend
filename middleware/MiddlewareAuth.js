import jwt from "jsonwebtoken";

export const auth = (request, response, next) => {
  try {
    const token = request.header("x-auth-token");
    console.log("x-auth-token in middleware", token);
    if (!token) return response.status(401).send("Access Denied");

    const verified = jwt.verify(token, process.env.SECRET_KEY);
    request.user = verified;
    next();
  } catch (err) {
    response.status(401).send({ error: err.message });
  }
};
