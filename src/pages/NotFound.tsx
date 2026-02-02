import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <PageHero
        badge="Error 404"
        badgeIcon={AlertCircle}
        title="Page"
        titleHighlight="Not Found"
        description="The page you're looking for doesn't exist or has been moved. Let's get you back on track."
      >
        <div className="mt-8">
          <Button variant="teal" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </div>
      </PageHero>
      <div className="flex-1" />
      <Footer />
    </div>
  );
};

export default NotFound;
