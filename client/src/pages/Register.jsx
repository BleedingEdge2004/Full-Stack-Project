import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Salesperson', // default role
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, formData);
            toast.success('Registered successfully');
            navigate('/');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Registration failed');
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
                {/* Image */}
                <div className="bg-gray-200 hidden md:flex items-center justify-center">
                    <img src="/register-bg.jpg" alt="Register" className="object-cover h-full w-full" />
                </div>

                {/* Form */}
                <div className="p-8 flex flex-col justify-center space-y-6">
                    <h2 className="text-2xl font-bold text-center text-green-600">Register</h2>
                    {error && (
                        <div className="bg-red-100 text-red-700 p-2 rounded">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-semibold text-gray-600">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold text-gray-600">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold text-gray-600">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold text-gray-600">Role</label>
                            <select name="role" value={formData.role} onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                                <option value="Salesperson">Salesperson</option>
                                <option value="Manager">Manager</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit"
                            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200">
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

}
// return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         {/* <div className="bg-white p-8 rounded shadow-md w-full max-w-md"> */}
//         <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden max-w-4xl w-full">

//             {/* Left image */}
//             <div className="hidden md:block md:w-1/2">
//                 <img
//                     src="/register-bg.jpg"
//                     alt="register"
//                     className="w-full h-full object-cover"
//                 />
//             </div>
//             <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2>
//             {error && (
//                 <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
//                     {error}
//                 </div>
//             )}
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <label className="block mb-1 font-semibold text-gray-600">Name</label>
//                     <input
//                         type="text"
//                         name="name"
//                         className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label className="block mb-1 font-semibold text-gray-600">Email</label>
//                     <input
//                         type="email"
//                         name="email"
//                         className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label className="block mb-1 font-semibold text-gray-600">Password</label>
//                     <input
//                         type="password"
//                         name="password"
//                         className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         value={formData.password}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label className="block mb-1 font-semibold text-gray-600">Role</label>
//                     <select
//                         name="role"
//                         className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         value={formData.role}
//                         onChange={handleChange}
//                     >
//                         <option value="Salesperson">Salesperson</option>
//                         <option value="Manager">Manager</option>
//                         <option value="Admin">Admin</option>
//                     </select>
//                 </div>
//                 <button
//                     type="submit"
//                     className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-200"
//                 >
//                     Register
//                 </button>
//             </form>
//         </div>
//     </div>
// );

export default Register;
