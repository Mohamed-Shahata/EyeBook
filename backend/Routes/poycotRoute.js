import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { createPoycot, deletePoycot, getPoycot, getPoycots, updatePoycot } from "../controllers/poycotController.js";
import {allowedTo} from "../middlewares/allowedTo.js";


const router = express.Router();

router.get("/:id", protectRoute , getPoycot)
router.get("/", protectRoute , getPoycots)
router.post("/", protectRoute , createPoycot)
router.put("/:id", protectRoute , updatePoycot)
router.delete("/:id", protectRoute , deletePoycot)

export default router;