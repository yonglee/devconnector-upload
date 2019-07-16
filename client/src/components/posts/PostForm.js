import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../store/actions/postAction';
import Message from '../layout/Message';

const imageTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/pjpeg'
];

const sizeLimit = 12000000;

const PostForm = ({ addPost }) => {
  const [text, setText] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imagePreviewUrl2, setImagePreviewUrl2] = useState('');
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [rotate1, setRotate1] = useState(0);
  const [rotate2, setRotate2] = useState(0);
  const [invalidMessage1, setInvalidMessage1] = useState('');
  const [invalidMessage2, setInvalidMessage2] = useState('');
  const imageRef1 = useRef(null);
  const imageRef2 = useRef(null);
  const imageInputRef1 = useRef(null);
  const imageInputRef2 = useRef(null);

  // for image put preview
  const handleImageChange1 = e => {
    e.preventDefault();

    // if image is not uploaded sent error message
    if (e.target.files[0]) {
      if (imageTypes.indexOf(e.target.files[0].type) === -1) {
        imageInputRef1.current.value = '';
        setInvalidMessage1('Please upload an image');
        setImagePreviewUrl('');
        // @todo: display invalid image input
      } else {
        setInvalidMessage1('');
        const file = e.target.files[0];
        if (file.size > sizeLimit) {
          setInvalidMessage1('Please upload an image with size 12mb or lower');
          imageInputRef1.current.value = '';
        } else {
          const reader = new FileReader();

          reader.onloadend = () => {
            // console.log('image loaded');

            setImage1(file);
            setImagePreviewUrl(reader.result);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };
  // for image put preview
  const handleImageChange2 = e => {
    e.preventDefault();

    // if image is not uploaded sent error message
    if (e.target.files[0]) {
      if (imageTypes.indexOf(e.target.files[0].type) === -1) {
        imageInputRef2.current.value = '';
        setInvalidMessage2('Please upload an image');
        setImagePreviewUrl2('');
      } else {
        setInvalidMessage2('');
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
          setImage2(file);
          setImagePreviewUrl2(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
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
        <h5>Click an image to rotate 90deg</h5>
        <div
          style={{
            height: 'auto',
            overflow: 'hidden',
            width: '100%',
            maxWidth: '50%',
            display: 'inline-block'
          }}
        >
          <strong>before:</strong>
          {invalidMessage1 !== '' && (
            <Message message={invalidMessage1} badgeType="danger" />
          )}
          <img
            src={imagePreviewUrl}
            alt=""
            width="100%"
            height="auto"
            ref={imageRef1}
            style={
              rotate1 > 0
                ? {
                    transform: `rotate(${rotate1}deg)`,
                    transition: `transform 150ms ease`
                  }
                : {}
            }
            onClick={e => {
              if (rotate1 <= 270) setRotate1(rotate1 + 90);
              if (rotate1 === 270) setRotate1(0);
            }}
          />
          <input
            type="file"
            name="image1"
            ref={imageInputRef1}
            onChange={e => handleImageChange1(e)}
          />
        </div>

        <div
          style={{
            height: 'auto',
            overflow: 'hidden',
            width: '100%',
            maxWidth: '50%',
            display: 'inline-block'
          }}
        >
          <strong>after:</strong>
          {invalidMessage2 !== '' && (
            <Message message={invalidMessage2} badgeType="danger" />
          )}
          <img
            src={imagePreviewUrl2}
            alt=""
            width="100%"
            height="auto"
            ref={imageRef2}
            style={
              rotate2 > 0
                ? {
                    transform: `rotate(${rotate2}deg)`,
                    transition: `transform 150ms ease`
                  }
                : {}
            }
            onClick={e => {
              if (rotate1 <= 270) setRotate2(rotate2 + 90);
              if (rotate1 === 270) setRotate2(0);
            }}
          />
          <input
            type="file"
            name="image2"
            ref={imageInputRef2}
            onChange={e => handleImageChange2(e)}
          />
        </div>

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
