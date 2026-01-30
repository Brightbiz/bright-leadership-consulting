import LoadingSpinner from "./LoadingSpinner";

const PageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
};

export default PageLoader;
