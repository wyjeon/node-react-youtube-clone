import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import LikeDisklikes from './LikeDisklikes';

import { Comment, Avatar, Button, Input } from 'antd';
const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector(state => state.user);
  const [CommentValue, setCommentValue] = useState('');
  const [OpenReply, setOpenReply] = useState(false);

  const onClickOpenReply = () => {
    setOpenReply(!OpenReply);
  };

  const actions = [
    <LikeDisklikes userId={localStorage.getItem('userId')} commentId={props.comment._id} />,
    <span onClick={onClickOpenReply} key="comment-basic">
      Reply to
    </span>,
  ];

  const handleChange = event => {
    setCommentValue(event.currentTarget.value);
  };

  const onSubmit = event => {
    event.preventDefault();

    const variables = {
      content: CommentValue,
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
    };

    Axios.post('/api/comment/saveComment', variables).then(response => {
      if (response.data.success) {
        setCommentValue('');
        setOpenReply(!OpenReply);
        props.refreshFunction(response.data.result);
      } else {
        alert('커맨트를 저장하지 못했습니다.');
      }
    });
  };

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt="image" />}
        content={<p>{props.comment.content}</p>}
      ></Comment>

      {OpenReply && (
        <form style={{ display: 'flex' }} onSubmit={onSubmit}>
          <TextArea style={{ width: '100%', borderRadius: '5px' }} onChange={handleChange} value={CommentValue} placeholder="write some comments!!" />
          <br />
          <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
