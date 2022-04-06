import React from 'react';
import classnames from 'classnames';
import './UserCurrencyDisplay.scss'

export default function UserCurrencyDisplay({
    className,
    hideTitle,
    title,
    value,
}) 
    {
    return (
        <div 
            className={classnames('currency-display-component', className)}
        >
            <span className='currency-display-component__text'>
                {value}
            </span>
            <span className='currency-display-component__suffix'>
                KLAY
            </span>
        </div>
    );

}