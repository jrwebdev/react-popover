// TODO: Allow scrollable selector to be passed in
// TODO: Bind element reposition/resize
// TODO: Bind close on click off popover
// TODO: Horizontal scrolling
// TODO: Scrolling within scrolling
// TODO: Allow scrolling to work when over popover

import React from 'react';
import Portal from 'react-portal';

const popoverWidth = 350;
const popoverHeight = 150;

const basePopoverStyles = {
  position: 'absolute',
  backgroundColor: '#FFF',
  boxShadow: '0 0 3px rgba(0,0,0,.5)'
};

// TODO: Fix this to check overflow-y and CSS styles
// TODO: Allow scrollable selector to be passed in
const isScrollable = target => (
    target.classList && target.classList.contains('scrollable') ||
    target === document.body
);

const getScrollableAncestor = target => isScrollable(target) ? target : getScrollableAncestor(target.parentNode);

// TODO: Optimise this so all the relative-positioned DOM elements are cached
const getPosRelativeToAncestor = (target, ancestor, pos = {top: target.offsetTop, left: target.offsetLeft}) => {

  const {parentNode} = target;

  if (parentNode === ancestor) {
    return pos;
  }

  const parentNodePosition = window.getComputedStyle(parentNode).getPropertyValue('position');
  if (parentNodePosition === 'relative' || parentNodePosition === 'absolute') {
    pos.top += parentNode.offsetTop;
    pos.left += parentNode.offsetLeft;
  }

  return getPosRelativeToAncestor(parentNode, ancestor, pos);
};

const getPopoverPos = (anchor, popover) => {

  const anchorBounds = anchor.getBoundingClientRect();
  const popoverHeight = popover.offsetHeight;
  const popoverWidth = popover.offsetWidth;

  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // TODO: Take popover height into consideration (e.g. do not display above if it is higher than the available space)
  const spaceAbove = anchorBounds.top;
  const spaceBelow = viewportHeight - anchorBounds.bottom;
  const spaceLeft = anchorBounds.left;
  const spaceRight = viewportWidth - anchorBounds.right;

  const top = spaceAbove > spaceBelow ? anchorBounds.top - popoverHeight : anchorBounds.bottom;
  const left = spaceLeft > spaceRight ? anchorBounds.right - popoverWidth : anchorBounds.left;

  return {
    top,
    left
  }
};

const isInView = (anchor, scrollableAncestor) => {

  const anchorPos = getPosRelativeToAncestor(anchor, scrollableAncestor);
  const anchorBounds = {
    top: anchorPos.top,
    bottom: anchorPos.top + anchor.offsetHeight
  };

  // TODO: Left/right (horizontal scrolling)
  const scrollBounds = {
    top: scrollableAncestor.scrollTop,
    bottom: scrollableAncestor.scrollTop + scrollableAncestor.offsetHeight
  };

  return anchorBounds.bottom > scrollBounds.top && anchorBounds.top < scrollBounds.bottom;
};

class Popover extends React.Component {

  constructor() {
    super();
    this.state = {
      isInView: true
    };

    this.initialise = this.initialise.bind(this);
    this.setPopover = this.setPopover.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.positionPopover = this.positionPopover.bind(this);
  }

  componentWillUnmount() {
    if (this.scrollableAncestor && this.scrollListener) {
      this.scrollableAncestor.removeEventListener(this.scrollListener);
    }
    window.removeEventListener(this.windowResizeListener);
  }

  initialise(ref) {
    this.anchor = ref;
    this.scrollableAncestor = getScrollableAncestor(ref.parentNode);
    this.windowResizeListener = window.addEventListener('resize', this.positionPopover);
    this.scrollListener = this.scrollableAncestor.addEventListener('scroll', this.positionPopover);
  }

  setPopover(ref) {
    this.popover = ref;
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
      const popoverPos = getPopoverPos(this.anchor, this.popover);
      this.setState({
        isInView: isInView(this.anchor, this.scrollableAncestor),
        popoverTop: popoverPos.top,
        popoverLeft: popoverPos.left
      });
    }
  }

  render() {
    return (
      <div>
        <span onClick={this.togglePopover} ref={this.initialise}>{this.props.anchor}</span>
        <Portal isOpened={this.state.isOpen}>
          <div
            ref={this.setPopover}
            style={{
              ...basePopoverStyles,
              top: this.state.popoverTop,
              left: this.state.popoverLeft,
              visibility: this.state.isInView ? 'visible' : 'hidden'
            }}
          >
            {this.props.children}
          </div>
        </Portal>
      </div>
    )
  }
}

Popover.proptypes = {
  anchor: React.PropTypes.element,
  children: React.PropTypes.element
}

export default Popover;
