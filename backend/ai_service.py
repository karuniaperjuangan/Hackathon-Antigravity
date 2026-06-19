import os
import json
import logging
import re
import time
import random
import urllib.request
import urllib.parse
from typing import Dict, Any
from dotenv import load_dotenv

from google.cloud import aiplatform_v1
from google.api_core.client_options import ClientOptions

# Setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env
dotenv_path = os.path.join(os.path.dirname(__file__), "../.env")
load_dotenv(dotenv_path, override=True)

# Configuration for Vertex AI
API_KEY = os.environ.get("GEMINI_API_KEY")
GCP_PROJECT = os.environ.get("GCP_PROJECT", "1013557203704")
GCP_REGION = os.environ.get("GCP_REGION", "us-central1")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")

if not API_KEY:
    logger.warning("GEMINI_API_KEY environment variable is not set. AI services may fail.")
else:
    logger.info(f"Using Vertex AI SDK (google.cloud.aiplatform_v1) with project {GCP_PROJECT}, region {GCP_REGION}, model {GEMINI_MODEL}")
    logger.info(f"API Key loaded, starting with: {API_KEY[:6]}...")

def clean_json_string(text: str) -> str:
    """Strip markdown code blocks and other formatting to extract pure JSON."""
    text = text.strip()
    match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
    if match:
        return match.group(1).strip()
    return text

def search_youtube_videos(query: str, max_results=2) -> list:
    """Search YouTube directly for high-quality workout tutorials and extract actual YouTube video details (ID, title, creator, duration) to prevent hallucinations."""
    try:
        # Construct clean query for YouTube search directly
        search_query = f"workout tutorial {query}"
        encoded_query = urllib.parse.quote(search_query)
        url = f"https://www.youtube.com/results?search_query={encoded_query}"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        }
        
        req = urllib.request.Request(url, headers=headers)
        # 5 second timeout to keep it fast
        with urllib.request.urlopen(req, timeout=5) as response:
            html = response.read().decode('utf-8')
            
        videos = []
        
        # Try JSON-based extraction first from ytInitialData
        data_match = re.search(r'ytInitialData\s*=\s*({.+?});', html)
        if not data_match:
            data_match = re.search(r'ytInitialData\s*=\s*({.+?})</script>', html)
            
        if data_match:
            try:
                json_str = data_match.group(1)
                data = json.loads(json_str)
                
                renderers = []
                def find_video_renderers(obj):
                    if isinstance(obj, dict):
                        if "videoRenderer" in obj:
                            renderers.append(obj["videoRenderer"])
                        else:
                            for v in obj.values():
                                find_video_renderers(v)
                    elif isinstance(obj, list):
                        for item in obj:
                            find_video_renderers(item)
                            
                find_video_renderers(data)
                
                seen_ids = set()
                for v in renderers:
                    v_id = v.get("videoId")
                    if not v_id or len(v_id) != 11 or v_id in ['y1r9toPQNkM', 'wT7S7mY_FIs', 'wYREQvWyeg4']:
                        continue
                    if v_id in seen_ids:
                        continue
                        
                    seen_ids.add(v_id)
                    
                    # Extract title
                    title = f"Panduan Latihan {query}"
                    if "title" in v and "runs" in v["title"] and len(v["title"]["runs"]) > 0:
                        title = v["title"]["runs"][0].get("text", title)
                    elif "title" in v and "simpleText" in v["title"]:
                        title = v["title"]["simpleText"]
                        
                    # Extract channel name / creator
                    creator = "YouTube Fitness"
                    if "ownerText" in v and "runs" in v["ownerText"] and len(v["ownerText"]["runs"]) > 0:
                        creator = v["ownerText"]["runs"][0].get("text", "YouTube Fitness")
                    elif "longBylineText" in v and "runs" in v["longBylineText"] and len(v["longBylineText"]["runs"]) > 0:
                        creator = v["longBylineText"]["runs"][0].get("text", "YouTube Fitness")
                        
                    # Extract duration
                    duration = "5:00"
                    if "lengthText" in v and "simpleText" in v["lengthText"]:
                        duration = v["lengthText"]["simpleText"]
                    elif "lengthText" in v and "runs" in v["lengthText"] and len(v["lengthText"]["runs"]) > 0:
                        duration = v["lengthText"]["runs"][0].get("text", "5:00")
                        
                    videos.append({
                        "video_id": v_id,
                        "title": title,
                        "creator": creator,
                        "duration": duration
                    })
                    if len(videos) >= max_results:
                        break
            except Exception as e:
                logger.warning(f"Error parsing ytInitialData in search_youtube_videos: {e}")
                
        # Fallback if no videos found via JSON
        if not videos:
            logger.info("Falling back to regex video ID extraction for YouTube search")
            video_ids = re.findall(r'"videoId"\s*:\s*"([A-Za-z0-9_-]{11})"', html)
            seen_ids = set()
            for vid in video_ids:
                if len(vid) == 11 and vid not in seen_ids and vid not in ['y1r9toPQNkM', 'wT7S7mY_FIs', 'wYREQvWyeg4']:
                    seen_ids.add(vid)
                    videos.append({
                        "video_id": vid,
                        "title": f"Panduan {query}",
                        "creator": "YouTube Fitness",
                        "duration": "5:00"
                    })
                    if len(videos) >= max_results:
                        break
                        
        return videos
    except Exception as e:
        logger.warning(f"Failed to search YouTube videos for {query}: {e}")
        return []

