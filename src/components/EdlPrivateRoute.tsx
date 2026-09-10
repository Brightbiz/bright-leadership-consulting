import { Suspense, lazy } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import PageLoader from "@/components/PageLoader";
import { EDL_PRIVATE } from "@/data/edlIntensive";

const NotFound = lazy(() => import("@/pages/NotFound"));

/**
 * While the Intensive is private, its pages are only reachable by a signed-in
 * administrator. Everyone else — including anyone holding the direct URL — gets
 * the standard not-found page, so the programme is not discoverable.
 */
const EdlPrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading } = useAdminAuth();

  if (!EDL_PRIVATE) return <>{children}</>;
  if (isLoading) return <PageLoader />;
  if (!isAdmin) {
    return (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    );
  }
  return <>{children}</>;
};

export default EdlPrivateRoute;
