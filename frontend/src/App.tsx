import { useState, useEffect, useRef } from 'react';
import { 
  Flame, Award, Dumbbell, Utensils, User, Camera, 
  Plus, Check, AlertCircle, Sparkles, LogOut, ArrowRight,
  RefreshCw, Eye, EyeOff, Play, X
} from 'lucide-react';

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000';

const ASTRA_LOGOS: Record<string, { name: string, bg: string, text: string, border: string }> = {
  astralife: { name: "Astra Life", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  gardamedika: { name: "Garda Medika", bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
  hermina: { name: "RS Hermina", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  halodoc: { name: "Halodoc", bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
  toyota: { name: "Toyota Astra", bg: "bg-zinc-500/10", text: "text-zinc-300", border: "border-zinc-700/30" },
  fifgroup: { name: "FIFGROUP", bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20" },
  astrapay: { name: "AstraPay", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  banksaqu: { name: "Bank Saqu", bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
  seva: { name: "SEVA", bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
  trac: { name: "TRAC Rental", bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
  heartology: { name: "Heartology", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  astrahonda: { name: "Astra Honda", bg: "bg-rose-600/10", text: "text-rose-400", border: "border-rose-600/20" },
  shopanddrive: { name: "Shop & Drive", bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
  unitedtractors: { name: "United Tractors", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  astraagro: { name: "Astra Agro", bg: "bg-emerald-600/10", text: "text-emerald-400", border: "border-emerald-600/20" },
  astragraphia: { name: "Astragraphia", bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" }
};

const ASTRA_PRODUCT_IMAGES: Record<string, string> = {
  active_lifestyle: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop",
  medical_checkup: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop",
  electric_suv: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop",
  hybrid_car: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop",
  home_gym: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fit=crop",
  payment_cashback: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop"
};

const CATUR_DHARMA = [
  {
    title: "Menjadi Milik yang Bermanfaat bagi Bangsa dan Negara",
    desc: "Komitmen Astra untuk berkontribusi positif bagi kemajuan, kesehatan, dan kesejahteraan masyarakat Indonesia.",
    symbol: "🇮🇩",
    color: "from-blue-600/20 to-blue-800/20",
    textColor: "text-blue-400",
    renderSvg: () => (
      <svg className="w-24 h-24 relative z-10" viewBox="0 0 100 100" fill="none">
        <style>{`
          @keyframes circle-wave {
            0%, 100% { opacity: 0.25; transform: scale(0.98); }
            50% { opacity: 1; transform: scale(1.02); filter: drop-shadow(0 0 6px rgba(0, 102, 255, 0.8)); }
          }
          .c-ring {
            transform-origin: 50px 50px;
            animation: circle-wave 2.5s ease-in-out infinite;
            stroke: #0066FF;
            fill: none;
          }
          .c-center {
            transform-origin: 50px 50px;
            animation: circle-wave 2.5s ease-in-out infinite;
            fill: #0066FF;
          }
        `}</style>
        <clipPath id="clip-c">
          <rect width="100" height="100" rx="16" />
        </clipPath>
        <g clipPath="url(#clip-c)">
          <circle cx="50" cy="50" r="5" className="c-center" style={{ animationDelay: '0s' }} />
          <circle cx="50" cy="50" r="15" strokeWidth="5" className="c-ring" style={{ animationDelay: '0.1s' }} />
          <circle cx="50" cy="50" r="25" strokeWidth="5" className="c-ring" style={{ animationDelay: '0.2s' }} />
          <circle cx="50" cy="50" r="35" strokeWidth="5" className="c-ring" style={{ animationDelay: '0.3s' }} />
          <circle cx="50" cy="50" r="45" strokeWidth="5" className="c-ring" style={{ animationDelay: '0.4s' }} />
          <circle cx="50" cy="50" r="55" strokeWidth="5" className="c-ring" style={{ animationDelay: '0.5s' }} />
          <circle cx="50" cy="50" r="65" strokeWidth="5" className="c-ring" style={{ animationDelay: '0.6s' }} />
          <circle cx="50" cy="50" r="75" strokeWidth="5" className="c-ring" style={{ animationDelay: '0.7s' }} />
          <circle cx="50" cy="50" r="85" strokeWidth="5" className="c-ring" style={{ animationDelay: '0.8s' }} />
          <circle cx="50" cy="50" r="95" strokeWidth="5" className="c-ring" style={{ animationDelay: '0.9s' }} />
          <circle cx="50" cy="50" r="105" strokeWidth="5" className="c-ring" style={{ animationDelay: '1.0s' }} />
        </g>
      </svg>
    )
  },
  {
    title: "Memberikan Pelayanan Terbaik kepada Pelanggan",
    desc: "Menghadirkan layanan asuransi, kesehatan, mobilitas, dan rekomendasi AI personal dengan kualitas terbaik.",
    symbol: "🤝",
    color: "from-blue-500/20 to-indigo-600/20",
    textColor: "text-blue-400",
    renderSvg: () => (
      <svg className="w-24 h-24 relative z-10" viewBox="0 0 100 100" fill="none">
        <style>{`
          @keyframes diamond-wave {
            0%, 100% { opacity: 0.25; transform: rotate(45deg) scale(0.98); }
            50% { opacity: 1; transform: rotate(45deg) scale(1.02); filter: drop-shadow(0 0 6px rgba(0, 102, 255, 0.8)); }
          }
          .d-ring {
            transform-origin: 50px 50px;
            animation: diamond-wave 2.5s ease-in-out infinite;
            stroke: #0066FF;
            fill: none;
          }
          .d-center {
            transform-origin: 50px 50px;
            animation: diamond-wave 2.5s ease-in-out infinite;
            fill: #0066FF;
          }
        `}</style>
        <clipPath id="clip-d">
          <rect width="100" height="100" rx="16" />
        </clipPath>
        <g clipPath="url(#clip-d)">
          <rect x="45" y="45" width="10" height="10" className="d-center" style={{ animationDelay: '0s' }} />
          <rect x="38" y="38" width="24" height="24" strokeWidth="5" className="d-ring" style={{ animationDelay: '0.1s' }} />
          <rect x="31" y="31" width="38" height="38" strokeWidth="5" className="d-ring" style={{ animationDelay: '0.2s' }} />
          <rect x="24" y="24" width="52" height="52" strokeWidth="5" className="d-ring" style={{ animationDelay: '0.3s' }} />
          <rect x="17" y="17" width="66" height="66" strokeWidth="5" className="d-ring" style={{ animationDelay: '0.4s' }} />
          <rect x="10" y="10" width="80" height="80" strokeWidth="5" className="d-ring" style={{ animationDelay: '0.5s' }} />
          <rect x="3" y="3" width="94" height="94" strokeWidth="5" className="d-ring" style={{ animationDelay: '0.6s' }} />
          <rect x="-4" y="-4" width="108" height="108" strokeWidth="5" className="d-ring" style={{ animationDelay: '0.7s' }} />
          <rect x="-11" y="-11" width="122" height="122" strokeWidth="5" className="d-ring" style={{ animationDelay: '0.8s' }} />
          <rect x="-18" y="-18" width="136" height="136" strokeWidth="5" className="d-ring" style={{ animationDelay: '0.9s' }} />
          <rect x="-25" y="-25" width="150" height="150" strokeWidth="5" className="d-ring" style={{ animationDelay: '1.0s' }} />
        </g>
      </svg>
    )
  },
  {
    title: "Saling Menghargai dan Membina Kerja Sama",
    desc: "Kolaborasi terpadu antar ekosistem Astra Group demi menciptakan ekosistem hidup sehat yang utuh & harmonis.",
    symbol: "👥",
    color: "from-blue-600/20 to-sky-600/20",
    textColor: "text-blue-400",
    renderSvg: () => (
      <svg className="w-24 h-24 relative z-10" viewBox="0 0 100 100" fill="none">
        <style>{`
          @keyframes hex-wave {
            0%, 100% { opacity: 0.25; transform: scale(0.98); }
            50% { opacity: 1; transform: scale(1.02); filter: drop-shadow(0 0 6px rgba(0, 102, 255, 0.8)); }
          }
          .h-ring {
            transform-origin: 50px 50px;
            animation: hex-wave 2.5s ease-in-out infinite;
            stroke: #0066FF;
            fill: none;
          }
          .h-center {
            transform-origin: 50px 50px;
            animation: hex-wave 2.5s ease-in-out infinite;
            fill: #0066FF;
          }
        `}</style>
        <clipPath id="clip-h">
          <rect width="100" height="100" rx="16" />
        </clipPath>
        <g clipPath="url(#clip-h)">
          <polygon points="46,43.07 54,43.07 58,50 54,56.93 46,56.93 42,50" className="h-center" style={{ animationDelay: '0s' }} />
          <polygon points="40,32.68 60,32.68 70,50 60,67.32 40,67.32 30,50" strokeWidth="5" className="h-ring" style={{ animationDelay: '0.1s' }} />
          <polygon points="34,22.29 66,22.29 82,50 66,77.71 34,77.71 18,50" strokeWidth="5" className="h-ring" style={{ animationDelay: '0.2s' }} />
          <polygon points="28,11.9 72,11.9 94,50 72,88.1 28,88.1 6,50" strokeWidth="5" className="h-ring" style={{ animationDelay: '0.3s' }} />
          <polygon points="22,1.51 78,1.51 106,50 78,98.49 22,98.49 -6,50" strokeWidth="5" className="h-ring" style={{ animationDelay: '0.4s' }} />
          <polygon points="16,-8.89 84,-8.89 118,50 84,108.89 16,108.89 -18,50" strokeWidth="5" className="h-ring" style={{ animationDelay: '0.5s' }} />
          <polygon points="10,-19.28 90,-19.28 130,50 90,119.28 10,119.28 -30,50" strokeWidth="5" className="h-ring" style={{ animationDelay: '0.6s' }} />
          <polygon points="4,-29.67 96,-29.67 142,50 96,129.67 4,129.67 -42,50" strokeWidth="5" className="h-ring" style={{ animationDelay: '0.7s' }} />
          <polygon points="-2,-40.06 102,-40.06 154,50 102,140.06 -2,140.06 -54,50" strokeWidth="5" className="h-ring" style={{ animationDelay: '0.8s' }} />
          <polygon points="-8,-50.46 108,-50.46 166,50 108,150.46 -8,150.46 -66,50" strokeWidth="5" className="h-ring" style={{ animationDelay: '0.9s' }} />
        </g>
      </svg>
    )
  },
  {
    title: "Berusaha Mencapai yang Terbaik",
    desc: "Terus berinovasi, belajar, dan berupaya mencapai standar kualitas kebugaran tertinggi bagi masa depan Anda.",
    symbol: "🏆",
    color: "from-blue-700/20 to-blue-500/20",
    textColor: "text-blue-400",
    renderSvg: () => (
      <svg className="w-24 h-24 relative z-10" viewBox="0 0 100 100" fill="none">
        <style>{`
          @keyframes chevron-wave {
            0%, 100% { opacity: 0.2; stroke-width: 4px; }
            50% { opacity: 1; stroke-width: 6.5px; filter: drop-shadow(0 0 6px rgba(0, 102, 255, 0.8)); }
          }
          .c-arrow {
            animation: chevron-wave 2.2s ease-in-out infinite;
            stroke: #0066FF;
            strokeLinejoin: miter;
            fill: none;
          }
        `}</style>
        <clipPath id="clip-v">
          <rect width="100" height="100" rx="16" />
        </clipPath>
        <g clipPath="url(#clip-v)">
          <path d="M -20,218 L 50,148 L 120,218" strokeWidth="5" className="c-arrow" style={{ animationDelay: '0s' }} />
          <path d="M -20,200 L 50,130 L 120,200" strokeWidth="5" className="c-arrow" style={{ animationDelay: '0.1s' }} />
          <path d="M -20,182 L 50,112 L 120,182" strokeWidth="5" className="c-arrow" style={{ animationDelay: '0.2s' }} />
          <path d="M -20,164 L 50,94 L 120,164" strokeWidth="5" className="c-arrow" style={{ animationDelay: '0.3s' }} />
          <path d="M -20,146 L 50,76 L 120,146" strokeWidth="5" className="c-arrow" style={{ animationDelay: '0.4s' }} />
          <path d="M -20,128 L 50,58 L 120,128" strokeWidth="5" className="c-arrow" style={{ animationDelay: '0.5s' }} />
          <path d="M -20,110 L 50,40 L 120,110" strokeWidth="5" className="c-arrow" style={{ animationDelay: '0.6s' }} />
          <path d="M -20,92 L 50,22 L 120,92" strokeWidth="5" className="c-arrow" style={{ animationDelay: '0.7s' }} />
          <path d="M -20,74 L 50,4 L 120,74" strokeWidth="5" className="c-arrow" style={{ animationDelay: '0.8s' }} />
          <path d="M -20,56 L 50,-14 L 120,56" strokeWidth="5" className="c-arrow" style={{ animationDelay: '0.9s' }} />
          <path d="M -20,38 L 50,-32 L 120,38" strokeWidth="5" className="c-arrow" style={{ animationDelay: '1.0s' }} />
          <path d="M -20,20 L 50,-50 L 120,20" strokeWidth="5" className="c-arrow" style={{ animationDelay: '1.1s' }} />
        </g>
      </svg>
    )
  }
];

export default function App() {
  // Session & Auth States
  const [token, setToken] = useState<string | null>(localStorage.getItem('aurafit_token'));
  const [isRegister, setIsRegister] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'gym' | 'body' | 'food'>('dashboard');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorErrorMsg] = useState('');

  const [caturDharmaIndex, setCaturDharmaIndex] = useState(0);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCaturDharmaIndex((prev) => (prev + 1) % 4);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setCaturDharmaIndex(0);
    }
  }, [loading]);

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
  const [activeYoutubeId, setActiveYoutubeId] = useState<string | null>(null);
  const [activeYoutubeTitle, setActiveYoutubeTitle] = useState<string>('');

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

  // Webcam Feature States & Actions
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [webcamTarget, setWebcamTarget] = useState<'gym' | 'body' | 'food' | 'biometrics' | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const triggerWebcam = (target: 'gym' | 'body' | 'food' | 'biometrics') => {
    setWebcamTarget(target);
    setIsWebcamOpen(true);
  };

  const closeWebcam = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    setCameraStream(null);
    setIsWebcamOpen(false);
    setWebcamTarget(null);
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleEstimateBiometrics = async (file: File) => {
    try {
      setLoading(true);
      showToast("Sedang menganalisis fisik Anda untuk autofill biometrik...", "success");
      
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch(`${API_BASE}/api/vision/estimate-biometrics`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (!res.ok) throw new Error("Gagal mengestimasi biometrik dari foto");
      
      const data = await res.json();
      
      if (data.height) setHeight(data.height.toString());
      if (data.weight) setWeight(data.weight.toString());
      if (data.age) setAge(data.age.toString());
      if (data.gender) setGender(data.gender);
      if (data.goal) setGoal(data.goal);
      
      showToast("Biometrik berhasil diisi otomatis oleh AI!", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const captureWebcamPhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Use natural video dimensions
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        
        ctx.save();
        if (facingMode === 'user') {
          // Mirror horizontal for natural front cam shot
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `webcam_${Date.now()}.jpg`, { type: 'image/jpeg' });
            const previewUrl = URL.createObjectURL(file);
            
            if (webcamTarget === 'gym') {
              setGymFile(file);
              setGymPreview(previewUrl);
              setGymPreviewResult(null);
            } else if (webcamTarget === 'body') {
              setBodyFile(file);
              setBodyPreview(previewUrl);
              setBodyResult(null);
            } else if (webcamTarget === 'food') {
              setFoodFile(file);
              setFoodPreview(previewUrl);
              setFoodResult(null);
            } else if (webcamTarget === 'biometrics') {
              handleEstimateBiometrics(file);
            }
            
            showToast("Foto berhasil diambil dari webcam!", "success");
            closeWebcam();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    const startCam = async () => {
      if (isWebcamOpen) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: facingMode, 
              width: { ideal: 1280 }, 
              height: { ideal: 720 } 
            },
            audio: false
          });
          activeStream = stream;
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.log("Play interrupted", e));
          }
        } catch (err) {
          console.error("Gagal membuka kamera:", err);
          showToast("Gagal mengakses kamera. Pastikan izin kamera diberikan.", "error");
          setIsWebcamOpen(false);
        }
      }
    };
    
    startCam();
    
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isWebcamOpen, facingMode]);

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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-zinc-900 to-black">
        {toast && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl flex items-center gap-2 border shadow-lg transition-all animate-fade-in ${
            toast.type === 'success' ? 'bg-zinc-900 border-volt text-volt' : 'bg-zinc-900 border-red-500 text-red-500'
          }`}>
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">{toast.message}</span>
          </div>
        )}

        <div className="w-full max-w-md bg-slate-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-volt rounded-full filter blur-3xl opacity-10"></div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3 bg-zinc-800/50 px-4 py-1.5 rounded-full border border-zinc-700/50">
              <Sparkles className="w-4 h-4 text-volt" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Astra Health & Fitness Ecosystem</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">ASTRAFIT<span className="text-volt">AI</span></h1>
            <p className="text-zinc-400 text-sm mt-2">Asisten kesehatan & kebugaran pintar terintegrasi ekosistem Astra Group</p>
          </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3.5 rounded-xl flex items-center gap-2 text-sm mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  placeholder="Bagas K." 
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-volt transition-colors"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">Alamat Email</label>
              <input 
                type="email" 
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                placeholder="bagas@gmail.com" 
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-volt transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">Kata Sandi</label>
              <input 
                type="password" 
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                placeholder="••••••••" 
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-volt transition-colors"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-volt text-black font-bold py-3.5 px-4 rounded-xl hover:bg-volt-hover transition-colors flex items-center justify-center gap-2 mt-6 shadow-md"
            >
              <span>{isRegister ? 'Buat Akun AstraFit' : 'Masuk Aplikasi'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-zinc-800/80">
            <button 
              onClick={() => { setIsRegister(!isRegister); setAuthError(''); }}
              className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            >
              {isRegister ? 'Sudah memiliki akun? Masuk' : 'Belum bergabung? Daftar Sekarang'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-zinc-100">
      {/* CATUR DHARMA ASTRA LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-lg z-[100] flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="max-w-md w-full bg-zinc-950/95 border border-zinc-850 p-8 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
            {/* Background glow matching active Dharma */}
            <div className={`absolute -inset-10 bg-gradient-to-tr ${CATUR_DHARMA[caturDharmaIndex].color} filter blur-3xl opacity-30 rounded-full transition-all duration-700`}></div>
            
            {/* AstraFit Brand Header */}
            <div className="relative">
              <h2 className="text-xs font-black text-blue-500 tracking-widest uppercase mb-1">AstraFit AI</h2>
              <div className="h-0.5 w-12 bg-blue-500 mx-auto rounded-full"></div>
            </div>

            {/* Spinner and Center Icon (Custom Geometric SVG representing active Catur Dharma Principle) */}
            <div className="relative flex items-center justify-center py-6">
              {/* Outer rotating dashed tech-circle */}
              <div className="absolute w-36 h-36 border border-dashed border-zinc-800 rounded-full animate-[spin_20s_linear_infinite]"></div>
              
              {/* High-speed spinning loading ring */}
              <div className="absolute w-28 h-28 border-[3px] border-zinc-900 border-t-blue-500 rounded-full animate-spin"></div>
              
              {/* Render Beautiful, Crisp, Dynamic Geometric SVG for current Catur Dharma element */}
              <div className="relative z-10 p-4 bg-zinc-950/40 rounded-2xl border border-zinc-900 shadow-inner flex items-center justify-center">
                {CATUR_DHARMA[caturDharmaIndex].renderSvg()}
              </div>

              {/* Bouncing active emoji representation badge */}
              <div className="absolute top-2 right-12 bg-zinc-900 border border-zinc-800 text-sm w-9 h-9 rounded-full flex items-center justify-center animate-bounce shadow-xl z-20">
                {CATUR_DHARMA[caturDharmaIndex].symbol}
              </div>
            </div>

            {/* Catur Dharma Information */}
            <div className="relative space-y-2.5 animate-fade-in" key={caturDharmaIndex}>
              <span className="text-[9px] font-black uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-blue-400 inline-block mb-1 shadow-inner">
                Catur Dharma Astra {caturDharmaIndex + 1} / 4
              </span>
              <h3 className={`text-sm sm:text-base font-black ${CATUR_DHARMA[caturDharmaIndex].textColor} transition-colors duration-300 px-2 leading-snug tracking-wide`}>
                {CATUR_DHARMA[caturDharmaIndex].title}
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed h-14 px-1">
                {CATUR_DHARMA[caturDharmaIndex].desc}
              </p>
            </div>

            {/* Progress indicators dots */}
            <div className="relative flex justify-center items-center gap-1.5 pt-2">
              {[0, 1, 2, 3].map((idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === caturDharmaIndex ? 'w-6 bg-blue-500 shadow-md shadow-blue-500/50' : 'w-1.5 bg-zinc-800'}`}
                />
              ))}
            </div>

            {/* Bottom tag */}
            <div className="relative text-[9px] text-zinc-500 font-extrabold tracking-wider uppercase">
              Melayani dengan Integritas Astra Group
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl flex items-center gap-2 border shadow-lg transition-all animate-fade-in ${
          toast.type === 'success' ? 'bg-zinc-900 border-volt text-volt' : 'bg-zinc-900 border-red-500 text-red-500'
        }`}>
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Navigation Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-zinc-800/80 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight">ASTRAFIT<span className="text-volt">AI</span></h1>
            <span className="text-zinc-500 text-xs font-mono font-bold bg-zinc-800 px-2 py-0.5 rounded">v1.0</span>
          </div>

          {dashboardData && (
            <div className="mb-6 p-4 rounded-2xl bg-zinc-950 border border-zinc-800/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-volt/10 border border-volt/20 flex items-center justify-center text-volt">
                <User className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-white truncate">{dashboardData.user.full_name || 'Bagas K.'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Award className="w-3.5 h-3.5 text-volt" />
                  <span className="text-xs text-zinc-400 font-bold">{dashboardData.user.xp} XP</span>
                </div>
              </div>
            </div>
          )}

          <nav className="space-y-1.5">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    active 
                      ? 'bg-volt text-black shadow-lg shadow-volt/10' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 mt-6 text-zinc-500 hover:text-red-400 rounded-xl font-bold text-sm transition-colors text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Top telemetry bar */}
        <header className="p-6 bg-slate-900/40 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold capitalize tracking-wide">{activeTab === 'gym' ? 'Scan Alat Gym' : (activeTab === 'body' ? 'Full-Body Selfie' : activeTab)}</h2>
          </div>
          
          {dashboardData && (
            <div className="flex items-center gap-3">
              {/* Daily Streak display */}
              <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 px-3 py-1.5 rounded-full text-xs font-bold">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                <span>{dashboardData.user.current_streak} DAY STREAK</span>
              </div>
              <button 
                onClick={fetchDashboard}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full transition-colors border border-zinc-700/50"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}
        </header>

        {/* Tab contents */}
        <div className="p-6 max-w-5xl w-full mx-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-start gap-3 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold mb-1">Terjadi Kesalahan</h5>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* LOADING STATE */}
          {loading && !dashboardData && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-10 h-10 border-4 border-volt border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-zinc-400">Sedang memproses kecerdasan vision harian Anda...</p>
            </div>
          )}

          {/* 1. DASHBOARD TAB */}
          {activeTab === 'dashboard' && dashboardData && (
            <div className="space-y-6 animate-fade-in">
              {/* Profile Card & Bio details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Target Kebugaran</span>
                    <h3 className="text-xl font-extrabold text-white uppercase tracking-wider">{dashboardData.user.goal || 'Stay Fit'}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-volt mt-4 text-xs font-bold">
                    <span>Target Anda ditentukan secara visual</span>
                  </div>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-5 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Tinggi Badan</span>
                    <p className="text-xl font-bold text-white">{dashboardData.user.height ? `${dashboardData.user.height} cm` : '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Berat Badan</span>
                    <p className="text-xl font-bold text-white">{dashboardData.user.weight ? `${dashboardData.user.weight} kg` : '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Usia</span>
                    <p className="text-xl font-bold text-white">{dashboardData.user.age ? `${dashboardData.user.age} th` : '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Gender</span>
                    <p className="text-xl font-bold text-white truncate">{dashboardData.user.gender || '-'}</p>
                  </div>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Estimasi Body Fat</span>
                      <p className="text-2xl font-black text-volt">{dashboardData.latest_body_composition?.estimated_body_fat || 'Lakukan Sync'}</p>
                    </div>
                    {dashboardData.latest_body_composition && (
                      <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full font-bold">
                        {dashboardData.latest_body_composition.somatotype}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setActiveTab('body')}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors mt-3 text-center"
                  >
                    Sync Ulang Foto Badan
                  </button>
                </div>
              </div>

              {/* Macro & Nutrition Log Bar */}
              <div className="bg-zinc-900 border border-zinc-800/80 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-white">Target Nutrisi Harian</h3>
                    <p className="text-xs text-zinc-400">Berdasarkan data selfie tubuh terakhir Anda</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('food')}
                    className="bg-volt text-black text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-volt-hover transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Catat Makanan</span>
                  </button>
                </div>

                {/* Macro progress grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Kalori', cur: dashboardData.daily_totals.calories_consumed, target: dashboardData.daily_totals.calories_target, unit: 'kcal', color: 'text-volt border-volt/30' },
                    { label: 'Protein', cur: dashboardData.daily_totals.protein_consumed, target: dashboardData.daily_totals.protein_target, unit: 'g', color: 'text-sky-400 border-sky-500/30' },
                    { label: 'Karbohidrat', cur: dashboardData.daily_totals.carbs_consumed, target: dashboardData.daily_totals.carbs_target, unit: 'g', color: 'text-amber-400 border-amber-500/30' },
                    { label: 'Lemak', cur: dashboardData.daily_totals.fats_consumed, target: dashboardData.daily_totals.fats_target, unit: 'g', color: 'text-rose-400 border-rose-500/30' },
                  ].map(macro => {
                    const pct = Math.min(100, Math.round((macro.cur / macro.target) * 100)) || 0;
                    return (
                      <div key={macro.label} className="bg-zinc-950/60 border border-zinc-800/40 rounded-2xl p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-zinc-400">{macro.label}</span>
                          <span className="text-xs font-bold text-zinc-500">{pct}%</span>
                        </div>
                        <div>
                          <p className="text-lg font-black text-white">{macro.cur} <span className="text-xs font-semibold text-zinc-500">{macro.unit}</span></p>
                          <div className="w-full bg-zinc-800 h-2 rounded-full mt-2 overflow-hidden">
                            <div className={`h-full rounded-full ${macro.label === 'Kalori' ? 'bg-volt' : (macro.label === 'Protein' ? 'bg-sky-400' : (macro.label === 'Karbohidrat' ? 'bg-amber-400' : 'bg-rose-400'))}`} style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-medium block mt-1">Target: {macro.target} {macro.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* History workout logs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-5">
                  <h4 className="text-md font-extrabold text-white mb-4 flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-volt" />
                    <span>Aktivitas Latihan Terakhir</span>
                  </h4>
                  {dashboardData.workout_logs.length === 0 ? (
                    <div className="text-center py-8 bg-zinc-950/50 border border-dashed border-zinc-800 rounded-xl">
                      <p className="text-xs text-zinc-500">Belum ada aktivitas latihan tercatat.</p>
                      <button onClick={() => setActiveTab('gym')} className="text-xs font-bold text-volt mt-2 hover:underline">Scan Alat Pertama</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dashboardData.workout_logs.map((log: any) => (
                        <div key={log.id} className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/50 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-sm text-white">{log.equipment_name}</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">{new Date(log.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full font-bold">
                              {log.sets} Set x {log.reps} Reps
                            </span>
                            <p className="text-[10px] text-zinc-400 mt-1 font-semibold">{log.weight_kg} kg | {log.rpe}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-5">
                  <h4 className="text-md font-extrabold text-white mb-4 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-volt" />
                    <span>Jurnal Makan Hari Ini</span>
                  </h4>
                  {dashboardData.food_logs.length === 0 ? (
                    <div className="text-center py-8 bg-zinc-950/50 border border-dashed border-zinc-800 rounded-xl">
                      <p className="text-xs text-zinc-500">Belum ada makanan tercatat hari ini.</p>
                      <button onClick={() => setActiveTab('food')} className="text-xs font-bold text-volt mt-2 hover:underline">Foto Hidanganmu</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dashboardData.food_logs.map((log: any) => (
                        <div key={log.id} className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/50 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-sm text-white">{log.food_name}</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">{log.portion}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-volt">{log.calories} kcal</span>
                            <p className="text-[10px] text-zinc-500 mt-1 font-semibold">P:{log.protein_g}g C:{log.carbs_g}g F:{log.fats_g}g</p>
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
            <div className="space-y-6 animate-fade-in">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-lg font-extrabold text-white mb-2">Deteksi Alat Gym</h3>
                <p className="text-xs text-zinc-400 mb-6">Foto atau unggah gambar alat olahraga di lantai gym untuk mengetahui gerakan terbaik dari Personal Trainer</p>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl p-8 bg-zinc-950/50 hover:bg-zinc-950 transition-colors">
                  {gymPreview ? (
                    <div className="text-center space-y-4 w-full max-w-sm">
                      <img src={gymPreview} alt="Pratinjau Alat" className="rounded-xl w-full h-48 object-cover border border-zinc-800" />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setGymFile(null); setGymPreview(null); setGymPreviewResult(null); }}
                          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
                        >
                          Hapus Foto
                        </button>
                        <button 
                          onClick={handleGymScan}
                          disabled={loading}
                          className="flex-1 bg-volt text-black font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          {loading ? 'Menganalisis...' : 'Analisis Alat'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 w-full">
                      <div className="flex gap-4 w-full max-w-xs mb-4">
                        <button
                          type="button"
                          onClick={() => triggerWebcam('gym')}
                          className="flex-1 flex flex-col items-center justify-center py-5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-volt/40 rounded-2xl transition-all group cursor-pointer"
                        >
                          <Camera className="w-7 h-7 text-volt mb-2 group-hover:scale-110 transition-transform duration-250" />
                          <span className="text-xs font-bold text-white">Webcam</span>
                        </button>
                        
                        <label className="flex-1 flex flex-col items-center justify-center py-5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-volt/40 rounded-2xl cursor-pointer transition-all group">
                          <Plus className="w-7 h-7 text-volt mb-2 group-hover:scale-110 transition-transform duration-250" />
                          <span className="text-xs font-bold text-white">Unggah Berkas</span>
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
                            className="hidden" 
                          />
                        </label>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium">Format JPG, PNG (Ambil lewat webcam atau pilih dari galeri)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Gym vision Analysis result card */}
              {gymResult && (
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-6 animate-fade-in">
                  <div className="flex justify-between items-start border-b border-zinc-800/80 pb-4">
                    <div>
                      <span className="bg-volt/10 border border-volt/20 text-volt text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        Terdeteksi AI
                      </span>
                      <h3 className="text-2xl font-black text-white mt-2 uppercase tracking-wide">{gymResult.equipment_name}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-zinc-500 block">Sasaran Otot Utama</span>
                      <p className="font-bold text-volt text-sm">{gymResult.primary_muscle}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-volt" />
                        <span>Cara Penggunaan Aman</span>
                      </h4>
                      <ol className="space-y-2.5 text-xs text-zinc-300">
                        {gymResult.how_to_use.map((step: string, i: number) => (
                          <li key={i} className="flex gap-3">
                            <span className="font-black text-volt">{i+1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-extrabold text-red-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span>Kesalahan Umum Pemula</span>
                      </h4>
                      <ul className="space-y-2.5 text-xs text-zinc-300">
                        {gymResult.common_mistakes.map((step: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-red-500 font-extrabold">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-black block">Skema Rekomendasi Latihan</span>
                      <p className="font-bold text-sm text-white mt-1">
                        {gymResult.recommended_schema.sets} Set x {gymResult.recommended_schema.reps} Repetisi | {gymResult.recommended_schema.rpe}
                      </p>
                    </div>

                    <button 
                      onClick={() => setLogFormOpen(true)}
                      className="bg-volt text-black text-xs font-extrabold px-5 py-3 rounded-xl hover:bg-volt-hover transition-colors shadow-md shadow-volt/5"
                    >
                      Mulai Latihan dengan Alat Ini
                    </button>
                  </div>

                  {/* Astra Group personalized recommendations section for Gym Scan */}
                  {(() => {
                    let astraRecs: any[] = [];
                    if (gymResult.astra_recommendations) {
                      try {
                        astraRecs = typeof gymResult.astra_recommendations === 'string'
                          ? JSON.parse(gymResult.astra_recommendations)
                          : gymResult.astra_recommendations;
                      } catch (e) {
                        console.error("Failed to parse astra_recommendations", e);
                      }
                    }
                    if (!astraRecs || astraRecs.length === 0) return null;
                    
                    return (
                      <div className="space-y-4 pt-6 border-t border-zinc-800/80">
                        <div>
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 rounded-full border border-blue-500/30">
                            <span className="text-[9px] font-black uppercase tracking-wider text-white">Sinergi Astra Group</span>
                          </div>
                          <h4 className="text-base font-black text-white mt-2 flex items-center gap-2">
                            <span>Rekomendasi Pendukung Latihanmu</span>
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1">
                            Layanan kesehatan, proteksi cedera, dan kemudahan pembiayaan dari Astra Group untuk menunjang aktivitas fisik Anda.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {astraRecs.map((rec: any, idx: number) => {
                            const normKey = (rec.logo_key || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                            const logoInfo = ASTRA_LOGOS[normKey] || { name: rec.logo_key || "Astra Group", bg: "bg-zinc-850", text: "text-zinc-300", border: "border-zinc-800" };
                            const imgUrl = (rec.product_image_key && (rec.product_image_key.startsWith('http://') || rec.product_image_key.startsWith('https://')))
                              ? rec.product_image_key
                              : (ASTRA_PRODUCT_IMAGES[rec.product_image_key] || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fit=crop");
                            
                            return (
                              <div key={idx} className="bg-zinc-950/80 border border-zinc-850 hover:border-blue-500/40 rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300 group shadow-md hover:shadow-lg hover:shadow-blue-950/5">
                                {/* Product Cover Photo */}
                                <div className="relative aspect-[16/10] w-full bg-zinc-900 overflow-hidden">
                                  <img 
                                    src={imgUrl} 
                                    alt={rec.product_name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                                  
                                  {/* Child brand logo badge floating */}
                                  <span className={`absolute top-2.5 left-2.5 border ${logoInfo.bg} ${logoInfo.text} ${logoInfo.border} text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider`}>
                                    {logoInfo.name}
                                  </span>

                                  <span className="absolute bottom-2 left-2.5 text-[10px] text-zinc-300 font-extrabold tracking-wide">
                                    {rec.category}
                                  </span>
                                </div>

                                {/* Details */}
                                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                  <div className="space-y-2">
                                    <h5 className="text-xs font-black text-white group-hover:text-volt transition-colors leading-snug">
                                      {rec.product_name}
                                    </h5>
                                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                                      {rec.description}
                                    </p>
                                    
                                    {/* Personalization Relevance explanation */}
                                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-2.5 text-[9px] text-blue-300 leading-relaxed">
                                      <span className="font-extrabold text-blue-400 block mb-0.5">MENGAPA RELEVAN DENGAN ALAT INI:</span>
                                      {rec.relevance_reason}
                                    </div>
                                  </div>

                                  <a 
                                    href={rec.action_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                                  >
                                    <span>{rec.action_text}</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {gymResult.youtube_videos && gymResult.youtube_videos.length > 0 && (
                    <div className="space-y-4 pt-6 border-t border-zinc-800/80">
                      <div>
                        <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                          <span className="text-red-500 font-extrabold animate-pulse">●</span>
                          <span>Video Panduan Workout YouTube</span>
                        </h4>
                        <p className="text-[10px] text-zinc-500 mt-1">
                          Tonton teknik gerakan terbaik yang direkomendasikan langsung oleh AI untuk menghindari cedera.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {gymResult.youtube_videos.map((video: any, i: number) => (
                          <div 
                            key={i} 
                            onClick={() => {
                              setActiveYoutubeId(video.video_id);
                              setActiveYoutubeTitle(video.title);
                            }}
                            className="group relative bg-zinc-950 border border-zinc-850 hover:border-volt/40 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                          >
                            <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                              <img 
                                src={`https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`} 
                                alt={video.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop";
                                }}
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors duration-300">
                                <div className="bg-red-600 group-hover:bg-red-500 group-hover:scale-110 text-white rounded-full p-2 shadow-lg shadow-red-900/40 transition-all duration-300">
                                  <Play className="w-4 h-4 fill-current" />
                                </div>
                              </div>
                              {video.duration && (
                                <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-[9px] text-zinc-300 font-extrabold px-1.5 py-0.5 rounded border border-white/5">
                                  {video.duration}
                                </span>
                              )}
                            </div>
                            <div className="p-3 flex-1 flex flex-col justify-between space-y-1 bg-zinc-950/40">
                              <h5 className="text-[11px] font-extrabold text-zinc-100 line-clamp-2 leading-snug group-hover:text-volt transition-colors duration-200">
                                {video.title}
                              </h5>
                              <p className="text-[9px] text-zinc-500 font-bold tracking-wide uppercase">
                                {video.creator}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Log exercise sets form popup */}
              {logFormOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm space-y-4">
                    <div>
                      <h4 className="text-lg font-extrabold text-white">Catat Latihan</h4>
                      <p className="text-xs text-zinc-400 mt-1">Alat: {gymResult?.equipment_name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Set Latihan</label>
                        <input 
                          type="number" 
                          value={logSets}
                          onChange={e => setLogSets(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Repetisi</label>
                        <input 
                          type="number" 
                          value={logReps}
                          onChange={e => setLogReps(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Beban (kg)</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 15"
                          value={logWeight}
                          onChange={e => setLogWeight(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Intensitas (RPE 1-10)</label>
                        <select 
                          value={logRpe} 
                          onChange={e => setLogRpe(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-volt text-sm"
                        >
                          <option value="6">RPE 6 (Mudah)</option>
                          <option value="7">RPE 7 (Sedang)</option>
                          <option value="8">RPE 8 (Berat)</option>
                          <option value="9">RPE 9 (Sangat Berat)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => setLogFormOpen(false)}
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                      >
                        Batal
                      </button>
                      <button 
                        onClick={handleLogWorkout}
                        className="flex-1 bg-volt text-black font-bold py-2.5 rounded-xl text-xs transition-colors"
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
            <div className="space-y-6 animate-fade-in">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-lg font-extrabold text-white mb-2">Sinkronisasi Komposisi Tubuh</h3>
                <p className="text-xs text-zinc-400 mb-6">Unggah foto satu badan penuh untuk mengestimasi lemak tubuh, tipe tubuh, target gizi secara visual melalui vision AI</p>

                <div className="bg-zinc-950/60 border border-zinc-800 p-4 rounded-2xl space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>Fitur Keamanan: Sensor Wajah Otomatis</span>
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Wajah Anda disensor secara lokal di browser sebelum diunggah demi privasi penuh</p>
                    </div>
                    <button 
                      onClick={() => setBlurFace(!blurFace)}
                      className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-colors flex items-center gap-1 ${
                        blurFace ? 'bg-volt/10 text-volt border border-volt/20' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {blurFace ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{blurFace ? 'AKTIF (Saran)' : 'MATI'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl p-8 bg-zinc-950/50 hover:bg-zinc-950 transition-colors">
                  {bodyPreview ? (
                    <div className="text-center space-y-4 w-full max-w-xs relative">
                      <div className="relative rounded-xl overflow-hidden border border-zinc-800">
                        <img src={bodyPreview} alt="Selfie Tubuh" className="w-full h-64 object-cover" />
                        {(blurFace || blurringActive) && (
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-zinc-700/50 px-4 py-2 rounded-xl flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-volt rounded-full animate-ping"></span>
                            <span className="text-[10px] text-white font-bold uppercase tracking-wider">Face Blur Filter Active</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setBodyFile(null); setBodyPreview(null); setBodyResult(null); }}
                          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
                        >
                          Hapus Foto
                        </button>
                        <button 
                          onClick={handleBodySync}
                          disabled={loading}
                          className="flex-1 bg-volt text-black font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          {loading ? 'Menghitung...' : 'Mulai Sinkronisasi'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 w-full">
                      <div className="flex gap-4 w-full max-w-xs mb-4">
                        <button
                          type="button"
                          onClick={() => triggerWebcam('body')}
                          className="flex-1 flex flex-col items-center justify-center py-5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-volt/40 rounded-2xl transition-all group cursor-pointer"
                        >
                          <Camera className="w-7 h-7 text-volt mb-2 group-hover:scale-110 transition-transform duration-250" />
                          <span className="text-xs font-bold text-white">Ambil Selfie</span>
                        </button>
                        
                        <label className="flex-1 flex flex-col items-center justify-center py-5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-volt/40 rounded-2xl cursor-pointer transition-all group">
                          <Plus className="w-7 h-7 text-volt mb-2 group-hover:scale-110 transition-transform duration-250" />
                          <span className="text-xs font-bold text-white">Unggah Berkas</span>
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
                            className="hidden" 
                          />
                        </label>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium">Gunakan pakaian fit-wear agar analisis visual tubuh akurat</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Body Vision sync result card */}
              {bodyResult && (
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-6 animate-fade-in">
                  <div className="flex justify-between items-start border-b border-zinc-800/80 pb-4">
                    <div>
                      <span className="bg-volt/10 border border-volt/20 text-volt text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        Hasil Sinkronisasi Fisik
                      </span>
                      <h3 className="text-2xl font-black text-white mt-2 uppercase tracking-wide">KOMPOSISI TUBUH ANDA</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                      <span className="text-[10px] text-zinc-500 uppercase font-black block">Persentase Lemak Tubuh</span>
                      <p className="text-2xl font-black text-volt mt-1">{bodyResult.estimated_body_fat}</p>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                      <span className="text-[10px] text-zinc-500 uppercase font-black block">Somatotype</span>
                      <p className="text-2xl font-black text-white mt-1">{bodyResult.somatotype}</p>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50 col-span-1 md:col-span-1">
                      <span className="text-[10px] text-zinc-500 uppercase font-black block">Rekomendasi Fokus</span>
                      <p className="text-sm font-bold text-white mt-1.5 truncate text-wrap">{bodyResult.recommended_workout_focus}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Analisis Proporsi Massa Otot</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-2xl border border-zinc-800/40">
                      {bodyResult.muscle_distribution_analysis}
                    </p>
                  </div>

                  <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">Target Nutrisi Baru Disesuaikan</h4>
                      <p className="text-xs text-zinc-500">Gunakan target kalori dan makro ini untuk mencatat asupan makan harian Anda.</p>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center">
                        <span className="text-[10px] text-zinc-500 font-bold block">Kalori</span>
                        <span className="font-extrabold text-sm text-volt">{bodyResult.cal_target || bodyResult.macronutrient_targets?.calories} kcal</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-zinc-500 font-bold block">Protein</span>
                        <span className="font-extrabold text-sm text-sky-400">{bodyResult.protein_target || bodyResult.macronutrient_targets?.protein} g</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-zinc-500 font-bold block">Karb</span>
                        <span className="font-extrabold text-sm text-amber-400">{bodyResult.carbs_target || bodyResult.macronutrient_targets?.carbs} g</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-zinc-500 font-bold block">Lemak</span>
                        <span className="font-extrabold text-sm text-rose-400">{bodyResult.fat_target || bodyResult.macronutrient_targets?.fat} g</span>
                      </div>
                    </div>
                  </div>

                  {/* Astra Group personalized recommendations section */}
                  {(() => {
                    let astraRecs: any[] = [];
                    if (bodyResult.astra_recommendations) {
                      try {
                        astraRecs = typeof bodyResult.astra_recommendations === 'string'
                          ? JSON.parse(bodyResult.astra_recommendations)
                          : bodyResult.astra_recommendations;
                      } catch (e) {
                        console.error("Failed to parse astra_recommendations", e);
                      }
                    }
                    if (!astraRecs || astraRecs.length === 0) return null;
                    
                    return (
                      <div className="space-y-4 pt-6 border-t border-zinc-800/80">
                        <div>
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 rounded-full border border-blue-500/30">
                            <span className="text-[9px] font-black uppercase tracking-wider text-white">Sinergi Astra Group</span>
                          </div>
                          <h4 className="text-base font-black text-white mt-2 flex items-center gap-2">
                            <span>Rekomendasi Layanan Sehat Astra Untukmu</span>
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1">
                            Integrasi kesehatan terpadu dari asuransi, konsultasi medis, hingga mobilitas ramah lingkungan yang disesuaikan dengan profil biometrik & somatotype Anda.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {astraRecs.map((rec: any, idx: number) => {
                            const normKey = (rec.logo_key || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                            const logoInfo = ASTRA_LOGOS[normKey] || { name: rec.logo_key || "Astra Group", bg: "bg-zinc-850", text: "text-zinc-300", border: "border-zinc-800" };
                            const imgUrl = (rec.product_image_key && (rec.product_image_key.startsWith('http://') || rec.product_image_key.startsWith('https://')))
                              ? rec.product_image_key
                              : (ASTRA_PRODUCT_IMAGES[rec.product_image_key] || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop");
                            
                            return (
                              <div key={idx} className="bg-zinc-950/80 border border-zinc-850 hover:border-blue-500/40 rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300 group shadow-md hover:shadow-lg hover:shadow-blue-950/5">
                                {/* Product Cover Photo */}
                                <div className="relative aspect-[16/10] w-full bg-zinc-900 overflow-hidden">
                                  <img 
                                    src={imgUrl} 
                                    alt={rec.product_name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                                  
                                  {/* Child brand logo badge floating */}
                                  <span className={`absolute top-2.5 left-2.5 border ${logoInfo.bg} ${logoInfo.text} ${logoInfo.border} text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider`}>
                                    {logoInfo.name}
                                  </span>

                                  <span className="absolute bottom-2 left-2.5 text-[10px] text-zinc-300 font-extrabold tracking-wide">
                                    {rec.category}
                                  </span>
                                </div>

                                {/* Details */}
                                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                  <div className="space-y-2">
                                    <h5 className="text-xs font-black text-white group-hover:text-volt transition-colors leading-snug">
                                      {rec.product_name}
                                    </h5>
                                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                                      {rec.description}
                                    </p>
                                    
                                    {/* Personalization Relevance explanation */}
                                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-2.5 text-[9px] text-blue-300 leading-relaxed">
                                      <span className="font-extrabold text-blue-400 block mb-0.5">MENGAPA COCOK UNTUK ANDA:</span>
                                      {rec.relevance_reason}
                                    </div>
                                  </div>

                                  <a 
                                    href={rec.action_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                                  >
                                    <span>{rec.action_text}</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* 4. FOOD SCAN TAB */}
          {activeTab === 'food' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-lg font-extrabold text-white mb-2">Scan Hidangan Makanan</h3>
                <p className="text-xs text-zinc-400 mb-6">Foto piring makan malam, sarapan, atau camilan Anda untuk mengestimasi kandungan gizinya secara otomatis</p>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-2xl p-8 bg-zinc-950/50 hover:bg-zinc-950 transition-colors">
                  {foodPreview ? (
                    <div className="text-center space-y-4 w-full max-w-sm">
                      <img src={foodPreview} alt="Pratinjau Hidangan" className="rounded-xl w-full h-48 object-cover border border-zinc-800" />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setFoodFile(null); setFoodPreview(null); setFoodResult(null); }}
                          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
                        >
                          Hapus Foto
                        </button>
                        <button 
                          onClick={handleFoodScan}
                          disabled={loading}
                          className="flex-1 bg-volt text-black font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          {loading ? 'Menganalisis...' : 'Analisis Gizi'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 w-full">
                      <div className="flex gap-4 w-full max-w-xs mb-4">
                        <button
                          type="button"
                          onClick={() => triggerWebcam('food')}
                          className="flex-1 flex flex-col items-center justify-center py-5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-volt/40 rounded-2xl transition-all group cursor-pointer"
                        >
                          <Camera className="w-7 h-7 text-volt mb-2 group-hover:scale-110 transition-transform duration-250" />
                          <span className="text-xs font-bold text-white">Ambil Foto</span>
                        </button>
                        
                        <label className="flex-1 flex flex-col items-center justify-center py-5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-volt/40 rounded-2xl cursor-pointer transition-all group">
                          <Plus className="w-7 h-7 text-volt mb-2 group-hover:scale-110 transition-transform duration-250" />
                          <span className="text-xs font-bold text-white">Unggah Berkas</span>
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
                            className="hidden" 
                          />
                        </label>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium">Arahkan tegak lurus dari atas piring makan untuk akurasi terbaik</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Food vision analysis result card */}
              {foodResult && (
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-6 animate-fade-in">
                  <div className="flex justify-between items-start border-b border-zinc-800/80 pb-4">
                    <div>
                      <span className="bg-volt/10 border border-volt/20 text-volt text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        Nutrisi Terdeteksi
                      </span>
                      <h3 className="text-2xl font-black text-white mt-2 uppercase tracking-wide">{foodResult.food_name}</h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Estimasi Porsi: {foodResult.estimated_portion}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-zinc-500 block">Total Energi</span>
                      <p className="font-black text-volt text-2xl">{foodResult.nutrition.calories} kcal</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/50 text-center">
                      <span className="text-[10px] text-zinc-500 font-bold block">Protein</span>
                      <span className="font-extrabold text-sm text-sky-400">{foodResult.nutrition.protein_g} g</span>
                    </div>
                    <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/50 text-center">
                      <span className="text-[10px] text-zinc-500 font-bold block">Karbohidrat</span>
                      <span className="font-extrabold text-sm text-amber-400">{foodResult.nutrition.carbohydrates_g} g</span>
                    </div>
                    <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/50 text-center">
                      <span className="text-[10px] text-zinc-500 font-bold block">Lemak</span>
                      <span className="font-extrabold text-sm text-rose-400">{foodResult.nutrition.fats_g} g</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/40">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Kesesuaian Target</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">{foodResult.fitness_compatibility}</p>
                    </div>
                    <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/40">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Saran Ahli Gizi</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">{foodResult.improvement_tips}</p>
                    </div>
                  </div>

                  {/* Astra Group personalized recommendations section for Food Scan */}
                  {(() => {
                    let astraRecs: any[] = [];
                    if (foodResult.astra_recommendations) {
                      try {
                        astraRecs = typeof foodResult.astra_recommendations === 'string'
                          ? JSON.parse(foodResult.astra_recommendations)
                          : foodResult.astra_recommendations;
                      } catch (e) {
                        console.error("Failed to parse astra_recommendations", e);
                      }
                    }
                    if (!astraRecs || astraRecs.length === 0) return null;
                    
                    return (
                      <div className="space-y-4 pt-6 border-t border-zinc-800/80">
                        <div>
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 rounded-full border border-blue-500/30">
                            <span className="text-[9px] font-black uppercase tracking-wider text-white">Sinergi Astra Group</span>
                          </div>
                          <h4 className="text-base font-black text-white mt-2 flex items-center gap-2">
                            <span>Rekomendasi Diet & Nutrisi Sehat</span>
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1">
                            Layanan dokter spesialis gizi, asuransi pendukung, dan program belanja hemat dari Astra Group untuk mempercepat pencapaian target nutrisi Anda.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {astraRecs.map((rec: any, idx: number) => {
                            const normKey = (rec.logo_key || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                            const logoInfo = ASTRA_LOGOS[normKey] || { name: rec.logo_key || "Astra Group", bg: "bg-zinc-850", text: "text-zinc-300", border: "border-zinc-800" };
                            const imgUrl = (rec.product_image_key && (rec.product_image_key.startsWith('http://') || rec.product_image_key.startsWith('https://')))
                              ? rec.product_image_key
                              : (ASTRA_PRODUCT_IMAGES[rec.product_image_key] || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop");
                            
                            return (
                              <div key={idx} className="bg-zinc-950/80 border border-zinc-850 hover:border-blue-500/40 rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300 group shadow-md hover:shadow-lg hover:shadow-blue-950/5">
                                {/* Product Cover Photo */}
                                <div className="relative aspect-[16/10] w-full bg-zinc-900 overflow-hidden">
                                  <img 
                                    src={imgUrl} 
                                    alt={rec.product_name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                                  
                                  {/* Child brand logo badge floating */}
                                  <span className={`absolute top-2.5 left-2.5 border ${logoInfo.bg} ${logoInfo.text} ${logoInfo.border} text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider`}>
                                    {logoInfo.name}
                                  </span>

                                  <span className="absolute bottom-2 left-2.5 text-[10px] text-zinc-300 font-extrabold tracking-wide">
                                    {rec.category}
                                  </span>
                                </div>

                                {/* Details */}
                                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                  <div className="space-y-2">
                                    <h5 className="text-xs font-black text-white group-hover:text-volt transition-colors leading-snug">
                                      {rec.product_name}
                                    </h5>
                                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                                      {rec.description}
                                    </p>
                                    
                                    {/* Personalization Relevance explanation */}
                                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-2.5 text-[9px] text-blue-300 leading-relaxed">
                                      <span className="font-extrabold text-blue-400 block mb-0.5">MENGAPA COCOK DENGAN HIDANGAN INI:</span>
                                      {rec.relevance_reason}
                                    </div>
                                  </div>

                                  <a 
                                    href={rec.action_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                                  >
                                    <span>{rec.action_text}</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  <button 
                    onClick={handleLogFood}
                    className="w-full bg-volt text-black font-extrabold py-3.5 rounded-xl text-xs hover:bg-volt-hover transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-md space-y-6 relative overflow-hidden animate-fade-in">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-volt rounded-full filter blur-3xl opacity-10"></div>
            
            <div className="text-center">
              <span className="text-xs bg-volt/10 text-volt border border-volt/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Onboarding Kritis</span>
              <h3 className="text-2xl font-black text-white mt-3 uppercase tracking-wide">SIAPKAN BIOMETRIKMU</h3>
              <p className="text-xs text-zinc-400 mt-2">Daftarkan tinggi dan berat badanmu agar asisten PT AI dapat mengoreksi target kalorimu secara presisi</p>
            </div>

            <form onSubmit={submitBiometrics} className="space-y-4">
              {/* AI Autofill Section */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 space-y-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-volt" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">Isi Otomatis dengan AI</span>
                </div>
                <p className="text-[10px] text-zinc-400">Punya foto seluruh tubuh? Ambil foto baru atau unggah untuk memprediksi tinggi, berat, umur, gender, dan target Anda secara instan.</p>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => triggerWebcam('biometrics')}
                    disabled={loading}
                    className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-volt/30 text-white font-bold py-2 px-3 rounded-xl text-[10px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Camera className="w-3.5 h-3.5 text-volt" />
                    <span>Ambil Foto</span>
                  </button>
                  
                  <label className="flex-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 hover:border-volt/30 text-white font-bold py-2 px-3 rounded-xl text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:text-white">
                    <Plus className="w-3.5 h-3.5 text-volt" />
                    <span>Unggah File</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          handleEstimateBiometrics(e.target.files[0]);
                        }
                      }}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Tinggi Badan (cm)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 172"
                    required
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-volt text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Berat Badan (kg)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 68"
                    required
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-volt text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Usia Anda</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 23"
                    required
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-volt text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Gender</label>
                  <select 
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-volt text-sm"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Target Kebugaran Utama</label>
                <select 
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-volt text-sm"
                >
                  <option value="Lose Weight / Defisit Kalori">Bakar Lemak (Lose Weight)</option>
                  <option value="Gain Muscle / Bulking">Bina Otot (Gain Muscle)</option>
                  <option value="Stay Fit / Recomposition">Kebugaran Seimbang (Stay Fit)</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full bg-volt text-black font-extrabold py-3.5 rounded-xl text-sm hover:bg-volt-hover transition-colors shadow-md mt-4"
              >
                Simpan & Mulai Sinkronisasi
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Webcam Modal Overlay */}
      {isWebcamOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 w-full max-w-lg space-y-6 relative overflow-hidden animate-fade-in flex flex-col items-center">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-volt rounded-full filter blur-3xl opacity-10"></div>
            
            <div className="text-center w-full">
              <span className="text-xs bg-volt/10 text-volt border border-volt/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                {webcamTarget === 'gym' ? 'Scan Alat Gym' : webcamTarget === 'body' ? 'Sync Tubuh AI' : webcamTarget === 'biometrics' ? 'Autofill Biometrik' : 'Scan Makanan'}
              </span>
              <h3 className="text-xl font-black text-white mt-3 uppercase tracking-wide">
                {webcamTarget === 'gym' ? 'Bidik Alat Gym' : webcamTarget === 'body' ? 'Ambil Foto Tubuh' : webcamTarget === 'biometrics' ? 'Ambil Foto Fisik' : 'Bidik Makanan Anda'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {webcamTarget === 'body' 
                  ? 'Posisikan seluruh badan di tengah frame. Wajah Anda akan disamarkan secara otomatis demi privasi.'
                  : webcamTarget === 'biometrics'
                  ? 'Gunakan selfie seluruh tubuh atau bagian badan untuk estimasi tinggi/berat AI yang paling presisi.'
                  : 'Pastikan objek terlihat jelas di bawah pencahayaan yang cukup.'
                }
              </p>
            </div>

            {/* Video Preview Frame */}
            <div className="relative w-full aspect-[4/3] max-h-[60vh] rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900 flex items-center justify-center">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Grid lines for guiding the user */}
              <div className="absolute inset-0 pointer-events-none border border-dashed border-zinc-500/20 grid grid-cols-3 grid-rows-3">
                <div className="border-b border-r border-dashed border-zinc-500/10"></div>
                <div className="border-b border-r border-dashed border-zinc-500/10"></div>
                <div className="border-b border-dashed border-zinc-500/10"></div>
                <div className="border-b border-r border-dashed border-zinc-500/10"></div>
                <div className="border-b border-r border-dashed border-zinc-500/10"></div>
                <div className="border-b border-dashed border-zinc-500/10"></div>
                <div className="border-r border-dashed border-zinc-500/10"></div>
                <div className="border-r border-dashed border-zinc-500/10"></div>
                <div></div>
              </div>

              {/* Facing mode toggle floating button */}
              <button 
                type="button"
                onClick={toggleFacingMode}
                className="absolute bottom-4 right-4 bg-black/80 hover:bg-zinc-850 border border-zinc-700 hover:border-volt text-white p-3 rounded-full transition-all duration-250 shadow-lg flex items-center justify-center cursor-pointer group active:scale-95"
                title="Ganti Kamera"
              >
                <RefreshCw className="w-5 h-5 text-volt group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>

            {/* Capture controls */}
            <div className="flex items-center justify-center gap-6 w-full">
              <button 
                type="button"
                onClick={closeWebcam}
                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button 
                type="button"
                onClick={captureWebcamPhoto}
                className="w-16 h-16 bg-volt hover:bg-volt-hover rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 relative group cursor-pointer animate-pulse"
              >
                <div className="absolute inset-1.5 border-2 border-black rounded-full group-hover:scale-95 transition-transform"></div>
                <Camera className="w-6 h-6 text-black" />
              </button>

              {/* Just an invisible canvas for rendering frames */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        </div>
      )}

      {/* Interactive YouTube Video Player Modal */}
      {activeYoutubeId && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-950 border border-zinc-850 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl shadow-red-950/10 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-850 flex justify-between items-start gap-4">
              <div>
                <span className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block">
                  YouTube Player
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-white mt-1.5 leading-snug line-clamp-1">{activeYoutubeTitle}</h4>
              </div>
              <button 
                onClick={() => {
                  setActiveYoutubeId(null);
                  setActiveYoutubeTitle('');
                }}
                className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white p-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Iframe Container */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1&rel=0`}
                title={activeYoutubeTitle}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            {/* Footer / Info */}
            <div className="p-4 sm:p-5 bg-zinc-950/80 text-center border-t border-zinc-850">
              <p className="text-[11px] text-zinc-500">
                Peringatan: Ikuti instruksi gerakan dengan hati-hati. Jika merasa sakit, segera hentikan latihan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
