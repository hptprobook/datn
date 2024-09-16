import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.css';
import { PropTypes } from 'prop-types';

export default function EditorContent({ value, onChange }) {
  return (
    <ReactQuill
      className="editor"
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder="Hãy viết vào đây..."
    />
  );
}

EditorContent.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
