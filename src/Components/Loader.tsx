// Words of affirmation while things load. Hmmm... :)

const Loader = () => {
  const array: [string, string][] = [
    ['You are loved', 'Even on the bad hair days'],
    ['Wow! You look so good!', 'I really love the new outfit.'],
    ['You are the only one', "I'd want to be Quarantined With"],
    ['I give myself space', 'To learn and grow'],
    ['Breathe in', 'Breathe out'],
    ['I am creatively inspired', 'By the world around me'],
    ['I feel so lucky', 'To have you'],
    ["It's not what you think up", "It's what you get down."],
  ];
  const myArr = array[Math.floor(Math.random() * array.length)];

  return (
    <div className="py-10 text-center">
      <h1 className="text-2xl font-extrabold">{myArr[0]}</h1>
      <h3 className="mt-1 text-muted">{myArr[1]}</h3>
      <div className="mt-4 flex justify-center gap-3 text-2xl text-accent">
        <i className="fa-solid fa-heart heart-beat" style={{ animationDelay: '0ms' }} aria-hidden />
        <i className="fa-solid fa-heart heart-beat" style={{ animationDelay: '200ms' }} aria-hidden />
        <i className="fa-solid fa-heart heart-beat" style={{ animationDelay: '400ms' }} aria-hidden />
      </div>
    </div>
  );
};

export default Loader;
