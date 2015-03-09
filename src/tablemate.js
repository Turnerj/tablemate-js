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
		profile: true,
		log: function()
		{
			if (this.debug && console && typeof console.log == 'function')
			{
				var args = Array.prototype.slice.call(arguments);
				args.unshift('[Tablemate]');
				console.log.apply(console, args);
			}
		},
		profileStart: function()
		{
			if (this.profile && console && typeof console.profile == 'function')
			{
				console.profile();
			}
		},
		profileStop: function()
		{
			if (this.profile && console && typeof console.profile == 'function')
			{
				console.profileEnd();
			}
		}
	};
	
	$.fn.tablemate = function(Options)
	{
		var result = this.each(function()
		{
			var table = this, 
				$table = $(table), 
				data = {
					isResponsiveMode: false,
					isBreakPointActive: false,
					options: $.extend({}, $.tablemate.defaults, Options)
				};
			
			var result = $.tablemate.analysis.analyseTable(table, data.options.analyse);
			data.analysis = result;
			
			$table.data('tablemate', data);
			
			if ($.tablemate.tests)
			{
				$.tablemate.tests.setup.call(table, data);
			}
			
			//Setup Resizing
			function resizeCallback()
			{
				handleResize($table, $table.data().tablemate);
			}
			
			var breakTimeout = null;
			$(window).on('resize', function windowResize()
			{
				clearTimeout(breakTimeout);
				breakTimeout = setTimeout(resizeCallback, data.options.resizeTimeout);
			});
			
			$.tablemate.log('Table Initialised', table);
			resizeCallback();
		});
		
		return result;
	}
	
	function handleResize($Table, Data)
	{
		var currentWidth = Data.isBreakPointActive ? Data.breakWidth : $Table.width();
		var parentWidth = $Table.parent().width();
		var forceBreak = false;
		var dataStateChanged = false;
		
		if (Data.options.allowResponsiveTableWidth && !Data.analysis.isInitialWidthPercentage)
		{
			if (!Data.inResponsiveMode)
			{
				if (parentWidth <= Data.analysis.initialWidth)
				{
					$Table.css('width', '100%');
					Data.inResponsiveMode = true;
					dataStateChanged = true;
				}
			}
			else if (Data.inResponsiveMode)
			{
				if (parentWidth > Data.analysis.initialWidth)
				{
					$Table.css('width', Data.analysis.initialWidth + 'px');
					Data.inResponsiveMode = false;
					dataStateChanged = true;
				}
			}
		}
		
		//TODO: Possibly remove or move this line - it is here due to the code above potentially
		//		changing the width of the table.
		currentWidth = Data.isBreakPointActive ? Data.breakWidth : $Table.width();
		
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
				
				if ($.tablemate.rendering.enableBreak($Table, Data.options))
				{
					$Table.addClass(Data.options.breakPoint.activeClass);
					Data.isBreakPointActive = true;
					dataStateChanged = true;
				}
			}
		}
		else if (Data.isBreakPointActive)
		{
			Data.breakWidth = -1;
			
			$.tablemate.rendering.disableBreak($Table);
			$Table.removeClass(Data.options.breakPoint.activeClass);
			
			Data.isBreakPointActive = false;
			dataStateChanged = true;
		}
		
		//Avoid expensive jQuery data call if we haven't updated anything
		if (dataStateChanged)
		{
			$Table.data('tablemate', Data);
		}
	}
	
})(jQuery);
