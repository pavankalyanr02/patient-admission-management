
import {
  Activity,
  BedDouble,
  CheckCircle,
  Users
} from "lucide-react";

function StatsCards({
  totalPatients,
  admittedPatients,
  dischargedPatients,
  activeWards
}) {

  return (

    <div className="stats-grid">

      {/* Total Patients */}
      <div className="stat-card">

        <div className="stat-icon purple">
          <Users size={22} />
        </div>

        <div>
          <span>Total Patients</span>
          <h2>{totalPatients}</h2>
          <small>Registered patients</small>
        </div>

      </div>


      {/* Currently Admitted */}
      <div className="stat-card">

        <div className="stat-icon green">
          <Activity size={22} />
        </div>

        <div>
          <span>Currently Admitted</span>
          <h2>{admittedPatients}</h2>
          <small>Active admissions</small>
        </div>

      </div>


      {/* Discharged Patients */}
      <div className="stat-card">

        <div className="stat-icon blue">
          <CheckCircle size={22} />
        </div>

        <div>
          <span>Discharged</span>
          <h2>{dischargedPatients}</h2>
          <small>Completed admissions</small>
        </div>

      </div>


      {/* Active Wards */}
      <div className="stat-card">

        <div className="stat-icon orange">
          <BedDouble size={22} />
        </div>

        <div>
          <span>Wards In Use</span>
          <h2>{activeWards}</h2>
          <small>Active wards</small>
        </div>

      </div>

    </div>

  );

}

export default StatsCards;
