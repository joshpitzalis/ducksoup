import { Button, Comment, Form, Input, List } from 'antd';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { useFireColl } from '../../hooks/firebase';
import { firestore } from '../../utils/firebase';

const TextArea = Input.TextArea;

// const data = [
//   {
//     // actions: [<span>Reply to</span>],
//     author: 'Han Solo',
//     // avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
//     content: (
//       <p>
//         We supply a series of design principles, practical patterns and high
//         quality design resources (Sketch and Axure), to help people create their
//         product prototypes beautifully and efficiently.
//       </p>
//     ),
//     datetime: (
//       <Tooltip
//         title={moment()
//           .subtract(1, 'days')
//           .format('YYYY-MM-DD HH:mm:ss')}
//       >
//         <span>
//           {moment()
//             .subtract(1, 'days')
//             .fromNow()}
//         </span>
//       </Tooltip>
//     )
//   }
// ];

class App extends PureComponent {
  static propTypes = {
    listId: PropTypes.string.isRequired
  };

  state = {
    submitting: false,
    value: ''
  };

  handleSubmit = async () => {
    if (!this.state.value) {
      return;
    }

    console.log('submitting...', this.state.value);

    try {
      const { listId } = this.props;

      this.setState({
        submitting: true
      });
      const comment = await firestore
        .collection(`discussions/${listId}/comments`)
        .doc();

      console.log('listId', listId, 'commenId', comment.id);
      firestore
        .doc(`discussions/${listId}/comments/${comment.id}`)
        .set({
          id: comment.id,
          author: 'Josh',
          // avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          content: this.state.value,
          datetime: new Date()
        })
        .then(() =>
          this.setState({
            submitting: false,
            value: ''
          })
        );
    } catch (error) {
      console.log('error adding a comment to the discussion', error);
    }
  };

  handleChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  render() {
    const { submitting, value } = this.state;
    const { listId } = this.props;

    return (
      <div className="tl">
        <hr />
        <CommentList listId={listId} />
        <Comment
          // avatar={
          //   <Avatar
          //     src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          //     alt="Han Solo"
          //   />
          // }
          content={
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
            />
          }
        />
      </div>
    );
  }
}

export default App;

const CommentList = ({ listId }) => {
  const comments = useFireColl(`discussions/${listId}/comments`)
    .sort((a, b) => a.datetime - b.datetime)
    .map(comment => ({
      ...comment,
      datetime: null
      // <Tooltip
      //   title={moment()
      //     .subtract(1, 'days')
      //     .format('YYYY-MM-DD HH:mm:ss')}
      // >
      //   <span>
      //     {moment()
      //       .subtract(1, 'days')
      //       .fromNow()}
      //   </span>
      // </Tooltip>
    }));

  return comments.length > 0 ? (
    <List
      dataSource={comments}
      // header={`${comments.length} ${
      //   comments.length > 1 ? 'Comments' : 'Comment'
      // }`}
      itemLayout="horizontal"
      renderItem={props => <Comment {...props} />}
    />
  ) : null;
};

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </div>
);