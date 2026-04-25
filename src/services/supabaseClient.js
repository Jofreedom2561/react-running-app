// ไฟล์ที่ใช้ในการเชื่อมต่อกับ Supabase
import { createClient } from '@supabase/supabase-js'

// ตั้งค่าการเชื่อมต่อกับ Supabase โดยใช้ URL และ ANON KEY จากไฟล์ .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// สร้าง instance ของ Supabase client เพื่อเชื่อมต่อไปยัง supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ส่งออก instance ของ Supabase client เพื่อให้สามารถนำไปใช้ในไฟล์อื่น ๆ ได้
export default supabase