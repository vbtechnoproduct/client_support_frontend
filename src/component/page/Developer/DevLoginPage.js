import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { devLogin } from "../../redux/devSlice/devAuthSlice";
import Input from "../../extras/Input";
import Button from '../../extras/Button'
import { useNavigate } from 'react-router-dom';

export default function DevLoginPage() {
  const [pin, setPin] = useState("");
  const [name, setName] = useState("")
  const [error, setError] = useState({
    name: "",
    pin: "",
  });
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuth = useSelector((state) => state.devAuth.isAuthDev);

  // useEffect(() => {
  //   isAuth && navigate("/dev/dashboard");
  // }, [isAuth]);

  const submit = async () => {
    if (!pin || !name) {
      let error = {};
      if (!name) error.name = "Name is required";
      if (!pin) error.pin = "Pin is required";
      return setError(error);
    } else {
      const payload = {
        pin: pin,
      };

      dispatch(devLogin(payload))
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
      <div className='bg-login'>
      </div>
      <div className='login-form'>
        <h6>Dev Login</h6>
        <form>
          <div className='mb-3'>
            <Input
              type={`text`}
              name={`name`}
              value={name}
              label={`Name`}
              placeholder={`Name`}
              errorMessage={error.name && error.name}
              onChange={(e) => {
                setName(e.target.value);
                if (!e.target.value) {
                  return setError({
                    ...error,
                    name: `Name is Required`,
                  });
                } else {
                  return setError({
                    ...error,
                    name: "",
                  });
                }
              }}
            />
          </div>
          <div className='mb-3'>
            <Input
              type={`number`}
              name={`pin`}
              value={pin}
              label={`Pin`}
              placeholder={`Pin`}
              errorMessage={error.pin && error.pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (!e.target.value) {
                  return setError({
                    ...error,
                    pin: `Pin is Required`,
                  });
                } else {
                  return setError({
                    ...error,
                    pin: "",
                  });
                }
              }}
            />
          </div>
          {/* <h4>Forgot Your Password?</h4> */}
          <Button
            text={"Login"}
            className={"w-100"}
            type={"button"}
            onKeyPress={handleKeyPressInput}
            onClick={submit}
          />
        </form>
      </div>
    </div >
  )
}
