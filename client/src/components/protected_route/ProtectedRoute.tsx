import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ObrišiVrednostPoKljuču } from "../../helpers/LocalStorage";
import { useAuth } from "../../hooks/auth/UseAuthHook";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole: string;
  redirectTo?: string;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    ObrišiVrednostPoKljuču("authToken");
    logout();
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.uloga !== requiredRole) {
    return (
    <main>
        <div>
          <h2>
            Немате дозволу
          </h2>
          <p>
            Потребна је улога{" "}
            <span>"{requiredRole}"</span> за приступ
            овој страници.
          </p>
          <button
            onClick={handleLogout}
          >
            Одјава из апликације
          </button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
};
