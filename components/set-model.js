/* global AFRAME from https://github.com/aframevr/360-image-gallery-boilerplate/tree/master/components*/

/**
 * Component that listens to an event, toggles the visibility of an object.
 */
AFRAME.registerComponent('set-model', {
  schema: {
    on: {type: 'string'},
    target: {type: 'selector'}
  },

  init: function () {
    var data = this.data;
    var el = this.el;
    var isVisible = el.getAttribute('avr-visible');


    el.addEventListener(data.on, function () {
      // Toggle visibility back and forth
      if( isVisible == 'true') {   
        isVisible = 'false';
      } else { 
        isVisible = 'true'; 
      }
       
      // Update visibility on object 
      data.target.setAttribute('avr-visible', isVisible);
      
    });
  }
});