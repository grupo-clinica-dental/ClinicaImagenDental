const jwt = require("jsonwebtoken");
const getNewResponseApi = require('./../utils/createApiResponse');


function requireAuth  (
  req,
  res,
  next
)  {
  const authHeader = req.headers.authorization;

const response = getNewResponseApi()

  // debe ir en los headers de la solicitud

  if (!authHeader)
    return res.status(401).json({
      ...response,
      message: "Falta encabezado de autorización",
    });

  const token = authHeader.split(" ")[1];

  // headers AUTHORIZATION = 'Bearer laksfhjasklfa564'


  if (!token)
    return res.status(401).json({
      ...response,
      message: "Usted no esta Autorizado",
    });

  // si solo viene el bearer sin el token no pasara

    console.log(process.env.TOKENSECRET)

  jwt.verify(token, process.env.TOKENSECRET, (err, user) => {
    if (err)
      return res.status(401).json({
        ...response,
        message: "Usted no esta autorizado",
      });

    req.user = user;

    next();
  });
};

module.exports = requireAuth;