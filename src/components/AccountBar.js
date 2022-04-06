import React, {Component} from 'react';
import SelectedAccount from 'components/SelectedAccount'

class AccountBar extends Component {
    render(){
        return(
            <div className='account-bar'>
                <SelectedAccount/>
            </div>
        )
    }
}

export default AccountBar;
