import React from 'react'; 
import classNames from 'classnames';
import './DidButton.scss';

const defaultRender = (inner) => inner;

export default function DidButton({
  onClick,
  image,
  disabled,
  label,
  tooltipRender,
  className
}) {
  const renderWrapper = tooltipRender ?? defaultRender;
  return (
    <button
      className={classNames('icon-button', className, {
        'icon-button--disabled': disabled,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {renderWrapper(
        <>
          <div className="icon-button__circle">
            <img className= "icon-button__img"
              src = {image}
              height = {25}
              width = {25}
            />
          </div>
          <span>{label}</span>
        </>,
      )}
    </button>
  );
}

