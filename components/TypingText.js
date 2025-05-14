import React, {useRef, useEffect, useState} from 'react';
import {StyleSheet, Text} from 'react-native';

export default function TypingText(props){
  let [text, setText] = useState("");
  let [cursorColor, setCursorColor] = useState("transparent");
  let [messageIndex, setMessageIndex] = useState(0);
  let [textIndex, setTextIndex] = useState(0);
  let [timeouts, setTimeouts] = useState({
    cursorTimeout: undefined,
    typingTimeout: undefined,
    firstNewLineTimeout: undefined,
    secondNewLineTimeout: undefined,
  });

  let textRef = useRef(text);
  textRef.current = text;

  let cursorColorRef = useRef(cursorColor);
  cursorColorRef.current = cursorColor;

  let messageIndexRef = useRef(messageIndex);
  messageIndexRef.current = messageIndex;

  let textIndexRef = useRef(textIndex);
  textIndexRef.current = textIndex;

  let timeoutsRef = useRef(timeouts);
  timeoutsRef.current = timeouts;

  let [isDeleting, setIsDeleting] = useState(false);
  let isDeletingRef = useRef(isDeleting);
  isDeletingRef.current = isDeleting;

  let typingAnimation = () => {
    if (!isDeletingRef.current) {
      if (textIndexRef.current < props.text[messageIndexRef.current].length) {
        setText(textRef.current + props.text[messageIndexRef.current].charAt(textIndexRef.current));
        setTextIndex(textIndexRef.current + 1);
  
        let updatedTimeouts = { ...timeoutsRef.current };
        updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 200);
        setTimeouts(updatedTimeouts);
      } else if (messageIndexRef.current + 1 < props.text.length) {
        setText(textRef.current + '\n');
        setMessageIndex(messageIndexRef.current + 1);
        setTextIndex(0);
  
        let updatedTimeouts = { ...timeoutsRef.current };
        updatedTimeouts.firstNewLineTimeout = setTimeout(newLineAnimation, 120);
        updatedTimeouts.secondNewLineTimeout = setTimeout(newLineAnimation, 200);
        updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 300);
        setTimeouts(updatedTimeouts);
      } else {
        // ✅ Typing done — begin deleting phase
        setIsDeleting(true);
        let updatedTimeouts = { ...timeoutsRef.current };
        updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 1000); // Pause before deleting
        setTimeouts(updatedTimeouts);
      }
    } else {
      // Deleting phase
      if (textRef.current.length > 0) {
        setText(textRef.current.slice(0, -1));
  
        let updatedTimeouts = { ...timeoutsRef.current };
        updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 200); // Deleting speed
        setTimeouts(updatedTimeouts);
      } else {
        setIsDeleting(false);
        setMessageIndex(0);
        setTextIndex(0);
  
        let updatedTimeouts = { ...timeoutsRef.current };
        updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 500); // Restart after pause
        setTimeouts(updatedTimeouts);
  
        if (props.onComplete) {
          props.onComplete();
        }
      }
    }
  };

  let newLineAnimation = () => {
    setText(textRef.current);
  };

  let cursorAnimation = () => {
    if(cursorColorRef.current === "transparent"){
      setCursorColor("#fff");
    }else{
      setCursorColor("transparent");
    }
  }

  useEffect(() => {
    let updatedTimeouts = {...timeoutsRef.current};
    updatedTimeouts.typingTimeout = setTimeout(typingAnimation, 500);
    updatedTimeouts.cursorTimeout = setInterval(cursorAnimation, 350);
    setTimeouts(updatedTimeouts);

    return () => {
      clearTimeout(timeoutsRef.current.typingTimeout);
      clearTimeout(timeoutsRef.current.firstNewLineTimeout);
      clearTimeout(timeoutsRef.current.secondNewLineTimeout);
      clearInterval(timeoutsRef.current.cursorTimeout);
    }
  }, []);

  return(
    <Text style={styles.text}>
      {text}
      <Text style={{color: cursorColor}}>|</Text>
    </Text>
  )
}

let styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 60,
    fontWeight: 'bold',
    paddingRight: 15
  }
})