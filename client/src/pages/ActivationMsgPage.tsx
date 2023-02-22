import React from 'react';
import '../styles/ActivationMsgPage.scss';

const ActivationMsgPage = () => {
  return (
    <div className="messageBox">
      <span className="messageBox__content">
        We sent you an activation link. Please check your e-mail and click on the link to
        activate your account.
      </span>
    </div>
  );
};

export default ActivationMsgPage;
