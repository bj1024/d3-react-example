import {useEffect, useRef, useState} from "react";

type Props = {}

export const CounterExample = ({}: Props) => {

  const [count, setCount] = useState(0)

  // フックに関するよくある質問 – React
  // 副作用の依存リストが頻繁に変わりすぎる場合はどうすればよいですか？
  // https://ja.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often

  // useEffectは１回のみCallされる。（第２引数が[]のため。）
  // setIntervalは発生するが、初回のcount変数がclosureにキャプチャされ、
  // closure内ではずっと0のままとなってしまう。そのためいつも0+1=1となり、コンポーネントが更新されない。
  // useEffect(() => {
  //   const id = setInterval(() => {
  //     console.debug(`setInterval count={count}`,count)
  //     setCount(count + 1); // This effect depends on the `count` state
  //   }, 1000);
  //   return () => clearInterval(id);
  // }, []); // 🔴 Bug: `count` is not specified as a dependency


  // countを渡さないバージョン。setCountは、((prevState: S) => S)を引数に取れる。
  useEffect(() => {
    const id = setInterval(() => {
      console.debug(`setInterval`)
      setCount(prevState => prevState + 1) // (prevState) => { return prevState + 1}を短縮したもの。
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      {count}
    </div>
  )
}

export default CounterExample
