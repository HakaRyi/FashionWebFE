import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { guestRoutes, privateRoutes } from './routes/index';
import GlobalStyle from './components/GlobalStyle/GlobalStyle';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
    const renderRoutes = (routes, isPrivate = false) => {
        return routes.map((route, index) => {
            const Page = route.component;

            let Layout = Fragment;
            if (route.layout) {
                Layout = route.layout;
            }

            return (
                <Route
                    key={index}
                    path={route.path}
                    element={
                        isPrivate ? (
                            <ProtectedRoute allowedRoles={route.roles}>
                                <Layout>
                                    <Page />
                                </Layout>
                            </ProtectedRoute>
                        ) : (
                            <Layout>
                                <Page />
                            </Layout>
                        )
                    }
                >
                    {route.children?.map((child, i) => {
                        const ChildPage = child.component;
                        return <Route key={i} path={child.path} element={<ChildPage />} />;
                    })}
                </Route>
            );
        });
    };

    return (
        <Router>
            <GlobalStyle>
                <div className="App">
                    <Routes>
                        <Route element={<PublicRoute />}>
                            {renderRoutes(guestRoutes)}
                        </Route>

                        {renderRoutes(privateRoutes, true)}

                        <Route path="*" element={<div style={{ padding: '20px' }}>404 - Not Found</div>} />
                    </Routes>
                </div>
            </GlobalStyle>
        </Router>
    );
}

export default App;