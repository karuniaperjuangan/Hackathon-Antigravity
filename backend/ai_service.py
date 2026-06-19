import os
import json
import logging
import re
from typing import Dict, Any
import google.generativeai as genai
from PIL import Image
import io

# Setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Google Generative AI
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    logger.warning("GEMINI_API_KEY environment variable is not set. AI services may fail.")
else:
    genai.configure(api_key=API_KEY)

def clean_json_string(text: str) -> str:
    """Strip markdown code blocks and other formatting to extract pure JSON."""
    # Find JSON blocks
    text = text.strip()
    match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
    if match:
        return match.group(1).strip()
    return text

class AIService:
    @staticmethod
    def analyze_gym_equipment(image_bytes: bytes) -> Dict[str, Any]:
        """Detect gym equipment and provide usage details."""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            prompt = """
            Anda adalah Personal Trainer profesional bersertifikasi NASM.
            Analisis gambar alat olahraga/gym ini dan kembalikan detail dalam format JSON mentah tanpa markdown blocks (no ```json):
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
              }
            }
            Pastikan nama alat dalam Bahasa Indonesia atau nama umum internasional yang mudah dipahami, serta penjelasan langkah yang mudah dan aman untuk pemula.
            """
            
            response = model.generate_content([prompt, image])
            cleaned_text = clean_json_string(response.text)
            return json.loads(cleaned_text)
            
        except Exception as e:
            logger.error(f"Error in analyze_gym_equipment: {e}")
            # Fallback mock data in case of failure or invalid JSON
            return {
                "equipment_name": "Alat Gym Multi-Purpose (Deteksi Bermasalah)",
                "primary_muscle": "Latihan Seluruh Tubuh",
                "secondary_muscle": "Otot Inti",
                "how_to_use": [
                    "Sesuaikan tinggi kursi agar nyaman.",
                    "Pegang erat tuas besi dengan kedua tangan.",
                    "Lakukan gerakan secara perlahan dan terkontrol."
                ],
                "common_mistakes": [
                    "Menggunakan momentum tubuh (sentakan) berlebih.",
                    "Mengatur beban terlalu berat di latihan perdana."
                ],
                "recommended_schema": {
                    "sets": 3,
                    "reps": 12,
                    "rpe": "RPE 6 (Ringan)"
                }
            }

    @staticmethod
    def analyze_body_selfie(image_bytes: bytes, height: float, weight: float, age: int, gender: str, goal: str) -> Dict[str, Any]:
        """Estimate body composition and provide customized workout & macro targets from full-body photo."""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            prompt = f"""
            Anda adalah Ahli Kinesiologi dan Spesialis Komposisi Tubuh Kebugaran.
            Analisis gambar selfie seluruh badan ini dan gabungkan dengan data biometrik pengguna berikut:
            - Tinggi Badan: {height} cm
            - Berat Badan: {weight} kg
            - Usia: {age} tahun
            - Jenis Kelamin: {gender}
            - Target Kebugaran: {goal}

            Task: Lakukan estimasi visual persentase lemak tubuh (body fat %) dan buat analisis fisik. Kembalikan respons dalam format JSON mentah tanpa markdown blocks (no ```json):
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
              }}
            }}
            Pastikan seluruh teks penjelasan ditulis dalam Bahasa Indonesia yang ramah, memotivasi, dan mendidik bagi pemula. Estimasi persentase lemak tubuh harus realistis dan objektif berdasarkan tampilan siluet visual tubuh.
            """
            
            response = model.generate_content([prompt, image])
            cleaned_text = clean_json_string(response.text)
            return json.loads(cleaned_text)
            
        except Exception as e:
            logger.error(f"Error in analyze_body_selfie: {e}")
            # Intelligent fallback based on basic target
            is_lose = "lose" in goal.lower() or "turun" in goal.lower() or "kurang" in goal.lower()
            is_gain = "gain" in goal.lower() or "naik" in goal.lower() or "otot" in goal.lower()
            
            cals = 1600 if is_lose else (2500 if is_gain else 2000)
            prot = weight * 1.6 if weight else 100
            fat = 50 if is_lose else 70
            carbs = (cals - (prot * 4 + fat * 9)) / 4
            
            return {
                "estimated_body_fat": "18-24% (Estimasi Fallback)",
                "somatotype": "Mesomorph",
                "muscle_distribution_analysis": "Proporsi tubuh terlihat seimbang secara visual. Sempurnakan dengan program latihan resistensi teratur.",
                "biometric_assessment": "Berat badan Anda berada dalam rentang normal, sangat baik untuk memulai pembentukan massa otot.",
                "recommended_workout_focus": "Recomposition" if not is_lose and not is_gain else ("Fat Loss" if is_lose else "Hypertrophy"),
                "macronutrient_targets": {
                    "calories": int(cals),
                    "protein": int(prot),
                    "carbs": int(carbs),
                    "fat": int(fat)
                }
            }

    @staticmethod
    def analyze_food_plate(image_bytes: bytes) -> Dict[str, Any]:
        """Analyze a food plate image to estimate nutrition macros."""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            prompt = """
            Anda adalah Ahli Gizi Olahraga bersertifikat.
            Analisis gambar makanan/piring makan ini, identifikasi hidangan, dan estimasikan kandungan kalorinya secara visual.
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
              "improvement_tips": "Saran gizi tambahan (misal: kurangi kuah santan untuk memotong lemak jenuh, tambah serat sayur)"
            }
            Pastikan seluruh penjelasan ditulis dalam Bahasa Indonesia yang mendidik bagi pemula.
            """
            
            response = model.generate_content([prompt, image])
            cleaned_text = clean_json_string(response.text)
            return json.loads(cleaned_text)
            
        except Exception as e:
            logger.error(f"Error in analyze_food_plate: {e}")
            # Fallback mock data
            return {
                "food_name": "Makanan Seimbang Campur (Fallback)",
                "identified_items": ["Protein Hewani/Nabati", "Sumber Karbohidrat", "Sayur/Serat"],
                "estimated_portion": "Porsi Sedang (Estimasi Visi Bermasalah)",
                "nutrition": {
                    "calories": 500,
                    "protein_g": 25,
                    "carbohydrates_g": 60,
                    "fats_g": 15
                },
                "fitness_compatibility": "Mengandung makronutrisi lengkap, cukup aman untuk kebugaran harian umum.",
                "improvement_tips": "Pastikan selalu menyertakan sayuran hijau setengah piring untuk serat optimal."
            }

    @staticmethod
    def estimate_biometrics_from_photo(image_bytes: bytes) -> Dict[str, Any]:
        """Estimate user's height, weight, age, and gender from a selfie/photo to autofill biometrics."""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            model = genai.GenerativeModel("gemini-1.5-flash")
            
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
            
            response = model.generate_content([prompt, image])
            cleaned_text = clean_json_string(response.text)
            return json.loads(cleaned_text)
            
        except Exception as e:
            logger.error(f"Error in estimate_biometrics_from_photo: {e}")
            # Fallback mock data
            return {
                "height": 170,
                "weight": 65,
                "age": 25,
                "gender": "Laki-laki",
                "goal": "Stay Fit / Recomposition"
            }

export_service = AIService
