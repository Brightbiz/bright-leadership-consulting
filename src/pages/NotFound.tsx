import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center">
        <div className="container-brief py-24">
          <div className="max-w-[680px]">
            <p className="kicker mb-6">404</p>
            <h1 className="heading-hero mb-8">Page Not Found</h1>
            <p className="body-brief mb-10">
              The page you are looking for does not exist or has been moved.
            </p>
            <Link to="/" className="link-quiet">
              Return to Homepage
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
