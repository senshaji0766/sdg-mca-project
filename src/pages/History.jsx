import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase";
import {
  query,
  where
} from "firebase/firestore";

import { auth } from "../firebase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function History() {

  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const totalReports = reports.length;

  const totalCarbon = reports.reduce(
    (sum, report) => sum + Number(report.total || 0),
    0
  );

   const averageCarbon =
      totalReports > 0
        ? Math.round(totalCarbon / totalReports)
        : 0;

    const highestCarbon =
       totalReports > 0
         ? Math.max(
            ...reports.map((report) =>
             Number(report.total || 0)
             )
           )
         : 0;
    const CustomTooltip = ({ active, payload }) => {

  if (active && payload && payload.length) {

    return (

      <div className="bg-white p-4 rounded-lg shadow-lg">

        <p className="text-green-600 font-bold">
          Total CO₂: {payload[0].value}
        </p>

      </div>

    );

  }

  return null;

};
  const latestReport =
     reports.length > 0
       ? reports.reduce((latest, current) => {

        return Number(current.total) >
          Number(latest.total)
          ? current
          : latest;

      })
    : null;  

const latestCarbon =
  Number(latestReport?.total || 0);

const improvementMessage =
  latestCarbon < 150
    ? "🌱 Excellent sustainability progress!"
    : latestCarbon < 300
    ? "🌍 Moderate emissions detected."
    : "⚠️ High emissions. Try reducing carbon activities.";
    const deleteReport = async (id) => {

      await deleteDoc(doc(db, "reports", id));

      setReports(
      reports.filter((report) => report.id !== id)
     );

    };

  useEffect(() => {

    const fetchReports = async () => {
      const q = query(
        collection(db, "reports"),
        where(
          "userId",
           "==",
          auth.currentUser.uid
        )
      );

      const querySnapshot = await getDocs(q);


      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setReports(data);

    };

    fetchReports();

  }, []);
  const chartData = reports.map((report, index) => {

  return {

    reportNumber: `R${index + 1}`,

    total: Number(report.total || 0),

    date: report.createdAt?.seconds
      ? new Date(
          report.createdAt.seconds * 1000
        ).toLocaleDateString()
      : "",

    time: report.createdAt?.seconds
      ? new Date(
          report.createdAt.seconds * 1000
        ).toLocaleTimeString()
      : ""

  };
  console.log(chartData);

});
  const filteredReports = reports.filter((report) => {

  const totalText =
    report.total
      ?.toString()
      .toLowerCase();

  const dateText =
    report.createdAt?.seconds
      ? new Date(
          report.createdAt.seconds * 1000
        )
          .toLocaleDateString()
          .toLowerCase()
      : "";

  const timeText =
    report.createdAt?.seconds
      ? new Date(
          report.createdAt.seconds * 1000
        )
          .toLocaleTimeString()
          .toLowerCase()
      : "";

  const searchText =
    search.toLowerCase();

  return (
    totalText.includes(searchText) ||
    dateText.includes(searchText) ||
    timeText.includes(searchText)
  );

});

  return (

    <div className="min-h-screen bg-slate-900 text-white p-8">

      <h1 className="text-5xl font-bold text-green-400 text-center mb-10">
        📜 Saved Reports
      </h1>
      <div className="grid md:grid-cols-3 gap-6 mb-10"
      ><div className="bg-slate-800 p-6 rounded-2xl mb-10 shadow-lg">

  <h2 className="text-3xl text-green-400 mb-4">
    📈 Sustainability Insight
  </h2>

  <p className="text-xl">
    {improvementMessage}
  </p>

</div>

  <div className="bg-green-500 p-6 rounded-2xl text-center">

    <h2 className="text-2xl font-bold">
      📜 Reports
    </h2>

    <p className="text-4xl mt-4 font-bold">
      {totalReports}
    </p>

  </div>

  <div className="bg-blue-500 p-6 rounded-2xl text-center">

    <h2 className="text-2xl font-bold">
      📊 Average CO₂
    </h2>

    <p className="text-4xl mt-4 font-bold">
      {averageCarbon}
    </p>

  </div>

  <div className="bg-red-500 p-6 rounded-2xl text-center">

    <h2 className="text-2xl font-bold">
      ⚠️ Highest CO₂
    </h2>

    <p className="text-4xl mt-4 font-bold">
      {highestCarbon}
    </p>

  </div>

</div>
      <input
         type="text"
         placeholder="Search by CO₂, date, or time..."
         value={search}
         onChange={(e) => setSearch(e.target.value)}
         className="w-full p-4 rounded-xl bg-slate-700 text-white mb-8"
       />
       <div className="bg-slate-800 p-6 rounded-2xl mb-10">

  <h2 className="text-3xl text-green-400 mb-6">
    📈 Carbon Emission Trends
  </h2>

  <ResponsiveContainer width="100%" height={400}>
<LineChart data={chartData}>

  <CartesianGrid strokeDasharray="3 3" />

  <XAxis dataKey="reportNumber" />

  <YAxis />

  <Tooltip
    formatter={(value, name, props) => [
  `CO₂ : ${props.payload.total}`
]}
  />

  <Line
    type="monotone"
    dataKey="total"
    stroke="#22c55e"
    strokeWidth={4}
  />

</LineChart>
  </ResponsiveContainer>

</div>

      <div className="grid gap-6">

        {filteredReports.map((report) => (

          <div
            key={report.id}
            className="bg-slate-800 p-6 rounded-2xl shadow-lg"
          >

            <h2 className="text-2xl text-green-300 mb-4">
              🌍 Carbon Report
            </h2>

            <p>🚗 Transport: {report.transport}</p>

            <p>⚡ Electricity: {report.electricity}</p>

            <p>🔥 Total Calories: {report.Calories} kcal</p>
            <p className="mt-2 text-gray-300">
               📅 Date:
               {" "}
               {new Date(
                 report.createdAt?.seconds * 1000
                ).toLocaleString()}
            </p>

            <p className="mt-4 text-xl font-bold text-green-400">
              Total CO₂: {report.total}
            </p>
            <p className="mt-2 text-gray-300">
               📅 Date:
               {" "}
               {new Date(
                  report.createdAt?.seconds * 1000
                ).toLocaleString()}
            </p>
            <button
                onClick={() => deleteReport(report.id)}
                className="mt-4 bg-red-500 px-4 py-2 rounded-xl text-white font-bold hover:bg-red-600"
            >
                Delete Report 🗑️
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default History;