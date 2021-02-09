import Axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Input } from 'antd';
const { TextArea } = Input;

function Comment(props) {
  const videoId = props.postId;

  const user = useSelector(state => state.user); //리덕스에서 유저id 가져오기
  const [commentValue, setCommentValue] = useState('');

  const handleClick = event => {
    setCommentValue(event.currentTarget.value);
  };

  const onSubmit = event => {
    event.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id,
      postId: videoId,
    };

    Axios.post('/api/comment/saveComment', variables).then(response => {
      if (response.data.success) {
        console.log(response.data.result);
      } else {
        alert('커맨트를 저장하지 못했습니다.');
      }
    });
  };

  return (
    <div>
      <br />
      <p> replies</p>
      <hr />
      {/* Comment Lists  */}

      {/* Root Comment Form */}
      <form style={{ display: 'flex' }} onSubmit={onSubmit}>
        <TextArea style={{ width: '100%', borderRadius: '5px' }} onChange={handleClick} value={commentValue} placeholder="write some comments" />
        <br />
        <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Comment;
