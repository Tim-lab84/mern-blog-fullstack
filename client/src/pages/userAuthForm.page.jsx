import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { AnimatePresence } from "framer-motion";
import { useContext, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { userContext } from "../App";
import { authWithGoogle } from "../common/firebase";
import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";

const UserAuthForm = ({ type }) => {
  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(userContext);

  const userAuthThroughServer = (serverRoute, formData) => {
    const URL = import.meta.env.VITE_SERVER_DOMAIN + serverRoute;
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        //console.log(data);
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch((error) => {
        console.log("Response error", error);
        if (error?.response?.data?.error)
          toast.error(error.response.data.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type == "sign-in" ? "/signin" : "/signup";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
    //formData
    let form = new FormData(formElement);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    //form validation
    let { fullname, email, password } = formData;
    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Fullname must be at least 3 letters long");
      }
    }

    if (!email.length) {
      return toast.error("Enter Email");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 to 20 characters long and contain a numeric, 1 uppercase and 1 lowercase letter"
      );
    }
    userAuthThroughServer(serverRoute, formData);
    //console.log(formData);
  };

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        let serverRoute = "/google-auth";
        let formData = {
          access_token: user.accessToken,
        };
        userAuthThroughServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error("trouble logging in through Google");
        return console.log(err);
      });
  };
  /* 
  const handleGoogleAuth = (e) => {
    e.preventDefault();
  
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
  
    signInWithRedirect(auth, provider)
      .catch((err) => {
        toast.error("Trouble logging in through Google");
        console.error(err);
      });
  }; */

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimatePresence>
      <AnimationWrapper keyValue={type}>
        <section className="h-cover flex items-center justify-center">
          <Toaster />
          <form id="formElement" className="w-[80%] max-w-[400px] ">
            <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
              {type == "sign-in" ? "Welcome back" : "Join us today"}
            </h1>

            {type != "sign-in" ? (
              <InputBox
                name="fullname"
                type="text"
                placeholder="Full Name"
                icon="fi-rr-user"
              />
            ) : (
              ""
            )}
            <InputBox
              name="email"
              type="email"
              placeholder="Email"
              icon="fi-rr-envelope"
            />
            <InputBox
              name="password"
              type="password"
              placeholder="Password"
              icon="fi-rr-key"
            />

            <button
              className="btn-dark center mt-14"
              type="submit"
              onClick={handleSubmit}
            >
              {type.replace("-", " ")}
            </button>
            <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black first-line:font-bold">
              <hr className="w-1/2 border-black" />
              <p>or</p>
              <hr className="w-1/2 border-black" />
            </div>

            <button
              className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
              onClick={handleGoogleAuth}
            >
              <img src={googleIcon} className="w-5" />
              continue with Google
            </button>

            {type == "sign-in" ? (
              <p className="mt-6 text-dark-grey text-xl text-center">
                Don't have an account ?
                <Link
                  to="/signup"
                  className="underline text-black text-xl ml-1"
                >
                  Join us today
                </Link>
              </p>
            ) : (
              <p className="mt-6 text-dark-grey text-xl text-center">
                Already a member?
                <Link
                  to="/signin"
                  className="underline text-black text-xl ml-1"
                >
                  Sign in here
                </Link>
              </p>
            )}
          </form>
        </section>
      </AnimationWrapper>
    </AnimatePresence>
  );
};

export default UserAuthForm;
