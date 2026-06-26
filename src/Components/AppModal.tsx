import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface AppModalProps {
  buttonLabel: React.ReactNode;
  className?: string;
  title: React.ReactNode;
  // Cloned with an injected `toggle` prop; callers may also pass a string fallback.
  children: any;
}

const AppModal = (props: AppModalProps) => {
  const { buttonLabel, className, title } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button color="btn-primary-outline accentColor" onClick={toggle}>
        {buttonLabel}
      </Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>{React.cloneElement(props.children, { toggle })}</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AppModal;
