import { useRef } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Editor } from '@tinymce/tinymce-react';
import PropTypes from 'prop-types';

const tinyKey = import.meta.env.VITE_TINYMCE_API_KEY;
export default function TinyEditor({
  initialValue = 'Đây là nội dung ban đầu của trình soạn thảo.',
  onChange,
  height = 500,
  error = false,
}) {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      onChange(editorRef.current.getContent());
    }
  };
  return (
    <div style={{ border: error && '1px solid red' , borderRadius: '8px'}}>
      <Editor
        apiKey={tinyKey}
        onInit={(_evt, editor) => {
          editorRef.current = editor;
        }}
        borderColor={error ? 'red' : 'gray'}
        onChange={log}
        initialValue={`<p>${initialValue}</p>`}
        init={{
          height,
          menubar: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'code',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
    </div>
  );
}
TinyEditor.propTypes = {
  initialValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  height: PropTypes.number,
  error: PropTypes.bool,
};
