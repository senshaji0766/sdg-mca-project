import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {

    try {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Account Created Successfully 🔥");

    } catch (error) {

      alert(error.message);

    }

  };

  return (

    <div className="flex items-center justify-center h-screen bg-slate-900">

      <div className="bg-slate-800 p-10 rounded-2xl w-96 shadow-2xl">

        <h1 className="text-4xl font-bold text-center text-green-400 mb-8">
          🌱 Signup
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-slate-700 text-white"
          />

          <input
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-slate-700 text-white"
          />

          <button
            onClick={signup}
            className="bg-green-500 hover:bg-green-600 p-3 rounded-lg text-white font-bold"
          >
            Create Account
          </button>

        </div>

      </div>

    </div>
  );
}

export default Signup;