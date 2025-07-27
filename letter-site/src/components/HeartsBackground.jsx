import React from 'react';

function HeartSVG({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 456.075"
      className={className}
    >
      <path fill="#F77AA0" d="M253.648 83.482c130.39-219.052 509.899 65.491-.513 372.591-514.778-328.934-101.872-598.684.513-372.591z"/>
      <path fill="#EC557A" d="M121.414.647c48.667-4.845 100.027 17.922 129.334 76.927a197.378 197.378 0 013.538 11.586c10.541 34.289.093 49.641-12.872 50.551-18.137 1.274-20.215-14.849-24.967-27.641-23.756-63.973-57.673-99.447-100.014-110.208 1.655-.432 3.313-.838 4.981-1.215zm223.073 9.932C490.816-28.5 661.321 195.704 279.469 439.707 561.641 215.546 470.391 36.151 344.487 10.579z"/>
      <path fill="#FA9EBB" d="M130.561 35.502C87.904 31.256 42.91 59.4 31.389 101.568c-7.867 25.592-.07 37.051 9.607 37.73 13.536.948 15.088-11.084 18.634-20.632 17.732-47.748 43.045-74.225 74.65-82.255a107.734 107.734 0 00-3.719-.909z"/>
    </svg>
  );
}

export default function HeartsBackground() {
  return (
    <div className="pointer-events-none fixed top-0 left-0 w-screen h-screen z-[60]">
      <div className="hidden sm:block">
        <HeartSVG className="absolute left-[6vw] top-[12%] w-12 h-12 animate-[bounce_2.2s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
        <HeartSVG className="absolute left-[7vw] top-[32%] w-12 h-12 animate-[bounce_2.2s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }} />
        <HeartSVG className="absolute left-[8vw] top-[58%] w-12 h-12 animate-[bounce_2.2s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
        <HeartSVG className="absolute left-[6vw] top-[78%] w-12 h-12 animate-[bounce_2.2s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' }} />
        <HeartSVG className="absolute right-[6vw] top-[12%] w-12 h-12 animate-[bounce_2.2s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
        <HeartSVG className="absolute right-[7vw] top-[32%] w-12 h-12 animate-[bounce_2.2s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }} />
        <HeartSVG className="absolute right-[8vw] top-[58%] w-12 h-12 animate-[bounce_2.2s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
        <HeartSVG className="absolute right-[6vw] top-[78%] w-12 h-12 animate-[bounce_2.2s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' }} />
      </div>
      <div className="block sm:hidden">
        <HeartSVG className="absolute left-[10vw] top-[20%] w-16 h-16 opacity-70 animate-[bounce_2.2s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
        <HeartSVG className="absolute right-[10vw] top-[80%] w-16 h-16 opacity-70 animate-[bounce_2.2s_ease-in-out_infinite]" style={{ animationDelay: '0.7s' }} />
      </div>
    </div>
  );
}
