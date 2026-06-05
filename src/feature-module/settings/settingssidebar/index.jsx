import React, { useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { all_routes } from "../../../Router/all_routes";
import { Link, useLocation } from "react-router-dom";
import { Smartphone } from "feather-icons-react/build/IconComponents";

const SettingsSideBar = (props) => {
  const route = all_routes;
  const location = useLocation();
  const [isAppSettingsOpen, setIsAppSettingsOpen] = useState(true);

  const toggleAppSettings = () => {
    setIsAppSettingsOpen((prev) => !prev);
  };

  return (
    <div>
      <div
        className="sidebars settings-sidebar theiaStickySidebar"
        id="sidebar2"
      >
        <div className="sidebar-inner slimscroll">
          <Scrollbars
            style={{ width: 255, height: 800 }}
            autoHide
            autoHeight
            autoHeightMin={400}
            {...props}
          >
            <div id="sidebar-menu5" className="sidebar-menu">
              <ul>
                <li className="submenu-open">
                  <ul>
                    <li
                      className={`submenu${
                        isAppSettingsOpen ? " active subdrop" : ""
                      }`}
                    >
                      <Link to="#" onClick={toggleAppSettings}>
                        <Smartphone />
                        <span>App Settings</span>
                        <span className="menu-arrow" />
                      </Link>
                      <ul>
                        <li>
                          <Link
                            to={route.invoicesettings}
                            className={
                              location.pathname === route.invoicesettings
                                ? "active"
                                : ""
                            }
                          >
                            Invoice
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={route.printersettings}
                            className={
                              location.pathname === route.printersettings
                                ? "active"
                                : ""
                            }
                          >
                            Printer
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </Scrollbars>
        </div>
      </div>
    </div>
  );
};

export default SettingsSideBar;
