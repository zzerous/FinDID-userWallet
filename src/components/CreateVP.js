import React, { Component } from 'react'
import { connect } from 'react-redux'
import ui from 'utils/ui'
import Button from 'components/Button'
import Input from 'components/Input'
import Checkbox from 'components/Checkbox'
import Loading from 'components/Loading'

import * as contentActions from 'redux/actions/contents'

import './DownloadContent.scss'

class CreateVP extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: null,
      isChecked: false,
      claimList: [], //선택된 claim 관리
      checkedList: [], //check 상태관리
    }
  }

  componentDidMount() {
    const { claims } = this.props;
    this.setState({
      claimList: claims,
      checkedList: new Array(Object.keys(claims).length).fill(false),
    })
  }

  checkedItemHandler = () => {
    const { isChecked, checkedList, cartlist } = this.state;
    if (isChecked) {
      this.state({
        claimList
      })
    }

    const target = e.target;
    console.log(target);
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      checkedList: checkedList.add(e.target.checked),
    })
  }

  createVP = (e) => {
    e.preventDefault();
    const { cartlist } = this.props;
    console.log(cartlist);
  }

  render() {
    const { cid, claims } = this.props
    const { isLoading, claimList, checkedList } = this.state
    console.log(claimList)
    console.log(checkedList)
    return (
      <div className="DownloadContent">
        <Input
          className="DownloadContent__infoName"
          name="VCName"
          label="Credential Name"
          value={cid}
          readOnly
        />
        <Checkbox 
          className="DownloadContent__infoType"
          name="VCclaim"
          label="Credential Claims"
          value={claims}
          onChangeHandler={this.checkedItemHandler}
        />
        <Button
          className="DownloadContent__auction"
          onClick={this.createVP}
          title="Create Auction"
        />
        <Button
          className="DownloadContent__delete"
          //onClick={onClick}
          title="Delete"
        />

        {isLoading && (
          <Loading />
        )}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({

})
export default connect(null, mapDispatchToProps)(CreateVP)
