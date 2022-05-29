import React, { useState, useEffect } from "react";
import Camera from "../components/svg/Camera";
import DefaultImg from "../media/DefaultAvatar.png";
import { storage, db, auth } from "../firebase";
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import DeleteIcon from "../components/svg/DeleteIcon";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [img, setImg] = useState("");
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    //clearing/getting all available users doc from fireStore
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      // and if docs available, then setting the state
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });
    // Uploading Image
    if (img) {
      const uploadImg = async () => {
        // creating an image reference
        const imgRef = ref(storage, `avatar/${new Date().getTime()} - ${img.name}`);
        try {
          // checking (and if there any) deleting photo before uploading new one
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          // uploading image and getting downloadUrl from firebaseStorage
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
          // updating "user" collection in fireStore and setting avatar&avatarPath to above created url&snap
          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });
          // resetting state once all done
          setImg("");
        } catch (err) {
          console.log(err.message);
        }
      };
      uploadImg();
    }
  }, [img]);

  const deleteImage = async () => {
    try {
      const confirm = window.confirm("Delete avatar ?");
      if (confirm) {
        // deleting image
        await deleteObject(ref(storage, user.avatarPath));
        // resetting avatar: and avatarPath: to an empty string in fireStore Database
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        });
        navigate("/");
      }
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };

  return user ? (
    <section>
      <div className="profile_container">
        <div className="img_container">
          <img src={user.avatar || DefaultImg} alt="Avatar" />
          <div className="overlay">
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              {user.avatar ? <DeleteIcon deleteImage={deleteImage} /> : null}
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
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <hr />
          <small>Joined on: {user.createdAt.toDate().toDateString()}</small>
        </div>
      </div>
    </section>
  ) : null;
};

export default Profile;
