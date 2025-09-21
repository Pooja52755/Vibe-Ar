import { useState, useEffect } from "react";

export default function useTypingEffect(texts, speed = 60, pause = 1200, eraseSpeed = 30) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [char, setChar] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    let timeout;
    if (isTyping && !isErasing) {
      if (char < texts[index].length) {
        timeout = setTimeout(() => {
          setDisplayed((prev) => prev + texts[index][char]);
          setChar((c) => c + 1);
        }, speed);
      } else {
        timeout = setTimeout(() => {
          setIsErasing(true);
        }, pause);
      }
    } else if (isErasing) {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed((prev) => prev.slice(0, -1));
        }, eraseSpeed);
      } else {
        setIsErasing(false);
        setIsTyping(true);
        setChar(0);
        setIndex((i) => (i + 1) % texts.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [char, isTyping, isErasing, index, texts, speed, pause, eraseSpeed, displayed]);

  return displayed;
}
