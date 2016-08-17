import React from 'react';
import Portal from 'react-portal';

const popoverWidth = 350;
const popoverHeight = 150;

const baseButtonStyles = {
  marginBottom: '350px',
  backgroundColor: '#DDD',
  borderRadius: '3px',
  padding: '5px',
  cursor: 'pointer',
  textAlign: 'center'
};

const basePopoverStyles = {
  position: 'absolute',
  height: popoverHeight,
  width: popoverWidth,
  backgroundColor: '#FFF',
  boxShadow: '0 0 3px rgba(0,0,0,.5)'
};

const getPopoverPos = targetBounds => {

  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const spaceAbove = targetBounds.top;
  const spaceBelow = viewportHeight - targetBounds.bottom;
  const spaceLeft = targetBounds.left;
  const spaceRight = viewportWidth - targetBounds.right;

  const top = spaceAbove > spaceBelow ? targetBounds.top - popoverHeight : targetBounds.bottom;
  const left = spaceLeft > spaceRight ? targetBounds.right - popoverWidth : targetBounds.left;

  return {
    top,
    left
  }
};

const isInView = (target, scrollableAncestor) => {

  // TODO: Fix this depending on scrollableAncestor being the closest positioned relative/absolute parent
  const targetBounds = {
    top: target.offsetTop,
    bottom: target.offsetTop + target.offsetHeight
  };

  // TODO: Left/right (horizontal scrolling)
  const scrollBounds = {
    top: scrollableAncestor.scrollTop,
    bottom: scrollableAncestor.scrollTop + scrollableAncestor.offsetHeight
  };

  return targetBounds.bottom > scrollBounds.top && targetBounds.top < scrollBounds.bottom;
};

// TODO: Bind element reposition/resize
// TODO: Bind close on click off popover

class PopoverButton extends React.Component {

  constructor() {
    super();
    this.state = {
      isInView: true
    };

    this.initialiseButton = this.initialiseButton.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.positionPopover = this.positionPopover.bind(this);
  }

  componentWillUnmount() {
    if (this.scrollableAncestor && this.scrollListener) {
      this.scrollableAncestor.removeEventListener(this.scrollListener);
    }
    window.removeEventListener(this.windowResizeListener);
  }

  initialiseButton(ref) {
    this.button = ref;
    // TODO: Find closest scrollable, not just parent
    if (ref.parentNode.classList.contains('scrollable')) {
      this.scrollableAncestor = ref.parentNode;
      this.windowResizeListener = window.addEventListener('resize', this.positionPopover);
      this.scrollListener = this.scrollableAncestor.addEventListener('scroll', this.positionPopover);
    }
  }

  togglePopover() {
    if (this.state.isOpen) {
      this.setState({isOpen: false});
    } else {
      // Set isInView in positionPopover
      this.setState({isOpen: true, isInView: false}, this.positionPopover)
    }
  }

  positionPopover() {
    if (this.state.isOpen) {
      const targetBounds = this.button.getBoundingClientRect();
      const popoverPos = getPopoverPos(targetBounds);
      this.setState({
        isInView: isInView(this.button, this.scrollableAncestor),
        popoverTop: popoverPos.top,
        popoverLeft: popoverPos.left
      });
    }
  }

  render() {
    return (
      <div style={baseButtonStyles} onClick={this.togglePopover} ref={this.initialiseButton}>
        Toggle Popover
        <Portal isOpened={this.state.isOpen}>
          <div
            style={{
              ...basePopoverStyles,
              top: this.state.popoverTop,
              left: this.state.popoverLeft,
              visibility: this.state.isInView ? 'visible' : 'hidden'
            }}
          />
        </Portal>
      </div>
    )
  }
}

export default PopoverButton;
