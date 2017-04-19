 AFRAME.registerComponent('avr-visible',
	{
		schema: { type: 'boolean', default: true},
    	init: function () {
      		this.el.addEventListener('model-loaded', this.setVisibility.bind(this)); 
    	},
		setVisibility: function(){
			this.el.object3D.traverse(function(o){
				o.visible = this.data;
				console.log("hello world" + o.visible);
			}.bind(this));
		},
    	update: function () {
      		this.setVisibility();
    	}
});