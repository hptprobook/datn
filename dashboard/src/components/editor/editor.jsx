import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.css';

export default function EditorContent() {
  const [value, setValue] = useState('');
  console.log(value);
  return <ReactQuill className="editor" theme="snow" value={value} onChange={setValue} placeholder='Hãy viết vào đây...' />;
}