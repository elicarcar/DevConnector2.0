import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getProfile } from "../../actions/profile";
import PropTypes from "prop-types";

const Dashboard = ({ getProfile, profile, auth }) => {
  useEffect(() => {
    getProfile();
  }, []);

  console.log(profile);
  return <div>Dashboard</div>;
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  auth: state.auth,
});

Dashboard.propTypes = {
  getProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { getProfile })(Dashboard);
