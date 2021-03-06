import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

const Header = () => {
  return (
    <div className="ui menu">
      <div className="ui container center">
        <Link to={``}>
          <h2 style={{ color: 'black' }} data-cy="home-nav-button">
            <Icon name="home" size="big" />
            MKWii TT
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Header;
