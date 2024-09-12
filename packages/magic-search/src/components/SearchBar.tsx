import React from "react";

const SearchBar = ({
  innerRef,
  handleSubmit,
  value,
  classNames,
  handleChange,
  placeholder,
}: {
  innerRef: React.RefObject<HTMLInputElement>;
  value: string;
  classNames: string;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => {
  return (
    <div className="magic-search-input-wrap">
      <div className="magic-search-input-container">
        <form onSubmit={handleSubmit} className="magic-search-form">
          <input
            ref={innerRef}
            value={value}
            onChange={handleChange}
            className={classNames}
            placeholder={placeholder}
          />
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
