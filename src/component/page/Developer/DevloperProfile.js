/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Title from "../../extras/Title";
import { useDispatch, useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { AiFillCamera } from "react-icons/ai";
import { MdPassword } from "react-icons/md";
import { getDev, updateDeveloperDev } from "../../redux/devSlice/devAuthSlice";
import Button from "../../extras/Button";
import Male from "../../../assets/images/AvtarImg.png";
import Input from "../../extras/Input";

export const DevloperProfile = () => {
  const dispatch = useDispatch();

  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [data, setData] = useState({});

  const { devLogin } = useSelector((state) => state.devAuth);
  const getDevId = JSON.parse(sessionStorage.getItem("devDetails"))

  useEffect(() => {
    dispatch(getDev(getDevId?._id))
  }, [])
  // const { data: adminData, isError, refetch } = useQuery({
  //   queryKey: ['DevloperProfile'],
  //   queryFn: () => adminProfile(),
  //   config: {
  //     refetchOnWindowFocus: false,
  //     onSuccess: (data) => {
  //       setData(data?.admin);
  //     },
  //   },
  // });

  useEffect(() => {
    setData(devLogin);
    if (devLogin && Object?.values(devLogin)?.length > 0) {
      sessionStorage.setItem("devDetails", JSON.stringify(devLogin))
    }
  }, [devLogin]);

  useEffect(() => {
    setName(data?.name);
    setImagePath(data?.image);
    setPin(data?.pin)
    setError({ name: "" });
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
      data: formData,
      id: devLogin?._id,
      shoTost:true

    }
    dispatch(updateDeveloperDev(payload))
  };

  const handleEditName = () => {
    // if (!hasPermission) return permissionError();
    if (!name) {

      let error = {}
      if (!name) error.name = "name is required"
    } else {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      const payload = {
        data: formData,
        id: devLogin?._id
      }
      dispatch(updateDeveloperDev(payload))
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
          <div className="card" style={{ minHeight: "350px" }}>
            <div className="card-body justify-content-center d-flex align-items-center">
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
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xxl-6 mt-4">
          <div className="row">
            <div className="col-12">
              <div className="card" style={{ height: "350px" }}>
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
                        id={`pin`}
                        disabled={true}
                        name={`pin`}
                        value={pin}
                        label={`Pin`}
                        placeholder={`Pin`}
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
              </div>
            </div>
          </div>
        </div>
        <div className="col-0 col-md-0 col-lg-3 col-xxl-3 mt-4"></div>
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
