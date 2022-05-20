import React from 'react';
import CodeMirror, { useCodeMirror } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';


export default function LogViewer({ logs = [] }) {
  const editor = React.useRef();

  const value = React.useMemo(() => logs.join('\r\n'), [logs]);

  const { state, setState, setContainer } = useCodeMirror({
    container: editor.current,
    extensions: [javascript({ jsx: true })],
    value,
    height: '250px',
    width: '100%',
    readOnly: true,
    // editable: false,
    onFocus: () => editor.current.blur()
  });

  React.useEffect(() => {
    if (editor.current) {
      setContainer(editor.current);
    }
  }, [editor.current]);

  return (
    <>
      <div ref={editor} />
      {/* <CodeMirror
        value={value}
        // options={{
        //   theme: 'monokai',
        //   keyMap: 'sublime',
        //   mode: 'jsx'
        // }}
      /> */}
    </>
  );
}
