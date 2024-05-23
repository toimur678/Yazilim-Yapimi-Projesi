/* eslint-disable no-unused-vars */
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
    const [limit, setLimit] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3000/auth/add_word_limit', {limit})
        .then(result => {
            if(result.data.Status) {
                navigate('/dashboard')
            } else {
                alert(result.data.Error)
            }
        })
        .catch(err => console.log(err))
    }
  return (
    <div className='d-flex justify-content-center align-items-center' style={{height: '60vh', marginLeft: '250px'}}>
        <div className='p-3 rounded w-50 border'>
            <h2>Change the number of new words</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-3 mt-5'>
                    <label htmlFor="limit"><strong>Word limit(6-10):</strong></label>
                    <input type="number" name='limit' placeholder='Enter max limit'
                     onChange={(e) => setLimit
              (e.target.value)} className='form-control rounded-100 mt-3' min="6" max="10"/>
                </div>
                <button className='btn btn-success w-100 rounded-100 mb-2'>Save</button>
            </form>
        </div>
    </div>
  )
}

export default Settings