import { useEffect, useState } from "react";

export default function Timer(props: {
  precision: number;
  onTimerUpdate?: (number: number) => void;
  running: boolean;
}) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (props.running) {
      const updater = setTimeout(() => {
        console.log(time + props.precision);
        setTime((oldTime) => oldTime + props.precision);
      }, 1000 * props.precision);
      
      return () => clearTimeout(updater);
    }
  }, [props.running, time]);

  useEffect(() => {
    props.onTimerUpdate?.(time);
  }, [time]);

  function formattedTime() {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const remainder = (time - seconds).toFixed(Math.log10(1 / props.precision));

    function formatNumber(n: number) {
      return n < 10 ? `0${n}` : `${n}`;
    }

    return props.precision >= 1
      ? `${formatNumber(minutes)}:${formatNumber(seconds)}`
      : `${formatNumber(minutes)}:${formatNumber(seconds)}.${remainder
          .toString()
          .substring(2)}`;
  }

  return <span className="timer">{formattedTime()}</span>;
}
