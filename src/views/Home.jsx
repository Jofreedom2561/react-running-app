import React from 'react'
import FooterSAU from './../components/RunningSAU'
import logo from './../assets/logo.png'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  // สร้าง state
  // [ชื่อ state, ฟังก์ชันสำหรับอัปเดตค่า state] = useState(ค่าเริ่มต้น)
  const [secureCode, setSecureCode] = useState('')

  // ฟังก์ชันตรวจสอบ Secure Code เพื่อเปิดไปยังหน้า /showallfood
  const handleAccessClick = () => {
    // Validate UI
    if (secureCode === '') {
      //ว่างจริงแสดงข้อความเตือน
      // alert('กรุณาป้อน Secure Code ก่อนเข้าใช้งาน') ง่ายแต่ไม่สวย
      Swal.fire({
        icon: 'warning',
        title: 'คำเตือน',
        text: 'กรุณาป้อน Secure Code ก่อนเข้าใช้งาน',
        confirmButtonText: 'ตกลง'
      })
      return
    }

    // ตรวจสอบว่า secureCode ตรงกับ 'SAU' หรือไม่ ถ้าใช่ให้เปิดหน้า /showallrun    
    if (secureCode.toUpperCase() === 'SAU') {
      // เปิดหน้า /showallrun
      navigate('/showallrun')
    } else {
      // แสดงข้อความเตือนว่า Secure Code ไม่ถูกต้อง
      Swal.fire({
        icon: 'warning',
        title: 'คำเตือน',
        text: 'Secure Code ไม่ถูกต้อง',
        confirmButtonText: 'ตกลง'
      })
    }
  }

  return (
    <>
      {/* ส่วนของรายละเอียดของหน้าหลัก */}
      <div className='w-3/5 mx-auto flex flex-col items-center shadow-lg
                      border border-gray-300 rounded p-10 mt-30'>

        {/* แสดงรูป logo */}
        <img src={logo} alt="logo" className='w-30' />

        {/* แสดงชื่อเว็บ */}
        <h1 className='text-2xl mt-5 font-bold text-blue-500'>
          Running APP (Supabase)
        </h1>
        <h1 className='text-2xl mt-5 font-bold text-blue-500'>
          วิ่งกันเถอะ
        </h1>
        {/* ป้อน Secure Code */}
        <input value={secureCode}
          onChange={(e) => setSecureCode(e.target.value)}
          type="text" placeholder='Enter secure code'
          className='w-[250px] border mt-5 p-2 rounded-md' />

        {/* ปุ่มกดเข้าใช้งา เว็บ */}
        <button onClick={handleAccessClick}
          className='w-[250px] bg-blue-500 mt-5 text-white p-2
                           rounded-md cursor-pointer hover:bg-blue-700'>
          เข้าใช้งาน
        </button>
      </div>

      {/* ส่วนของ Footer */}
      <FooterSAU />
    </>
  )
}