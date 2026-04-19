import { Link } from "react-router-dom";

const LoginUserForm = () => {
    return (
    <form className="text-[#9929EA] flex flex-col md:gap-3 md:text-sm">
        <div className="flex flex-col md: gap-2">
             <label className="text-[#9929EA]">Username</label>
             <input type="text" placeholder="create your username" 
             className= "text-white md:p-2 border rounded-xl" 
             />
        </div>


         <div className="flex flex-col md: gap-2">
             <label className="text-[#9929EA]">Password</label>
             <input type="text" placeholder="create your password" 
             className= "text-white md:p-2 border rounded-xl" 
             />
        </div>
        
          <Link to="/register" className="text-[#9929EA]">
             Don't have an account?
            </Link>

        <button className="bg-[#b76eef] font-bold text-[#2b0347] md:py-2 rounded-xl hover:bg-[#858386] cursor-pointer ease-in-out dura">
            Login
            </button>
        
    </form>
    )
};

export default LoginUserForm;