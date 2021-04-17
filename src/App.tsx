function App() {
  const headers = [
    {
      title: 'To',
      input: 'Hooli Customer Support (support@hooli.xyz)',
    },
    {
      title: 'Subject',
      input: 'Questions about Hooli',
    },
    {
      title: 'From',
      input: '',
    },
  ];
  return (
    <div className="p-2 bg-transparent w-full h-screen">
      <div className="flex shadow-lg flex-col h-full">
        <div className="px-6 py-4 bg-gray-700 w-full text-white font-bold rounded-t-lg">
          Email Demo
        </div>
        <hr className="mx-6" />
        <div className="bg-white px-6 py-6">
          {headers.map((header, i) => (
            <h1 className={i !== 0 ? 'mt-2' : ''}>
              <a className="text-gray-500">{header.title}: </a>
              <a className="font-semibold text-gray-800">{header.input}</a>
            </h1>
          ))}
        </div>
        <hr className="mx-6" />
        <div className="px-6 py-4 flex-auto overflow-scroll">
          Hey there, Lorem Ipsum is simply dummy text of the printing and
          typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s, when an unknown printer took a galley
          of type and scrambled it to make a type specimen book. It has survived
          not only five centuries Cheers, Richard
        </div>
        <div className="flex px-6 py-2 bg-gray-100">
          <button className="bg-blue-600 hover:bg-blue-500 py-2 px-12 rounded-md text-white font-medium">
            Send
          </button>
          <div className="flex-1 flex items-stretch">
            <div className="flex-1 flex items-center">
              <button className="ml-4 focus:outline-none">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="bold"
                  className="h-4 w-4 text-gray-400 hover:text-gray-600"
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
              <button className="ml-3 focus:outline-none">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="italic"
                  className="h-4 w-4 text-gray-400 hover:text-gray-600"
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
              <button className="ml-3 focus:outline-none">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="underline"
                  className="h-4 w-4 text-gray-400 hover:text-gray-600"
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
              <button className="focus:outline-none">
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
