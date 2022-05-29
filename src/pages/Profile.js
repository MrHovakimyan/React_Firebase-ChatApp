import React, { useState } from "react";
import Camera from "../components/svg/Camera";
import Img from "../media/minion01.png";

const Profile = () => {
  const [img, setImg] = useState("");
  console.log(img);
  return (
    <section>
      <div className="profile_container">
        <div className="img_container">
          <img src={Img} alt="Avatar" />
          <div className="overlay">
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="photo"
                onChange={(evn) => setImg(evn.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="text_container">
          <h3>User Name</h3>
          <p>User Email</p>
          <hr />
          <small>Joined on ...</small>
        </div>
      </div>
    </section>
  );
};

export default Profile;
