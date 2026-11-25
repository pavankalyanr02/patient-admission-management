
import {
  HeartPulse,
  LayoutDashboard,
  Users
} from "lucide-react";

function Sidebar({ activeNav, onDashboard, onPatients }) {

  return (

    <aside className="sidebar">

      {/* Brand section */}
      <div className="brand">

        <HeartPulse size={27} />

        <div>
          <h2>Careflow</h2>
          <span>HOSPITAL MANAGEMENT</span>
        </div>

      </div>


      {/* Navigation heading */}
      <div className="sidebar-heading">
        WORKSPACE
      </div>


      {/* Dashboard button */}
      <button
        className={`nav-link nav-button ${
          activeNav === "dashboard" ? "active" : ""
        }`}
        onClick={onDashboard}
      >

        <LayoutDashboard size={19} />

        Dashboard

      </button>


      {/* Patient admissions button */}
      <button
        className={`nav-link nav-button ${
          activeNav === "patients" ? "active" : ""
        }`}
        onClick={onPatients}
      >

        <Users size={19} />

        Patient Admissions

      </button>


      {/* Sidebar footer */}
      <div className="sidebar-bottom">

        <HeartPulse size={22} />

        <h4>Care begins here.</h4>

        <p>
          Managing patient admissions made simpler.
        </p>

      </div>

    </aside>

  );

}

export default Sidebar;
