"use client";

import { useEffect } from "react";
import { api } from "~/trpc/react";

export default function Landing() {
  const mutate = api.clipboard.addItem.useMutation();
  const query = api.clipboard.getLastCopiedItem.useQuery({ device: "desktop" });

  useEffect(() => {
    void mutate.mutateAsync({ item: "test", device: "desktop" });
  }, [])

  return "proxy service for echo's clipboard sync";
}
