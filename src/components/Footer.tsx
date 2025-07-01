import React from "react";
import snoozie from "../assets/snoozie.jpeg";

const Footer: React.FC = () => {
  return (
    <footer>
      <img
        src={snoozie}
        alt="snoozie"
        style={{ height: "69px", width: "69px"}}
      />
      <p>Have Fun || Burn SHT</p>
    </footer>
  );
};

export default Footer;
