import React, { use } from 'react'
import RunningSAU from './../components/RunningSAU'
import logo from './../assets/logo.png'
import { Link, Links } from 'react-router-dom'
import { useEffect, useState } from 'react'
import supabase from './../services/supabaseClient'
import Swal from 'sweetalert2'

export default function ShowAllRun() {
  // สร้างตัวแปรประเภท state เพื่อเก็บข้อมูลการกินทั้งหมดที่ดึงมาจาก Supabase
  const [runs, setRuns] = useState([])

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลการกินทั้งหมดจาก Supabase
    const fetchRun = async () => {
      //โค้ดดึงข้อมูลจาก Supabase
      const { data, error } = await supabase.from('running_tb').select('*')

      //ตรวจสอบว่ามี error หรือไม่
      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถดึงข้อมูลการวิ่งได้ กรุณาลองใหม่อีกครั้ง',
        })

        return
      }

      //กรณีไม่มี error เราจะเอาข้อมูลไปเก็บในตัวแปรประเภท state เพื่อเอาไปใช้กับการแสดงผลในตาราง
      setRuns(data)
    }

    // เรียกใช้ฟังก์ชันดึงข้อมูลให้ทำงาน
    fetchRun()
  }, [])

  // ฟักง์ชันลบข้อมูลการวิ่งออกจาก running_tb และลบไฟล์ออกจาก food_bk
  const handleDeleteRunClick = async (id, run_image_url) => {
    //ถามผู้ใช้ เพื่อยืนยั้นการลบ
    if (confirm('คุณต้องการลบข้อมูลการวิ่งนี้หรือไม่?')) {
      //ลบข้อมูลออกจาก food_tb
      const { error: deleteError } = await supabase.from('running_tb')
        .delete()
        .eq('id', id) //เงื่อนไขในการลบข้อมูล

      if (deleteError) {
        alert('พบปัญหาในการลบข้อมูล กรุณาลองใหม่อีกครั้ง')
        return
      }

      //ลบไฟล์ออกจาก running_bk
      //จากที่อยู่ของไฟล์รูป ตัดให้เหลือชื่อไฟล์รูปเท่านั้น
      //https://byagoxnxyfffutpvybqa.supabase.co/storage/v1/object/public/food_bk/aa.jpg
      const fileName = run_image_url.split('/').pop()
      const { error: deleteFileError } = await supabase.storage.from('running_bk')
        .remove([fileName])

      if (deleteFileError) {
        alert('พบปัญหาในการลบไฟล์ข้อมูล กรุณาลองใหม่อีกครั้ง')
        return
      }

      // แสดงข้อความแจ้งผู้ใช้
      alert('ข้อมูลการวิ่งถูกลบเรียบร้อยแล้ว')

      // อัปเดจข้อมูลในตาราง
      setRuns(runs.filter(run => run.id !== id))
    }
  }


  return (
    <>
      {/* ส่วนของรายละเอียดของหน้าแสดงข้อมูลการวิ่งทั้งหมด */}
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

        {/* ส่วนปุ่มเพิ่มข้อมูลอยู่ทางด้านขวา */}
        <div className='w-full mt-5 flex justify-end'>
          <Link to='/addrun' className='p-2 bg-green-500 text-white
                                         rounded hover:bg-green-600'>
            เพิ่มการวิ่ง
          </Link>
        </div>
{/* จะให้ทำอะไร */}
        {/* ส่วนของตารางแสดงข้อมูลที่ดึงมาจาก Supabase */}
        <div className='w-full mt-5'>
          <table className='w-full border border-gray-600 text-sm'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='p-2 border border-gray-600'>รูป</th>
                <th className='p-2 border border-gray-600'>วันที่วิ่ง</th>
                <th className='p-2 border border-gray-600'>สถานที่วิ่ง</th>
                <th className='p-2 border border-gray-600'>ระยะทางที่วิ่ง (เมตร)</th>
                <th className='p-2 border border-gray-600'>เวลาที่ใช้ในการวิ่ง (นาที)</th>
                <th className='p-2 border border-gray-600'>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {
                runs.map((item) => (
                  <tr key={item.id}>
                    <td className='p-2 border border-gray-600'>
                      <img src={item.run_image_url} alt="" className='w-20 mx-auto' />
                    </td>
                    <td className='p-2 border border-gray-600'>{item.run_date}</td>
                    <td className='p-2 border border-gray-600'>{item.run_place}</td>
                    <td className='p-2 border border-gray-600'>{item.run_distance}</td>
                    <td className='p-2 border border-gray-600 text-right'>{item.run_time} </td>
                    <td className='p-2 border border-gray-600 text-center'>
                      <Link to={`/editrun/${item.id}`} className='text-green-500 hover:text-green-700'>
                        แก้ไข
                      </Link>
                      {' '}|{' '}
                      <button onClick={() => handleDeleteRunClick(item.id, item.run_image_url)}
                        className='text-red-500 hover:text-red-700 cursor-pointer'>
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

      </div>
      <div className="mt-5 text-center">
        <span
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = '/'
          }}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          ออกจากการใช้งาน
        </span>
      </div>


      {/* ส่วนของ Footer */}
      <RunningSAU />
    </>
  )
}
