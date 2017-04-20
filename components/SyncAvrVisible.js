
'use strict';

import {AFrameComponent} from './AFrameComponent';
import {registerComponentClass, registerSystemClass} from './AFrameComponent';

/**
* Sync the visible property of the object between clients.
* Requires both a [sync-system]{@link module:altspace/components.sync-system} component on the `a-scene`, and a
* [sync]{@link module:altspace/components.sync} component on the target entity. @aframe
* @alias sync-visible
* @memberof module:altspace/components
* @extends module:altspace/components.AFrameComponent
*/

class SyncAvrVisible extends AFrameComponent
{
	get dependencies(){
		return ['sync'];
	}

	init()
	{
		this.sync = this.el.components.sync;

		// wait for firebase connection to start sync routine
		if(this.sync.isConnected)
			start();
		else
			this.el.addEventListener('connected', this.start.bind(this));
	}

	start()
	{
		let isVisible = this.sync.dataRef.child('avr-visible');
		let refChangedLocked = false;
		let firstValue = true;
		let self = this;

		this.el.addEventListener('componentchanged', event =>
		{
			let name = event.detail.name;
			let oldData = event.detail.oldData;
			let newData = event.detail.newData;

			if (name === 'avr-visible' && !refChangedLocked && oldData !== newData && self.sync.isMine)
			{
				//For some reason A-Frame has a misconfigured material reference if we do this too early
				setTimeout(() => avrVisibleRef.set(newData), 0);
			}
		});

		avrVisibleReg.on('value', snapshot => {
			if(!self.sync.isMine || firstValue)
			{
				let isVisible = snapshot.val();

				refChangedLocked = true;
				self.el.setAttribute('avr-visible', isVisible);
				refChangedLocked = false;

				firstValue = false;
			}
		});
	}
}

	
if (window.AFRAME)
{
	registerComponentClass('sync-avr-visble', SyncAvrVisible);
}


export default SyncAvrVisible;