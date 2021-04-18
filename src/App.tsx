import { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';

const PLACEHOLDERS = [
  {
    key: 'price',
    text:
      'Hello,\n\nWhat is the price of a ream of paper at Dunder Mifflin?\n\nBest,\nTom from Blue Cross',
  },
  {
    key: 'fire',
    text: 'My Sabre printer just started smoking. What should I do?',
  },
  {
    key: 'contact',
    text:
      "I'm having issues with with my shipment. Can I get in contact with the assistant regional manager?",
  },
];

function App() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [currentPlaceholder, setCurrentPlaceholder] = useState({
    key: 'price',
    text: '',
  });
  const [isFocused, setIsFocused] = useState(false);
  const [lastCompletedPlaceholder, setLastCompletedPlaceholder] = useState(0);
  const [timeSinceStart, setTimeSinceStart] = useState(0);
  const [fromInput, setFromInput] = useState('');
  const headers = [
    {
      title: 'To',
      input: 'Dunder Mifflin Support (support@dundermifflin.com)',
    },
    {
      title: 'Subject',
      input: 'Questions about Dunder Mifflin',
    },
    {
      isFrom: true,
      title: 'From',
      input: fromInput,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLength = currentPlaceholder.text.length;

      const currentIndex = PLACEHOLDERS.findIndex(
        (placeholder) => placeholder.key === currentPlaceholder.key
      );

      const selectedPlaceholder = PLACEHOLDERS[currentIndex];

      if (currentLength < selectedPlaceholder.text.length) {
        setCurrentPlaceholder({
          key: selectedPlaceholder.key,
          text: selectedPlaceholder.text.substring(0, currentLength + 1),
        });
      } else if (lastCompletedPlaceholder === 0) {
        setLastCompletedPlaceholder(timeSinceStart);
      }

      if (timeSinceStart - lastCompletedPlaceholder > 7000) {
        setLastCompletedPlaceholder(0);
        setTimeSinceStart(0);
        const nextIndex =
          currentIndex + 1 === PLACEHOLDERS.length ? 0 : currentIndex + 1;
        setCurrentPlaceholder({ key: PLACEHOLDERS[nextIndex].key, text: '' });
      } else {
        return setTimeSinceStart(timeSinceStart + 30);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [
    currentPlaceholder.key,
    currentPlaceholder.text.length,
    lastCompletedPlaceholder,
    timeSinceStart,
  ]);

  const handleKeyCommand = (command: any) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const getStyleButtonColor = (style: string) => {
    let styleColor = 'hover:text-gray-600 ';
    styleColor += editorState.getCurrentInlineStyle().has(style)
      ? 'text-gray-600'
      : 'text-gray-400';

    return styleColor;
  };

  const clearEditor = () => {
    setEditorState(EditorState.createEmpty());
  };

  const onToggleBold = (event: any) => {
    event.preventDefault();
    return setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const onToggleItalics = (event: any) => {
    event.preventDefault();
    return setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  };

  const onToggleUnderline = (event: any) => {
    event.preventDefault();
    return setEditorState(
      RichUtils.toggleInlineStyle(editorState, 'UNDERLINE')
    );
  };

  return (
    <div className="p-8 bg-transparent w-full h-screen">
      <div className="flex shadow-xl flex-col h-full bg-white rounded-lg text-lg">
        <div
          className="px-6 py-4 w-full text-white font-bold rounded-t-lg"
          style={{ backgroundColor: '#0c1d37' }}
        >
          Interactive Demo
        </div>
        <hr className="w-full" />
        <div className="bg-white px-6 py-6">
          {headers.map((header, i) => (
            <div className={`flex ${i !== 0 ? 'mt-2' : ''}`}>
              <span className="text-gray-500">{header.title}</span>
              <span
                className="relative ml-1 font-semibold px-2 rounded-md"
                style={
                  header.isFrom
                    ? {
                        backgroundColor: 'rgba(66, 133, 244)',
                        color: 'white',
                      }
                    : {
                        backgroundColor: '#e4fef0',
                        color: 'rgba(66, 133, 244)',
                      }
                }
              >
                <span className={header.isFrom ? 'text-transparent' : ''}>
                  {header.input}
                </span>
                {header.isFrom && (
                  <input
                    type="text"
                    className="absolute h-full left-0 font-semibold px-2 rounded-md bg-transparent focus:outline-none w-96"
                    value={fromInput}
                    onChange={(e) => setFromInput(e.target.value)}
                  />
                )}
              </span>
            </div>
          ))}
        </div>
        <hr className="mx-6" />
        <div className="px-6 py-4 flex-auto overflow-scroll h-full">
          <Editor
            editorState={editorState}
            placeholder={isFocused ? '' : currentPlaceholder.text}
            handleKeyCommand={handleKeyCommand}
            onChange={setEditorState}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        <div className="flex px-6 py-2 bg-gray-100 rounded-b-lg">
          <button
            className={`${
              editorState.getCurrentContent().hasText() && fromInput !== ''
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-100'
            }
            py-2 px-12 rounded-md font-medium`}
          >
            Send
          </button>
          <div className="flex-1 flex items-stretch">
            <div className="flex-1 flex items-center">
              <button
                className="ml-4 focus:outline-none"
                onMouseDown={onToggleBold}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="bold"
                  className={`h-4 w-4 ${getStyleButtonColor('BOLD')}`}
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path
                    fill="currentColor"
                    d="M333.49 238a122 122 0 0 0 27-65.21C367.87 96.49 308 32 233.42 32H34a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h31.87v288H34a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h209.32c70.8 0 134.14-51.75 141-122.4 4.74-48.45-16.39-92.06-50.83-119.6zM145.66 112h87.76a48 48 0 0 1 0 96h-87.76zm87.76 288h-87.76V288h87.76a56 56 0 0 1 0 112z"
                  ></path>
                </svg>
              </button>
              <button
                className="ml-3 focus:outline-none"
                onMouseDown={onToggleItalics}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="italic"
                  className={`h-4 w-4 ${getStyleButtonColor('ITALIC')}`}
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path
                    fill="currentColor"
                    d="M320 48v32a16 16 0 0 1-16 16h-62.76l-80 320H208a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h62.76l80-320H112a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h192a16 16 0 0 1 16 16z"
                  ></path>
                </svg>
              </button>
              <button
                className="ml-3 focus:outline-none"
                onMouseDown={onToggleUnderline}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="underline"
                  className={`h-4 w-4 ${getStyleButtonColor('UNDERLINE')}`}
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor"
                    d="M32 64h32v160c0 88.22 71.78 160 160 160s160-71.78 160-160V64h32a16 16 0 0 0 16-16V16a16 16 0 0 0-16-16H272a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h32v160a80 80 0 0 1-160 0V64h32a16 16 0 0 0 16-16V16a16 16 0 0 0-16-16H32a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm400 384H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="flex items-center">
              <button className="focus:outline-none" onClick={clearEditor}>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="trash"
                  className="h-4 w-4 text-gray-400 hover:text-gray-600"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor"
                    d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
