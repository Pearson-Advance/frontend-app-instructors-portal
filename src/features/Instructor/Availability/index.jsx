import React, { useState } from 'react';
import { Button } from 'react-paragon-topaz';

import AddEvent from 'features/Instructor/AddEvent';

const Availability = () => {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const handleAddEventModal = () => setIsAddEventOpen(!isAddEventOpen);

  return (
    <article>
      <AddEvent
        isOpen={isAddEventOpen}
        onClose={handleAddEventModal}
      />
      <div className="d-flex justify-content-between align-items-baseline bg-primary px-3 py-2 rounded-top">
        <h4 className="text-white">Availability</h4>
        <Button variant="inverse-primary" onClick={handleAddEventModal}>
          <i className="fa-light fa-plus pr-2" />
          New event
        </Button>
      </div>
    </article>
  );
};

export default Availability;
