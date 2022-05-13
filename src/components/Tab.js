import React from 'react';
import classnames from 'classnames';
import './Tabs.scss'

const Tab = (props) => {

    Tab.defaultProps = {
        activeClassName: undefined,
        className: undefined,
        onClick: undefined,
      };
      
    const {
        activeClassName,
        className,
        isActive,
        name,
        onClick,
        tabIndex,
    } = props;

  return (
    <li
      className={classnames('tab', className, {
        'tab--active': isActive,
        [activeClassName]: activeClassName && isActive,
      })}
      onClick={(event) => {
        event.preventDefault();
        onClick(tabIndex);
      }}
    >
      <button>{name}</button>
    </li>
  );
};

export default Tab;
