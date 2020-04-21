import React, { useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getProfile,
  deleteAccount,
  deleteExperience,
} from "../../actions/profile";
import PropTypes from "prop-types";
import Spinner from "../layouts/Spinner";
import DashboardActions from "./DashboardActions";
import Experience from "./Experience";
import Education from "./Education";

const Dashboard = ({
  deleteAccount,
  getProfile,
  profile: { profile, isLoading },
  auth: { user },
}) => {
  useEffect(() => {
    getProfile();
  }, []);

  return isLoading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      {" "}
      <h1 className="large text-primary">Dashboard</h1>{" "}
      <p className="lead">
        <i className="fas fa-user"></i>Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              {" "}
              <i className="fas fa-user-minus"></i> Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p> You have not yet setup a profile, please add some info.</p>
          <Link to="create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

Dashboard.propTypes = {
  getProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { getProfile, deleteAccount })(
  Dashboard
);
