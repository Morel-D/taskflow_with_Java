const TextTruncate = ({ text, maxLength }) => {
    const shouldTruncate = text.length > maxLength;
    const truncatedText = shouldTruncate ? `${text.slice(0, maxLength)}...` : text;
  
    return <>{truncatedText}</>;
  };


  const DateCell = ({ children }) => {
    return (
      <div>
        {new Date(children).toLocaleString('en-US', {
          // year: 'numeric',
          month: 'short',
          day: 'numeric',
          // year: "2-digit",
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    );
  };

  export {TextTruncate, DateCell}
