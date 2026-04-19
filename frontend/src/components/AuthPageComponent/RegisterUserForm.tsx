import { Link } from "react-router-dom";

const RegisterUserForm = () => {
    return (
    <form className="text-[#9929EA] flex flex-col md:gap-3 md:text-sm">
        <div className="flex flex-col md: gap-2">
             <label className="text-[#9929EA]">Username</label>
             <input type="text" placeholder="create your username" 
             className= "text-white md:p-2 border rounded-xl" 
             />
        </div>

          <div className="flex flex-col md: gap-2">
             <label className="text-[#9929EA]">Email</label>
             <input type="text" placeholder="enter your Email" 
             className= "text-white md:p-2 border rounded-xl" 
             />
        </div>

         <div className="flex flex-col md: gap-2">
             <label className="text-[#9929EA]">Password</label>
             <input type="text" placeholder="create your password" 
             className= "text-white md:p-2 border rounded-xl" 
             />
        </div>
        
         <div className="flex flex-col md: gap-2">
             <label className="text-[#9929EA]">Profile Picture</label>
             <input type="file"
             className= "text-white md:p-2 border rounded-xl hover:bg-[#2a2929]" 
             />
        </div>

             <Link to="/login" className="text-[#9929EA]">
            Already have an account?
            </Link>

        <button className="bg-[#b76eef] font-bold text-[#2b0347] md:py-2 rounded-xl hover:bg-[#858386] cursor-pointer ease-in-out dura">
            Register
            </button>
        
    </form>
    )
};

export default RegisterUserForm;