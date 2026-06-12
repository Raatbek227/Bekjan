"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { wishlistService } from "@/services/wishlist-service";
import { Button } from "@/components/ui/button";

export function WishlistAction({ productId, className = "" }) {
  const user = useAuthStore((state) => state.user);
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    setStatus("idle");

    try {
      await wishlistService.addWishlistItem(productId);
      setStatus("saved");
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      className={`inline-flex items-center gap-2 ${className}`}
      disabled={loading}
      ariaLabel="Add product to favorites"
    >
      <Heart size={16} className={status === "saved" ? "text-accent" : "text-white"} />
      {status === "saved" ? "Saved" : "Add to favorites"}
    </Button>
  );
}
