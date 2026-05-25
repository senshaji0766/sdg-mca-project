import { useState } from "react";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../firebase";

function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  // LOGIN

  const handleLogin = async () => {

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Login Successful 🔥");

    } catch (error) {

      alert(error.message);

    }

  };

  // REGISTER

  const handleRegister = async () => {

    try {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Registration Successful 🚀");

    } catch (error) {

      alert(error.message);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <div className="bg-slate-800 p-10 rounded-3xl w-[400px] shadow-2xl">

        <h1 className="text-4xl font-bold text-center text-green-400 mb-8">
          🌍 Eco Login
        </h1>

        {/* EMAIL */}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-4 rounded-xl mb-5 bg-slate-700 text-white"
        />

        {/* PASSWORD */}

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-4 rounded-xl mb-6 bg-slate-700 text-white"
        />

        {/* LOGIN BUTTON */}

        <button
          onClick={handleLogin}
          className="w-full bg-green-500 hover:bg-green-600 p-4 rounded-xl text-xl font-bold mb-4"
        >
          Login
        </button>

        {/* REGISTER BUTTON */}

        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 hover:bg-blue-600 p-4 rounded-xl text-xl font-bold"
        >
          Register
        </button>

      </div>

    </div>

  );

}

export default Login;