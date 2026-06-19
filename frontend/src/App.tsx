import { useState, useEffect, useRef } from 'react';
import { 
  Flame, Award, Dumbbell, Utensils, User, Camera, 
  Plus, Check, AlertCircle, Sparkles, LogOut, ArrowRight,
  ChevronRight, Calendar, Info, RefreshCw, Eye, EyeOff
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function App() {
  // Session & Auth States
  const [token, setToken] = useState<string | null>(localStorage.getItem('aurafit_token'));
  const [isRegister, setIsRegister] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // App Master States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'gym' | 'body' | 'food'>('dashboard');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorErrorMsg] = useState('');

  // Onboarding / Biometrics Modal State
  const [showBiometricsModal, setShowBiometricsModal] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Laki-laki');
  const [goal, setGoal] = useState('Stay Fit');

  // Feature specific states
  // 1. Gym Scan
  const [gymFile, setGymFile] = useState<File | null>(null);
  const [gymPreview, setGymPreview] = useState<string | null>(null);
  const [gymResult, setGymPreviewResult] = useState<any>(null);
  const [logFormOpen, setLogFormOpen] = useState(false);
  const [logWeight, setLogWeight] = useState('');
  const [logReps, setLogReps] = useState('12');
  const [logSets, setLogSets] = useState('3');
  const [logRpe, setLogRpe] = useState('7');

  // 2. Body Sync
  const [bodyFile, setBodyFile] = useState<File | null>(null);
  const [bodyPreview, setBodyPreview] = useState<string | null>(null);
  const [bodyResult, setBodyResult] = useState<any>(null);
  const [blurFace, setBlurFace] = useState(true);
  const [blurringActive, setBlurringActive] = useState(false);

  // 3. Food Scan
  const [foodFile, setFoodFile] = useState<File | null>(null);
  const [foodPreview, setFoodPreview] = useState<string | null>(null);
  const [foodResult, setFoodResult] = useState<any>(null);

  // Notification Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Check auth & fetch telemetry
  useEffect(() => {
    if (token) {
      fetchDashboard();
    }
  }, [token]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error('Gagal mengambil data dashboard');
      const data = await res.json();
      setDashboardData(data);
      
      // Prompt biometrics if empty
      if (!data.user.height || !data.user.weight) {
        setShowBiometricsModal(true);
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Email atau password salah');
      }
      const data = await res.json();
      localStorage.setItem('aurafit_token', data.access_token);
      setToken(data.access_token);
      showToast('Masuk berhasil! Selamat berolahraga.', 'success');
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const regRes = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword, full_name: authName })
      });
      if (!regRes.ok) {
        const err = await regRes.json();
        throw new Error(err.detail || 'Registrasi gagal');
      }
      
      // Log in automatically after registration
      const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const data = await loginRes.json();
      localStorage.setItem('aurafit_token', data.access_token);
      setToken(data.access_token);
      showToast('Akun berhasil dibuat!', 'success');
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aurafit_token');
    setToken(null);
    setDashboardData(null);
    setActiveTab('dashboard');
    showToast('Keluar berhasil.', 'success');
  };

  const submitBiometrics = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/users/biometrics`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          height: parseFloat(height),
          weight: parseFloat(weight),
          age: parseInt(age),
          gender,
          goal
        })
      });
      if (!res.ok) throw new Error('Gagal memperbarui biometrik');
      showToast('Biometrik Anda berhasil disinkronkan!', 'success');
      setShowBiometricsModal(false);
      fetchDashboard();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Action handlers
  const handleGymScan = async () => {
    if (!gymFile) return;
    setLoading(true);
    setErrorErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('file', gymFile);
      const res = await fetch(`${API_BASE}/api/vision/equipment`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error('Analisis alat gagal.');
      const data = await res.json();
      setGymPreviewResult(data);
      showToast('Alat terdeteksi berhasil!', 'success');
    } catch (err: any) {
      setErrorErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogWorkout = async () => {
    if (!gymResult) return;
    try {
      const res = await fetch(`${API_BASE}/api/logs/workout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          equipment_name: gymResult.equipment_name,
          sets: parseInt(logSets),
          reps: parseInt(logReps),
          weight_kg: parseFloat(logWeight || '0'),
          rpe: `RPE ${logRpe}`
        })
      });
      if (!res.ok) throw new Error('Gagal mencatat latihan');
      showToast('Latihan dicatat! Anda mendapatkan +15 XP 🔥', 'success');
      setLogFormOpen(false);
      fetchDashboard();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleBodySync = async () => {
    if (!bodyFile) return;
    setLoading(true);
    setErrorErrorMsg('');
    
    if (blurFace) {
      setBlurringActive(true);
      await new Promise(r => setTimeout(r, 1200)); // Simulate face blur processing
      setBlurringActive(false);
    }

    try {
      const formData = new FormData();
      formData.append('file', bodyFile);
      const res = await fetch(`${API_BASE}/api/vision/selfie`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Gagal menganalisis tubuh.');
      }
      const data = await res.json();
      setBodyResult(data);
      showToast('Komposisi tubuh sinkron! Anda mendapatkan +50 XP 🔥', 'success');
      fetchDashboard();
    } catch (err: any) {
      setErrorErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFoodScan = async () => {
    if (!foodFile) return;
    setLoading(true);
    setErrorErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('file', foodFile);
      const res = await fetch(`${API_BASE}/api/vision/food`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error('Analisis piring makanan gagal.');
      const data = await res.json();
      setFoodResult(data);
      showToast('Makanan berhasil dianalisis!', 'success');
    } catch (err: any) {
      setErrorErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogFood = async () => {
    if (!foodResult) return;
    try {
      const res = await fetch(`${API_BASE}/api/logs/food`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          food_name: foodResult.food_name,
          calories: foodResult.nutrition.calories,
          protein_g: foodResult.nutrition.protein_g,
          carbs_g: foodResult.nutrition.carbohydrates_g,
          fats_g: foodResult.nutrition.fats_g,
          portion: foodResult.estimated_portion,
          fitness_compatibility: foodResult.fitness_compatibility,
          improvement_tips: foodResult.improvement_tips
        })
      });
      if (!res.ok) throw new Error('Gagal mencatat gizi makanan');
      showToast('Makanan dicatat! Anda mendapatkan +10 XP 🔥', 'success');
      setFoodFile(null);
      setFoodPreview(null);
      setFoodResult(null);
      fetchDashboard();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // If not logged in, render Login/Register
  if (!token) {
    return (
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-zinc-900 to-black">
        {toast && (
          <div class={`fixed top-4 right-4 z-50 p-4 rounded-xl flex items-center gap-2 border shadow-lg transition-all animate-fade-in ${
            toast.type === 'success' ? 'bg-zinc-900 border-volt text-volt' : 'bg-zinc-900 border-red-500 text-red-500'
          }`}>
            <Sparkles class="w-5 h-5" />
            <span class="font-medium">{toast.message}</span>
          </div>
        )}

        <div class="w-full max-w-md bg-slate-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-volt rounded-full filter blur-3xl opacity-10"></div>
          
          <div class="text-center mb-8">
            <div class="inline-flex items-center gap-2 mb-3 bg-zinc-800/50 px-4 py-1.5 rounded-full border border-zinc-700/50">
              <Dumbbell class="w-5 h-5 text-volt" />
              <span class="text-xs font-semibold uppercase tracking-wider text-zinc-300">Gym Onboarding Assistant</span>
            </div>
            <h1 class="text-4xl font-extrabold tracking-tight">AURAFIT<span class="text-volt">AI</span></h1>
            <p class="text-zinc-400 text-sm mt-2">Dampingi langkah pertamamu di gym secara instan menggunakan Vision AI</p>
          </div>

          {authError && (
            <div class="bg-red-500/10 border border-red-500/20 text-red-500 p-3.5 rounded-xl flex items-center gap-2 text-sm mb-6">
              <AlertCircle class="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={isRegister ? handleRegister : handleLogin} class="space-y-4">
            {isRegister && (
              <div>
                <label class="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  placeholder="Bagas K." 
                  required
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-volt transition-colors"
                />
              </div>
            )}
            <div>
              <label class="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">Alamat Email</label>
              <input 
                type="email" 
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                placeholder="bagas@gmail.com" 
                required
                class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-volt transition-colors"
              />
            </div>
            <div>
              <label class="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">Kata Sandi</label>
              <input 
                type="password" 
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                placeholder="••••••••" 
                required
                class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-volt transition-colors"
              />
            </div>

            <button 
              type="submit" 
              class="w-full bg-volt text-black font-bold py-3.5 px-4 rounded-xl hover:bg-volt-hover transition-colors flex items-center justify-center gap-2 mt-6 shadow-md"
            >
              <span>{isRegister ? 'Buat Akun AuraFit' : 'Masuk Aplikasi'}</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </form>

          <div class="text-center mt-6 pt-6 border-t border-zinc-800/80">
            <button 
              onClick={() => { setIsRegister(!isRegister); setAuthError(''); }}
              class="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            >
              {isRegister ? 'Sudah memiliki akun? Masuk' : 'Belum bergabung? Daftar Sekarang'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-slate-950 flex flex-col md:flex-row text-zinc-100">
      {/* Toast Alert */}
      {toast && (
        <div class={`fixed top-4 right-4 z-50 p-4 rounded-xl flex items-center gap-2 border shadow-lg transition-all animate-fade-in ${
          toast.type === 'success' ? 'bg-zinc-900 border-volt text-volt' : 'bg-zinc-900 border-red-500 text-red-500'
        }`}>
          <Sparkles class="w-5 h-5 animate-pulse" />
          <span class="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Navigation Sidebar */}
      <aside class="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-zinc-800/80 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-2xl font-extrabold tracking-tight">AURAFIT<span class="text-volt">AI</span></h1>
            <span class="text-zinc-500 text-xs font-mono font-bold bg-zinc-800 px-2 py-0.5 rounded">v1.0</span>
          </div>

          {dashboardData && (
            <div class="mb-6 p-4 rounded-2xl bg-zinc-950 border border-zinc-800/50 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-volt/10 border border-volt/20 flex items-center justify-center text-volt">
                <User class="w-5 h-5" />
              </div>
              <div class="overflow-hidden">
                <p class="font-bold text-sm text-white truncate">{dashboardData.user.full_name || 'Bagas K.'}</p>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <Award class="w-3.5 h-3.5 text-volt" />
                  <span class="text-xs text-zinc-400 font-bold">{dashboardData.user.xp} XP</span>
                </div>
              </div>
            </div>
          )}

          <nav class="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Dumbbell },
              { id: 'gym', label: 'Scan Alat Gym', icon: Camera },
              { id: 'body', label: 'Body Composition', icon: Sparkles },
              { id: 'food', label: 'Scan Makanan', icon: Utensils },
            ].map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); setErrorErrorMsg(''); }}
                  class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    active 
                      ? 'bg-volt text-black shadow-lg shadow-volt/10' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                  }`}
                >
                  <Icon class="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          class="w-full flex items-center gap-3 px-4 py-3 mt-6 text-zinc-500 hover:text-red-400 rounded-xl font-bold text-sm transition-colors text-left"
        >
          <LogOut class="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </aside>

      {/* Main Content Pane */}
      <main class="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Top telemetry bar */}
        <header class="p-6 bg-slate-900/40 border-b border-zinc-800/50 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-extrabold capitalize tracking-wide">{activeTab === 'gym' ? 'Scan Alat Gym' : (activeTab === 'body' ? 'Full-Body Selfie' : activeTab)}</h2>
          </div>
          
          {dashboardData && (
            <div class="flex items-center gap-3">
              {/* Daily Streak display */}
              <div class="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 px-3 py-1.5 rounded-full text-xs font-bold">
                <Flame class="w-4 h-4 text-orange-500 animate-pulse" />
                <span>{dashboardData.user.current_streak} DAY STREAK</span>
              </div>
              <button 
                onClick={fetchDashboard}
                class="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full transition-colors border border-zinc-700/50"
                title="Refresh Data"
              >
                <RefreshCw class={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}
        </header>

        {/* Tab contents */}
        <div class="p-6 max-w-5xl w-full mx-auto space-y-6 flex-1">
          {errorMsg && (
            <div class="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-start gap-3 text-sm animate-fade-in">
              <AlertCircle class="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h5 class="font-bold mb-1">Terjadi Kesalahan</h5>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* LOADING STATE */}
          {loading && !dashboardData && (
            <div class="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div class="w-10 h-10 border-4 border-volt border-t-transparent rounded-full animate-spin"></div>
              <p class="text-sm font-semibold text-zinc-400">Sedang memproses kecerdasan vision harian Anda...</p>
            </div>
          )}

          {/* 1. DASHBOARD TAB */}
          {activeTab === 'dashboard' && dashboardData && (
            <div class="space-y-6 animate-fade-in">
              {/* Profile Card & Bio details */}
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Target Kebugaran</span>
                    <h3 class="text-xl font-extrabold text-white uppercase tracking-wider">{dashboardData.user.goal || 'Stay Fit'}</h3>
                  </div>
                  <div class="flex items-center gap-1 text-volt mt-4 text-xs font-bold">
                    <span>Target Anda ditentukan secara visual</span>
                  </div>
                </div>

                <div class="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-5 grid grid-cols-2 gap-4">
                  <div>
                    <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Tinggi Badan</span>
                    <p class="text-xl font-bold text-white">{dashboardData.user.height ? `${dashboardData.user.height} cm` : '-'}</p>
                  </div>
                  <div>
                    <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Berat Badan</span>
                    <p class="text-xl font-bold text-white">{dashboardData.user.weight ? `${dashboardData.user.weight} kg` : '-'}</p>
                  </div>
                  <div>
                    <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Usia</span>
                    <p class="text-xl font-bold text-white">{dashboardData.user.age ? `${dashboardData.user.age} th` : '-'}</p>
                  </div>
                  <div>
                    <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Gender</span>
                    <p class="text-xl font-bold text-white truncate">{dashboardData.user.gender || '-'}</p>
                  </div>
                </div>

                <div class="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-5 flex flex-col justify-between">
                  <div class="flex justify-between items-start">
                    <div>
                      <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Estimasi Body Fat</span>
                      <p class="text-2xl font-black text-volt">{dashboardData.latest_body_composition?.estimated_body_fat || 'Lakukan Sync'}</p>
                    </div>
                    {dashboardData.latest_body_composition && (
                      <span class="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full font-bold">
                        {dashboardData.latest_body_composition.somatotype}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setActiveTab('body')}
                    class="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors mt-3 text-center"
                  >
                    Sync Ulang Foto Badan
                  </button>
                </div>
              </div>

              {/* Macro & Nutrition Log Bar */}
              <div class="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6">
                <div class="flex justify-between items-center mb-6">
                  <div>
                    <h3 class="text-lg font-extrabold text-white">Target Nutrisi Harian</h3>
                    <p class="text-xs text-zinc-400">Berdasarkan data selfie tubuh terakhir Anda</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('food')}
                    class="bg-volt text-black text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-volt-hover transition-colors flex items-center gap-1.5"
                  >
                    <Plus class="w-3.5 h-3.5" />
                    <span>Catat Makanan</span>
                  </button>
                </div>

                {/* Macro progress grid */}
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Kalori', cur: dashboardData.daily_totals.calories_consumed, target: dashboardData.daily_totals.calories_target, unit: 'kcal', color: 'text-volt border-volt/30' },
                    { label: 'Protein', cur: dashboardData.daily_totals.protein_consumed, target: dashboardData.daily_totals.protein_target, unit: 'g', color: 'text-sky-400 border-sky-500/30' },
                    { label: 'Karbohidrat', cur: dashboardData.daily_totals.carbs_consumed, target: dashboardData.daily_totals.carbs_target, unit: 'g', color: 'text-amber-400 border-amber-500/30' },
                    { label: 'Lemak', cur: dashboardData.daily_totals.fats_consumed, target: dashboardData.daily_totals.fats_target, unit: 'g', color: 'text-rose-400 border-rose-500/30' },
                  ].map(macro => {
                    const pct = Math.min(100, Math.round((macro.cur / macro.target) * 100)) || 0;
                    return (
                      <div key={macro.label} class="bg-zinc-950/60 border border-zinc-800/40 rounded-2xl p-4 flex flex-col justify-between">
                        <div class="flex justify-between items-center mb-3">
                          <span class="text-xs font-bold text-zinc-400">{macro.label}</span>
                          <span class="text-xs font-bold text-zinc-500">{pct}%</span>
                        </div>
                        <div>
                          <p class="text-lg font-black text-white">{macro.cur} <span class="text-xs font-semibold text-zinc-500">{macro.unit}</span></p>
                          <div class="w-full bg-zinc-800 h-2 rounded-full mt-2 overflow-hidden">
                            <div class={`h-full rounded-full ${macro.label === 'Kalori' ? 'bg-volt' : (macro.label === 'Protein' ? 'bg-sky-400' : (macro.label === 'Karbohidrat' ? 'bg-amber-400' : 'bg-rose-400'))}`} style={{ width: `${pct}%` }}></div>
                          </div>
                          <span class="text-[10px] text-zinc-500 font-medium block mt-1">Target: {macro.target} {macro.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* History workout logs */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-5">
                  <h4 class="text-md font-extrabold text-white mb-4 flex items-center gap-2">
                    <Dumbbell class="w-4 h-4 text-volt" />
                    <span>Aktivitas Latihan Terakhir</span>
                  </h4>
                  {dashboardData.workout_logs.length === 0 ? (
                    <div class="text-center py-8 bg-zinc-950/50 border border-dashed border-zinc-800 rounded-xl">
                      <p class="text-xs text-zinc-500">Belum ada aktivitas latihan tercatat.</p>
                      <button onClick={() => setActiveTab('gym')} class="text-xs font-bold text-volt mt-2 hover:underline">Scan Alat Pertama</button>
                    </div>
                  ) : (
                    <div class="space-y-3">
                      {dashboardData.workout_logs.map((log: any) => (
                        <div key={log.id} class="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/50 flex justify-between items-center">
                          <div>
                            <p class="font-bold text-sm text-white">{log.equipment_name}</p>
                            <p class="text-[10px] text-zinc-500 mt-0.5">{new Date(log.created_at).toLocaleDateString()}</p>
                          </div>
                          <div class="text-right">
                            <span class="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full font-bold">
                              {log.sets} Set x {log.reps} Reps
                            </span>
                            <p class="text-[10px] text-zinc-400 mt-1 font-semibold">{log.weight_kg} kg | {log.rpe}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div class="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-5">
                  <h4 class="text-md font-extrabold text-white mb-4 flex items-center gap-2">
                    <Utensils class="w-4 h-4 text-volt" />
                    <span>Jurnal Makan Hari Ini</span>
                  </h4>
                  {dashboardData.food_logs.length === 0 ? (
                    <div class="text-center py-8 bg-zinc-950/50 border border-dashed border-zinc-800 rounded-xl">
                      <p class="text-xs text-zinc-500">Belum ada makanan tercatat hari ini.</p>
                      <button onClick={() => setActiveTab('food')} class="text-xs font-bold text-volt mt-2 hover:underline">Foto Hidanganmu</button>
                    </div>
                  ) : (
                    <div class="space-y-3">
                      {dashboardData.food_logs.map((log: any) => (
                        <div key={log.id} class="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/50 flex justify-between items-center">
                          <div>
                            <p class="font-bold text-sm text-white">{log.food_name}</p>
                            <p class="text-[10px] text-zinc-500 mt-0.5">{log.portion}</p>
                          </div>
                          <div class="text-right">
                            <span class="text-xs font-black text-volt">{log.calories} kcal</span>
                            <p class="text-[10px] text-zinc-500 mt-1 font-semibold">P:{log.protein_g}g C:{log.carbs_g}g F:{log.fats_g}g</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. GYM SCAN TAB */}
          {activeTab === 'gym' && (
            <div class="space-y-6 animate-fade-in">
              <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <h3 class="text-lg font-extrabold text-white mb-2">Deteksi Alat Gym</h3>
                <p class="text-xs text-zinc-400 mb-6">Foto atau unggah gambar alat olahraga di lantai gym untuk mengetahui gerakan terbaik dari Personal Trainer</p>

                <div class="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl p-8 bg-zinc-950/50 hover:bg-zinc-950 transition-colors">
                  {gymPreview ? (
                    <div class="text-center space-y-4 w-full max-w-sm">
                      <img src={gymPreview} alt="Pratinjau Alat" class="rounded-xl w-full h-48 object-cover border border-zinc-800" />
                      <div class="flex gap-2">
                        <button 
                          onClick={() => { setGymFile(null); setGymPreview(null); setGymPreviewResult(null); }}
                          class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
                        >
                          Hapus Foto
                        </button>
                        <button 
                          onClick={handleGymScan}
                          disabled={loading}
                          class="flex-1 bg-volt text-black font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          {loading ? 'Menganalisis...' : 'Analisis Alat'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label class="cursor-pointer text-center flex flex-col items-center">
                      <div class="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-volt mb-4">
                        <Camera class="w-6 h-6" />
                      </div>
                      <span class="text-sm font-bold text-white">Ambil Foto / Pilih Berkas</span>
                      <span class="text-xs text-zinc-500 mt-1">Format JPG, PNG (Kompres otomatis untuk mobile)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setGymFile(file);
                            setGymPreview(URL.createObjectURL(file));
                          }
                        }}
                        class="hidden" 
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Gym vision Analysis result card */}
              {gymResult && (
                <div class="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-6 animate-fade-in">
                  <div class="flex justify-between items-start border-b border-zinc-800/80 pb-4">
                    <div>
                      <span class="bg-volt/10 border border-volt/20 text-volt text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        Terdeteksi AI
                      </span>
                      <h3 class="text-2xl font-black text-white mt-2 uppercase tracking-wide">{gymResult.equipment_name}</h3>
                    </div>
                    <div class="text-right">
                      <span class="text-xs text-zinc-500 block">Sasaran Otot Utama</span>
                      <p class="font-bold text-volt text-sm">{gymResult.primary_muscle}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                      <h4 class="text-sm font-extrabold text-white flex items-center gap-1.5">
                        <Check class="w-4 h-4 text-volt" />
                        <span>Cara Penggunaan Aman</span>
                      </h4>
                      <ol class="space-y-2.5 text-xs text-zinc-300">
                        {gymResult.how_to_use.map((step: string, i: number) => (
                          <li key={i} class="flex gap-3">
                            <span class="font-black text-volt">{i+1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div class="space-y-4">
                      <h4 class="text-sm font-extrabold text-red-400 flex items-center gap-1.5">
                        <AlertCircle class="w-4 h-4 text-red-500" />
                        <span>Kesalahan Umum Pemula</span>
                      </h4>
                      <ul class="space-y-2.5 text-xs text-zinc-300">
                        {gymResult.common_mistakes.map((step: string, i: number) => (
                          <li key={i} class="flex gap-2">
                            <span class="text-red-500 font-extrabold">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div class="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <span class="text-[10px] text-zinc-500 uppercase font-black block">Skema Rekomendasi Latihan</span>
                      <p class="font-bold text-sm text-white mt-1">
                        {gymResult.recommended_schema.sets} Set x {gymResult.recommended_schema.reps} Repetisi | {gymResult.recommended_schema.rpe}
                      </p>
                    </div>

                    <button 
                      onClick={() => setLogFormOpen(true)}
                      class="bg-volt text-black text-xs font-extrabold px-5 py-3 rounded-xl hover:bg-volt-hover transition-colors shadow-md shadow-volt/5"
                    >
                      Mulai Latihan dengan Alat Ini
                    </button>
                  </div>
                </div>
              )}

              {/* Log exercise sets form popup */}
              {logFormOpen && (
                <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div class="bg-slate-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm space-y-4">
                    <div>
                      <h4 class="text-lg font-extrabold text-white">Catat Latihan</h4>
                      <p class="text-xs text-zinc-400 mt-1">Alat: {gymResult?.equipment_name}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Set Latihan</label>
                        <input 
                          type="number" 
                          value={logSets}
                          onChange={e => setLogSets(e.target.value)}
                          class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt text-sm"
                        />
                      </div>
                      <div>
                        <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Repetisi</label>
                        <input 
                          type="number" 
                          value={logReps}
                          onChange={e => setLogReps(e.target.value)}
                          class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt text-sm"
                        />
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Beban (kg)</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 15"
                          value={logWeight}
                          onChange={e => setLogWeight(e.target.value)}
                          class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt text-sm"
                        />
                      </div>
                      <div>
                        <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Intensitas (RPE 1-10)</label>
                        <select 
                          value={logRpe} 
                          onChange={e => setLogRpe(e.target.value)}
                          class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt text-sm"
                        >
                          <option value="6">RPE 6 (Mudah)</option>
                          <option value="7">RPE 7 (Sedang)</option>
                          <option value="8">RPE 8 (Berat)</option>
                          <option value="9">RPE 9 (Sangat Berat)</option>
                        </select>
                      </div>
                    </div>

                    <div class="flex gap-2 pt-2">
                      <button 
                        onClick={() => setLogFormOpen(false)}
                        class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                      >
                        Batal
                      </button>
                      <button 
                        onClick={handleLogWorkout}
                        class="flex-1 bg-volt text-black font-bold py-2.5 rounded-xl text-xs transition-colors"
                      >
                        Simpan Latihan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. BODY SYNC TAB */}
          {activeTab === 'body' && (
            <div class="space-y-6 animate-fade-in">
              <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <h3 class="text-lg font-extrabold text-white mb-2">Sinkronisasi Komposisi Tubuh</h3>
                <p class="text-xs text-zinc-400 mb-6">Unggah foto satu badan penuh untuk mengestimasi lemak tubuh, tipe tubuh, target gizi secara visual melalui vision AI</p>

                <div class="bg-zinc-950/60 border border-zinc-800 p-4 rounded-2xl space-y-4 mb-6">
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>Fitur Keamanan: Sensor Wajah Otomatis</span>
                      </h4>
                      <p class="text-[10px] text-zinc-500 mt-0.5">Wajah Anda disensor secara lokal di browser sebelum diunggah demi privasi penuh</p>
                    </div>
                    <button 
                      onClick={() => setBlurFace(!blurFace)}
                      class={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-colors flex items-center gap-1 ${
                        blurFace ? 'bg-volt/10 text-volt border border-volt/20' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {blurFace ? <EyeOff class="w-3.5 h-3.5" /> : <Eye class="w-3.5 h-3.5" />}
                      <span>{blurFace ? 'AKTIF (Saran)' : 'MATI'}</span>
                    </button>
                  </div>
                </div>

                <div class="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl p-8 bg-zinc-950/50 hover:bg-zinc-950 transition-colors">
                  {bodyPreview ? (
                    <div class="text-center space-y-4 w-full max-w-xs relative">
                      <div class="relative rounded-xl overflow-hidden border border-zinc-800">
                        <img src={bodyPreview} alt="Selfie Tubuh" class="w-full h-64 object-cover" />
                        {(blurFace || blurringActive) && (
                          <div class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-zinc-700/50 px-4 py-2 rounded-xl flex items-center gap-2">
                            <span class="w-2.5 h-2.5 bg-volt rounded-full animate-ping"></span>
                            <span class="text-[10px] text-white font-bold uppercase tracking-wider">Face Blur Filter Active</span>
                          </div>
                        )}
                      </div>
                      
                      <div class="flex gap-2">
                        <button 
                          onClick={() => { setBodyFile(null); setBodyPreview(null); setBodyResult(null); }}
                          class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
                        >
                          Hapus Foto
                        </button>
                        <button 
                          onClick={handleBodySync}
                          disabled={loading}
                          class="flex-1 bg-volt text-black font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          {loading ? 'Menghitung...' : 'Mulai Sinkronisasi'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label class="cursor-pointer text-center flex flex-col items-center">
                      <div class="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-volt mb-4">
                        <Camera class="w-6 h-6" />
                      </div>
                      <span class="text-sm font-bold text-white">Foto Seluruh Badan</span>
                      <span class="text-xs text-zinc-500 mt-1">Gunakan pakaian fit-wear agar analisis visual tubuh akurat</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setBodyFile(file);
                            setBodyPreview(URL.createObjectURL(file));
                          }
                        }}
                        class="hidden" 
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Body Vision sync result card */}
              {bodyResult && (
                <div class="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-6 animate-fade-in">
                  <div class="flex justify-between items-start border-b border-zinc-800/80 pb-4">
                    <div>
                      <span class="bg-volt/10 border border-volt/20 text-volt text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        Hasil Sinkronisasi Fisik
                      </span>
                      <h3 class="text-2xl font-black text-white mt-2 uppercase tracking-wide">KOMPOSISI TUBUH ANDA</h3>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                      <span class="text-[10px] text-zinc-500 uppercase font-black block">Persentase Lemak Tubuh</span>
                      <p class="text-2xl font-black text-volt mt-1">{bodyResult.estimated_body_fat}</p>
                    </div>
                    <div class="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                      <span class="text-[10px] text-zinc-500 uppercase font-black block">Somatotype</span>
                      <p class="text-2xl font-black text-white mt-1">{bodyResult.somatotype}</p>
                    </div>
                    <div class="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50 col-span-1 md:col-span-1">
                      <span class="text-[10px] text-zinc-500 uppercase font-black block">Rekomendasi Fokus</span>
                      <p class="text-sm font-bold text-white mt-1.5 truncate text-wrap">{bodyResult.recommended_workout_focus}</p>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-400">Analisis Proporsi Massa Otot</h4>
                    <p class="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-2xl border border-zinc-800/40">
                      {bodyResult.muscle_distribution_analysis}
                    </p>
                  </div>

                  <div class="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-4">
                    <div>
                      <h4 class="text-sm font-bold text-white">Target Nutrisi Baru Disesuaikan</h4>
                      <p class="text-xs text-zinc-500">Gunakan target kalori dan makro ini untuk mencatat asupan makan harian Anda.</p>
                    </div>

                    <div class="grid grid-cols-4 gap-3">
                      <div class="text-center">
                        <span class="text-[10px] text-zinc-500 font-bold block">Kalori</span>
                        <span class="font-extrabold text-sm text-volt">{bodyResult.cal_target || bodyResult.macronutrient_targets?.calories} kcal</span>
                      </div>
                      <div class="text-center">
                        <span class="text-[10px] text-zinc-500 font-bold block">Protein</span>
                        <span class="font-extrabold text-sm text-sky-400">{bodyResult.protein_target || bodyResult.macronutrient_targets?.protein} g</span>
                      </div>
                      <div class="text-center">
                        <span class="text-[10px] text-zinc-500 font-bold block">Karb</span>
                        <span class="font-extrabold text-sm text-amber-400">{bodyResult.carbs_target || bodyResult.macronutrient_targets?.carbs} g</span>
                      </div>
                      <div class="text-center">
                        <span class="text-[10px] text-zinc-500 font-bold block">Lemak</span>
                        <span class="font-extrabold text-sm text-rose-400">{bodyResult.fat_target || bodyResult.macronutrient_targets?.fat} g</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. FOOD SCAN TAB */}
          {activeTab === 'food' && (
            <div class="space-y-6 animate-fade-in">
              <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <h3 class="text-lg font-extrabold text-white mb-2">Scan Hidangan Makanan</h3>
                <p class="text-xs text-zinc-400 mb-6">Foto piring makan malam, sarapan, atau camilan Anda untuk mengestimasi kandungan gizinya secara otomatis</p>

                <div class="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl p-8 bg-zinc-950/50 hover:bg-zinc-950 transition-colors">
                  {foodPreview ? (
                    <div class="text-center space-y-4 w-full max-w-sm">
                      <img src={foodPreview} alt="Pratinjau Hidangan" class="rounded-xl w-full h-48 object-cover border border-zinc-800" />
                      <div class="flex gap-2">
                        <button 
                          onClick={() => { setFoodFile(null); setFoodPreview(null); setFoodResult(null); }}
                          class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
                        >
                          Hapus Foto
                        </button>
                        <button 
                          onClick={handleFoodScan}
                          disabled={loading}
                          class="flex-1 bg-volt text-black font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          {loading ? 'Menganalisis...' : 'Analisis Gizi'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label class="cursor-pointer text-center flex flex-col items-center">
                      <div class="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-volt mb-4">
                        <Camera class="w-6 h-6" />
                      </div>
                      <span class="text-sm font-bold text-white">Ambil Foto Piring Makan</span>
                      <span class="text-xs text-zinc-500 mt-1">Arahkan tegak lurus dari atas piring makan</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setFoodFile(file);
                            setFoodPreview(URL.createObjectURL(file));
                          }
                        }}
                        class="hidden" 
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Food vision analysis result card */}
              {foodResult && (
                <div class="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-6 animate-fade-in">
                  <div class="flex justify-between items-start border-b border-zinc-800/80 pb-4">
                    <div>
                      <span class="bg-volt/10 border border-volt/20 text-volt text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        Nutrisi Terdeteksi
                      </span>
                      <h3 class="text-2xl font-black text-white mt-2 uppercase tracking-wide">{foodResult.food_name}</h3>
                      <p class="text-[10px] text-zinc-500 mt-0.5">Estimasi Porsi: {foodResult.estimated_portion}</p>
                    </div>
                    <div class="text-right">
                      <span class="text-xs text-zinc-500 block">Total Energi</span>
                      <p class="font-black text-volt text-2xl">{foodResult.nutrition.calories} kcal</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-3">
                    <div class="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/50 text-center">
                      <span class="text-[10px] text-zinc-500 font-bold block">Protein</span>
                      <span class="font-extrabold text-sm text-sky-400">{foodResult.nutrition.protein_g} g</span>
                    </div>
                    <div class="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/50 text-center">
                      <span class="text-[10px] text-zinc-500 font-bold block">Karbohidrat</span>
                      <span class="font-extrabold text-sm text-amber-400">{foodResult.nutrition.carbohydrates_g} g</span>
                    </div>
                    <div class="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/50 text-center">
                      <span class="text-[10px] text-zinc-500 font-bold block">Lemak</span>
                      <span class="font-extrabold text-sm text-rose-400">{foodResult.nutrition.fats_g} g</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/40">
                      <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-2">Kesesuaian Target</h4>
                      <p class="text-xs text-zinc-400 leading-relaxed">{foodResult.fitness_compatibility}</p>
                    </div>
                    <div class="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/40">
                      <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-2">Saran Ahli Gizi</h4>
                      <p class="text-xs text-zinc-400 leading-relaxed">{foodResult.improvement_tips}</p>
                    </div>
                  </div>

                  <button 
                    onClick={handleLogFood}
                    class="w-full bg-volt text-black font-extrabold py-3.5 rounded-xl text-xs hover:bg-volt-hover transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus class="w-4 h-4" />
                    <span>Catat Makanan ke Jurnal Hari Ini</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Onboarding / Profile Update Biometrics popup */}
      {showBiometricsModal && (
        <div class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div class="bg-slate-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-md space-y-6 relative overflow-hidden animate-fade-in">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-volt rounded-full filter blur-3xl opacity-10"></div>
            
            <div class="text-center">
              <span class="text-xs bg-volt/10 text-volt border border-volt/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Onboarding Kritis</span>
              <h3 class="text-2xl font-black text-white mt-3 uppercase tracking-wide">SIAPKAN BIOMETRIKMU</h3>
              <p class="text-xs text-zinc-400 mt-2">Daftarkan tinggi dan berat badanmu agar asisten PT AI dapat mengoreksi target kalorimu secara presisi</p>
            </div>

            <form onSubmit={submitBiometrics} class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Tinggi Badan (cm)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 172"
                    required
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-volt text-sm"
                  />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Berat Badan (kg)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 68"
                    required
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-volt text-sm"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Usia Anda</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 23"
                    required
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-volt text-sm"
                  />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Gender</label>
                  <select 
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-volt text-sm"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Target Kebugaran Utama</label>
                <select 
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-volt text-sm"
                >
                  <option value="Lose Weight / Defisit Kalori">Bakar Lemak (Lose Weight)</option>
                  <option value="Gain Muscle / Bulking">Bina Otot (Gain Muscle)</option>
                  <option value="Stay Fit / Recomposition">Kebugaran Seimbang (Stay Fit)</option>
                </select>
              </div>

              <button 
                type="submit"
                class="w-full bg-volt text-black font-extrabold py-3.5 rounded-xl text-sm hover:bg-volt-hover transition-colors shadow-md mt-4"
              >
                Simpan & Mulai Sinkronisasi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
