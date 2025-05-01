import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useRef } from 'react';

const months = [
  { value: '', label: 'All Months' },
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const regions = [
  { value: '', label: 'All Regions' },
  { value: 'North India', label: 'North India' },
  { value: 'South India', label: 'South India' },
  { value: 'East India', label: 'East India' },
  { value: 'West India', label: 'West India' },
];

function Dashboard() {
  const lastRevenue = useRef(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [productBreakdown, setProductBreakdown] = useState([]);
  const [regionSales, setRegionSales] = useState([]);
  const [salesFunnel, setSalesFunnel] = useState({});
  const [monthFilter, setMonthFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [salespersonFilter, setSalespersonFilter] = useState('');
  const [salespersons, setSalespersons] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let userName = '';

  if (token) {
    const decoded = jwtDecode(token);
    userName = decoded.name || 'User';
  }

  // Loading Skeleton Components
  const LoadingSkeleton = ({ width = "w-full", height = "h-6" }) => (
    <div className={`bg-gray-300 animate-pulse rounded ${width} ${height}`}></div>
  );
  //Download to pdf and xls
  const exportToPDF = () => {
    const dashboardElement = document.getElementById('dashboard-content');
    if (!dashboardElement) {
      console.error('Dashboard content element not found');
      return;
    }
    html2canvas(dashboardElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('dashboard.pdf');
    });
  };

  const exportToExcel = () => {
    const data = [
      {
        'Total Revenue': monthlyRevenue.reduce((acc, cur) => acc + cur.totalRevenue, 0),
        Products: productBreakdown.length,
        Regions: regionSales.length,
        'Conversion Rate': salesFunnel.conversionRate,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dashboard');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'dashboard.xlsx');
  };

  useEffect(() => {
    const fetchSalespersons = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/salespersons', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSalespersons(res.data);
      } catch (err) {
        console.error('Failed to fetch salespersons:', err);
      }
    };
    fetchSalespersons();

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const queryParams = new URLSearchParams();
        if (monthFilter) queryParams.append('month', monthFilter);
        if (regionFilter) queryParams.append('region', regionFilter);
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        if (categoryFilter) queryParams.append('category', categoryFilter);
        if (salespersonFilter) queryParams.append('salesperson', salespersonFilter);

        const queryString = queryParams.toString() || ''; // ✅ prevents undefined in URL


        const [revenueRes, productRes, regionRes, funnelRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/dashboard/monthly-revenue?${queryString}`, { headers }),
          axios.get(`http://localhost:5000/api/dashboard/product-breakdown?${queryString}`, { headers }),
          axios.get(`http://localhost:5000/api/dashboard/region-sales?${queryString}`, { headers }),
          axios.get(`http://localhost:5000/api/dashboard/sales-funnel?${queryString}`, { headers }),
        ]);

        setMonthlyRevenue(revenueRes.data);
        setProductBreakdown(productRes.data);
        setRegionSales(regionRes.data);
        setSalesFunnel(funnelRes.data);
        setLoading(false);

        const totalRevenue = revenueRes.data.reduce((acc, cur) => acc + cur.totalRevenue, 0);

        if (lastRevenue.current !== totalRevenue) {
          lastRevenue.current = totalRevenue;
          toast.dismiss();
          if (totalRevenue > 5000) {
            toast.success('📈 Great work! Your weekly revenue is booming!');
          } else if (totalRevenue < 1000 && totalRevenue > 0) {
            toast.warning('📉 Revenue is lower than expected this week.');
          }
        }

      } catch (err) {
        console.error(err);
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    //Debounce to avoid API Spam
    const debounceTimeout = setTimeout(() => {
      fetchData();
    }, 300); //wait 300ms after last change 

    return () => clearTimeout(debounceTimeout);
  }, [token, monthFilter, regionFilter, startDate, endDate, categoryFilter, salespersonFilter]);


  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-100 space-y-8">
        {/* Navbar Placeholder */}
        <div className="flex justify-between items-center bg-white p-4 rounded shadow">
          <LoadingSkeleton width="w-1/3" height="h-8" />
          <LoadingSkeleton width="w-24" height="h-8" />
        </div>

        {/* Filters Placeholder */}
        <div className="flex gap-4">
          <LoadingSkeleton width="w-48" height="h-10" />
          <LoadingSkeleton width="w-48" height="h-10" />
        </div>

        {/* KPI Cards Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill().map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow">
              <LoadingSkeleton width="w-1/2" height="h-5" />
              <LoadingSkeleton width="w-3/4" height="h-8 mt-4" />
            </div>
          ))}
        </div>

        {/* Charts Placeholder */}
        <div className="bg-white p-8 rounded-xl shadow h-64 animate-pulse"></div>
        <div className="bg-white p-8 rounded-xl shadow h-64 animate-pulse"></div>
        <div className="bg-white p-8 rounded-xl shadow h-64 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-2xl text-red-600 font-semibold">{error}</h2>
      </div>
    );
  }

  return (
    <div id="dashboard-content">
      <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-100 space-y-10">

        {/* Navbar/Header */}
        <header className="flex flex-col items-center justify-center bg-white py-6 rounded shadow space-y-2 mb-6">
          <h1 className="text-3xl font-bold text-blue-600 tracking-wide">Sales Dashboard</h1>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-700 font-medium text-lg">Welcome, {userName}</span>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                navigate('/');
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition duration-300 shadow-md"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <select className="px-4 py-2 rounded border border-gray-300" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          <select className="px-4 py-2 rounded border border-gray-300" value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
            {regions.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 rounded border border-gray-300"
            value={salespersonFilter}
            onChange={(e) => setSalespersonFilter(e.target.value)}
          >
            <option value="">All Salespersons</option>
            {salespersons.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>


          <input type="date" className="px-4 py-2 rounded border border-gray-300" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

          <input type="date" className="px-4 py-2 rounded border border-gray-300" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

          <select className="px-4 py-2 rounded border border-gray-300" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Furniture">Furniture</option>
            <option value="Toys">Toys</option>
          </select>
        </div>
        { /*Export Buttons Download PDF/XLS*/}
        <div className="flex justify-end gap-4">
          <button
            onClick={exportToPDF}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            Download PDF
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
          >
            Download Excel
          </button>
        </div>


        {/* KPI Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {/* Each card */}
          {[
            { title: 'Total Revenue', value: `$${monthlyRevenue.reduce((acc, curr) => acc + curr.totalRevenue, 0)}`, color: 'text-green-500' },
            { title: 'Products', value: productBreakdown.length, color: 'text-blue-500' },
            { title: 'Regions', value: regionSales.length, color: 'text-purple-500' },
            { title: 'Conversion Rate', value: salesFunnel.conversionRate, color: 'text-yellow-500' }
          ].map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <h2 className="text-gray-500 text-lg font-semibold mb-2">{card.title}</h2>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Line Chart */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Monthly Revenue</h2>
          {monthlyRevenue.length === 0 ? (
            <div className="text-center text-gray-400 py-10">No Revenue Data Available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="totalRevenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Product Breakdown</h2>
          {productBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productBreakdown}
                  dataKey="totalRevenue"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {productBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-400 py-10">No Product Data Available</div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Region Sales</h2>
          {regionSales.length === 0 ? (
            <div className="text-center text-gray-400 py-10">No Region Data Available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalRevenue" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Sales Funnel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Total Visitors', value: salesFunnel.totalVisitors, color: 'text-blue-500' },
            { title: 'Total Orders', value: salesFunnel.totalOrders, color: 'text-green-500' },
            { title: 'Conversion Rate', value: salesFunnel.conversionRate, color: 'text-purple-500' }
          ].map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-center">
              <h2 className="text-gray-500 text-lg font-semibold mb-2">{card.title}</h2>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
