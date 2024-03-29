import {useEffect, useState} from 'react';
import Sidebar from '../sidebar/sidebar';
import axios from '../../config/axiosConfig';
import React from 'react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [bjadi, setBjadi] = useState([])
  const [bmentah, setBmentah] = useState([])
  const [stat, setStat] = useState([])
  const [merge, setMerge] = useState([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("/bjadi/")
        setBjadi(response.data.data)

        const response1 = await axios.get("/bmentah/")
        setBmentah(response1.data.data)

        const response2 = await axios.get("/statistik/")
        const uniqueMonths = new Set();
        const flattenedStat = response2.data.data.flat().reduce((acc, item) => {
          if (!uniqueMonths.has(item.bulan)) {
            uniqueMonths.add(item.bulan); // Add the month to the set
            acc.push({ ...item });
          }
          return acc;
        }, []);

        setStat(flattenedStat);

        console.log(stat)  
      } catch (err) {
        console.log(err)
      }
    }
    fetch()
  }, [])
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 lg:p-12 xl:p-16">
          <div className="bg-blue-200 p-4 md:p-8 lg:p-12 xl:p-16 rounded shadow-lg">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stat}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bulan" />
                <YAxis />
                <Tooltip />
                <Legend /> 
                <Bar dataKey="jml_bmentah" fill="#8884d8" name="Barang Mentah" />
                <Bar dataKey="jml_bjadi" fill="#82ca9d" name="Barang Jadi" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-4 md:p-8 lg:p-12 xl:p-16">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart width={800} height={800}>
              <Pie
                data={bmentah}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={130}
                fill="#8884d8"
                dataKey="students"
              >
                {bmentah.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
