import React from 'react'

interface ActionModalProps {
  onClose: () => void;
  handle: () => void;
}
export const ChangeNameModal: React.FC<ActionModalProps> = ({ onClose, handle}) => {
  return (
    <div className="modal-content text-sky-200">
      <h2>Change Name</h2>
      {/* Form elements go here */}
      <button onClick={onClose}>Close</button>
      <button onClick={handle}>Handle</button>
    </div>
  );
};


export const FindGroupModal: React.FC<ActionModalProps> = ({ onClose, handle}) => {
  return (
    <div className="modal-content text-sky-200">
      <h2>Find Group</h2>
      {/* Form elements go here */}
      <button onClick={onClose}>Close</button>
      <button onClick={handle}>Handle</button>
    </div>
  );
};

export const LeaveGroupModal: React.FC<ActionModalProps> = ({ onClose, handle}) => {
  return (
    <div className="modal-content text-sky-200">
      <h2>LeaveGroupModal</h2>
      {/* Form elements go here */}
      <button onClick={onClose}>Close</button>
      <button onClick={handle}>Handle</button>
    </div>
  );
};
export const ChangeGroupNameModal: React.FC<ActionModalProps> = ({ onClose, handle}) => {
  return (
    <div className="modal-content text-sky-200">
      <h2>ChangeGroupNameModal</h2>
      {/* Form elements go here */}
      <button onClick={onClose}>Close</button>
      <button onClick={handle}>Handle</button>
    </div>
  );
};
