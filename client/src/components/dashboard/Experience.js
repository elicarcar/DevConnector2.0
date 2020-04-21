import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteExperience } from "../../actions/profile";
import Moment from "react-moment";

const Experience = ({ experience, deleteExperience }) => {
  const experiences = experience.map((ex) => (
    <tr key={ex._id}>
      <td>{ex.company}</td>
      <td className="hide-sm">{ex.title}</td>
      <td>
        <Moment format="YYYY/MM/DD">{ex.from}</Moment> -
        {ex.to === null ? " Now" : <Moment format="YYYY/MM/DD">{ex.to}</Moment>}
      </td>
      <td>
        <button
          className="btn btn-danger"
          onClick={() => deleteExperience(ex._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className="my-2">Experience Credentials</h2>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Years</th>
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </Fragment>
  );
};

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
