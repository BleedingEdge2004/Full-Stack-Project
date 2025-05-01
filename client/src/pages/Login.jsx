import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        email,
        password
      });

      // Save token
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Decode token
      const decoded = jwtDecode(token);
      localStorage.setItem('role', decoded.role); // save role separately if needed

      // Redirect
      toast.success('Login successful');
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Login failed');
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
        {/* Image */}
        <div className="bg-gray-200 hidden md:flex items-center justify-center">
          <img src="/login-bg.jpg" alt="Login" className="object-cover h-full w-full" />
        </div>
  
        {/* Form */}
        <div className="p-8 flex flex-col justify-center space-y-6">
          <h2 className="text-2xl font-bold text-center text-blue-600">Login</h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold text-gray-600">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-600">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <button type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">
              Login
            </button>
          </form>
          <div className="text-center text-sm">
            Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
          </div>
        </div>
      </div>
    </div>
  );
  
}
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       {/* <div className="bg-white p-8 rounded shadow-md w-full max-w-sm"> */}
//         <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden max-w-4xl w-full">

//           {/* Left image */}
//           <div className="hidden md:block md:w-1/2">
//             <img
//               src="/login-bg.jpg"
//               alt="Login"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
//           {error && (
//             <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
//               {error}
//             </div>
//           )}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block mb-1 font-semibold text-gray-600">Email</label>
//               <input
//                 type="email"
//                 className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-semibold text-gray-600">Password</label>
//               <input
//                 type="password"
//                 className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
//             >
//               Login
//             </button>
//           </form>
//           <div className="text-center mt-4">
//             <p className="text-sm">
//               Don't have an account?{' '}
//               <a href="/register" className="text-blue-500 hover:underline">
//                 Register
//               </a>
//             </p>
//           </div>

//         </div>
//       </div>
//       );

      export default Login;
