import express from "express";
import { createOwner, getOwnersList } from "./controllers/OwnerController";
import { registerDrone, getDronesForOwner } from "./controllers/DroneController";
import {createOrder} from "./controllers/OrderController";
import { getReport } from "./controllers/ReportController";
import { getMedicationList } from "./controllers/MedicationController";

const router = express.Router();

router.post("/owners", createOwner);
router.post("/drones/register", registerDrone);
router.post("/drones/orders", createOrder);
router.get("/owners/:ownerId/drones", getDronesForOwner);
router.get("/report", getReport);
router.get("/medications", getMedicationList);
router.get("/owners", getOwnersList);


export default router;
