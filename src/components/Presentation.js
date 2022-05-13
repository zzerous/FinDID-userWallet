import React, { Component } from 'react';
import { connect } from 'react-redux'
import Loading from 'components/Loading'
import CreateVP from 'components/CreateVP'
import PresentationView from 'components/PresentationView'
import { shortenAddress } from 'utils/util'
import ui from 'utils/ui'
import axios from 'axios';
import './Credential.scss'

import * as contentActions from 'redux/actions/contents'

class Presentation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: !props.vp,
      type: "VP",
      addr: klaytn.selectedAddress
    }
  }
  componentDidMount() {
    const { vp, getFiles } = this.props;
    const { type, addr } = this.state;
    if (!vp) {
      getFiles(type, addr);
    }
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const isUpdatedVP = (nextProps.vp !== prevState.vp) && (nextProps.vp !== null)
    if (isUpdatedVP) {
      return { isLoading: false }
    }
    return null
  }

  createVP = (e) => {
    e.preventDefault()
    
  }

  render() {
    const { vp, verifyEndPoint } = this.props
    if (this.state.isLoading) return <Loading />
    return (
      <div className="credentials">
        {vp.length !== 0
          ? vp.map(({
              pid,
              claims,
            }) => {
              let SRC = "/images/icon-tx.svg";
              return (
                <div 
                  className="credential" 
                  key={pid}
                  onClick={() => ui.showModal({
                    header: 'View Presentation',
                    content: (
                      <PresentationView 
                        pid = {pid}
                        claims = {claims}
                        endPoint = {verifyEndPoint}
                      />
                    ),
                  })}
                >
                <div className="credential__image">
                  <img 
                  src={SRC} alt="image" />
                </div>
                <h2 className="credential__info">{shortenAddress(pid)}</h2>
              </div>
            )
          })
          : <span className="credential__empty">No Presentation :D</span>
        }
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  vp: state.contents.vp,
  verifyEndPoint: state.contents.verifyEndPoint,

})

const mapDispatchToProps = (dispatch) => ({
  getFiles: (type, addr) => 
  dispatch(contentActions.getFiles(type, addr)),
  
})


export default connect(mapStateToProps, mapDispatchToProps)(Presentation)