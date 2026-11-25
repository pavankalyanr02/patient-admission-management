
import { ChevronDown } from "lucide-react";

function Topbar({
  profileOpen,
  onToggleProfile,
  onCloseProfile
}) {

  return (

    <>

      {/* Top navigation bar */}
      <header className="topbar">

        <div>

          <span>Workspace / </span>

          <strong>Patient Admissions</strong>

        </div>


        {/* Admin profile button */}
        <button
          className="admin-profile"
          onClick={onToggleProfile}
          aria-expanded={profileOpen}
        >

          <div className="admin-avatar">
            AD
          </div>

          <span>Admin Desk</span>

          <ChevronDown size={15} />

        </button>

      </header>


      {/* Admin profile dropdown */}
      {profileOpen && (

        <div className="profile-menu">

          <div className="profile-menu-header">

            <div className="admin-avatar">
              AD
            </div>

            <div>
              <strong>Admin Desk</strong>
              <small>Hospital Administrator</small>
            </div>

          </div>


          <div className="profile-menu-info">

            <span>Account type</span>

            <strong>Administrator</strong>

          </div>


          <div className="profile-menu-info">

            <span>Application</span>

            <strong>Careflow Demo</strong>

          </div>


          <button
            className="profile-close"
            onClick={onCloseProfile}
          >
            Close
          </button>

        </div>

      )}

    </>

  );

}

export default Topbar;
