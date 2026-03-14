import { Fragment } from "react";
import { Routes, Route } from "react-router-dom";

import { routes } from "./routes";
import GlobalStyle from "../../shared/styles/GlobalStyle/GlobalStyle";

import PublicRoute from "./guards/PublicRoute";
import ProtectedRoute from "./guards/ProtectedRoute";

function AppRouter() {

  const renderRoute = (route, index) => {
    const Page = route.component;
    const Layout = route.layout || Fragment;

    const element = (
      <Layout>
        <Page />
      </Layout>
    );

    if (route.isAuthRoute) {
      return (
        <Route key={index} element={<PublicRoute />}>
          <Route path={route.path} element={element} />
        </Route>
      );
    }

    if (route.roles) {
      return (
        <Route
          key={index}
          path={route.path}
          element={
            <ProtectedRoute roles={route.roles}>
              {element}
            </ProtectedRoute>
          }
        />
      );
    }

    return (
      <Route
        key={index}
        path={route.path}
        element={element}
      />
    );
  };

  return (
    <GlobalStyle>
      <Routes>
        {routes.map(renderRoute)}

        <Route
          path="*"
          element={<div style={{ padding: "20px" }}>404 - Not Found</div>}
        />
      </Routes>
    </GlobalStyle>
  );
}

export default AppRouter;