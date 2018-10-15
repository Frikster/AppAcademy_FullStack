import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ChannelHeader extends React.Component {

  componentDidMount() {
    debugger
    this.props.fetchChannel(this.props.match.params.channelId);
  }

  render() {
    let channelName = '';
    if (this.props.channel) {
      channelName = this.props.channel.name;
    }

    return (
      <div className='channel-header'>
        <h1>{channelName}</h1>
      </div>
    );
  }
}

export default ChannelHeader;
