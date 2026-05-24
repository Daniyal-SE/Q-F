import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-kinetic-surface">
      <div className="text-center">
        <h1 className="text-kinetic-on-surface mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-kinetic-on-surface-variant">
          Oops! Page not found
        </p>
        <a
          href="/"
          className="text-kinetic-primary underline hover:text-kinetic-primary/90"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
