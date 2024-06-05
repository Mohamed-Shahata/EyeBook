import express from 'express';
import { 
  followUnfollowUser,
  freezeAccount,
  getAllUsers,
  getSuggestedUsers,
  getUserProfile,
  loginUser,
  logoutUser,
  signupUser,
  updateUser
} from '../controllers/userController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.get("/profile/:query" , getUserProfile);
router.get("/suggested", protectRoute , getSuggestedUsers);
router.get("/allusers" , protectRoute , getAllUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute , followUnfollowUser);
router.put("/update/:id", protectRoute , updateUser);
router.put("/freeze", protectRoute , freezeAccount);


export default router;