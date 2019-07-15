import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../store/actions/postAction';

const PostForm = ({ addPost }) => {
  const [text, setText] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imagePreviewUrl2, setImagePreviewUrl2] = useState('');
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  // for image put preview
  const handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    console.log(file);
    reader.onloadend = () => {
      setImage1(file);
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };
  // for image put preview
  const handleImageChange2 = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    console.log(file);

    reader.onloadend = () => {
      setImage2(file);
      setImagePreviewUrl2(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form
        className="form my-1"
        onSubmit={e => {
          e.preventDefault();
          const data = new FormData();
          data.append('text', text);
          data.append('image1', image1);
          data.append('image2', image2);
          addPost(data);
          setText('');
          setImage1(null);
          setImage2(null);
          setImagePreviewUrl('');
          setImagePreviewUrl2('');
        }}
      >
        <div style={{ width: '400px', height: 'auto', overflow: 'hidden' }}>
          <img src={imagePreviewUrl} alt="" width="100%" height="auto" />
        </div>

        <input type="file" name="image1" onChange={e => handleImageChange(e)} />
        <div style={{ width: '400px', height: 'auto', overflow: 'hidden' }}>
          <img src={imagePreviewUrl2} alt="" width="100%" height="auto" />
        </div>
        <input
          type="file"
          name="image2"
          onChange={e => handleImageChange2(e)}
        />
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a post"
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired
};

export default connect(
  null,
  { addPost }
)(PostForm);
