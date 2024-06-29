import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FaInfoCircle } from "react-icons/fa";
import { login } from "../../redux/slice/authSlice";
import Input from "../../extras/Input";
import Button from '../../extras/Button'
import LoginBg from '../../../assets/images/loginBg.png'
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuth = useSelector((state) => state.auth.isAuth);

  useEffect(() => {
    isAuth && navigate("/admin/dashboard");
  }, [isAuth, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      let error = {};
      if (!email) error.email = "Email is required";
      if (!password) error.password = "Password is required";
      return setError(error);
    } else {
      const loginData = {
        email:email?.trim(),
        password:password,
      };

      dispatch(login(loginData))
    }
  };


  const handleKeyPressInput = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className='loginPage'>
      {/* <div className='bg-login'>
      </div>
      <div className='login-form'>
        <h6>Admin Login</h6>
        <form className='w-100'>
          <div className='mb-3'>
            <Input
              type={`text`}
              id={`email`}
              name={`email`}
              label={`Email`}
              value={email}
              placeholder={`Email`}
              errorMessage={error.email && error.email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (!e.target.value) {
                  return setError({
                    ...error,
                    email: `Email Id is Required`,
                  });
                } else {
                  return setError({
                    ...error,
                    email: "",
                  });
                }
              }}
            />
          </div>
          <div className='mb-3'>
            <Input
              type={`password`}
              id={`password`}
              name={`password`}
              value={password}
              label={`Password`}
              placeholder={`Password`}
              errorMessage={error.password && error.password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (!e.target.value) {
                  return setError({
                    ...error,
                    password: `Password is Required`,
                  });
                } else {
                  return setError({
                    ...error,
                    password: "",
                  });
                }
              }}
            />
          </div>
          <h4>Forgot Your Password?</h4>
          <Button
            text={"Login"}
            className={"w-100"}
            type={"submit"}
            onKeyPress={handleKeyPressInput}
            onClick={submit}
          />
        </form>
      </div> */}
      <div className='row' style={{alignItems:"center"}}>
        <div className='col-12 col-sm-6 loginImg'>
          <div className='loginBgImg'>
          <img src={LoginBg} />
          </div>
        </div>
        <div className='col-12 col-sm-6 showFrom'>
          <div className='loginFormShow'>
            <h6 className='loginTitle'>Sign Up to Ticket Support Admin</h6>
            <div className='demoLoginBox'>
              <FaInfoCircle />
              <h6>Use email : <span>demo@ticketsupport.com</span> / password :<span>123456</span></h6>
            </div>
            <form className='w-100'>
          <div className='mb-3'>
            <Input
              type={`text`}
              id={`email`}
              name={`email`}
              label={`Email`}
              value={email}
              placeholder={`Email`}
              errorMessage={error.email && error.email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (!e.target.value) {
                  return setError({
                    ...error,
                    email: `Email Id is Required`,
                  });
                } else {
                  return setError({
                    ...error,
                    email: "",
                  });
                }
              }}
            />
          </div>
          <div className='mb-3'>
            <Input
              type={`password`}
              id={`password`}
              name={`password`}
              value={password}
              label={`Password`}
              placeholder={`Password`}
              errorMessage={error.password && error.password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (!e.target.value) {
                  return setError({
                    ...error,
                    password: `Password is Required`,
                  });
                } else {
                  return setError({
                    ...error,
                    password: "",
                  });
                }
              }}
            />
          </div>
          <Button
            text={"Login"}
            className={"w-100"}
            type={"submit"}
            onKeyPress={handleKeyPressInput}
            onClick={submit}
          />
        </form>
          </div>
        </div>

      </div>
    </div >
  )
}
