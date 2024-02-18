import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import compiler from "./compiler";

const Body = styled.div`
  background: #eee;
  min-height: 100vh;

  h1 {
    margin: 0;
    padding: 20px 0 0;
  }
`;

const Main = styled.main`
  margin: 0 auto;
  width: 1200px;
  max-width: calc(100% - 20px);
`;

const Editor = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Textarea = styled.textarea`
  border-radius: 10px;
  border: none;
  resize: none;
  width: 50%;
  height: 80vh;
  padding: 10px;
`;

function debounce(func, timeout = 1000) {
  let timer;
  return (...args) => {
    console.log("...", timer);
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log("inside");
      func(...args);
    }, timeout);
  };
}

const sample = `
export const x: string = 'Hello world';

export default function meaningPlus(x: number):number {
  return 42 + x;
}
`.trim();

export default function App() {
  const [src, setSrc] = useState(sample);
  const [out, setOut] = useState("");

  const ref = useRef(debounce((src) => setOut(compiler(src))));

  useEffect(() => {
    setOut("Loading...");
    ref.current(src);
  }, [src]);

  return (
    <Body>
      <Main>
        <h1>Typescript to Types Declarations</h1>
        <p>
          Write or paste your TS code on the left, get their generated Types
          Declarations (index.d.ts) on the right:
        </p>
        <Editor>
          <Textarea onChange={(e) => setSrc(e.target.value)} value={src} />
          <Textarea
            readOnly
            value={typeof out === "string" ? out : JSON.stringify(out, null, 2)}
          />
        </Editor>
      </Main>
    </Body>
  );
}
