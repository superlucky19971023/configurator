const FloatingToolbar = () => {
  return (
    <div className="absolute bg-gray-50 dark:bg-slate-900">
      <nav className="z-50 flex shrink-0 grow-0 justify-around gap-4 border-t border-gray-200 bg-white/50 p-2.5 shadow-lg backdrop-blur-lg dark:border-slate-600/60 dark:bg-slate-800/50 fixed top-2/4 -translate-y-3/4 right-6 min-h-[auto] min-w-[40px] flex-col rounded-lg border">
        <a
          href="#profile"
          data-tippy-content="This is a tooltip"
          data-tippy-placement="right"
          data-tippy-trigger="hover"
          className="flex aspect-square min-h-[32px] w-12 flex-col items-center justify-center gap-1 rounded-full border-2 p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 hover:underline">
          <svg
            version="1.0"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="800px"
            height="800px"
            viewBox="0 0 64 64"
            enable-background="new 0 0 64 64"
            xml:space="preserve">
            <title>Show dimensions</title>
            <g>
              <path
                fill="#231F20"
                d="M62.839,17.992L46.021,1.174c-1.551-1.549-4.058-1.549-5.606,0L1.173,40.414
		c-1.547,1.551-1.547,4.057,0,5.607L17.99,62.838c1.55,1.549,4.059,1.549,5.608,0l39.24-39.24
		C64.387,22.049,64.387,19.541,62.839,17.992z M61.437,22.196l-39.24,39.241c-0.774,0.774-2.029,0.774-2.804,0L2.575,44.619
		c-0.774-0.773-0.774-2.03-0.001-2.804l2.104-2.101l2.803,2.802c0.387,0.389,1.014,0.389,1.402,0
		c0.387-0.386,0.387-1.013-0.001-1.399l-2.803-2.805l2.803-2.803l5.605,5.607c0.389,0.387,1.015,0.387,1.401,0
		c0.388-0.389,0.388-1.016,0-1.402l-5.604-5.605l2.802-2.804l2.803,2.804c0.388,0.386,1.015,0.386,1.402,0
		c0.386-0.389,0.386-1.014,0-1.402l-2.804-2.803l2.804-2.803l2.802,2.803c0.389,0.388,1.014,0.388,1.403,0
		c0.386-0.387,0.386-1.014,0-1.402l-2.805-2.803l2.805-2.802l5.605,5.605c0.387,0.388,1.014,0.388,1.401,0s0.388-1.014,0-1.401
		l-5.605-5.605l2.801-2.805l2.805,2.804c0.388,0.387,1.015,0.387,1.4,0.001c0.389-0.389,0.389-1.016,0-1.402l-2.803-2.803
		l2.803-2.803l2.804,2.803c0.386,0.387,1.014,0.387,1.401,0c0.387-0.387,0.387-1.015,0-1.401l-2.803-2.804l2.803-2.801l5.605,5.604
		c0.388,0.387,1.015,0.387,1.401,0c0.388-0.388,0.388-1.015,0-1.401l-5.606-5.606l2.804-2.802l2.803,2.802
		c0.388,0.388,1.015,0.388,1.401,0c0.388-0.388,0.388-1.015,0-1.401l-2.803-2.802l2.102-2.104c0.774-0.772,2.03-0.772,2.804,0
		l16.817,16.817C62.211,20.167,62.211,21.423,61.437,22.196z"
              />
              <path
                fill="#231F20"
                d="M51.007,17.006c-2.209,0-4,1.791-4,4s1.791,4,4,4s4-1.791,4-4S53.216,17.006,51.007,17.006z M51.007,23.006
		c-1.104,0-2-0.896-2-2s0.896-2,2-2s2,0.896,2,2S52.111,23.006,51.007,23.006z"
              />
            </g>
          </svg>
        </a>

        <a
          href="#analytics"
          className="flex aspect-square min-h-[32px] w-12 flex-col items-center justify-center gap-1 rounded-full border-2 p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800">
          <svg fill="#000000" width="800px" height="800px" viewBox="-9 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <title>door</title>
            <path d="M13.28 5.88c-0.12-0.080-0.28-0.12-0.44-0.12 0 0 0 0-0.040 0h-12c-0.44 0-0.84 0.36-0.84 0.84v15.080c0 0.44 0.36 0.84 0.84 0.84h2.4v2.92c0 0.28 0.12 0.52 0.36 0.68 0.12 0.080 0.28 0.12 0.44 0.12 0.12 0 0.24-0.040 0.32-0.080l8.84-3.76c0.32-0.12 0.52-0.44 0.52-0.76v-15.040c-0.040-0.28-0.16-0.56-0.4-0.72zM1.64 20.8v-13.4h7.16l-5.080 2.2c-0.32 0.12-0.52 0.44-0.52 0.76v10.44h-1.56zM12 21.12l-7.12 3.040v-13.28l7.12-3.040v13.28zM7.64 16.84c0 0.464-0.376 0.84-0.84 0.84s-0.84-0.376-0.84-0.84c0-0.464 0.376-0.84 0.84-0.84s0.84 0.376 0.84 0.84z"></path>
          </svg>
        </a>

        <a
          href="#settings"
          className="flex aspect-square min-h-[32px] w-12 flex-col items-center justify-center gap-1 rounded-full border-2 p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800">
          <svg
            fill="#000000"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="800px"
            height="800px"
            viewBox="0 0 72.41 72.41"
            xml:space="preserve">
            <g>
              <path
                d="M55.341,31.639c-0.456-0.455-1.197-0.455-1.651,0l-4.179,4.179c-0.044-9.368-1.647-18.182-4.547-24.855
		C41.89,3.894,37.687,0,33.125,0c-9.199,0-16.4,15.905-16.4,36.205c0,20.302,7.204,36.205,16.4,36.205
		c0.644,0,1.167-0.524,1.167-1.168c0-0.643-0.523-1.168-1.167-1.168c-7.625,0-14.064-15.511-14.064-33.869
		c0-18.357,6.441-33.869,14.064-33.869c3.526,0,7.056,3.485,9.698,9.56c2.776,6.38,4.313,14.854,4.353,23.903l-4.156-4.16
		c-0.454-0.455-1.195-0.455-1.651,0c-0.454,0.456-0.454,1.196,0,1.651l6.984,6.989l6.989-6.989
		C55.799,32.835,55.799,32.095,55.341,31.639z"
              />
            </g>
          </svg>
        </a>

        <hr className="dark:border-gray-700/60" />

        <a href="/" className="flex aspect-square min-h-[32px] w-12 flex-col items-center justify-center gap-1 rounded-full border-2 p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800">
          <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8H2V4.5A2.5 2.5 0 0 1 4.5 2H8v1H4.5A1.5 1.5 0 0 0 3 4.5zm1.5 14A1.5 1.5 0 0 1 3 20.5V17H2v3.5A2.5 2.5 0 0 0 4.5 23H8v-1zM22 20.5a1.5 1.5 0 0 1-1.5 1.5H17v1h3.5a2.5 2.5 0 0 0 2.5-2.5V17h-1zM20.5 2H17v1h3.5A1.5 1.5 0 0 1 22 4.5V8h1V4.5A2.5 2.5 0 0 0 20.5 2zM14 7h4v4h1V6h-5zm-7 4V7h4V6H6v5zm11 3v4h-4v1h5v-5zm-7 4H7v-4H6v5h5z" />
            <path fill="none" d="M0 0h24v24H0z" />
          </svg>
        </a>
      </nav>
    </div>
  )
}
export default FloatingToolbar
