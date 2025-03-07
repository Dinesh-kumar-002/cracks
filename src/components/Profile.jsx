import React from "react";
import { GrLinkPrevious } from "react-icons/gr";
import profileToggle from "../store/profileToggle.js";

function Profile() {
    const {profileStatus,toggleProfileStatus}= profileToggle();
  return (
    <div>
      <div
        className="p-5 fixed top-16 right-0 h-full bg-black z-9"
        style={{ display: profileStatus ? "block" : "none" }}
      >
      
      <div className="flex justify-between mb-2">
        <button onClick={toggleProfileStatus}>
          <GrLinkPrevious />
        </button>
        <h1 className="text-[20px] mb-5">Login</h1>
      </div>

      </div>
    </div>
  );
}

export default Profile;
