(function($)
{
	$(function()
	{
		if ($.tablemate.defaults.autoInitialise)
		{
			$($.tablemate.defaults.autoInitialiseSelector).tablemate();
		}
	});
})(jQuery);
