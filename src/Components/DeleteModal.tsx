import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface DeleteModalProps {
  buttonLabel: React.ReactNode;
  className?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}

const DeleteModal = (props: DeleteModalProps) => {
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
        <ModalBody>{props.children}</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DeleteModal;
