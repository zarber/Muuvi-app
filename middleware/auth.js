const jwt = require('jsonwebtoken');

module.exports = {
  ensureAuth: function (req, res, next) {
    jwt.verify(
      req.cookies.cookieToken,
      process.env.SECRET,
      function (err, decoded) {
        console.log('Checking authentication...');
        if (err) {
          console.log('Token verification failed, redirecting to login...');
          res.redirect('auth/login');
        } else {
          console.log('User authenticated, proceeding to next middleware or route...');
          next();
        }
      }
    );
  },
  ensureGuest: function (req, res, next) {
    jwt.verify(
      req.cookies.cookieToken,
      process.env.SECRET,
      function (err, decoded) {
        if (err) {
          next();
        } else {
          res.redirect('/etusivu_opiskelija');
        }
      }
    );
  },
  authorize: function (...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorResponse(
            `Käyttäjäroolia ${req.user.role} ei ole oikeutta käyttää tätä toimintoa`,
            403
          )
        );
      }
      next();
    };
  },
};



// const jwt = require('jsonwebtoken');

// module.exports = {
//   ensureAuth: function (req, res, next) {
//     jwt.verify(
//       req.cookies.cookieToken,
//       process.env.SECRET,
//       function (err, decoded) {
//         if (err) {
//           res.redirect('auth/login');
//         } else {
//           next();
//         }
//       }
//     );
//   },
//   ensureGuest: function (req, res, next) {
//     jwt.verify(
//       req.cookies.cookieToken,
//       process.env.SECRET,
//       function (err, decoded) {
//         if (err) {
//           next();
//         } else {
//           res.redirect('/etusivu_opiskelija');
//         }
//       }
//     );
//   },
// };
