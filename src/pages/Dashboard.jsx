import { useState } from "react";
import { signOut } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";

import { motion } from "framer-motion";

import jsPDF from "jspdf";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

function Dashboard() {

  // -------------------------
  // STATES
  // -------------------------

  const [transport, setTransport] = useState("");
  const [electricity, setElectricity] = useState("");
  const [food, setFood] = useState("");

  const [darkMode, setDarkMode] = useState(true);

  // -------------------------
  // CARBON CALCULATIONS
  // -------------------------

  const transportCO2 = Number(transport || 0) * 0.21;

  const electricityCO2 = Number(electricity || 0) * 0.85;

  // Calories → Carbon
  const foodCO2 = Number(food || 0) * 0.0015;

  const total = Number(
    (
      transportCO2 +
      electricityCO2 +
      foodCO2
    ).toFixed(2)
  );

  // -------------------------
  // ECO GRADE
  // -------------------------

  let grade = "";
  let badge = "";
  let achievement = "";
  let specialReward = "";

  if (total <= 50) {

    grade = "🌱 Excellent";

    badge = "🌱 Eco Hero";

    achievement = "🌱 Eco Warrior";

    specialReward = "🏅 Green Champion";

  }

  else if (total <= 100) {

    grade = "🌍 Moderate";

    badge = "🌍 Eco Supporter";

    achievement = "🌍 Keep Improving";

  }

  else if (total <= 150) {

    grade = "⚠️ High Emission";

    badge = "⚠️ Pollution Alert";

    achievement = "Needs Improvement";

  }

  else {

    grade = "🚨 Very High Emission";

    badge = "🚨 Critical";

    achievement = "Reduce Carbon Immediately";

  }

  // -------------------------
  // PROGRESS BAR
  // -------------------------

  const progress = Math.min(
    (total / 200) * 100,
    100
  );
  const progressColor =
  total <= 50
    ? "bg-green-500"
    : total <= 100
    ? "bg-yellow-500"
    : total <= 150
    ? "bg-orange-500"
    : "bg-red-500";

  // -------------------------
  // PIE CHART DATA
  // -------------------------

  const data = [

    {
      name: "Transport",
      value: Number(transport || 0)
    },

    {
      name: "Electricity",
      value: Number(electricity || 0)
    },

    {
      name: "Calories",
      value: Number(food || 0)
    }

  ];

  const COLORS = [

    "#22c55e",

    "#3b82f6",

    "#f97316"

  ];
    // ===========================
  // SAVE REPORT
  // ===========================

  const saveReport = async () => {

    try {

      if (!auth.currentUser) {

        alert("Please login first");

        return;

      }

      await addDoc(collection(db, "reports"), {

        userId: auth.currentUser.uid,

        transport: Number(transport),

        electricity: Number(electricity),

        calories: Number(food),

        total,

        grade,

        createdAt: new Date()

      });

      alert("✅ Report Saved Successfully");

    }

    catch (error) {

      console.error(error);

      alert(error.message);

    }

  };



  // ===========================
  // PDF
  // ===========================

  const downloadPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Eco Carbon Tracker Report",20,20);

    doc.setFontSize(14);

    doc.text(`Transport : ${transport}`,20,45);

    doc.text(`Electricity : ${electricity}`,20,60);

    doc.text(`Calories : ${food}`,20,75);

    doc.text(`Total CO₂ : ${total}`,20,95);

    doc.text(`Eco Grade : ${grade}`,20,110);

    doc.text(`Trees Needed : ${Math.ceil(total/10)}`,20,125);

    doc.save("Eco_Report.pdf");

  };



  // ===========================
  // LOGOUT
  // ===========================

  const handleLogout = async()=>{

      await signOut(auth);

  };



  return(

<div className={`min-h-screen flex transition-all duration-500 ${
darkMode
?
"bg-gradient-to-br from-slate-900 via-slate-800 to-green-900 text-white"
:
"bg-gray-100 text-black"
}`}>



{/* ================= Sidebar ================= */}

<div className="w-64 bg-slate-950 shadow-2xl p-6 min-h-screen">

<h1 className="text-3xl font-bold text-green-400 mb-8">

🌍 Eco Tracker

</h1>

<div className="space-y-4">

<a
href="/dashboard"
className="block p-4 rounded-xl bg-green-600 hover:bg-green-700 transition"
>

📊 Dashboard

</a>

<a
href="/history"
className="block p-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
>

📜 History

</a>

<button

onClick={()=>setDarkMode(!darkMode)}

className="w-full text-left p-4 rounded-xl bg-yellow-600 hover:bg-yellow-700 transition"

>

{darkMode?"☀️ Light Mode":"🌙 Dark Mode"}

</button>

<button

onClick={handleLogout}

className="w-full text-left p-4 rounded-xl bg-red-600 hover:bg-red-700 transition"

>

🚪 Logout

</button>

</div>

</div>



{/* ================= MAIN ================= */}

<div className="flex-1 p-8">



<motion.div

initial={{opacity:0,y:-40}}

animate={{opacity:1,y:0}}

transition={{duration:0.7}}

>

<h1 className="text-6xl font-bold text-center text-green-400">

🌍 Eco Carbon Tracker

</h1>

<p className="text-center text-2xl mt-3 text-gray-300">

Monitor • Analyze • Reduce

</p>

<p className="text-center text-lg mt-2 text-gray-400">

Track and reduce your environmental impact

</p>

</motion.div>



<div className="mt-8 bg-slate-800 rounded-3xl p-8">

<h2 className="text-4xl font-bold text-green-400">

👋 Welcome Back

</h2>

<p className="text-gray-300 mt-3 text-xl">

Track your carbon footprint, monitor emissions and contribute to Sustainable Development Goals.

</p>

</div>
{/* ================= SUMMARY CARDS ================= */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

  {/* Total CO2 */}

  <div className="bg-gradient-to-r from-green-500 to-green-400 rounded-3xl p-8 shadow-xl">

    <h3 className="text-2xl text-white">
      🌿 Total CO₂
    </h3>

    <h1 className="text-6xl font-bold mt-4">
      {total}
    </h1>

  </div>

  {/* Trees */}

  <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-3xl p-8 shadow-xl">

    <h3 className="text-2xl text-white">
      🌳 Trees Needed
    </h3>

    <h1 className="text-6xl font-bold mt-4">
      {Math.ceil(total / 10)}
    </h1>

  </div>

  {/* Grade */}

  <div className="bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-3xl p-8 shadow-xl">

    <h3 className="text-2xl text-white">
      🏆 Eco Grade
    </h3>

    <h1 className="text-4xl font-bold mt-6">
      {grade}
    </h1>

  </div>

</div>

{/* ================= INPUT SECTION ================= */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

  {/* Transport */}

  <div className="bg-slate-800 rounded-3xl p-8 shadow-xl">

    <h2 className="text-3xl text-green-400 mb-5">

      🚗 Transport

    </h2>

    <input

      type="number"

      placeholder="Distance (km)"

      value={transport}

      onChange={(e)=>setTransport(e.target.value)}

      className="w-full p-4 rounded-xl bg-slate-700 text-white"

    />

  </div>

  {/* Electricity */}

  <div className="bg-slate-800 rounded-3xl p-8 shadow-xl">

    <h2 className="text-3xl text-yellow-400 mb-5">

      ⚡ Electricity

    </h2>

    <input

      type="number"

      placeholder="Units (kWh)"

      value={electricity}

      onChange={(e)=>setElectricity(e.target.value)}

      className="w-full p-4 rounded-xl bg-slate-700 text-white"

    />

  </div>

  {/* Calories */}

  <div className="bg-slate-800 rounded-3xl p-8 shadow-xl">

    <h2 className="text-3xl text-red-400 mb-5">

      🔥 Total Calories

    </h2>

    <input

      type="number"

      placeholder="Calories"

      value={food}

      onChange={(e)=>setFood(e.target.value)}

      className="w-full p-4 rounded-xl bg-slate-700 text-white"

    />

  </div>

</div>

{/* ================= RESULT CARD ================= */}

<div className="mt-10 bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-10 text-center shadow-2xl">

  <h1 className="text-5xl font-bold">

    Total Carbon Score

  </h1>

  <h2 className="text-7xl font-bold mt-5">

    {total} kg CO₂e

  </h2>

  <h2 className="text-3xl font-bold mt-5">

    {grade}

  </h2>

  <p className="text-xl mt-4">

    🌳 Trees Needed : {Math.ceil(total/10)}

  </p>

  <p className="text-xl mt-3">

    🏆 Badge : {badge}

  </p>

  <p className="text-xl mt-3">

    🎖 Achievement : {achievement}

  </p>

  {specialReward && (

    <p className="text-yellow-300 font-bold text-2xl mt-4">

      {specialReward}

    </p>

  )}

  {/* Progress */}

  <div className="mt-8">

    <div className="bg-slate-700 rounded-full h-5 overflow-hidden">

      <div
  className={`h-5 rounded-full ${
    total <= 50
      ? "bg-green-500"
      : total <= 100
      ? "bg-yellow-500"
      : total <= 150
      ? "bg-orange-500"
      : "bg-red-500"
  }`}
  style={{ width: `${progress}%` }}
/>
    </div>

  </div>

  {/* Buttons */}

  <div className="flex justify-center gap-5 mt-8">

    <button

      onClick={saveReport}

      className="bg-slate-900 hover:bg-black px-7 py-3 rounded-xl font-bold"

    >

      Save Report ☁️

    </button>

    <button

      onClick={downloadPDF}

      className="bg-blue-600 hover:bg-blue-700 px-7 py-3 rounded-xl font-bold"

    >

      Download PDF 📄

    </button>

  </div>

</div>
{/* ================= RECOMMENDATIONS ================= */}

<div
  className={`mt-10 p-8 rounded-3xl ${
    darkMode
      ? "bg-slate-800"
      : "bg-green-50"
  }`}
>

  <h2 className="text-3xl font-bold text-green-400 mb-6">
    💡 Smart Eco Recommendations
  </h2>

  <ul className="space-y-4 text-lg">

    {transport > 100 && (
      <li>
        🚲 Consider using public transport, cycling, or walking whenever possible.
      </li>
    )}

    {electricity > 100 && (
      <li>
        💡 Reduce electricity consumption by switching off unused appliances.
      </li>
    )}

    {Number(food) > 2500 && (
      <li>
        🥗 Maintain a balanced diet and reduce food waste to lower food-related emissions.
      </li>
    )}

    {total <= 50 && (
      <li>
        🌱 Excellent! Your carbon footprint is low. Keep up the great work.
      </li>
    )}

  </ul>

</div>

{/* ================= PIE CHART ================= */}

<div
  className={`mt-10 p-8 rounded-3xl ${
    darkMode
      ? "bg-slate-800"
      : "bg-blue-50"
  }`}
>

  <h2 className="text-3xl font-bold text-center text-green-400 mb-8">
    📊 Emission Analytics
  </h2>

  <div className="flex justify-center">

    <PieChart width={420} height={420}>

      <Pie
        data={[
          { name: "Transport", value: transportCO2 },
          { name: "Electricity", value: electricityCO2 },
          { name: "Calories", value: foodCO2 },
        ]}
        cx="50%"
        cy="50%"
        outerRadius={130}
        dataKey="value"
        label
      >

        {[
          "#22c55e",
          "#3b82f6",
          "#f97316"
        ].map((color, index) => (

          <Cell
            key={index}
            fill={color}
          />

        ))}

      </Pie>

      <Tooltip />

      <Legend />

    </PieChart>

  </div>

</div>

</div>

</div>

);

}

export default Dashboard;