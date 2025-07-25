import React from 'react'
import { Link } from 'react-router-dom'
function LoginAs() {
  return (
    <div className="bg-gray-200 font-sans flex flex-col items-center justify-center h-screen gap-y-10">
    <h1 className="font-semibold text-5xl">Who are you?</h1>

        <div className="flex flex-col sm:flex sm:flex-row gap-6 ">

        <Link className=" h-[110px] w-[170px] rounded-xl bg-white  flex flex-col gap-y-2 justify-center items-center hover:scale-[1.05] transition py-4 px-4" to="/loginAsClient">
            <div className="text-2xl text-blue-600 hover:text-blue-500 font-bold w-full text-center">Client</div>
            <p className=" text-center text-[14px]">Post requests and get quotes  </p>

       </Link>
        
        <Link className="h-[110px] w-[170px] rounded-xl bg-white py-4 px-4 flex flex-col gap-y-2 justify-center items-center hover:scale-[1.05] transition" to="/loginAsTransporter">
            <div className="text-2xl text-orange-600 hover:text-orange-500 font-bold w-full text-center">Transporter</div>
            <p className=" text-center text-[14px]">View client requests and quote prices</p>
       </Link>

      
    </div>
    
    
</div>

  )
}

export default LoginAs