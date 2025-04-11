const { Router } = require("express");
const {
  createUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateAvatar,
  updateUserInfo,
} = require("../controllers/userController.js");
const upload = require("../middlewares/multer.js");

const router = Router();

router.route("/users").post(createUser).get(getAllUsers);

router
  .route("/users/upload-avatar")
  .patch( upload.single("profileImage"), updateAvatar);

router
  .route("/users/:id")
  .put( updateUserInfo)
  .get(getSingleUser)
  .delete(deleteUser);

module.exports = router;
