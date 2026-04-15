/** @format */

import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "@/pages/AuthPages/SignIn";
import NotFound from "@/pages/OtherPage/NotFound";
import UserProfiles from "@/pages/UserProfiles";
import AppLayout from "@/layout/AppLayout";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import Home from "@/pages/Dashboard/Home";
import { AuthProvider } from "./context/AuthProvider";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { Toaster } from "react-hot-toast";
import BasicTables from "./pages/Tables/BasicTables";
import RoleRoute from "./components/auth/RoleRoute";
import Users from "./pages/Users/Users";


export default function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Dashboard Layout */}
            <Route
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            >
              <Route index path="/" element={<Home />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/basic-tables" element={<BasicTables />} />
               <Route
                index
                path="/users"
                element={
                  <RoleRoute allowedRoles={["Super Admin"]}>
                    <Users />
                  </RoleRoute>
                }
              />
              {/* <Route
                index
                path="/roles"
                element={
                  <RoleRoute allowedRoles={["admin"]}>
                    <Role />
                  </RoleRoute>
                }
              /> */}


              <Route path="/profile" element={<UserProfiles />} />

              {/* <Route path="/blank" element={<Blank />} /> */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Auth Layout */}
            <Route path="/signin" element={<SignIn />} />
            {/* <Route path="/forgot-password" element={<ResetPassword />} /> */}
            {/* <Route path="/signup" element={<SignUp />} /> */}
            {/* <Route path="/form-elements" element={<FormElements />} /> */}
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}
