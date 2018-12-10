// jscs:disable maximumLineLength
import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
// import MessageListContainer from './message_list/message_list_container';

class MessageForm extends React.Component {

  componentWillMount() {
    this.createSocket();
  }

  constructor(props) {
    super(props);
    this.state = {
      currentChatMessage: '',
      // chatLogs: []
    };
  }

  updateCurrentChatMessage(event) {
    this.setState({
      currentChatMessage: event.target.value
    });
  }

  createSocket() {
    let cable;
    if (process.env.NODE_ENV !== 'production') {
      cable = ActionCable.createConsumer('http://localhost:3000/cable');
    } else {
      cable = ActionCable.createConsumer('wss://app-academy-sloth.herokuapp.com/cable');
    }
    this.chats = cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected: () => {},
      received: (data) => {
        // debugger
        this.props.newMessage(data)
        // let chatLogs = this.state.chatLogs;
        // chatLogs.push(data);
        // setState({chatLogs: chatLogs});
      },
        create: function (chatContent, authorId, channelId, imageUrl, formData) {
          this.perform("create", {
            content: chatContent,
            author_id: authorId,
            channel_id: channelId,
            image_url: imageUrl,
            form_data: formData
          });
      },
        send_url: function (imageUrl) {
          this.perform("send_url", {
            image_url: imageUrl
          });
        },
    });
  }

  handleSendEvent(event) {
    event.preventDefault();

    if(this.state.currentChatMessage) {
      this.chats.create(
        // this.props.createMessage, TODO: How to add chat to state??
        this.state.currentChatMessage,
        this.props.currentUser.id,
        this.props.channel.id);
      this.setState({
        currentChatMessage: ''
      });
    }

    if (this.state.imageFile) {
      let formData = new FormData();
      formData.append("message[photo]", this.state.imageFile);
      formData.append("message[channel_id]", this.props.channel.id);
      $.ajax({
        url: '/api/messages',
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false
      }).then((res) => {
        // this.chats.send_url(res.message.image_url);
        this.props.history.push("/channels/" + res.message.channel_id); // I'm ashamed of this code
      });
      this.setState({ imageUrl: "", imageFile: null });
      document.getElementById("message-form-hidden-file-upload").value = null;
    }
  }

  handleChatInputKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleSendEvent(event);
      if (this.state.imageUrl != '') {
        // this.handleImageUpload(event);
      }
    }
  }

  handleImageUpload(e) {
    e.preventDefault();
    const formData = new FormData();
    // formData.append("message[title]", 'test');
    if (this.state.imageFile) {
      formData.append("photo", this.state.imageFile);
    }

    // this.chats.photo.attach(io: file, filename: 'sennacy.jpg')

    // this.chats.create(this.state.imageUrl, this.props.currentUser.id, this.props.channel.id);

    // $.ajax({
    //   url: '/api/messages',
    //   method: 'POST',
    //   data: formData,
    //   contentType: false,
    //   processData: false
    // });
  }

  handleImageSubmit(e) {
    const reader = new FileReader();
    const file = e.currentTarget.files[0];
    reader.onloadend = () =>
      this.setState({ imageUrl: reader.result, imageFile: file });
    if (file) {
      reader.readAsDataURL(file);
    } else {
      this.setState({ imageUrl: "", imageFile: null });
    }
    document.getElementById("message-form-chat-input").focus();
  }

  renderChatLog() {
    // console.log('this.props.chatLogs' + this.state.chatLogs)
    return this.state.chatLogs.map((el) => {
      // console.log('el.content' + el.content);
      return (
        <li key={`chat_${el.id}`}>
          <span className='chat-message'>{ el.content }</span>
          <span className='chat-created-at'>{ el.created_at }</span>
        </li>
      );
    });
  }

  handlePlusClick() {
    document.getElementById('message-form-hidden-file-upload').click();
  }

  handleChatInputFocus() {
    document.getElementById("chat-input-plus-button").style.borderColor ='gray';
    document.getElementById("chat-input-plus-button").style.color = 'gray';
  }

  handleChatInputBlur() {
    document.getElementById("chat-input-plus-button").style.borderColor = 'lightgray';
    document.getElementById("chat-input-plus-button").style.color = 'lightgray';
    this.setState({ imageUrl: "", imageFile: null });
    document.getElementById("message-form-hidden-file-upload").value = null;
  }

  render() {
    // <h1>Chat</h1>
    // <ul className='chat-logs'>
    //   { this.renderChatLog() }
    // </ul>
    // <MessageListContainer chatLogs={this.state.chatLogs} />

    let channelName = '';
    if (this.props.channel) {
      channelName = this.props.channel.name;
    }

    let imgPreview = <div></div>;
    if (this.state.imageFile) {
      imgPreview = <img src={`${this.state.imageUrl}`} alt="Oh noes!" className='image-preview'/>;
    }

    return (
      <div>
        <div className='chat-stage'>

          <div className='chat-input-container'>
            <h1 id='chat-input-plus-button' className='chat-input-plus-button' onClick={(e) => this.handlePlusClick(e)}>+</h1>
            <input
              id='message-form-chat-input'
              onKeyPress={ (e) => this.handleChatInputKeyPress(e) }
              value={ this.state.currentChatMessage }
              onChange={ (e) => this.updateCurrentChatMessage(e) }
              type='text'
              placeholder={'Message #' + channelName}
              className='chat-input'
              onFocus={(e) => this.handleChatInputFocus(e)} 
              onBlur={(e) => this.handleChatInputBlur(e)} />
            <input id='message-form-hidden-file-upload' onChange={(e) => this.handleImageSubmit(e)} type="file" name="pic" accept="image/*" />
            
            
            {/* <form onSubmit={(e) => this.handleImageSubmit(e)}>
              <input type="file" name="pic" accept="image/*"/>
              <input type="submit"/>
            </form> */}
          </div>
          {imgPreview}
        </div>
      </div>
    );
  }
}

// <MessageListContainer chatLogsState={this.state} />
// <button
//   onClick={ (e) => this.handleSendEvent(e) }
//   className='send'>
//   Send
// </button> Button not needed

export default withRouter(MessageForm);