def _call_vertex_ai_sdk(prompt: str, image_bytes: bytes) -> Dict[str, Any]:
    """Call Vertex AI using official google-cloud-aiplatform SDK with API key and robust retries."""
    if not API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured in the environment.")

    # Configure client options with the API key and region endpoint
    client_options = ClientOptions(
        api_endpoint=f"{GCP_REGION}-aiplatform.googleapis.com",
        api_key=API_KEY
    )

    # Initialize PredictionServiceClient using REST transport and client options
    # This allows using GCP API key credentials within the official SDK
    client = aiplatform_v1.PredictionServiceClient(
        client_options=client_options,
        transport="rest"
    )

    # Fully qualified resource path of the model
    model_path = f"projects/{GCP_PROJECT}/locations/{GCP_REGION}/publishers/google/models/{GEMINI_MODEL}"

    # Build the GenerateContentRequest payload
    parts = [aiplatform_v1.Part(text=prompt)]
    if image_bytes:
        parts.append(
            aiplatform_v1.Part(
                inline_data=aiplatform_v1.Blob(
                    mime_type="image/jpeg",
                    data=image_bytes
                )
            )
        )

    request = aiplatform_v1.GenerateContentRequest(
        model=model_path,
        contents=[
            aiplatform_v1.Content(
                role="user",
                parts=parts
            )
        ],
        generation_config=aiplatform_v1.GenerationConfig(
            response_mime_type="application/json",
            thinking_config={
                "thinking_budget": 1500
            }
        )
    )

    max_retries = 4
    base_delay = 1.0  # seconds

    for attempt in range(max_retries):
        try:
            response = client.generate_content(request=request)
            
            # Verify response contents
            if not response.candidates:
                raise Exception(f"No response candidates returned from model. Full response: {response}")
                
            text = response.candidates[0].content.parts[0].text
            cleaned_text = clean_json_string(text)
            return json.loads(cleaned_text)

        except Exception as e:
            err_str = str(e).lower()
            is_overloaded = "overloaded" in err_str or "rate limit" in err_str or "429" in err_str or "503" in err_str or "exhausted" in err_str
            
            if is_overloaded and attempt < max_retries - 1:
                # Exponential backoff with jitter
                delay = base_delay * (2 ** attempt) + random.uniform(0.1, 0.5)
                logger.warning(f"Vertex AI API rate limited/overloaded (attempt {attempt + 1}/{max_retries}). Retrying in {delay:.2f} seconds... Error: {e}")
                time.sleep(delay)
                continue
            else:
                if attempt < max_retries - 1:
                    delay = base_delay * (2 ** attempt) + random.uniform(0.1, 0.5)
                    logger.warning(f"Error calling Vertex AI on attempt {attempt + 1}/{max_retries}: {e}. Retrying in {delay:.2f} seconds...")
                    time.sleep(delay)
                    continue
                else:
                    logger.error(f"Error calling Vertex AI SDK after {max_retries} attempts: {e}")
                    raise e

