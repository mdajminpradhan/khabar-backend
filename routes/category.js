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
} = require("../controllers/category");

// profile param
router.param("profileId", getProfileById);

// category param
router.param("categoryId", getCategoryById);

// category create
router.post(
  "/productcategory/create/:profileId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  upload.single("icon"),
  createCategory
);

// getting categories
router.get("/productcategories", getAllCategory);

// get category by id
router.get("/productcategory/:categoryId", getCat);

// updating category
router.put(
  "/productcategory/update/:categoryId/:profileId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  upload.single("icon"),
  updateCategory
);

// deleting category
router.delete(
  "/productcategory/delete/:categoryId/:profileId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteCategory
);

module.exports = router;
