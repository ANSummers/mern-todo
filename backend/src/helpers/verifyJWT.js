import { default as jwt } from "jsonwebtoken";

export function verifyJWT(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    console.log("error");
    res.send("Access Token is required to view this page.");
  } else {
    jwt.verify(token, "shhhhh", (err, decoded) => {
      if (err) {
        console.log(err);
        res.send({ auth: false, message: "Failed to authenticate" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
}
