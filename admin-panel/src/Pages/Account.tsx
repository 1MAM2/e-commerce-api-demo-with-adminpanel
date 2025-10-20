import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { UserRegisterDTO } from "../types/UserTypes/UserRegisterDTO";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
const Account = () => {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isHaveAnAccount, setIsHaveAnAccount] = useState(true);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const req = {
        UserName: userName.trim(),
        Password: password.trim(),
      };
      const res = await login(req);
      if (res == false) {
        setLoading(false);
        return toast.error("Password or UserName wrong!!!!!");
      } else {
        setLoading(false);
        toast.success("Welcome back!!!!");
        return navigate("/");
      }
    } catch (err) {
      toast.error("Password or UserName wrong!!!!!");
      setLoading(false);
    } finally {
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userName == null || userName.length < 3) {
        toast.error("Username must be at least 3 characters long!");
        return;
      }
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        toast.error("Please enter a valid email address!");
        return;
      }
      if (!password || password.length < 6) {
        toast.error("Password must be at least 6 characters long!");
        return;
      }
      if (!address || address.length < 10) {
        toast.error("Address must be at least 10 characters long!");
        return;
      }
       if (!phoneNumber || phoneNumber.length < 11) {
        toast.error("phoneNumber must be at least 11 characters long!");
        return;
      }
      const req: UserRegisterDTO = {
        UserName: userName,
        Password: password,
        Role: "Customer",
        Email: email,
        Address: address,
        PhoneNumber:phoneNumber,
      };
      await register(req);

      toast.success("Your account has been successfully created!");
      navigate("/");
      setUserName("");
      setAddress("");
      setPassword("");
      setEmail("");
      setPhoneNumber("");
      setIsHaveAnAccount(true);
    } catch (error) {
      console.error("Register hatası:", error);
      toast.error("An error occurred during registration");
    }
  };

  return (
    <div className="h-[70vh] flex items-center justify-center">
      <div>
        {loading ? (
          <Loading />
        ) : isHaveAnAccount ? (
          <div>
            <div className="login bg-blue-900 m-4 p-4 rounded-4xl max-w-sm w-full text-white">
              <h2 className="text-center text-4xl">Login</h2>
              <form
                action=""
                method="post"
                className=""
                onSubmit={handleSubmit}
              >
                <div className="flex justify-center items-center flex-col">
                  <div className="my-4">
                    <label
                      htmlFor="userName"
                      className="block w-full text-xl my-2"
                    >
                      User name:
                    </label>
                    <input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      id="userName"
                      className="block w-full text-xl border-2 p-3 rounded-2xl border-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-800 focus:outline-none"
                      type="text"
                      placeholder="User name"
                    />
                  </div>
                  <div className="my-4">
                    <label
                      htmlFor="password"
                      className="block w-full text-xl my-2"
                    >
                      Password:
                    </label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      className="block w-full text-xl border-2 p-3 rounded-2xl border-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-800 focus:outline-none"
                      type="password"
                      placeholder="Password"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <button className="w-36 p-2 my-4 bg-cyan-500 rounded-xl hover:bg-cyan-600 active:bg-cyan-700 transition">
                      Login
                    </button>
                    <button
                      onClick={() => setIsHaveAnAccount(false)}
                      className="w-36 p-2 my-4 bg-cyan-500 rounded-xl hover:bg-cyan-600 active:bg-cyan-700 transition"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div>
            {loading ? (
              <Loading />
            ) : (
              <div className="register bg-blue-900 m-4 p-4 rounded-4xl max-w-sm w-full text-white">
                <h2 className="text-center text-4xl">Register</h2>
                <form
                  action=""
                  method="post"
                  className=""
                  onSubmit={handleRegister}
                >
                  <div className="flex justify-center items-center flex-col">
                    <div className="my-4">
                      <label
                        htmlFor="userName"
                        className="block w-full text-xl my-2"
                      >
                        User name:
                      </label>
                      <input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        id="userName"
                        className="block w-full text-xl border-2 p-3 rounded-2xl border-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-800 focus:outline-none"
                        type="text"
                        placeholder="User name"
                      />
                    </div>
                    <div className="my-4">
                      <label
                        htmlFor="email"
                        className="block w-full text-xl my-2"
                      >
                        Email:
                      </label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        className="block w-full text-xl border-2 p-3 rounded-2xl border-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-800 focus:outline-none"
                        type="text"
                        placeholder="Email"
                      />
                    </div>
                    <div className="my-4">
                      <label
                        htmlFor="address"
                        className="block w-full text-xl my-2"
                      >
                        Address:
                      </label>
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        id="address"
                        className="block w-full text-xl border-2 p-3 rounded-2xl border-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-800 focus:outline-none"
                        type="text"
                        placeholder="address"
                      />
                    </div>
                    <div className="my-4">
                      <label
                        htmlFor="password"
                        className="block w-full text-xl my-2"
                      >
                        Password:
                      </label>
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        className="block w-full text-xl border-2 p-3 rounded-2xl border-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-800 focus:outline-none"
                        type="password"
                        placeholder="Password"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <button className="w-36 p-2 my-4 bg-cyan-500 rounded-xl hover:bg-cyan-600 active:bg-cyan-700 transition">
                        Register
                      </button>

                      <button
                        onClick={() => setIsHaveAnAccount(true)}
                        className="w-36 p-2 my-4 bg-cyan-500 rounded-xl hover:bg-cyan-600 active:bg-cyan-700 transition"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Account;
