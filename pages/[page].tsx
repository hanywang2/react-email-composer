import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import 'draft-js/dist/Draft.css';

const IS_DEV = process.env.NODE_ENV === 'development';

const BACKEND_HOST = !IS_DEV
  ? 'https://api.promptly.to'
  : 'http://localhost:5000';

const TYPING_SPEED = 25;

export const EmailComposer = ({
  path,
  brandName,
  supportEmail,
  placeholders,
}) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(emptyContentState)
  );
  const [currentPlaceholder, setCurrentPlaceholder] = useState({
    key: 'first',
    text: '',
  });
  const [isFocused, setIsFocused] = useState(false);
  const [lastCompletedPlaceholder, setLastCompletedPlaceholder] = useState(0);
  const [timeSinceStart, setTimeSinceStart] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailResponse, setEmailResponse] = useState('');
  const [typedResponse, setTypedResponse] = useState('');

  const isResponse = emailResponse !== '';

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isResponse && placeholders != null) {
        const currentLength = currentPlaceholder.text.length;

        const currentIndex = placeholders.findIndex(
          (placeholder) => placeholder.key === currentPlaceholder.key
        );

        const selectedPlaceholder = placeholders[currentIndex];
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
            currentIndex + 1 === placeholders.length ? 0 : currentIndex + 1;
          setCurrentPlaceholder({ key: placeholders[nextIndex].key, text: '' });
        } else {
          return setTimeSinceStart(timeSinceStart + TYPING_SPEED);
        }
      } else {
        if (typedResponse.length < emailResponse.length) {
          setTypedResponse(
            emailResponse.substring(0, typedResponse.length + 1)
          );
        }
      }
    }, TYPING_SPEED);
    return () => clearInterval(interval);
  }, [
    currentPlaceholder.key,
    currentPlaceholder.text.length,
    lastCompletedPlaceholder,
    timeSinceStart,
    emailResponse,
    typedResponse,
    isResponse,
    placeholders,
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

  const onSendEmail = async () => {
    setIsGenerating(true);

    if (executeRecaptcha == null) return null;

    const recaptchaToken = await executeRecaptcha('composer');

    const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
    const emailValue = blocks
      .map((block) => (!block.text.trim() && '\n') || block.text)
      .join('\n');

    const response = await fetch(`${BACKEND_HOST}/api/demo/email`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailValue,
        fromAddress: '',
        recaptchaToken,
        path: path,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      setEmailResponse(responseData.response);
    } else {
      alert(responseData.error);
    }

    return setIsGenerating(false);
  };

  const isAbleToSend = editorState.getCurrentContent().hasText();

  return (
    <div>
      <Head>
        <title>Customer Support Demo for {brandName}</title>
      </Head>
      <div className="sm:p-8 w-full h-screen bg-transparent">
        <div className="flex sm:shadow-xl flex-col h-full bg-white rounded-lg text-lg">
          <div
            className="px-6 py-4 w-full text-white font-bold rounded-t-lg"
            style={{ backgroundColor: '#0c1d37' }}
          >
            Customer Support Demo for {brandName}
          </div>
          <hr className="w-full" />
          <div className="flex flex-col relative h-full">
            <div className="bg-white px-6 py-6">
              <div className="flex">
                <span className="text-gray-500">
                  {isResponse ? 'From' : 'To'}
                </span>
                <span
                  className="relative ml-1 font-semibold px-2 rounded-md"
                  style={{
                    backgroundColor: '#ebf5f5',
                    color: 'rgba(66, 133, 244)',
                  }}
                >
                  {brandName} ({supportEmail})
                </span>
              </div>
            </div>
            <hr className="mx-6" />
            <div className="relative px-6 py-4 flex-auto overflow-y-scroll h-full text-gray-800 whitespace-pre-line">
              {isResponse ? (
                typedResponse
              ) : (
                <Editor
                  editorState={editorState}
                  placeholder={isFocused ? '' : currentPlaceholder.text}
                  handleKeyCommand={handleKeyCommand}
                  onChange={setEditorState}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              )}
            </div>
            {isGenerating && (
              <>
                <div
                  className="absolute top-0 h-full w-full bg-gray-100 z-10 opacity-80
          flex items-center justify-center"
                ></div>
                <div
                  className="absolute top-0 h-full w-full z-20 bg-transparent
          flex items-center justify-center font-semibold animate-pulse"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    <p className="mt-2 text-xl text-gray-700">
                      Drafting Response
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          {!isResponse && (
            <div className="flex px-6 py-2 bg-gray-100 rounded-b-lg z-10">
              <button
                disabled={!isAbleToSend}
                className={`${
                  isAbleToSend
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-100 cursor-not-allowed'
                }
            py-2 px-12 rounded-md font-medium`}
                onClick={onSendEmail}
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
          )}
        </div>
      </div>
    </div>
  );
};

const emptyContentState = convertFromRaw({
  entityMap: {},
  blocks: [
    {
      text: '',
      key: 'foo',
      type: 'unstyled',
      entityRanges: [],
    },
  ],
});

const Post = () => {
  const router = useRouter();
  const { asPath } = router;

  let path, brandName, supportEmail, placeholders;
  if (asPath.includes('/tangem')) {
    path = 'TANGEM';
    brandName = 'Tangem';
    supportEmail = 'support@tangem.com';
    placeholders = [
      {
        key: 'first',
        text: 'Hello,\n\nWhat is Tangem and what is the Tangem card?\n\nBest,\nMaggie',
      },
      {
        key: 'download',
        text: 'How can I get the Tangem app on my iPhone?',
      },
      {
        key: 'anonymity',
        text: 'Does Tangem monitor my transactions?',
      },
    ];
  }
  if (asPath !== '/[page]' && path == null)
    return <ErrorPage statusCode={404} />;

  return (
    <EmailComposer
      path={path}
      brandName={brandName}
      supportEmail={supportEmail}
      placeholders={placeholders}
    />
  );
};

export default Post;
