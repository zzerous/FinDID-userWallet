import React, { useState, useEffect } from 'react'
import cx from 'classnames'

import './Checkbox.scss'

const Checkbox = ({
  className,
  attr,
  data,
  id,
  checkedIDs,
  checkedIDHandler,
}) => {

  const [isChecked, setIsChecked] = useState(false); //check여부

  const onCheck = ({target}) => {
    checkedIDHandler(target.value, target.checked);
    setIsChecked(target.checked);
  }

  useEffect(() => {
    if(checkedIDs.includes(id)) { //array에 data 존재시, true
      setIsChecked(true)
    } else {
      setIsChecked(false)
    }
  }, [checkedIDs])

  return (
    <div className={cx('Checkbox', className)}>
      {
        <div className="Checkbox__claim" key={id}>
          <input
            type="checkbox"
            name="VCClaim"
            checked={isChecked}
            value={id}
            onChange={e => onCheck(e)}
          />
          <label htmlFor={id}>
            <span>{attr}: {data}</span>
          </label>
        </div>
      }
    </div>
  )
}

export default Checkbox
