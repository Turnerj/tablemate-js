(function($)
{
	$.tablemate = {
		defaults: {
			autoInitialise: true,
			autoInitialiseSelector: 'table.tablemate',
			
			analyse: {},
			
			allowResponsiveTableWidth: true,
			autoBreakOnBodyOverflow: true,
			breakPoint: {
				activeClass: 'breakPoint',
				width: 480
			},
			resizeTimeout: 100
		},
		debug: true,
		log: function()
		{
			if (this.debug && console && typeof console.log == 'function')
			{
				var args = Array.prototype.slice.call(arguments);
				args.unshift('[Tablemate]');
				console.log.apply(console, args);
			}
		}
	};
	
	$.fn.tablemate = function(Options)
	{
		var tmpData = {
			isResponsiveMode: false,
			isBreakPointActive: false,
			options: $.extend({}, $.tablemate.defaults, Options),
		};
		
		return this.each(function()
		{
			var table = this, 
				$table = $(table), 
				data = $.extend({}, tmpData);
			
			var result = $.tablemate.analysis.analyseTable(table, data.options.analyse);
			data.analysis = result;
			
			$table.data('tablemate', data);
			
			if ($.tablemate.tests)
			{
				$.tablemate.tests.setup.call(this, data);
			}
			
			//Setup Resizing
			function resizeCallback()
			{
				handleResize(table, $(table).data('tablemate'));
			}
			
			var breakTimeout = null;
			$(window).on('resize', function()
			{
				clearTimeout(breakTimeout);
				breakTimeout = setTimeout(resizeCallback, data.options.resizeTimeout);
			});
			resizeCallback();
			
			$.tablemate.log('Table Initialised', table);
		});
	}
	
	function handleResize(Element, Data, SkipBreakCheck)
	{
		var $this = $(Element);
		
		var currentWidth = Data.isBreakPointActive ? Data.breakWidth : $this.width();
		var parentWidth = $this.parent().width();
		var forceBreak = false;
		
		if (Data.options.allowResponsiveTableWidth && !Data.analysis.isInitialWidthPercentage)
		{
			if (!Data.inResponsiveMode)
			{
				if (parentWidth <= Data.analysis.initialWidth)
				{
					$this.css('width', '100%');
					Data.inResponsiveMode = true;
				}
			}
			else if (Data.inResponsiveMode)
			{
				if (parentWidth > Data.analysis.initialWidth)
				{
					$this.css('width', Data.analysis.initialWidth + 'px');
					Data.inResponsiveMode = false;
				}
			}
		}
		
		currentWidth = Data.isBreakPointActive ? Data.breakWidth : $this.width();
		
		if (Data.options.autoBreakOnBodyOverflow)
		{
			var bodyWidth = $(document.body).width();
			if (bodyWidth < currentWidth || (Data.isBreakPointActive && bodyWidth < Data.breakWidth))
			{
				forceBreak = true;
			}
		}
		
		if (parentWidth <= Data.options.breakPoint.width || forceBreak)
		{
			if (!Data.isBreakPointActive)
			{
				Data.breakWidth = currentWidth;
				
				$.tablemate.rendering.enableBreak($this, Data.options);
				$this.addClass(Data.options.breakPoint.activeClass);
				
				Data.isBreakPointActive = true;
			}
		}
		else if (Data.isBreakPointActive)
		{
			Data.breakWidth = -1;
			
			$.tablemate.rendering.disableBreak($this);
			$this.removeClass(Data.options.breakPoint.activeClass);
			
			Data.isBreakPointActive = false;
		}
		
		$this.data('tablemate', Data);
	}
	
	
	$(function()
	{
		if ($.tablemate.defaults.autoInitialise)
		{
			$($.tablemate.defaults.autoInitialiseSelector).tablemate();
		}
	});
	
})(jQuery);
