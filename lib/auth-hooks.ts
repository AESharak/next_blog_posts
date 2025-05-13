"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useRequireAuth(redirectTo = "/auth/login") {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !session && !isRedirecting) {
      setIsRedirecting(true);
      const encodedPath = encodeURIComponent(pathname);
      router.push(`${redirectTo}?callbackUrl=${encodedPath}`);
    }
  }, [session, loading, router, redirectTo, pathname, isRedirecting]);

  return { session, loading: loading || isRedirecting };
}

export function useRedirectIfAuthenticated(redirectTo = "/dashboard") {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && session && !isRedirecting) {
      setIsRedirecting(true);
      router.push(redirectTo);
    }
  }, [session, loading, router, redirectTo, isRedirecting]);

  return { session, loading: loading || isRedirecting };
}
