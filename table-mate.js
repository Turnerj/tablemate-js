(function($)
{
	$.tablemate = {
		defaults: {
			autoInitialise: true,
			autoInitialiseSelector: 'table.tablemate',
			
			analyse: {
				detectCrossTabulation: true
			},
			
			allowResponsiveTableWidth: true,
			autoBreakOnBodyOverflow: true,
			breakPoint: {
				activeClass: 'breakPoint',
				breakTimeout: 100,
				resizeTimeout: 100,
				width: 480
			}
		},
		parsers: {
			timeRange: function(Input)
			{
				
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
			
			var result = analyseTable(table, data.options.analyse);
			data.analysis = result;
			
			$table.data('tablemate', data);
			
			//Setup Resizing
			function resizeCallback()
			{
				handleResize(table, $(table).data('tablemate'));
			}
			
			var breakTimeout = null;
			$(window).on('resize', function()
			{
				clearTimeout(breakTimeout);
				breakTimeout = setTimeout(resizeCallback, data.options.breakPoint.resizeTimeout);
			});
			resizeCallback();
		});
	}
	
	
	
	
	
	
	function analyseTable(Element, Options)
	{
		var $table = $(Element);
		var result = {
			rows: [],
			numberOfColumns: 0,
			isCrossTabulated: false,
			isHeadingDataPair: true
		};
		
		//Analyse Table Width
		var tmpWidth = $table.css('width');
		if (tmpWidth.indexOf('%') != -1)
		{
			result.initialWidth = $table.width();
			result.isInitialWidthPercentage = true;
		}
		else
		{
			result.initialWidth = parseInt(tmpWidth);
			result.isInitialWidthPercentage = false;
		}
		
		//Analyse Data
		//Get all child rows, regardless of thead/tbody/tfoot and without getting any tables inside tables
		var $rows = $($table.get(0).rows);
		
		//Utilities
		function rowAnalysis(Element)
		{
			var $row = $(Element);
			
			var result = {
				columns: [],
				numberOfColumns: 0,
				isInsideTHead: $row.parent().get(0).nodeName == 'THEAD',
				isRowOfHeadings: true,
				isHeadingDataPair: false,
				hasAnyHeadings: false,
				hasAnyData: false
			};
			
			var $columns = $row.children();
			$columns.each(function(Index)
			{
				var $this = $(this);
				var colData = {
					tag: this.nodeName,
					isBold: $this.css('font-weight') == '700',
					isCentered: $this.css('text-align') == 'center',
					isFirstChildStrong: $this.children().length > 0 && $this.children().get(0).nodeName == 'STRONG',
					isHeading: false,
					isEmpty: false,
					title: null,
					data: null,
					colspan: this.colSpan,
					rowspan: this.rowSpan
				};
				
				result.numberOfColumns += colData.colspan;
				
				//Detect if the row is a heading
				if (
					result.isInsideTHead ||
					colData.tag == 'TH' ||
					(colData.isBold && colData.isCentered) ||
					colData.isFirstChildStrong
				)
				{
					colData.isHeading = true;
					result.hasAnyHeadings = true;
					
					colData.data = $.trim($this.text());
					
					var tmpTitle = $this.data('title');
					if (!tmpTitle || !tmpTitle.length)
					{
						tmpTitle = colData.data;
					}
					
					colData.title = tmpTitle;
				}
				else
				{
					result.isRowOfHeadings = false;
					
					colData.data = $this.html();
				}
				
				//Empty Check
				if ($.trim($this.text()).length == 0)
				{
					colData.isEmpty = true;
				}
				else
				{
					result.hasAnyData = true;
				}
				
				//Allow row to still be full of headings if the first column doesn't have data
				if (Options.detectCrossTabulation && Index == 0 && colData.isEmpty && !colData.isHeading)
				{
					colData.isHeading = true;
					result.hasAnyHeadings = true;
					result.isRowOfHeadings = false;
				}
				
				result.columns.push(colData);
			});
			
			//Check if the row is a heading/data pair
			if ($columns.length == 2 && result.columns[0].isHeading && !result.columns[1].isHeading)
			{
				result.isHeadingDataPair = true;
			}
			
			return result;
		}
		
		//Loop Data
		$rows.each(function(RowIndex)
		{
			var $row = $(this);
			var rowData = rowAnalysis(this);
			
			if (rowData.columns.length > 1)
			{
				if (Options.detectCrossTabulation && RowIndex == 0 && rowData.columns[0].isEmpty && rowData.hasAnyHeadings)
				{
					result.isCrossTabulated = true;
				}
			}
			
			if (RowIndex == 0)
			{
				result.numberOfColumns = rowData.numberOfColumns;
			}
			
			if (!rowData.isHeadingDataPair)
			{
				result.isHeadingDataPair = false;
			}
			
			result.rows.push(rowData);
		});
		
		return result;
	}
	
	
	
	
	
	
	function handleResize(Element, Data, SkipBreakCheck)
	{
		var $this = $(Element);
		
		var currentWidth = Data.isBreakPointActive ? Data.breakWidth : $this.width();
		var parentWidth = $this.parent().width();
		var forceBreak = false;
		
		if (!Data.isBreakPointActive)
		{
			if (Data.options.allowResponsiveTableWidth && !Data.analysis.isInitialWidthPercentage)
			{
				if (parentWidth <= Data.analysis.initialWidth)
				{
					if (!Data.inResponsiveMode)
					{
						$this.css('width', '100%');
						Data.inResponsiveMode = true;
					}
				}
				else if (Data.inResponsiveMode)
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
				
				enableBreak($this);
				$this.addClass(Data.options.breakPoint.activeClass);
				
				Data.isBreakPointActive = true;
			}
		}
		else if (Data.isBreakPointActive)
		{
			Data.breakWidth = -1;
			
			disableBreak($this);
			$this.removeClass(Data.options.breakPoint.activeClass);
			
			Data.isBreakPointActive = false;
		}
		
		$this.data('tablemate', Data);
	}
	
	function enableBreak($Table)
	{
		var data = $Table.data('tablemate'), analysis = data.analysis;
		
		var $mate = $('<div></div>');
		$mate.addClass('tablemate');
		
		//Utilities
		function parseTitleInput(Input, Table)
		{
			//TODO: Clean this up! Several puppies could pass away with this function :(
			
			for (var parser in $.tablemate.parsers)
			{
				var result = $.tablemate.parsers[parser].call(Table, Input);
				if (typeof result == 'string')
					return result;
			}
			
			return Input;
		}
		
		
		if (analysis.isHeadingDataPair)
		{
			$mate.addClass('headingDataPair');
			
			var $block = $('<div class="block"></div>');
			
			//TODO: Possibly need to take into account rowspan on the columns, like I do on the cross tabulated data
			for (var i = 0, l = analysis.rows.length; i < l; i++)
			{
				var rowData = analysis.rows[i];
				
				if (rowData.columns[0].isEmpty || rowData.columns[1].isEmpty)
					continue;
				
				var $column = $('<div class="column"><div class="title"></div><div class="data"></div></div>');
				
				$column.find('.title').text(rowData.columns[0].title);
				$column.find('.data').text(rowData.columns[1].data);
				
				$block.append($column);
			}
			
			$mate.append($block);
			
		}
		else if (analysis.isCrossTabulated)
		{
			$mate.addClass('crossTabulated');
			
			//TODO: Handle data when there are multiple heading columns in the table? Die horribly? Detect and don't care?
			
			function getTitlesForRowSpan(Rows, Start, Length)
			{
				var title = '';
				for (var i = Start, l = Start + Length; i < l; i++)
				{
					title += analysis.rows[i].columns[0].title + ', ';
				}
				
				title = title.substr(0, title.length - 2);
				
				title = parseTitleInput(title);
				
				return title;
			}
			
			var firstRow = analysis.rows[0];
			for (var i = 1, l = firstRow.columns.length; i < l; i++)
			{
				if (firstRow.columns[i].isEmpty)
					continue;
				
				var $block = $('<div class="block"><div class="title"></div></div>');
				var hasAnyRows = false;
				$block.find('.title').text(firstRow.columns[i].title);
				
				for (var i2 = 1, l2 = analysis.rows.length; i2 < l2; i2++)
				{
					var rowData = analysis.rows[i2];
					
					if (typeof rowData.columns[i] == 'undefined')
						continue;
					
					if (rowData.columns[i].isEmpty)
						continue;
					
					hasAnyRows = true;
					
					var $column = $('<div class="column"><div class="title"></div><div class="data"></div></div>');
					var title = rowData.columns[0].title;
					
					var rowspan = rowData.columns[i].rowspan;
					if (rowspan > 1)
					{
						title = getTitlesForRowSpan(analysis.rows, i2, rowspan);
					}
					
					$column.find('.title').text(title);
					$column.find('.data').html(rowData.columns[i].data);
					
					$block.append($column);
				}
				
				if (hasAnyRows)
				{
					$mate.append($block);
				}
			}
		}
		else
		{
			console.log('Edge-case reached!', analysis);
			
			//TODO: Need to refine what the edge cases could be and how we should handle them
		}
		
		$Table.after($mate);
	}
	function disableBreak($Table)
	{
		$Table.next('div.tablemate').remove();
	}
	
	
	
	
	
	
	$(function()
	{
		if ($.tablemate.defaults.autoInitialise)
		{
			$($.tablemate.defaults.autoInitialiseSelector).tablemate();
		}
	});
	
})(jQuery);
