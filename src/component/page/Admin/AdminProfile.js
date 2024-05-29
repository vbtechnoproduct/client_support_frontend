/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Title from "../../extras/Title";
import { useDispatch, useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { AiFillCamera } from "react-icons/ai";
import { MdPassword } from "react-icons/md";
import { getAdmin, updateAdmin, updateAdminPassword } from "../../redux/slice/authSlice";
import Button from "../../extras/Button";
import Male from "../../../assets/images/AvtarImg.png";
import Input from "../../extras/Input";

export const AdminProfile = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [toggle, setToggle] = useState(false)

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [data, setData] = useState({});

  const { admin } = useSelector((state) => state.auth);

  const getToken = sessionStorage.getItem("token")

  useEffect(() => {
    // 
    dispatch(getAdmin())
  }, [])

  // const { data: adminData, isError, refetch } = useQuery({
  //   queryKey: ['adminProfile'],
  //   queryFn: () => adminProfile(),
  //   config: {
  //     refetchOnWindowFocus: false,
  //     onSuccess: (data) => {
  //       setData(data?.admin);
  //     },
  //   },
  // });

  useEffect(() => {
    setData(admin);
    sessionStorage.setItem("admin", JSON.stringify(admin))
  }, [admin]);

  useEffect(() => {
    setName(data?.name);
    setEmail(data?.email);
    setImagePath(data?.image);
    setError({ name: "", email: "" });
  }, [data]);


  const handleUploadImage = (e) => {
    setImage(e.target.files[0]);
    setImagePath(URL.createObjectURL(e.target.files[0]));
    setError((prevErrors) => ({
      ...prevErrors,
      image: "",
    }));
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    const payload = {
      data: formData
    }
    dispatch(updateAdmin(payload))
  };

  const handleChangePassword = () => {
    // if (!hasPermission) return permissionError();
    if (
      !newPassword ||
      !confirmPassword ||
      newPassword !== confirmPassword ||
      !oldPassword
    ) {
      let error = {};
      if (!newPassword) error.newPassword = "New password is required !";
      if (!confirmPassword)
        error.confirmPassword = "Confirm password Is required !";
      if (newPassword !== confirmPassword)
        error.confirmPassword =
          "New password and confirm password doesn't match";
      if (!oldPassword) error.oldPassword = "Old password is required !";
      return setError({ ...error });
    } else {
      let data = {
        oldPass: oldPassword,
        confirmPass: confirmPassword,
        newPass: newPassword,
        token: getToken
      };
      const payload = {
        data: data
      }
      dispatch(updateAdminPassword(payload));
    }
  };

  const handleEditName = () => {
    // if (!hasPermission) return permissionError();
    if (!imagePath || !name || !email) {

      let error = {}
      if (!email) error.email = "Email is required"
      if (!name) error.name = "name is required"
      if (!image || imagePath?.length < 0) error.image = "image is required"
    } else {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("email", email);
      const payload = {
        data: formData
      }
      dispatch(updateAdmin(payload))
    }
  };

  const handlePrevious = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="mainAdminProfile">
      <Title name="Admin Profile" />
      <div class="d-lg-flex d-md-block">
        <div className="col-12 col-sm-12 col-md-12 col-lg-3 mt-4 me-4">
          <div className="card" style={{ minHeight: "500px" }}>
            <div className="card-body">
              <div className="position-relative">
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={(e) => handleUploadImage(e)}
                />
                <img
                  src={imagePath ? imagePath : Male}
                  alt="admin"
                  className="mx-auto p-1 border "
                  onError={(e) => {
                    e.target.src = Male;
                  }}
                  style={{
                    width: 180,
                    height: 180,
                    objectFit: "cover",
                    display: "block",
                    borderRadius: "50%",
                  }}
                  onClick={() => handlePrevious(imagePath)}
                />
                {error?.image && <p className="errorMessage text-danger text-capitalize">{error?.image}</p>}
                <div
                  className="position-absolute"
                  style={{ bottom: "-2%", right: "45%" }}
                >
                  <div className="bg-theme"
                    style={{
                      // background: "rgb(31, 28, 48)",
                      borderRadius: 50,
                      height: 29,
                    }}
                  >
                    <label className="imgUploadProfile" htmlFor="file-input">
                      <AiFillCamera
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="text-center my-4 pb-4 border-bottom ">
                <h2 className="text-capitalize">{data?.name}</h2>
                <div className="mt-4">
                  <Button
                    onClick={handleEditName}
                    className={`text-end btn bg-theme text-white ml-2`}
                    text={`Upload Image`}
                  />
                </div>
              </div>
              <div>
                <ul style={{ listStyle: "none", fontSize: 15, paddingLeft: 10 }}>
                  <li
                    className="mt-2 user cursor-pointer userEdit"
                    onClick={() => setToggle(false)}
                  >
                    <FaRegEdit />
                    <span className="ps-2">Edit Profile</span>
                  </li>
                  <li
                    className="mt-2 user cursor-pointer"
                    onClick={() => setToggle(true)}
                  >
                    <MdPassword />
                    <span className="ps-2">Change Password</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xxl-6 mt-4">
          <div className="row">
            <div className="col-12">
              <div className="card" style={{ height: 500 }}>
                {toggle ? (
                  <div className="card-body">
                    <h4 className="profile_box pb-2 my-3 text-center head-bg">
                      Password Settings
                    </h4>
                    <div className="col-sm-12 col-md-12 col-lg-7 col-xl-7 col-xxl-7 mx-auto">
                      <div className='mb-3'>
                        <Input
                          type={`text`}
                          id={`oldPassword`}
                          name={`oldPassword`}
                          value={oldPassword}
                          label={`Old password`}
                          placeholder={`Old password`}
                          errorMessage={error.oldPassword && error.oldPassword}
                          onChange={(e) => {
                            setOldPassword(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                oldPassword: `Old password is Required`,
                              });
                            } else {
                              return setError({
                                ...error,
                                oldPassword: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className='mb-3'>
                        <Input
                          type={`text`}
                          id={`newPassword`}
                          name={`newPassword`}
                          value={newPassword}
                          label={`New password`}
                          placeholder={`New password`}
                          errorMessage={error.newPassword && error.newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                newPassword: `New password is Required`,
                              });
                            } else {
                              return setError({
                                ...error,
                                newPassword: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className='mb-3'>
                        <Input
                          type={`text`}
                          id={`confirmPassword`}
                          name={`confirmPassword`}
                          value={confirmPassword}
                          label={`Confirm Password`}
                          placeholder={`Confirm Password`}
                          errorMessage={error.confirmPassword && error.confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                confirmPassword: `Confirm Password is Required`,
                              });
                            } else {
                              return setError({
                                ...error,
                                confirmPassword: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="d-flex justify-content-end">
                        <Button
                          className={"submitButton"}
                          text={`Submit`}
                          type={"button"}
                          onClick={handleChangePassword}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card-body">
                    <h4 className=" profile_box pb-2 my-3 text-center head-bg">
                      Edit Profile
                    </h4>
                    <div className="col-sm-12 col-md-12 col-lg-7 col-xl-7 col-xxl-7 mx-auto my-5">
                      <div className='mb-3'>
                        <Input
                          type={`text`}
                          id={`name`}
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
                          type={`text`}
                          id={`email`}
                          name={`email`}
                          value={email}
                          label={`Email`}
                          placeholder={`Email`}
                          errorMessage={error.email && error.email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (!e.target.value) {
                              return setError({
                                ...error,
                                email: `Email is Required`,
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
                      <div className="d-flex justify-content-end mt-2">
                        <Button
                          className={"submitButton"}
                          text={`Submit`}
                          type={"button"}
                          onClick={handleEditName}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-0 col-sm-0 col-md-0 col-lg-3 mt-4 me-4"></div>
      </div>
    </div>
  );
};

{
  /* <div className="adminProfileBox col-md-6 col-lg-4">
      <form onSubmit={handleSubmit} id="bannerForm"> 
        <div className="adminImg  midBox position-relative">
          <Input
            type={`file`}
            id={`file-input`}
            name={`image`}
            errorMessage={`Enter Image`}
            className={`d-none`}
          />
          <input type="file" name="admin-img" id="file-input" className="d-none"/>
          <div
            className="position-absolute"
            style={{ bottom: "11%", right: "47%" }}
          >
            <div
              className=""
              style={{ backgroundColor: "#0f7085", borderRadius: "50%" }}
            >
              <label for="file-input">
                <i
                  className="fa-solid fa-camera camera"
                  style={{
                    fontSize: "15px",
                    color: "rgb(255, 255, 255)",
                    cursor: "pointer",
                    marginRight: "3px",
                  }}
                ></i>
              </label>
            </div>
          </div>
        </div>
        <Button
          className={"bg-theme text-white mx-auto m10-top d-flex"}
          text={"Upload Profile Image"}
          onClick={handleUpload}
          disabled={!selectedImage}
        />
        </form>
        <div className="admminData">
          <div className="d-flex">
            <div className="adminKey mx-auto m15-top fs-25 fw-700">
              {data?.name}
            </div>
          </div>
        </div>
      </div> */
}
