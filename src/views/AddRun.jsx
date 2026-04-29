//AddFood.jsx
import React from 'react'
import logo from './../assets/logo.png'
import RunningSAU from './../components/RunningSAU'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import supabase from './../services/supabaseClient'

export default function AddFood() {
  const navigate = useNavigate();
  // สร้างตัวแปร State สำหรับข้อมูลบน component ที่ต้องบริหารจัดการ
  const [runDate, setRunDate] = useState('')
  const [runPlace, setRunPlace] = useState('')
  const [runDistance, setRunDistance] = useState('')
  const [runTime, setRunTime] = useState('')
  const [runImageUrl, setRunImageUrl] = useState('') //เก็บที่อยู่ของรูป
  const [runImageFile, setRunImageFile] = useState(null) //เก็บไฟล์รูปที่เลือก


  // สร้างฟังก์ชันสำหรับจัดการการเลือกไฟล์รูปภาพ
  const handleImageChange = (e) => {
    const file = e.target.files[0] //ดึงไฟล์ที่เลือกมาเก็บในตัวแปร file

    if (file) {
      setRunImageFile(file) //เก็บไฟล์รูปที่เลือกไว้ใน State
      const imageUrl = URL.createObjectURL(file) //สร้าง URL ชั่วคราวสำหรับแสดงรูปที่เลือก
      setRunImageUrl(imageUrl) //เก็บ URL ของรูปที่เลือกไว้ใน State
    }
  }

  // สร้างฟังก์ชันบันทึก
  const handleSaveClick = async () => {
    // Validate UI - ตรวจสอบว่าข้อมูลที่ป้อนครบหรือไม่ (ตรวจสอบจากตัวแปร state)
    if (!runDate || !runPlace || !runDistance || !runTime || !runImageFile) {
      alert('กรุณาป้อนข้อมูลให้ครบทุกช่อง และเลือกรูปภาพด้วยครับ') //สามารถใช้ Swal
      return //หยุดการทำงานของฟังก์ชันนี้ทันที
    }

    // upload ไฟล์รูปไปยัง Storage บน Supabase
    // ตั้งชืิ่อรูปที่ไม่ซ้ำกัน
    const newFileName = `${Date.now()}_${runImageFile.name}` //ตั้งชื่อไฟล์ใหม่โดยใช้ timestamp ต่อท้ายชื่อไฟล์เดิม เพื่อให้ชื่อไฟล์ไม่ซ้ำกัน
    const { error: uploadError } = await supabase.storage
      .from('running_bk')
      .upload(newFileName, runImageFile)  //(ชื่อรูป, ตัวรูป)

    // ดึงที่อยู่ของไฟล์รูปที่อัปโหลดมาเก็บในตัวแปร เพื่อบันทึกไปยังฐานข้อมูล
    // ตัวแปรเก็บที่อยู่รูป
    let run_image_url = ''
    const { data } = supabase.storage.from('running_bk')
      .getPublicUrl(newFileName) //ดึงที่อยู่ของไฟล์รูปที่อัปโหลดมาเก็บในตัวแปร data
    run_image_url = data.publicUrl //เก็บที่อยู่ของรูปที่อัปโหลดไว้ในตัวแปร food_image_url

    // บันทึกข้อมูลไปยัง Supabase
    const { error: insertError } = await supabase.from('running_tb')
      .insert({
        run_date: runDate,
        run_place: runPlace,
        run_distance: runDistance,
        run_time: parseFloat(runTime), //แปลงค่าเป็นตัวเลขทศนิยม
        run_image_url: run_image_url
      })

    // แสดงข้อความแจ้งเตือนว่าบันทึกสำเร็จแล้ว
    alert('บันทึกข้อมูลการวิ่งเรียบร้อยแล้วครับ') //สามารถใช้ Swal

    // ย้อนกลับไปยังหน้าแสดงข้อมูลการวิ่งทั้งหมด
    // window.location.href = '/showallrun'
    navigate('/showallrun')

  }

  // สร้างฟังก์ชันยกเลิก
  const handleCancelClick = () => {
    // ล้างข้อมูลที่ป้อนในฟอร์มทั้งหมด ซึ่งก็คือการรีเซ็ต State ให้กลับเป็นค่าเริ่มต้น
    setRunDate('')
    setRunPlace('')
    setRunDistance('')
    setRunTime('')
    setRunImageUrl('')
    setRunImageFile(null)
  }

  //ส่วนของหน้าจอ
  return (
    <>
      {/* ส่วนของรายละเอียดของหน้าเพิ่มข้อมูลการกินทั้งหมด */}
      <div className='w-3/5 mx-auto flex flex-col items-center shadow-lg
                      border border-gray-300 rounded p-10 mt-30'>

        {/* แสดงรูป logo */}
        <img src={logo} alt="logo" className='w-30' />

        {/* แสดงชื่อเว็บ */}
        <h1 className='text-2xl mt-5 font-bold text-blue-500'>
          Running APP (Supabase)
        </h1>
        <h1 className='text-2xl mt-2 font-bold text-blue-500'>
          วิ่งกันเถอะ
        </h1>

        {/* ส่วนของการป้อนข้อมูล เลือกรูป และปุ่มบันทึกปุ่มยกเลิก */}
        {/* ป้อนวันที่วิ่ง */}
        <div className='mt-10 w-full'>
          <label>วันที่วิ่ง</label>
          <input value={runDate} onChange={(e) => setRunDate(e.target.value)}
            type="text" placeholder='เช่น 1 มกราคม 2569 10 พฤษภาคม 2569'
            className='w-full border border-gray-300 rounded p-2' />
        </div>
        {/* ป้อนวิ่งที่ไหน */}
        <div className='mt-4 w-full'>
          <label>สถานที่วิ่ง</label>
          <input value={runPlace} onChange={(e) => setRunPlace(e.target.value)}
            type="text" placeholder='เช่น สวนลุม สวนจตุจักร'
            className='w-full border border-gray-300 rounded p-2' />
        </div>
        {/* ป้อนระยะทาง */}
        <div className='mt-4 w-full'>
          <label>ระยะทางที่วิ่ง (เมตร)</label>
          <input value={runDistance} onChange={(e) => setRunDistance(e.target.value)}
            type="text" placeholder='เช่น 2000 5000'
            className='w-full border border-gray-300 rounded p-2' />
        </div>
        {/* ป้อนเวลา */}
        <div className='mt-4 w-full'>
          <label>เวลาที่ใช้ในการวิ่ง (นาที)</label>
          <input value={runTime} onChange={(e) => setRunTime(e.target.value)}
            type="number" placeholder='เช่น 30 60'
            className='w-full border border-gray-300 rounded p-2' />
        </div>
        {/* เลือกรูป */}
        <div className='mt-4 w-full flex items-start'>
          <label>อัปโหลดรูป </label>
          <input onChange={handleImageChange}
            type="file" accept='image/*' id="select-image"
            className='w-full border border-gray-300 rounded p-2 hidden' />
          <label htmlFor="select-image" className='cursor-pointer px-6 py-2 bg-blue-700 rounded text-white ml-3'>
            เลือกรูป
          </label>

        </div>
        {/* แสดงรูปที่เลือก (image preview) */}
        {
          // ตรวจสอบว่า foodImageUrl มีค่าหรือไม่ (มีรูปที่เลือก) จึงแสดงรูปนั้น
          runImageUrl &&
          <img src={runImageUrl} alt="Selected"
            className='mt-4 h-30 rounded' />
        }
        {/* ปุ่มบันทึก */}
        <button onClick={handleSaveClick}
          className='w-full mt-6 py-2 bg-blue-500 rounded text-white
                         hover:bg-blue-600 cursor-pointer'>
          บันทึกการวิ่ง
        </button>




        {/* ข้อความลิงค์กลับไปยังหน้า /showallfood */}
        <Link to="/showallrun" className='mt-4 text-blue-500 hover:underline'>
          กลับไปหน้าการวิ่งทั้งหมด
        </Link>
      </div>

      {/* ส่วนของ Footer */}
      <RunningSAU />
    </>
  )
}