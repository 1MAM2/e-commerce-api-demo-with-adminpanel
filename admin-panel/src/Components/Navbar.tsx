import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const { accessToken } = useAuth();
  let role;
  if (accessToken != null) {
    const decode: any = jwtDecode(accessToken!);
    role =
      decode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    console.log(role);
  }

  return (
    <nav className="bg-blue-900  text-white">
      <div className="flex justify-between items-center h-[80px] px-[25px] xl:text-4xl xl:h-[80px]">
        <div className="w-[200px] h-[100px] flex items-center ">
          <Link to={"/"} aria-label="Home Page">
            Home
          </Link>
        </div>
        <ul className="flex text-2xl sm:text-5xl justify-between items-center gap-[20px] xl:text-5xl">
          {role == "Admin" && (
            <Link to={"/admin-panel"} aria-label="Admin page">
              <li className="hover:text-sky-500 transition-all duration-300 bg-green-600 h-16 text-center w-md text-4xl flex justify-center items-center hover:bg-green-800">
                Admin Panel
              </li>
            </Link>
          )}

          <li className="text-2xl sm:text-4xl hover:text-sky-300 transition-all duration-300 xl:text-5xl">
            <div>
              <Link to={"/account"} aria-label="Account">
                <FaUserCircle />
              </Link>
            </div>
          </li>

          <li className="text-2xl sm:text-4xl hover:text-sky-300 transition-all duration-300 relative xl:text-5xl"></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
