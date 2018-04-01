import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Profile extends Component {
  // static propTypes = {
  //   name: PropTypes.string.isRequired
  // }
  render() {
    return (
      <div>
        <h1>Profile</h1>
        <h2>{this.props.match.params.id}</h2>
      </div>
    );
  }
}
Profile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  })
};

export default Profile;
