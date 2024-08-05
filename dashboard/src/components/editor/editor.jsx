import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.css';

export default function EditorContent({ value, onChange }) {
  return (
    <ReactQuill
      className="editor"
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder='Hãy viết vào đây...'
    />
  );
}