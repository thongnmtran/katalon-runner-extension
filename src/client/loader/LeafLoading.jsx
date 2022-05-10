// /* eslint-disable react/no-array-index-key */
import React from 'react';
import { BreedingRhombusSpinner } from 'react-epic-spinners';
import classnames from 'classnames';
import './Loading.scss';


export default ({
  fullscreen,
  overlaping,
  timeout = -1,
  text,
  onSubmitError,
  inTable = false
}) => {
  const [seconds, setSeconds] = React.useState(timeout);

  if (seconds > 0 && window.key?.alt) {
    window.location.reload();
  }
  if (seconds > 0 && !window.key?.ctrl) {
    setTimeout(
      () => setSeconds(
        (prevSeconds) => (prevSeconds > 0 ? seconds - 1 : prevSeconds)
      ), 1000
    );
  } else if (seconds === 0) {
    window.location.reload();
  }

  const handleAbord = React.useCallback(() => {
    setSeconds(-2);
  }, [setSeconds]);

  const handleSubmitError = React.useCallback(() => {
    setSeconds(-3);
    if (onSubmitError) {
      onSubmitError();
    }
  }, [setSeconds, onSubmitError]);

  const handleReload = React.useCallback(() => {
    window.location.reload();
  }, []);

  const isCounting = seconds >= 0;
  const isAborted = seconds <= -2;
  const isSubmitted = seconds <= -3;

  return (
    <div
      className={
        classnames(
          'loading overlap',
          'd-flex w-100 h-100 justify-content-center align-items-center',
          { overlaping, fullscreen, intable: inTable }
        )
      }
    >
      <BreedingRhombusSpinner color="#4285f4" size={75} animationDuration={isAborted ? 0 : undefined} />
      <div className="loading-text">
        {!isAborted
          ? (text || 'đang tải...').split('').map((c, i) => <span key={c + i}>{c}</span>)
          : !isSubmitted && 'Đã ngắt quá trình tải lại trang'}
      </div>
      {isCounting && (
        <div className={`reloading-text ${seconds === 0 ? 'fade slower' : ''}`}>tải lại sau {seconds} giây</div>
      )}
      {isCounting && (
        <button onClick={handleAbord} type="button" className="abort-reloading-button">Ngắt việc tải lại trang</button>
      )}
      {isAborted && !isSubmitted && (
        <div>
          <button onClick={handleSubmitError} type="button" className="abort-reloading-button">Báo lỗi</button>
          {' '}
          <button onClick={handleReload} type="button" className="abort-reloading-button">Tải Lại Trang</button>
        </div>
      )}
      {isSubmitted && (
        <>
          <span style={{ fontSize: '1rem', marginTop: '20px' }}>
            Chúng tôi rất tiếc vì sự cố này.<br />
            Hệ thống đã ghi nhận lỗi bạn gặp phải và sẽ xử lý sớm nhất có thể.<br />
            Ngoài ra bạn có thể báo cho quản trị viên để khắc phục sự cố nhanh hơn.
          </span>
          <button onClick={handleReload} type="button" className="abort-reloading-button">Thử Tải Lại Trang</button>
        </>
      )}
    </div>
  );
};
