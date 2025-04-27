import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import RoleType from '../../lib/types.js';



const userMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, auth denied' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;

    if (req.user.role !== RoleType.USER) {
      return res.status(403).json({ message: 'Admin access only' });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, auth denied' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;

    if (req.user.role !== RoleType.ADMIN) {
      return res.status(403).json({ message: 'Admin access only' });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const superAdminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, auth denied' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;

    if (req.user.role !== RoleType.SUPER_ADMIN) {
      return res.status(403).json({ message: 'SuperAdmin access only' });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminSuperAdminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, auth denied' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;

    if (req.user.role !== RoleType.ADMIN || req.user.role !== RoleType.SUPER_ADMIN) {
      return res.status(403).json({ message: 'Admin or SuperAdmin access only' });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const userAdminSuperAdminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, auth denied' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;

    if (
      req.user.role !== RoleType.USER ||
      req.user.role !== RoleType.ADMIN ||
      req.user.role !== RoleType.SUPER_ADMIN
    ) {
      return res.status(403).json({ message: 'User, Admin or SuperAdmin access only' });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { userMiddleware, adminMiddleware, superAdminMiddleware, adminSuperAdminMiddleware,userAdminSuperAdminMiddleware };

