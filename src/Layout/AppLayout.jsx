import React from 'react'
import { Outlet } from 'react-router'
import Header from './Header'

const AppLayout = () => {
    return (
        <div>
            <div className="grid-background"></div>
            <main className="min-h-screen container">
                <Header />
                <Outlet />
            </main>
            <div className="p-10 text-center bg-gray-800 mt-10 flex items-center justify-center gap-2">Made With <span className='text-red-500 text-2xl'>♥</span> Anish</div>
        </div>
    )
}

export default AppLayout
