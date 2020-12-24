// Words of affirmation appearing on screen while loader processes.
// Hmmm... :)

const Loader = () => {
  const array = [
    ["You are loved", "Even on the bad hair days"],
    ["Wow! You look so good!","I really love the new outfit."],
    ["Humans", "We are humans too."],
    ["I give myself space", "To learn and grow"],
    ["I am creatively inspired", "By the world around me"],
    ["I feel so lucky", "To have you"],
    ["It's not what you think up", "It's what you get down."]
  ];
  const arrayLength = array.length;
  const  myArr = array[Math.floor(Math.random() * Math.floor(arrayLength))];
  return (
    <div className="text-center">
      <h1 className="message">{myArr[0]}</h1>
      <h3 className="message">{myArr[1]}</h3>
    <span className="space heartbeat-loader">Loading...</span>
    <span className="space heartbeat-loader">Loading...</span>
    <span className="space heartbeat-loader">Loading...</span>
  </div>
);
 
  }
  
  export default Loader;