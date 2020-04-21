import React, { useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getProfile } from "../../actions/profile";
import PropTypes from "prop-types";
import Spinner from "../layouts/Spinner";

const Dashboard = ({
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
        <Fragment> </Fragment>
      ) : (
        <Fragment>
          {" "}
          <p> You have not yet setup a profile, please add some info.</p>
          <Link to="create/profile" className="btn btn-primary my-1">
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
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { getProfile })(Dashboard);
