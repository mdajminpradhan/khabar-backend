const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({}),
});

const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getProfileById,
} = require("../controllers/user");

const {
  createCategory,
  getCategoryById,
  getAllCategory,
  updateCategory,
  deleteCategory,
  getCat,
} = require("../controllers/postcategory");

// profile param
router.param("profileId", getProfileById);

// category param
router.param("categoryId", getCategoryById);

// category create
router.post(
  "/postcategory/create/:profileId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  upload.single("icon"),
  createCategory
);

// getting categories
router.get("/postcategories", getAllCategory);

// get category by id
router.get("/postcategory/:categoryId", getCat);

// updating category
router.put(
  "/postcategory/update/:categoryId/:profileId",
  upload.single("icon"),
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

// deleting category
router.delete(
  "/postcategory/delete/:categoryId/:profileId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteCategory
);

module.exports = router;