class AIService:
    @staticmethod
    def analyze_gym_equipment(image_bytes: bytes) -> Dict[str, Any]:
        """Detect gym equipment and provide usage details with expanded Astra Group product synergy."""
        prompt = """
        Anda adalah Personal Trainer profesional bersertifikasi NASM sekaligus Konsultan Sehat Astra Group.
        Gunakan kemampuan analisis gambar tingkat tinggi Anda untuk mengidentifikasi alat olahraga pada foto.
        Kembalikan detail dalam format JSON mentah tanpa markdown blocks (no ```json):
        {
          "equipment_name": "Nama Alat",
          "primary_muscle": "Otot Utama yang Dilatih",
          "secondary_muscle": "Otot Pendukung",
          "how_to_use": [
            "Langkah 1...",
            "Langkah 2..."
          ],
          "common_mistakes": [
            "Kesalahan 1...",
            "Kesalahan 2..."
          ],
          "recommended_schema": {
            "sets": 3,
            "reps": 12,
            "rpe": "6-7 (beban ringan ke sedang)"
          },
          "youtube_videos": [
            {
              "title": "Judul Video (Bahasa Indonesia atau Inggris yang memotivasi)",
              "video_id": "ID Video YouTube asli/populer untuk latihan alat ini (misal: 'y1r9toPQNkM', 'wT7S7mY_FIs', 'wYREQvWyeg4')",
              "creator": "Nama Creator/Channel",
              "duration": "Estimasi durasi video (misal: 10:15)"
            },
            {
              "title": "Judul Video Latihan Ke-2",
              "video_id": "ID Video YouTube asli/populer Ke-2",
              "creator": "Nama Creator Ke-2",
              "duration": "Estimasi durasi Ke-2"
            }
          ],
          "astra_recommendations": [
            {
              "category": "Kategori rekomendasi (Layanan Rumah Sakit & Medis / Pembiayaan Kebugaran / Layanan Pembayaran / Asuransi / Otomotif Sehat / perbankan / dll.)",
              "product_name": "Nama Produk/Layanan Kreatif Astra Group (misal: Bank Saqu Saku Sehat, Cicilan Alat Gym FIFGROUP, Konsultasi Fisioterapi Halodoc, Spesialis Orthopedi RS Hermina, Skrining Kardio Heartology, Astra Life Fit Active, TRAC Active Rent, atau produk astra kreatif lainnya)",
              "logo_key": "Kunci Logo lowercase (misal: banksaqu, fifgroup, halodoc, hermina, heartology, astralife, gardamedika, toyota, astrapay, seva, trac, astrahonda, shopanddrive, unitedtractors, astraagro, astragraphia)",
              "description": "Deskripsi singkat dan menarik mengenai layanan medis spesialis, tabungan sehat, asuransi, pembiayaan, sewa kendaraan, atau produk Astra Group lainnya.",
              "relevance_reason": "Alasan spesifik dan sangat personal mengapa produk dari anak perusahaan Astra ini sangat cocok untuk pengguna yang menggunakan alat gym ini (misal: pencegahan cedera sendi, tabungan target gym via Bank Saqu, pengadaan home gym via FIFGROUP, sewa mobil TRAC untuk membawa peralatan, dsb.)",
              "action_text": "Teks tombol aksi yang memotivasi",
              "action_url": "URL pemasaran resmi yang sesuai",
              "product_image_key": "Kunci gambar produk (pilih dari: active_lifestyle, medical_checkup, electric_suv, hybrid_car, home_gym, payment_cashback atau sediakan URL gambar Unsplash bertema olahraga/medis/kebugaran secara langsung)"
            }
          ]
        }
        Pastikan nama alat dalam Bahasa Indonesia atau nama umum internasional yang mudah dipahami, serta penjelasan langkah yang mudah dan aman untuk pemula.
        Sediakan minimal 2 video YouTube berkualitas tinggi yang paling relevan dengan tipe alat yang terdeteksi agar pengguna bisa langsung meniru gerakannya dengan benar.
        
        Persyaratan Khusus Rekomendasi Astra:
        1. Berikan tepat 2 rekomendasi produk Astra Group yang saling komplementer.
        2. BEBASKAN KREATIVITAS Anda untuk merekomendasikan anak perusahaan Astra Group mana saja (seperti Bank Saqu, FIFGROUP, AstraPay, Astra Life, Asuransi Astra, SEVA, TRAC, Astra Honda Motor, United Tractors, Astragraphia, Astra Agro, dsb.) tanpa dibatasi oleh list dasar. Desainlah relevansi produk yang kreatif namun masuk akal untuk menunjang kebugaran pengguna!
        3. Sebagai jaminan keamanan medis, wajib menyertakan minimal 1 rekomendasi berupa layanan klinis/fisioterapi medis dari RS Hermina, Halodoc, atau Heartology Cardiovascular Center yang relevan dengan otot yang dilatih atau pencegahan cedera alat olahraga ini.
        4. Seluruh teks harus ditulis dalam Bahasa Indonesia yang profesional, hangat, memotivasi, dan mendidik.
        """
        analysis = _call_vertex_ai_sdk(prompt, image_bytes)
        
        # Search actual working YouTube videos programmatically to avoid hallucinations
        equipment_name = analysis.get("equipment_name", "")
        if equipment_name:
            if "tidak ada" in equipment_name.lower() or "no equipment" in equipment_name.lower():
                logger.info("No equipment detected. Clearing YouTube video list to avoid irrelevant recommendations.")
                analysis["youtube_videos"] = []
            else:
                logger.info(f"Programmatic YouTube search active for equipment: {equipment_name}")
                real_videos = search_youtube_videos(equipment_name, max_results=2)
                if real_videos:
                    logger.info(f"Found real YouTube videos: {real_videos}")
                    analysis["youtube_videos"] = real_videos
                else:
                    logger.warning(f"No YouTube videos found for query: {equipment_name}")
                    # Keep empty list to prevent displaying dead placeholder links
                    analysis["youtube_videos"] = []
                
        return analysis

    @staticmethod
    def analyze_body_selfie(image_bytes: bytes, height: float, weight: float, age: int, gender: str, goal: str) -> Dict[str, Any]:
        """Estimate body composition and provide customized workout & macro targets from full-body photo, integrated with creative Astra Group products."""
        prompt = f"""
        Anda adalah Ahli Kinesiologi, Spesialis Komposisi Tubuh, dan Konsultan Kesehatan Astra Group.
        Analisis gambar selfie seluruh badan ini secara sopan, objektif, dan hubungkan dengan data biometrik berikut:
        - Tinggi Badan: {height} cm
        - Berat Badan: {weight} kg
        - Usia: {age} tahun
        - Jenis Kelamin: {gender}
        - Target Kebugaran: {goal}

        Task: Lakukan estimasi visual persentase lemak tubuh (body fat %) dan buat analisis fisik komprehensif. Kembalikan respons dalam format JSON mentah tanpa markdown blocks (no ```json):
        {{
          "estimated_body_fat": "X%",
          "somatotype": "Ectomorph / Mesomorph / Endomorph",
          "muscle_distribution_analysis": "Analisis singkat tentang proporsi fisik visual tubuh bagian atas vs bawah dan area fokus",
          "biometric_assessment": "Evaluasi berat badan terhadap tinggi badan (BMI yang relevan secara fisik kebugaran)",
          "recommended_workout_focus": "Fokus latihan yang paling cocok (misal: Hypertrophy, Recomposition, Fat Loss, Endurance)",
          "macronutrient_targets": {{
            "calories": 2000,
            "protein": 120,
            "carbs": 220,
            "fat": 65
          }},
          "astra_recommendations": [
            {{
              "category": "Kategori (Asuransi / Medis / Otomotif Sehat / Finansial / Perbankan / Transportasi / Gaya Hidup / dll.)",
              "product_name": "Nama Produk/Layanan Kreatif Astra Group (misal: Astra Life Fit Active, Garda Medika, Layanan Spesialis RS Hermina, Konsultasi Gizi Halodoc, Skrining Jantung Heartology, Bank Saqu Saku Sehat, Toyota Yaris Cross Hybrid, TRAC Active Lifestyle Rent, FIFGROUP Sports Financing, atau produk anak astra kreatif lainnya)",
              "logo_key": "Kunci Logo lowercase (misal: banksaqu, seva, trac, astrahonda, hermina, halodoc, heartology, astralife, gardamedika, toyota, fifgroup, astrapay, shopanddrive, unitedtractors, astraagro, astragraphia)",
              "description": "Deskripsi singkat, premium, dan menarik mengenai asuransi, layanan rumah sakit, perbankan digital, kendaraan ramah lingkungan, atau layanan sewa mobil Astra Group.",
              "relevance_reason": "Alasan personalisasi yang sangat kreatif mengapa produk ini sangat cocok dengan kondisi fisik pengguna, somatotype, persentase lemak tubuh, dan tujuan fitness {goal} mereka.",
              "action_text": "Teks tombol aksi yang memikat dan interaktif",
              "action_url": "URL pemasaran resmi yang sesuai",
              "product_image_key": "Kunci gambar produk (pilih dari: active_lifestyle, medical_checkup, electric_suv, hybrid_car, home_gym, payment_cashback atau sediakan URL gambar Unsplash bertema kesehatan/gaya hidup/mobil secara langsung)"
            }}
          ]
        }}
        
        Persyaratan Khusus Rekomendasi Astra:
        1. Berikan tepat 3 rekomendasi produk Astra Group yang saling komplementer untuk mendukung tubuh dan gaya hidup aktif pengguna.
        2. BEBASKAN KREATIVITAS Anda secara maksimal! Manfaatkan seluruh ekosistem Astra Group (misal: Bank Saqu untuk tantangan finansial menabung hidup sehat, TRAC untuk sewa mobil bepergian olahraga, United Tractors untuk solar panel rumah ramah lingkungan/home gym, Astra Honda Motor untuk motor listrik sehat EM1 e:, SEVA untuk pembiayaan mobil hybrid penunjang olahraga, Astra Life, Garda Medika, FIFGROUP, dsb.) secara relevan dan memukau.
        3. Wajib menyertakan minimal 1 rekomendasi medis/klinis spesialis profesional dari RS Hermina, Halodoc, atau Heartology Cardiovascular Center untuk melakukan skrining fisik mendalam, konsultasi gizi, atau pemantauan kesehatan jantung pasca-analisis komposisi badan ini.
        4. Pastikan seluruh teks penjelasan ditulis dalam Bahasa Indonesia yang hangat, profesional, memotivasi, dan mendidik.
        Estimasi persentase lemak tubuh harus realistis dan objektif berdasarkan tampilan siluet visual tubuh.
        """
        return _call_vertex_ai_sdk(prompt, image_bytes)

    @staticmethod
    def analyze_food_plate(image_bytes: bytes) -> Dict[str, Any]:
        """Analyze a food plate image to estimate nutrition macros with highly creative Astra Group product synergy."""
        prompt = """
        Anda adalah Ahli Gizi Olahraga bersertifikat sekaligus Penasihat Diet Astra Group.
        Analisis gambar makanan/piring makan ini, identifikasi hidangan, dan estimasikan kandungan kalori serta makronutrisinya secara visual.
        Kembalikan respons dalam format JSON mentah tanpa markdown blocks (no ```json):
        {
          "food_name": "Nama Makanan (misal: Nasi Padang Dada Ayam, Salad Buah, Gado-Gado)",
          "identified_items": ["Bahan 1 (misal: Dada ayam tanpa kulit 120g)", "Bahan 2 (misal: Nasi putih 1 porsi)"],
          "estimated_portion": "Keterangan porsi visual (misal: Porsi Sedang, Sekitar 400g total piring)",
          "nutrition": {
            "calories": 450,
            "protein_g": 35,
            "carbohydrates_g": 45,
            "fats_g": 12
          },
          "fitness_compatibility": "Analisis apakah makanan ini mendukung diet pembentukan otot, pembakaran lemak, atau kebugaran umum.",
          "improvement_tips": "Saran gizi tambahan (misal: kurangi kuah santan untuk memotong lemak jenuh, tambah serat sayur)",
          "astra_recommendations": [
            {
              "category": "Kategori (Layanan Medis & Gizi / Pembayaran & Belanja Sehat / Proteksi Sehat / Perbankan Diet / Agribisnis Organik / dll.)",
              "product_name": "Nama Produk/Layanan Kreatif Astra Group (misal: Spesialis Gizi RS Hermina, Chat Dokter Gizi Halodoc, Skrining Kolesterol Jantung Heartology, Bank Saqu Saku Sehat, AstraPay Groceries Cashback, Garda Medika Wellness Screening, Minyak Goreng Sehat Astra Agro Lestari, atau produk astra kreatif lainnya)",
              "logo_key": "Kunci Logo lowercase (misal: banksaqu, astraagro, hermina, halodoc, heartology, astrapay, gardamedika, astralife, toyota, fifgroup, seva, trac, astrahonda, shopanddrive, unitedtractors, astragraphia)",
              "description": "Deskripsi singkat dan menarik mengenai konsultasi gizi, belanja sehat, minyak nabati berkelanjutan, perbankan, atau asuransi pendukung diet sehat dari Astra Group.",
              "relevance_reason": "Alasan personalisasi yang sangat kreatif mengapa layanan ini sangat cocok dengan kandungan kalori, protein, kolesterol, lemak, atau porsi hidangan yang dianalisis ini untuk mendukung program diet pengguna.",
              "action_text": "Teks tombol aksi yang ramah dan solutif",
              "action_url": "URL pemasaran resmi yang sesuai",
              "product_image_key": "Kunci gambar produk (pilih dari: active_lifestyle, medical_checkup, electric_suv, hybrid_car, home_gym, payment_cashback atau sediakan URL gambar Unsplash bertema makanan sehat/gizi/belanja secara langsung)"
            }
          ]
        }
        
        Persyaratan Khusus Rekomendasi Astra:
        1. Berikan tepat 2 rekomendasi produk Astra Group yang saling komplementer di bagian 'astra_recommendations'.
        2. BEBASKAN KREATIVITAS Anda untuk mengintegrasikan anak perusahaan Astra Group mana pun (seperti Bank Saqu dengan saku belanja sehat, Astra Agro Lestari untuk minyak sawit premium sehat berkelanjutan, AstraPay untuk cashback merchant sayur/buah organik, Garda Medika untuk cek kolesterol, Astra Life, Astragraphia untuk mencetak food journal, dsb.) secara logis dan inovatif.
        3. Wajib menyertakan minimal 1 rekomendasi bernilai medis/klinis gizi (seperti Spesialis Gizi Klinik RS Hermina, Dokter Diet Spesialis Halodoc, atau Screening Kolesterol/Jantung Heartology) untuk membantu pengguna berkonsultasi mengenai asupan lemak, kolesterol, gula darah, atau kalori harian mereka.
        4. Seluruh teks penjelasan harus ditulis dalam Bahasa Indonesia yang ramah, mendidik, dan memotivasi.
        """
        return _call_vertex_ai_sdk(prompt, image_bytes)

    @staticmethod
    def estimate_biometrics_from_photo(image_bytes: bytes) -> Dict[str, Any]:
        """Estimate user's height, weight, age, and gender from a selfie/photo to autofill biometrics with thinking config support."""
        prompt = """
        Anda adalah pakar kebugaran dan analisis antropometri visual.
        Analisis gambar tubuh atau selfie orang ini untuk mengestimasi secara sopan dan mendekati kenyataan data fisik berikut:
        1. Tinggi badan (dalam satuan cm, estimasikan berdasarkan proporsi relatif)
        2. Berat badan (dalam satuan kg)
        3. Usia (dalam tahun)
        4. Gender (pilih antara "Laki-laki" atau "Perempuan")
        5. Saran Target Kebugaran Utama (pilih salah satu dari: "Lose Weight / Defisit Kalori", "Gain Muscle / Bulking", "Stay Fit / Recomposition")

        Kembalikan respons HANYA dalam format JSON mentah tanpa markdown blocks (no ```json):
        {
          "height": 170,
          "weight": 65,
          "age": 25,
          "gender": "Laki-laki",
          "goal": "Stay Fit / Recomposition"
        }
        Ingat, buat estimasi se-sopan mungkin agar memotivasi pengguna, dan pastikan nilainya berupa angka/integer yang valid untuk height, weight, dan age, serta string yang tepat untuk gender dan goal.
        """
        return _call_vertex_ai_sdk(prompt, image_bytes)

export_service = AIService
