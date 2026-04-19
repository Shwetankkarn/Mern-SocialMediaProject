import RegisterUserForm from "../components/AuthPageComponent/RegisterUserForm"

const RegisterPage = () => {
  return (
    <div className="bg-[#000000] h-screen flex flex-col items-center gap-10 overflow-hidden md:gap-10">
      <div className="flex flex-col items-center  md:gap-5 md:pt-12">
        
        <h1 className="text-2xl md:text-5xl text-[#FFAF61] font-bold">
          Welcome To KosmosConnect
        </h1>

        <p className="text-white text-sm md:text-3xl">
          A place to flex your Creation
        </p>

      </div>

      <div className="flex flex-col md:w-1/2 md:p-4 rounded-2xl shadow-2xl shadow-gray-800">
        <h1 className="text-white text-xl md:mb-4">Create Your Account</h1>
        <RegisterUserForm/>
      </div>
    </div> 
  )
}

export default RegisterPage