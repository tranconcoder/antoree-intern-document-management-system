"use client";

import { useAppSelector } from "@/store/hooks";
import { UserDashboard, LandingPage } from "./components";

export default function Home() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const user = useAppSelector((state) => state.user.user);

  if (isLoggedIn) {
    return <UserDashboard user={user} />;
  }

  return <LandingPage />;
}
