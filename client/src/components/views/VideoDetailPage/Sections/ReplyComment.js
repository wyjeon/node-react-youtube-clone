import React, { useState, useEffect } from 'react';
import SingleComment from './SingleComment';

function ReplyComment(props) {
  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [OpenReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
    props.CommentLists.map(comment => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
      setChildCommentNumber(commentNumber);
    });
  }, [props.CommentLists]);

  const redenrReplyComment = parentCommentId =>
    props.CommentLists.map((comment, index) => (
      <React.Fragment>
        {comment.responseTo === parentCommentId && (
          <div style={{ width: '80%', marginLeft: '40px' }}>
            <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.videoId} />
            <ReplyComment
              refreshFunction={props.refreshFunction}
              CommentLists={props.CommentLists}
              postId={props.videoId}
              parentCommentId={comment._id}
            />
          </div>
        )}
      </React.Fragment>
    ));

  const handleChange = () => {
    setOpenReplyComments(!OpenReplyComments);
  };

  return (
    <div>
      {ChildCommentNumber > 0 && (
        <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick={handleChange}>
          View {ChildCommentNumber} more comment(s)
        </p>
      )}
      {OpenReplyComments && redenrReplyComment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
