import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const Editor = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };
  return (
    <ReactQuill
      value={value}
      modules={modules}
      theme="snow"
      onChange={onChange}
    />
  );
};
export default Editor;
