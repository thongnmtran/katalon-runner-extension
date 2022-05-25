import React from 'react';
import CodeMirror, { useCodeMirror } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import { TextField } from '@mui/material';


export default function LogViewer({ logs = [], onCommand, instance }) {
  const editor = React.useRef();

  const value = React.useMemo(() => logs.join('\r\n'), [logs]);

  React.useEffect(() => {
    const scroller = editor.current?.querySelector('.cm-scroller');
    scroller?.scrollTo({
      top: scroller?.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }, [value]);

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

  const handleKeyDown = React.useCallback((event) => {
    const { target, target: { value: command } } = event;
    if (event.key === 'Enter') {
      onCommand?.(command);
      target.value = '';
    }
  }, [onCommand]);

  return (
    <>
      <div ref={editor} />
      <TextField
        fullWidth
        variant="outlined"
        onKeyDownCapture={handleKeyDown}
        size="small"
        placeholder={instance ? `Instance ${instance?.id}` : ''}
      />
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
