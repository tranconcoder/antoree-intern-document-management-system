import { Router } from "express";
import { PremiumController } from "../controllers/premium.controller";
import { validateToken } from "../middlewares/auth.middleware";

const premiumRouter = Router();

// User routes (require authentication)
premiumRouter.post("/purchase", validateToken, PremiumController.purchasePlan);
premiumRouter.get(
  "/current",
  validateToken,
  PremiumController.getCurrentSubscription
);
premiumRouter.get(
  "/history",
  validateToken,
  PremiumController.getSubscriptionHistory
);

// Admin routes (require authentication and admin role)
premiumRouter.get(
  "/analytics",
  validateToken,
  PremiumController.getRevenueAnalytics
);
premiumRouter.get("/all", validateToken, PremiumController.getAllSubscriptions);

export default premiumRouter;
