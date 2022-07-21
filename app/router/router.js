const { AdminRoutes } = require('./admin/admin.routes');
const { DeveloperRoutes } = require('./developer.routes');
const { UserAuthRoutes } = require('./user/auth');
const {
  VerifyAccessToken,
  checkRole,
} = require('../http/middleware/verifyAccessToken');
const { UserRoutes } = require('./user/user.routes');
const router = require('express').Router();

router.use('/auth', UserAuthRoutes);

router.use(
  '/admin',
  VerifyAccessToken,
  checkRole('ADMIN', 'ADMIN'),
  AdminRoutes
);

router.use('/developer', DeveloperRoutes);

router.use('/user', UserRoutes);

module.exports = {
  AllRoutes: router,
};
