import React, { useState, useEffect } from 'react'
import logo from './../assets/logo.png'
import RunningSAU from './../components/RunningSAU'
import { Link, useParams, useNavigate } from 'react-router-dom'
import supabase from './../services/supabaseClient'
import Swal from 'sweetalert2'

// ทำผิดหน้าหรือเปล่า หน้าเพิ่มจะดึงข้อมูลทำไม อันนี้มันไฟล์หน้า Add ไม่ใช่รึ แล้งวทำไมโค้ดเป็น Edit

export default function EditRun() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [runDate, setRunDate] = useState('')
  const [runPlace, setRunPlace] = useState('')
  const [runDistance, setRunDistance] = useState('')
  const [runTime, setRunTime] = useState('')
  const [runImageUrl, setRunImageUrl] = useState('')
  const [runImageFile, setRunImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('running_tb')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        Swal.fire('ผิดพลาด', 'ไม่สามารถดึงข้อมูลได้', 'error')
        return
      }

      setRunDate(data.run_date || '')
      setRunPlace(data.run_place || '')
      setRunDistance(data.run_distance || '')
      setRunTime(data.run_time || '')
      setRunImageUrl(data.run_image_url || '')
    }

    fetchData()
  }, [id])

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setRunImageFile(file)
      const imageUrl = URL.createObjectURL(file)
      setRunImageUrl(imageUrl)
    }
  }

  const handleSaveClick = async () => {
    if (!runDate || !runPlace || !runDistance || !runTime) {
      Swal.fire('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบ', 'warning')
      return
    }

    setLoading(true)
    let imageUrlToSave = runImageUrl

    try {
      if (runImageFile) {
        if (runImageUrl && runImageUrl.includes('supabase')) {
          const oldFileName = runImageUrl.split('/').pop()
          await supabase.storage.from('running_bk').remove([oldFileName])
        }

        const newFileName = `${Date.now()}_${runImageFile.name}`

        const { error: uploadError } = await supabase.storage
          .from('running_bk')
          .upload(newFileName, runImageFile)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('running_bk')
          .getPublicUrl(newFileName)

        imageUrlToSave = data.publicUrl
      }

      const { error: updateError } = await supabase
        .from('running_tb')
        .update({
          run_date: runDate,
          run_place: runPlace,
          run_distance: runDistance,
          run_time: parseFloat(runTime),
          run_image_url: imageUrlToSave
        })
        .eq('id', id)

      if (updateError) throw updateError

      Swal.fire('สำเร็จ', 'แก้ไขข้อมูลเรียบร้อยแล้ว', 'success')
      navigate('/showallrun')

    } catch (err) {
      Swal.fire('ผิดพลาด', err.message, 'error')
    }

    setLoading(false)
  }

  return (
    <>
      <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">

        <div className="w-[650px] bg-white border rounded-lg shadow-md p-10">

          {/* LOGO */}
          <div className="flex flex-col items-center">
            <img src={logo} alt="logo" className="w-20 mb-2" />
            <h1 className="text-blue-600 font-bold text-xl">
              Running APP (Supabase)
            </h1>
            <h2 className="text-blue-600 font-bold text-md">
              วิ่งกันเถอะ (แก้ไข)
            </h2>
          </div>

          <div className="mt-6">

            {/* วันที่ */}
            <div className="mb-4">
              <label className="block text-sm mb-1">วันที่วิ่ง</label>
              <input
                value={runDate}
                onChange={(e) => setRunDate(e.target.value)}
                type="date"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* สถานที่ */}
            <div className="mb-4">
              <label className="block text-sm mb-1">สถานที่วิ่ง</label>
              <input
                value={runPlace}
                onChange={(e) => setRunPlace(e.target.value)}
                type="text"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* ระยะทาง */}
            <div className="mb-4">
              <label className="block text-sm mb-1">ระยะทางที่วิ่ง (เมตร)</label>
              <input
                value={runDistance}
                onChange={(e) => setRunDistance(e.target.value)}
                type="number"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* เวลา */}
            <div className="mb-4">
              <label className="block text-sm mb-1">เวลาที่ใช้ในการวิ่ง (นาที)</label>
              <input
                value={runTime}
                onChange={(e) => setRunTime(e.target.value)}
                type="number"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* รูป */}
            <div className="mb-4">
              <label className="block text-sm mb-1">อัปโหลดรูป</label>

              <label className="bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer">
                เลือกรูป
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {runImageUrl && (
                <img
                  src={runImageUrl}
                  alt="preview"
                  className="mt-3 w-24 h-24 object-cover rounded"
                />
              )}
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSaveClick}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึกการวิ่ง'}
            </button>

            {/* LINK */}
            <div className="text-center mt-4">
              <Link to="/showallrun" className="text-green-600 text-sm">
                กลับไปหน้าการวิ่งทั้งหมด
              </Link>
            </div>

          </div>
        </div>

        <RunningSAU />
      </div>
    </>
  )
}
