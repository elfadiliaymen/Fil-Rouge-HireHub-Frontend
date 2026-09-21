import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import { getRole } from "./token";
import { getMenu } from "../config/roles";
import "./NavBar.css";

const NAV_ICONS = {
  "/dashboard": DashboardIcon,
  "/users": PeopleIcon,
  "/offres": WorkIcon,
  "/candidatures": AssignmentIcon,
  "/entretiens": EventNoteIcon,
  "/cvs": DescriptionIcon,
  "/profile": PersonIcon,
};

export default function NavBar({ open, onClose }) {
  const menu = getMenu(getRole());

  return (
    <nav
      className={"connected-nav" + (open ? "" : " is-closed")}
      aria-label="Menu principal"
    >
      {menu.map((item) => {
        const Icon = NAV_ICONS[item.path];
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) => "nav-link" + (isActive ? " is-active" : "")}
            onClick={onClose}
          >
            {Icon ? <Icon className="nav-link-icon" /> : null}
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}