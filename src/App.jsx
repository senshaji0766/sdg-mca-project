import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import History from "./pages/History";

import { auth } from "./firebase";

import { onAuthStateChanged } from "firebase/auth";

function App() {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(auth, (currentUser) => {

        setUser(currentUser);

        setLoading(false);

      });

    return () => unsubscribe();

  }, []);

  // LOADING SCREEN

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-3xl font-bold bg-slate-900 text-white">
        Loading...
      </div>

    );

  }

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/"
          element={
            user
              ? <Navigate to="/dashboard" />
              : <Login />
          }
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            user
              ? <Dashboard />
              : <Navigate to="/" />
          }
        />

        {/* HISTORY */}

        <Route
          path="/history"
          element={
            user
              ? <History />
              : <Navigate to="/" />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;