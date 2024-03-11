import { FormEvent, useEffect, useState } from "react";
import { FaCubes } from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { signupThunk } from "../features/auth/authApi";
import { hideError, showError } from "../features/auth/authSlice";
import { clearState } from "../features/question/questionSlice";
import { Spinner } from "../components/Spinner";

const SignUp = () => {
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(hideError());
      }, 4000);
    }
  }, [error]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ([username, email, password].includes("")) {
      return dispatch(showError("All fields are required"));
    }
    dispatch(clearState());
    dispatch(
      signupThunk({
        username,
        email,
        password,
      })
    );
  };

  if (loading) return <Spinner />;
  if (user) return <Navigate to="/" />;
  return (
    <div>
      <main className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Link to="/">
            <FaCubes size={45} className="mx-auto mb-10 text-orange-400" />
          </Link>
          <form
            onSubmit={handleSubmit}
            className="bg-white w-3/4 sm:w-72 mx-auto p-8 rounded-lg shadow-lg "
          >
            <div className="flex flex-col py-1">
              <label htmlFor="findBy" className="p-1 font-semibold">
                Username
              </label>
              <input
                className="p-1 border rounded"
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col py-1">
              <label htmlFor="email" className="p-1 font-semibold">
                Email
              </label>
              <input
                className="p-1 border rounded"
                type="text"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col py-1">
              <label htmlFor="password" className="p-1 font-semibold">
                Password
              </label>
              <input
                className="p-1 border rounded"
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 py-1 rounded mt-2 text-white hover:bg-blue-600 transition-colors "
              disabled={loading}
            >
              Sign Up
            </button>
            {error && (
              <div className="text-center">
                <p className="text-sm text-red-700 font-bold py-5">{error}</p>
              </div>
            )}
          </form>
          <p className="text-sm mt-7">
            Already have an account?{" "}
            <span>
              <Link to="/login" className="text-blue-500 hover:underline">
                Log in
              </Link>
            </span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
