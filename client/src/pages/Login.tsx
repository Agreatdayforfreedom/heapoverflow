import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginThunk } from "../features/auth/authApi";
import { hideError, showError } from "../features/auth/authSlice";
import { FaCubes } from "react-icons/fa";
import { clearState } from "../features/question/questionSlice";
import { Spinner } from "../components/Spinner";

const Login = () => {
  const [findBy, setFindBy] = useState("");
  const [password, setPassword] = useState("");
  const { loading, user, error } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(hideError());
      }, 4000);
    }
  }, [error]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ([password, findBy].includes("")) {
      return dispatch(showError("all fields are required"));
    }
    //clear question state to prevent homepage flickering
    dispatch(clearState());

    dispatch(loginThunk({ findBy, password }));
  };
  if (loading) return <Spinner />;
  if (user) return <Navigate to="/" />;
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <Link to="/">
          <FaCubes size={45} className="mb-10 text-orange-400" />
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-white w-3/4 sm:w-72 mx-auto p-8 rounded-lg shadow-lg "
        >
          <div className="flex flex-col py-1">
            <label htmlFor="findBy" className="p-1 font-semibold">
              Email/username
            </label>
            <input
              className="p-1 border rounded"
              type="text"
              name="findBy"
              id="findBy"
              value={findBy}
              onChange={(e) => setFindBy(e.target.value)}
            />
          </div>
          <div className="flex flex-col py-1">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="p-1 font-semibold">
                Password
              </label>

              <Link
                to="#"
                className="text-sm text-blue-400 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>
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
            Log in
          </button>
          {error && (
            <div className="text-center">
              <p className="text-sm text-red-700 font-bold py-5">{error}</p>
            </div>
          )}
        </form>
        <p className="text-sm mt-7">
          Don’t have an account?{" "}
          <span>
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </span>
        </p>
      </div>
    </main>
  );
};

export default Login;
