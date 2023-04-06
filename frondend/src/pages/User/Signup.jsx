
import { LockClosedIcon } from '@heroicons/react/20/solid'
import axios from 'axios'
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Example() {
  const history =useNavigate()
  const [inputs, setInputs] = useState({
    name:"",
    email: "",
    pass: "",
    phone:"",
    showPass: false,
  });


  const sendReguest=async (e)=>{
    try {
      console.log(inputs)
      const res = await axios.post('http://localhost:5000/user/signup',{
        name:inputs.name,
        email:inputs.email,
        password:inputs.password,
        phone:inputs.phone,
    })
    console.log(res)
    } catch (error) {
      console.log(error)
    }
  
  }

  
  const handleChange =(e)=>{
    setInputs(prev=>({
      ...prev,
      [e.target.name]:e.target.value

    }))
    console.log(e.target.name,"value",e.target.value)
  }





  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform validation on the form data here
    // console.log(inputs);
    // Send the form data to the server here using AJAX or navigate to a new page
  
    sendReguest().then(()=>history("/OTP"))
  };


  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuF_ui1tL7qDhDLnSue4SfcvzwtaWtBcpQg4gm59NtVA&s"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign up 
            </h2>
           
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Name
                </label>
                <input
                  id="email-address"
                  name="name"
                  type="text"
                  // autoComplete="email"
                  onChange={handleChange}
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Name"
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  phone
                </label>
                <input
                  id="email-address"
                  name="phone"
                  type="text"
                  onChange={handleChange}
                  // autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="phone"
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  // autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  // autoComplete="current-password"
                  required
                  className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                
               
              </div>

              <div className="text-sm">
               
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
