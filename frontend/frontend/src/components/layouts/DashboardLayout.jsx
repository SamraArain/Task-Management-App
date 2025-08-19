import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({children, activeMenu}) => {
    const { user } = useContext(UserContext);

    // if(loading) {
    //   return <div className="p-6">Loading dashboard...</div>
    // }

    if (!user) {
      return <div className="p-6">User not authenticated</div>;
    }

  return (
   <div>
    <Navbar activeMenu={activeMenu} />


        <div className="flex">
            <div className="max-[1080px]:hidden">
                <SideMenu activeMenu={activeMenu} />
            </div>
            <div className="flex-1 px-6 py-4">{children}</div>
   </div>
    </div>
  );
};
export default DashboardLayout;