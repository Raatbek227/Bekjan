import { Suspense } from "react";
import { AdminProductEditPage } from "../[id]/client";

export default function AdminProductEditRoute() {
  return (
    <Suspense fallback={null}>
      <AdminProductEditPage />
    </Suspense>
  );
}
