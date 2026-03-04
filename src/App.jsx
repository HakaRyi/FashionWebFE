import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes/index';
import GlobalStyle from './components/GlobalStyle/GlobalStyle';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import HomeLayout from './layouts/HomeLayout';
import Home from './pages/Home/index';
import Unauthorized from './pages/Unauthorized';

function App() {

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
                <Route
                    key={index}
                    element={<PublicRoute />}
                >
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
        <Router>
            <GlobalStyle>
                <Routes>

                    {routes.map(renderRoute)}

                    <Route path="*" element={<div>404 - Not Found</div>} />

                </Routes>
            </GlobalStyle>
        </Router>
    );
}

export default App;
