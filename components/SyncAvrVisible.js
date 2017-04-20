'use strict';

/**
* Sync the visible property of the object between clients.
* Requires both a [sync-system]{@link module:altspace/components.sync-system} component on the `a-scene`, and a
* [sync]{@link module:altspace/components.sync} component on the target entity. @aframe
* @alias sync-visible
* @memberof module:altspace/components
* @extends module:altspace/components.AFrameComponent
*/

AFRAME.registerComponent('sync-avr-visible', {
	dependencies: ['avr-visible', 'sync'],
	init: function ()
	{
		this.sync = this.el.components.sync;

		// wait for firebase connection to start sync routine
		if(this.sync.isConnected)
			start();
		else
			this.el.addEventListener('connected', this.start.bind(this));
	},
	start: function ()
	{
		var avrVisibleRef = this.sync.dataRef.child('avr-visible');
		var refChangedLocked = false;
		var firstValue = true;
		var self = this;

		this.el.addEventListener('componentchanged', function (event) 
		{
			var name = event.detail.name;
			var oldData = event.detail.oldData;
			var newData = event.detail.newData;
			console.log("componentchanged " + newData);

			if (name === 'avr-visible' && !refChangedLocked && oldData !== newData && self.sync.isMine)
			{
				//For some reason A-Frame has a misconfigured material reference if we do this too early
				setTimeout(function () { avrVisibleRef.set(newData) }, 0);
				console.log(newData);
			}
		});

		avrVisibleRef.on('value', function (snapshot) {
			if(!self.sync.isMine || firstValue)
			{
				var isVisible = snapshot.val();
				if (isVisible === null) { return; }

				refChangedLocked = true;
				self.el.setAttribute('avr-visible', isVisible);
				refChangedLocked = false;

				firstValue = false;
			}
		});
	}
});
