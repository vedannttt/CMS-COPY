import { useEffect } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './store/auth'
import DashboardLayout from './layouts/DashboardLayout'
import { MenuView, CartView, MyOrders, FeedbackForm, AnnouncementsView } from './pages/student'
import { OrderManagement, MenuAvailability, ViewFeedback, CreateAnnouncement } from './pages/staff'
import { MenuManagement, UserManagement, AnalyticsDashboard, FeedbackManagement } from './pages/admin'

function LoginPage() {
	const { login, loading, error } = useAuthStore()
	const navigate = useNavigate()
	
	async function onSubmit(e) { 
		e.preventDefault(); 
		const f=new FormData(e.currentTarget); 
		const success = await login(f.get('username'), f.get('password'))
		if (success) {
			navigate('/')
		}
	}
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<form onSubmit={onSubmit} className="w-full max-w-sm bg-white shadow p-6 rounded space-y-4">
				<h1 className="text-2xl font-semibold text-center">Canteen Login</h1>
				<input name="username" placeholder="VIT Email (e.g., john.doe@vit.edu.in)" className="w-full border p-2 rounded" required />
				<input name="password" type="password" placeholder="Password" className="w-full border p-2 rounded" required />
				{error && <p className="text-red-600 text-sm">{error}</p>}
				<button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">{loading ? 'Signing in...' : 'Login'}</button>
				<p className="text-sm text-center">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
			</form>
		</div>
	)
}

function RegisterPage() {
	const { register, loading, error } = useAuthStore()
	const navigate = useNavigate()
	
	async function onSubmit(e) { 
		e.preventDefault(); 
		const f=new FormData(e.currentTarget); 
		const success = await register(f.get('username'), f.get('password'), f.get('role'))
		if (success) {
			navigate('/')
		}
	}
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<form onSubmit={onSubmit} className="w-full max-w-sm bg-white shadow p-6 rounded space-y-4">
				<h1 className="text-2xl font-semibold text-center">Register</h1>
				<input name="username" placeholder="VIT Email (e.g., john.doe@vit.edu.in)" className="w-full border p-2 rounded" required />
				<input name="password" type="password" placeholder="Password" className="w-full border p-2 rounded" required />
				<select name="role" className="w-full border p-2 rounded" required>
					<option value="student">Student</option>
					<option value="staff">Staff</option>
					<option value="admin">Admin</option>
				</select>
				{error && <p className="text-red-600 text-sm">{error}</p>}
				<button disabled={loading} className="w-full bg-green-600 text-white py-2 rounded">{loading ? 'Creating...' : 'Register'}</button>
				<p className="text-xs text-gray-500 text-center">Note: Only VIT email addresses (@vit.edu.in) are allowed</p>
				<p className="text-sm text-center">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
			</form>
		</div>
	)
}

function Home() {
	const { user, logout } = useAuthStore()
	
	if (user) {
		// If user is logged in, redirect to their dashboard
		if (user.role === 'student') {
			return <Navigate to="/student/menu" replace />
		} else if (user.role === 'staff') {
			return <Navigate to="/staff/orders" replace />
		} else if (user.role === 'admin') {
			return <Navigate to="/admin/menu" replace />
		}
	}
	
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Canteen Management System</h1>
					<p className="text-gray-600 mb-8">Welcome to the canteen management system</p>
				</div>
				
				<div className="space-y-4">
					<div className="text-center">
						<p className="text-sm text-gray-600 mb-4">Choose your role to access the system:</p>
					</div>
					<div className="grid gap-4">
						<Link 
							to="/student/menu" 
							className="block w-full px-4 py-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Student Portal
						</Link>
						<Link 
							to="/staff/orders" 
							className="block w-full px-4 py-3 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
						>
							Staff Portal
						</Link>
						<Link 
							to="/admin/menu" 
							className="block w-full px-4 py-3 text-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
						>
							Admin Portal
						</Link>
					</div>
					
					<div className="text-center pt-4 border-t">
						<p className="text-sm text-gray-600">
							Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
						</p>
						<p className="text-sm text-gray-600 mt-2">
							Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function App() {
	const init = useAuthStore((s) => s.init)
	useEffect(() => { init() }, [init])
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />

			<Route element={<ProtectedRoute roles={["student"]} />}>
				<Route element={<DashboardLayout />}> 
					<Route path="/student/menu" element={<MenuView />} />
					<Route path="/student/cart" element={<CartView />} />
					<Route path="/student/orders" element={<MyOrders />} />
					<Route path="/student/feedback" element={<FeedbackForm />} />
					<Route path="/student/announcements" element={<AnnouncementsView />} />
				</Route>
			</Route>

			<Route element={<ProtectedRoute roles={["staff"]} />}>
				<Route element={<DashboardLayout />}> 
					<Route path="/staff/orders" element={<OrderManagement />} />
					<Route path="/staff/availability" element={<MenuAvailability />} />
					<Route path="/staff/feedback" element={<ViewFeedback />} />
					<Route path="/staff/announcements" element={<CreateAnnouncement />} />
				</Route>
			</Route>

			<Route element={<ProtectedRoute roles={["admin"]} />}>
				<Route element={<DashboardLayout />}> 
					<Route path="/admin/menu" element={<MenuManagement />} />
					<Route path="/admin/users" element={<UserManagement />} />
					<Route path="/admin/analytics" element={<AnalyticsDashboard />} />
					<Route path="/admin/feedback" element={<FeedbackManagement />} />
				</Route>
			</Route>

			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}
