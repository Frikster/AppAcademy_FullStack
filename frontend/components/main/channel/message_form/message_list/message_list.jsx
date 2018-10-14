import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

class MessageList extends React.Component {

  constructor(props) {
    super(props);
  }

  renderChatLog(source) {
    console.log('renderChatLog')
    console.log('source' + source)
    return source.map((el) => {
      return (
        <li key={`chat_${el.id}`}>
          <span className='chat-author'>{ el.author_id }</span>
          <span className='chat-message'>{ el.content }</span>
          <span className='chat-created-at'>{ el.created_at }</span>
        </li>
      );
    });
  }

  render() {
    let channelName = '';
    if (this.props.channel) {
      channelName = this.props.channel.name;
    }
    return (
      <div>
        <h1>{channelName}</h1>
        <ul className='chat-logs'>
          { this.renderChatLog(this.props.getChannelMessages) }
          { this.renderChatLog(this.props.chatLogsState.chatLogs) }
        </ul>
      </div>
    );
  }
}

export default withRouter(MessageList);
