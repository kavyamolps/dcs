import React, { useState } from 'react'
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import './Auth.css'
import { registerUserAPI, loginUserAPI, googleLoginUserAPI } from '../services/allAPIs';
import { ToastContainer, toast ,Bounce } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
function Auth({ register }) {
  console.log(register);

  //create a state to hold user data
  const [userData, setUserData] = useState({ 'username': '', 'email': '', 'password': '' });

  const [token,setToken]=useState()

  const navigate = useNavigate()
  const handleRegister = async () => {
    console.log(userData);
    if (!userData.username || !userData.email || !userData.password) {
      alert("Please fill all the fields");
    }
    else {
      //call register user api
      try {
        const response = await registerUserAPI(userData);
        console.log(response);
        if (response.status === 200) {
          alert("Registration Successful!");
          navigate('/login');
        } else {
          // alert("Registration Failed! ");
          alert(response.response.data);
        }
      }
      catch (err) {
        console.log(err);
      }
    }

  }

  const handleLogin = async () => {
    console.log(userData);
    const {email,password}=userData
    if(!email||!password)
    {
      alert("Please fill the form")
      return
    }
    else{
      try{
        const response = await loginUserAPI({email,password})
        console.log(response)
        if(response.status==200)
        {
          sessionStorage.setItem("token",response.data.token)
          localStorage.setItem("token",response.data.token)
          toast.success(response.data.message, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            style: {
              background: "#027773",
              color: "#ffffff"
            },
            progressStyle: {
              background: "#ffffff"
            }
            
            });
          // alert(response.data.message)
          setTimeout(()=>{
            navigate("/home")
          },4000)
          // navigate("/home")

        }
        else
        {
          alert(response.response.data)
        }
      }catch(err)
      {
        console.log(err);
      }
    }
  }
  const handleGoogleLogin = async(credentialResponse)=>{
    // console.log("google login")
    const decode = jwtDecode(credentialResponse.credential)
    console.log(decode)

    try{
      const response=await googleLoginUserAPI({username:decode.name,email:decode.email,password:"googlepswd",profile:decode.picture})
      console.log(response)
      if(response.status==200)
      {
        sessionStorage.setItem("token",response.data.token)
        sessionStorage.setItem("userDetails",JSON.stringify(response.data.existingUser))
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("userDetails",JSON.stringify(response.data.existingUser))

        navigate("/home")
      }
      else
      {
        console.log(response.data.message)
      }
    }
    catch(err){
      console.log(err)
    }
  }
  




  return (
    <div className='bg'>
      <div className="flex justify-center items-center w-full">
        <div className="basis w-full max-w-md mx-3 p-6 sm:p-8" >
          <form className="flex max-w-md flex-col gap-4">
            <div>
              {
                register ? <div><h2 className='text-amber-100 text-3xl mb-5 text-center' style={{color:"#027773"}}><b>Create an Account</b></h2><p className='text-center mb-3' style={{color:"#636363"}}>Join the Decision Companion System and make smarter decision</p></div>
                  : <div><h2 className='text-amber-100 text-3xl mb-5 text-center' style={{color:"#027773"}}><b>Welcome Back 👋</b></h2><p className="text-center mb-3" style={{color:"#636363"}}>Login to continue using the Decision Companion System</p></div>
              }
              {
                register &&
                <div >
                  <div className="mb-4 block">
                    <TextInput onChange={(e) => setUserData({ ...userData, username: e.target.value })} className='' id="name" type="text" placeholder="Fullname" required />
                  </div>
                </div>


              }
              <div className="mb-2 block">
                <TextInput onChange={(e) => setUserData({ ...userData, email: e.target.value })} className='' id="email1" type="email" placeholder="Email" required />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <TextInput onChange={(e) => setUserData({ ...userData, password: e.target.value })} id="password1" type="password" placeholder='Password' required />
              </div>
            </div>
            {
              register ? <div><Button onClick={handleRegister} className='!text-olive-50 w-full' type="button">SignUp</Button><p className='mt-3 text-center' style={{color:"#6a6a6a",fontSize:"14px"}}>Already have an account ? <a href="/login" style={{ textDecoration: "underline",color:"#0b6a67" }}>login</a></p></div> : <div><Button className='!text-olive-50 w-full mb-2' type="button" onClick={handleLogin}>SignIn</Button>
              
              <GoogleLogin 
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
    handleGoogleLogin(credentialResponse)
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>

              <p className='mt-3 text-center' style={{color:"#6a6a6a",fontSize:"14px"}}>Don't have an account ? <a href="/register" style={{ textDecoration: "underline",color:"#0b6a67" }}>Sign Up</a></p></div>
              
            }
          </form>
        </div>
      </div>
      <ToastContainer
position="top-center"
autoClose={4000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}

/>
    </div>
  )
}

export default Auth
