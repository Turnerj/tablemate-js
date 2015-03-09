var selectedExample = 'example-1',
	selectedSize = 'desktop',
	tablemateEnabled = true;

$(function()
{
	var $demoFrame = $('#DemoFrame');
	
	$('#ExampleSelect').on('change', function()
	{
		var $this = $(this);
		selectedExample = $this.val();
		
		$demoFrame.attr('src', 'examples/' + selectedExample + '.html' + (!tablemateEnabled ? '?without' : ''));
	}).change();
	
	$('#SizeSelect').on('change', function()
	{
		var $this = $(this);
		selectedSize = $this.val();
		
		$demoFrame.parent().removeClass().addClass('frameContainer ' + selectedSize);
	}).change();
	
	$('.tablemateToggle .switch').on('click', function()
	{
		var $this = $(this);
		$this.parent().toggleClass('enabled disabled');
		tablemateEnabled = $this.parent().hasClass('enabled');
		
		$('#ExampleSelect').change();
	});
});