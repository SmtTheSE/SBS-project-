import React from "react";

const Container = ({ children, className }) => {
  return (
    <>
      <div className={`ml-[256px] w-[calc(100%-256px)] ${className}`}>{children}</div>
    </>
  );
};

export default Container;